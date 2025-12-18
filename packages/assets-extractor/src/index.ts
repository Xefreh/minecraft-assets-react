import { fetchBinary, fetchJson } from './utils';

type LatestVersion = {
  release: string;
  snapshot: string;
};

type Version = {
  id: string;
  type: 'release' | 'snapshot';
  url: string;
};

type VersionManifest = {
  latest: LatestVersion;
  versions: Version[];
};

type VersionMetadata = {
  downloads: {
    client: {
      url: string;
      size: number;
      sha1: string;
    };
  };
  assetIndex: {
    url: string;
  };
};

export async function getMinecraftVersion(minecraftVersion: string) {
  const versionsUrl =
    'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json';
  const versionsData = await fetchJson<VersionManifest>(versionsUrl);

  if (minecraftVersion === 'latest') {
    minecraftVersion = versionsData.latest.release;
  }

  const version = versionsData.versions.find((v) => v.id === minecraftVersion);
  if (!version) {
    throw new Error(`No version found for ${minecraftVersion}`);
  }

  return version;
}

export async function fetchVersionMetadata(version: Version) {
  if (!version.url) {
    throw new Error(`No url found for ${version.id}`);
  }

  const versionMetadata = await fetchJson<VersionMetadata>(version.url);
  return versionMetadata;
}

export async function downloadClient(versionMetadata: VersionMetadata) {
  if (!versionMetadata.downloads.client.url) {
    throw new Error(`No client download found`);
  }

  const clientJarResponse = await fetchBinary(
    versionMetadata.downloads.client.url
  );
  return clientJarResponse;
}

type Assets = {
  objects: {
    [key: string]: {
      hash: string;
    };
  };
};

export async function extractSounds(versionMetadata: VersionMetadata) {
  if (!versionMetadata.assetIndex.url) {
    throw new Error(`No asset index url found`);
  }

  const assetsData = await fetchJson<Assets>(versionMetadata.assetIndex.url);

  const assets = Object.entries(assetsData.objects).flatMap(
    ([assetPath, asset]) => {
      if (!assetPath.startsWith('minecraft/sounds/')) {
        return [];
      }

      return {
        assetPath,
        url: `https://resources.download.minecraft.net/${asset.hash.slice(
          0,
          2
        )}/${asset.hash}`,
      };
    }
  );

  return assets;
}

export async function extractAssets(
  versionMetadata: VersionMetadata,
  jarData: ArrayBuffer,
  uiPackagePath: string
) {
  if (!uiPackagePath) {
    throw new Error('uiPackagePath is required');
  }

  const assetsPath = `${uiPackagePath}/assets`;
  const tempJar = `${assetsPath}/.temp-client.jar`;

  try {
    await Bun.$`mkdir -p ${assetsPath}`.quiet();
    await Bun.write(tempJar, jarData);

    await Bun.$`unzip -q -o ${tempJar} "assets/minecraft/textures/item/*" -d ${assetsPath}`.quiet();
    await Bun.$`unzip -q -o ${tempJar} "assets/minecraft/textures/block/*" -d ${assetsPath}`.quiet();

    await Bun.$`mkdir -p ${assetsPath}/item ${assetsPath}/block`.quiet();
    await Bun.$`mv ${assetsPath}/assets/minecraft/textures/item/* ${assetsPath}/item/`.quiet();
    await Bun.$`mv ${assetsPath}/assets/minecraft/textures/block/* ${assetsPath}/block/`.quiet();
    await Bun.$`rm -rf ${assetsPath}/assets`.quiet();

    console.log(`Assets extracted to ${assetsPath}`);
  } finally {
    await Bun.$`rm -f ${tempJar}`.quiet();
  }

  const assets = await extractSounds(versionMetadata);
  for (const asset of assets) {
    const relativePath = asset.assetPath.replace('minecraft/', '');
    const destinationPath = `${assetsPath}/${relativePath}`;

    const parentDir = destinationPath.substring(
      0,
      destinationPath.lastIndexOf('/')
    );
    await Bun.$`mkdir -p ${parentDir}`.quiet();

    const assetData = await fetchBinary(asset.url);
    await Bun.write(destinationPath, assetData);
  }
}

function toExportName(filename: string, extension = '.png'): string {
  return filename
    .replace(new RegExp(`${extension.replace('.', '\\.')}$`), '')
    .replace(/-/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_');
}

function toSoundExportName(relativePath: string): string {
  return relativePath
    .replace(/\.ogg$/, '')
    .replace(/\//g, '_')
    .replace(/-/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_');
}

export async function generateExportFiles(uiPackagePath: string) {
  const itemsDir = `${uiPackagePath}/assets/item`;
  const blocksDir = `${uiPackagePath}/assets/block`;
  const soundsDir = `${uiPackagePath}/assets/sounds`;

  const pngGlob = new Bun.Glob('*.png');
  const oggGlob = new Bun.Glob('**/*.ogg');

  // Generate items.ts
  const itemFiles = Array.from(pngGlob.scanSync(itemsDir));
  const itemExports = itemFiles.map((f) => {
    const name = toExportName(f);
    return `export { default as ${name} } from '../assets/item/${f}';`;
  });
  const itemNames = itemFiles.map((f) => `'${toExportName(f)}'`).join('\n  | ');
  const itemsContent = `${itemExports.join('\n')}

export type ItemName =
  | ${itemNames};
`;
  await Bun.write(`${uiPackagePath}/src/items.ts`, itemsContent);
  console.log(`Generated items.ts with ${itemExports.length} exports`);

  // Generate blocks.ts
  const blockFiles = Array.from(pngGlob.scanSync(blocksDir));
  const blockExports = blockFiles.map((f) => {
    const name = toExportName(f);
    return `export { default as ${name} } from '../assets/block/${f}';`;
  });
  const blockNames = blockFiles
    .map((f) => `'${toExportName(f)}'`)
    .join('\n  | ');
  const blocksContent = `${blockExports.join('\n')}

export type BlockName =
  | ${blockNames};
`;
  await Bun.write(`${uiPackagePath}/src/blocks.ts`, blocksContent);
  console.log(`Generated blocks.ts with ${blockExports.length} exports`);

  // Generate sounds.ts
  const soundFiles = Array.from(oggGlob.scanSync(soundsDir));
  const soundExports = soundFiles.map((f) => {
    const name = toSoundExportName(f);
    return `export { default as ${name} } from '../assets/sounds/${f}';`;
  });
  const soundNames = soundFiles
    .map((f) => `'${toSoundExportName(f)}'`)
    .join('\n  | ');
  const soundsContent = `${soundExports.join('\n')}

export type SoundName =
  | ${soundNames};
`;
  await Bun.write(`${uiPackagePath}/src/sounds.ts`, soundsContent);
  console.log(`Generated sounds.ts with ${soundExports.length} exports`);
}

type LatestVersion = {
  release: string;
  snapshot: string;
};

type Version = {
  id: string;
  type: 'release' | 'snapshot';
  url: string;
};

export async function getMinecraftVersion(minecraftVersion: string) {
  const versionsUrl = `https://piston-meta.mojang.com/mc/game/version_manifest_v2.json`;
  const versionsResponse = await fetch(versionsUrl);
  const versionsData = (await versionsResponse.json()) as {
    latest: LatestVersion;
    versions: Version[];
  };
  if (minecraftVersion === 'latest') {
    minecraftVersion = versionsData.latest.release;
  }
  const version = versionsData.versions.find(
    (version: Version) => version.id === minecraftVersion
  );
  if (!version) {
    throw new Error(`No version found for ${minecraftVersion}`);
  }
  return version;
}

type DownloadClientData = {
  downloads: {
    client: {
      sha1: string;
      size: number;
      url: string;
    };
  };
};

export async function downloadClient(minecraftVersion: Version) {
  if (!minecraftVersion.url) {
    throw new Error(`No url found for ${minecraftVersion.id}`);
  }

  const versionResponse = await fetch(minecraftVersion.url);
  const versionResponseJson =
    (await versionResponse.json()) as DownloadClientData;

  if (!versionResponseJson.downloads || !versionResponseJson.downloads.client) {
    throw new Error(
      `No downloads found for client jar for ${minecraftVersion.id}`
    );
  }

  const clientJarResponse = await fetch(
    versionResponseJson.downloads.client.url
  );

  const clientJarData = await clientJarResponse.arrayBuffer();
  return clientJarData;
}

export async function extractAssets(jarData: ArrayBuffer, distPath: string) {
  if (!distPath) {
    throw new Error('distPath is required');
  }

  const tempJar = `${distPath}/.temp-client.jar`;

  try {
    await Bun.$`mkdir -p ${distPath}`.quiet();

    await Bun.write(tempJar, jarData);

    await Bun.$`unzip -q -o ${tempJar} "assets/minecraft/textures/item/*" "assets/minecraft/textures/block/*" -d ${distPath}`;

    console.log(`Assets extracted to ${distPath}`);
  } finally {
    await Bun.$`rm -f ${tempJar}`.quiet();
  }
}

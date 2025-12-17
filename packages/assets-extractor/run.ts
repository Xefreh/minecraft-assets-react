import { getMinecraftVersion, downloadClient, extractAssets } from './index';

const minecraftVersion = process.argv[2] || 'latest';
const distPath = process.argv[3] || './dist';

console.log(`Fetching Minecraft version: ${minecraftVersion}`);
const version = await getMinecraftVersion(minecraftVersion);
console.log(`Found version: ${version.id} (${version.type})`);

console.log('Downloading client JAR...');
const jarData = await downloadClient(version);
console.log(`Downloaded ${(jarData.byteLength / 1024 / 1024).toFixed(2)} MB`);

console.log(`Extracting assets to: ${distPath}`);
await extractAssets(jarData, distPath);

console.log('Done!');

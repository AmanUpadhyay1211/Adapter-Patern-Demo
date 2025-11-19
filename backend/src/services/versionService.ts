import { Meta } from "../models/meta";

/**
 * Get the current global version
 */
export async function getGlobalVersion(): Promise<number> {
  let meta = await Meta.findByPk(1);
  
  if (!meta) {
    // Initialize if it doesn't exist
    meta = await Meta.create({ id: 1, globalVersion: 1 });
    return 1;
  }
  
  return meta.globalVersion;
}

/**
 * Increment the global version and return the new version
 */
export async function incrementGlobalVersion(): Promise<number> {
  let meta = await Meta.findByPk(1);
  
  if (!meta) {
    meta = await Meta.create({ id: 1, globalVersion: 2 });
    return 2;
  }
  
  meta.globalVersion += 1;
  await meta.save();
  
  return meta.globalVersion;
}

/**
 * Initialize the meta table with version 1 if it doesn't exist
 */
export async function initializeVersion() {
  const existing = await Meta.findByPk(1);
  if (!existing) {
    await Meta.create({ id: 1, globalVersion: 1 });
    console.log("✅ Initialized global version to 1");
  }
}


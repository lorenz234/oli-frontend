#!/usr/bin/env ts-node
// scripts/fetch-orbit-chains.ts

import * as fs from 'fs';
import * as path from 'path';
import { OrbitChainResponse, OrbitChainAPI, ProcessedOrbitChain } from '../src/types/orbitChain';

const ORBIT_CHAINS_API = 'https://portal-data.arbitrum.io/__auto-generated-orbitChains.json';
const ORBIT_CHAINS_CACHE_PATH = path.join(__dirname, '../.cache/orbit-chains.json');
const ORBIT_CHAINS_OUTPUT_PATH = path.join(__dirname, '../src/constants/orbitChains.ts');

/**
 * Fetch Orbit chains from Arbitrum portal API
 */
async function fetchOrbitChains(): Promise<OrbitChainResponse> {
  try {
    console.log('Fetching Orbit chains from Arbitrum portal...');
    const response = await fetch(ORBIT_CHAINS_API);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: OrbitChainResponse = await response.json();
    console.log(`✓ Fetched ${data.content.length} Orbit chains`);
    
    return data;
  } catch (error) {
    console.error('Error fetching Orbit chains:', error);
    throw error;
  }
}

/**
 * Generate a simple SVG logo placeholder for chains without logos
 */
function generatePlaceholderLogo(chainName: string, color: string): string {
  const initial = chainName.charAt(0).toUpperCase();
  // Simple circle with letter - this is an SVG path representation
  return `<circle cx="7.5" cy="7.5" r="6" fill="${color}" opacity="0.2"/><text x="7.5" y="10" text-anchor="middle" font-size="8" font-weight="bold" fill="${color}">${initial}</text>`;
}

/**
 * Convert hex color to determine if it should use dark text
 */
function shouldUseDarkText(hexColor: string): boolean {
  // Remove # if present
  const color = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return true if color is light (needs dark text)
  return luminance > 0.5;
}

/**
 * Download and convert logo to SVG path (simplified version)
 * In production, you might want to use a library like sharp or svg-path-bounds
 */
async function fetchLogoAsSvg(logoUrl: string, chainName: string, primaryColor: string): Promise<{ body: string; width: number; height?: number } | null> {
  try {
    // For now, we'll use a placeholder. In production, you might want to:
    // 1. Download the image
    // 2. Convert it to SVG
    // 3. Extract the path
    // For simplicity, we'll use a placeholder
    
    const placeholderBody = generatePlaceholderLogo(chainName, primaryColor || '#6B7280');
    
    return {
      body: placeholderBody,
      width: 15,
      height: 15
    };
  } catch (error) {
    console.warn(`Could not fetch logo for ${chainName}:`, error);
    return null;
  }
}

/**
 * Process Orbit chain data into our format
 */
async function processOrbitChain(orbitChain: OrbitChainAPI): Promise<ProcessedOrbitChain | null> {
  const { chain, title, description, color, categoryId, slug } = orbitChain;
  
  // Only process mainnet chains with valid chain IDs and approved parent chains
  if (chain.status !== 'Mainnet' || !chain.chainId) {
    return null;
  }
  
  // Filter to only include chains built on Ethereum or Arbitrum One
  const allowedParentChains = ['Ethereum', 'Arbitrum One'];
  if (!allowedParentChains.includes(chain.parentChain)) {
    return null;
  }
  
  const chainId = chain.chainId;
  const caip2 = `eip155:${chainId}`;
  
  // Determine colors
  const primaryColor = color.primary || '#6B7280';
  const secondaryColor = color.secondary || color.primary || '#9CA3AF';
  const darkTextOnBg = shouldUseDarkText(primaryColor);
  
  // Create short name (max 12 characters as per template)
  const shortName = title.length > 12 ? title.substring(0, 12) : title;
  
  // Fetch or generate logo
  const logo = await fetchLogoAsSvg(orbitChain.images.logoUrl, title, primaryColor);
  
  // Build the processed chain
  const processedChain: ProcessedOrbitChain = {
    id: slug,
    name: title,
    shortName: shortName,
    caip2: caip2,
    chainId: chainId,
    isOrbitChain: true,
    orbitMetadata: {
      parentChain: chain.parentChain,
      deployerTeam: chain.deployerTeam,
      status: chain.status,
      layer: chain.layer,
      category: categoryId
    },
    colors: {
      light: [primaryColor, secondaryColor],
      dark: [primaryColor, secondaryColor],
      darkTextOnBackground: darkTextOnBg
    },
    logo: logo,
    description: description || `${title} is an Arbitrum Orbit chain built on ${chain.parentChain}.`
  };
  
  return processedChain;
}

/**
 * Check if orbit chains have been updated
 */
function hasOrbitChainsChanged(newData: OrbitChainResponse): boolean {
  // Ensure cache directory exists
  const cacheDir = path.dirname(ORBIT_CHAINS_CACHE_PATH);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  
  // Check if cache file exists
  if (!fs.existsSync(ORBIT_CHAINS_CACHE_PATH)) {
    console.log('No cache found, will create new one');
    return true;
  }
  
  try {
    const cachedData = JSON.parse(fs.readFileSync(ORBIT_CHAINS_CACHE_PATH, 'utf-8'));
    
    // Compare timestamps
    if (cachedData.meta.timestamp !== newData.meta.timestamp) {
      console.log('Orbit chains data has been updated');
      console.log(`  Cached: ${cachedData.meta.timestamp}`);
      console.log(`  Latest: ${newData.meta.timestamp}`);
      return true;
    }
    
    // Compare content length
    if (cachedData.content.length !== newData.content.length) {
      console.log(`Chain count changed: ${cachedData.content.length} → ${newData.content.length}`);
      return true;
    }
    
    // Compare mainnet chains with chain IDs
    const cachedMainnetChains = cachedData.content.filter((c: OrbitChainAPI) => 
      c.chain.status === 'Mainnet' && c.chain.chainId
    );
    const newMainnetChains = newData.content.filter((c: OrbitChainAPI) => 
      c.chain.status === 'Mainnet' && c.chain.chainId
    );
    
    if (cachedMainnetChains.length !== newMainnetChains.length) {
      console.log(`Mainnet chain count changed: ${cachedMainnetChains.length} → ${newMainnetChains.length}`);
      return true;
    }
    
    console.log('No changes detected in Orbit chains');
    return false;
  } catch (error) {
    console.error('Error reading cache:', error);
    return true;
  }
}

/**
 * Update the cache file
 */
function updateCache(data: OrbitChainResponse): void {
  const cacheDir = path.dirname(ORBIT_CHAINS_CACHE_PATH);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  
  fs.writeFileSync(ORBIT_CHAINS_CACHE_PATH, JSON.stringify(data, null, 2));
  console.log(`✓ Updated cache at ${ORBIT_CHAINS_CACHE_PATH}`);
}

/**
 * Generate TypeScript file with Orbit chains
 */
function generateOrbitChainsFile(orbitChains: ProcessedOrbitChain[]): void {
  // Ensure the directory exists
  const outputDir = path.dirname(ORBIT_CHAINS_OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const fileContent = `// This file is auto-generated by scripts/fetch-orbit-chains.ts
// Last updated: ${new Date().toISOString()}
// Do not edit manually

import { ChainMetadata } from './chains';

export const ORBIT_CHAINS: (ChainMetadata & { 
  isOrbitChain: true; 
  orbitMetadata: {
    parentChain: string;
    deployerTeam: string | null;
    status: string;
    layer: number | null;
    category: string;
  };
})[] = ${JSON.stringify(orbitChains, null, 2)};

export const ORBIT_CHAIN_IDS = new Set(ORBIT_CHAINS.map(chain => chain.caip2));

export function isOrbitChain(caip2: string): boolean {
  return ORBIT_CHAIN_IDS.has(caip2);
}

export function getOrbitChainMetadata(caip2: string) {
  return ORBIT_CHAINS.find(chain => chain.caip2 === caip2)?.orbitMetadata;
}
`;
  
  try {
    fs.writeFileSync(ORBIT_CHAINS_OUTPUT_PATH, fileContent);
    console.log(`✓ Generated Orbit chains file at ${ORBIT_CHAINS_OUTPUT_PATH}`);
    console.log(`  Added ${orbitChains.length} Orbit chains`);
  } catch (error) {
    console.error(`❌ Error writing Orbit chains file:`, error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Starting Orbit chains sync...\n');
    
    // Fetch latest data
    const orbitData = await fetchOrbitChains();
    
    // Check if data has changed (or force update on first run)
    const hasChanged = hasOrbitChainsChanged(orbitData);
    
    if (!hasChanged && fs.existsSync(ORBIT_CHAINS_OUTPUT_PATH)) {
      console.log('\n✓ No updates needed - Orbit chains are up to date');
      process.exit(0);
    }
    
    if (!hasChanged && !fs.existsSync(ORBIT_CHAINS_OUTPUT_PATH)) {
      console.log('First run detected - generating Orbit chains file...');
    }
    
    // Process chains
    console.log('\nProcessing Orbit chains...');
    const processedChains: ProcessedOrbitChain[] = [];
    
    for (const orbitChain of orbitData.content) {
      const processed = await processOrbitChain(orbitChain);
      if (processed) {
        processedChains.push(processed);
        console.log(`  ✓ ${processed.name} (Chain ID: ${processed.chainId})`);
      }
    }
    
    // Deduplicate chains by chain ID
    const uniqueChains = deduplicateChains(processedChains);
    
    // Sort by name
    uniqueChains.sort((a, b) => a.name.localeCompare(b.name));
    
    // Generate output file
    generateOrbitChainsFile(uniqueChains);
    
    // Update cache
    updateCache(orbitData);
    
    console.log(`\n✅ Successfully synced ${uniqueChains.length} unique Orbit chains!\n`);
    
  } catch (error) {
    console.error('\n❌ Error syncing Orbit chains:', error);
    process.exit(1);
  }
}

/**
 * Deduplicate chains by chain ID, keeping the first occurrence
 */
function deduplicateChains(chains: ProcessedOrbitChain[]): ProcessedOrbitChain[] {
  const seen = new Map<string, ProcessedOrbitChain>();
  const duplicates: string[] = [];
  
  for (const chain of chains) {
    if (seen.has(chain.caip2)) {
      const existing = seen.get(chain.caip2)!;
      duplicates.push(`${chain.caip2}: "${chain.name}" vs "${existing.name}"`);
    } else {
      seen.set(chain.caip2, chain);
    }
  }
  
  if (duplicates.length > 0) {
    console.log(`\n⚠️  Found ${duplicates.length} duplicate chain ID(s):`);
    duplicates.forEach(dup => console.log(`  - ${dup}`));
    console.log('  Keeping first occurrence for each duplicate.');
  }
  
  return Array.from(seen.values());
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main as syncOrbitChains };


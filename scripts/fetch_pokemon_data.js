// scripts/fetch_pokemon_data.js
// Run this script with: node scripts/fetch_pokemon_data.js
// This will fetch ALL 1000+ Pokemon from PokeAPI and update src/data/pokemon.json

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.join(__dirname, '../src/data/pokemon.json');
const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

// Maps for Type Capitalization
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

async function fetchAllPokemon() {
  console.log('🔴 Starting Pokemon Fetch... This may take a few minutes.');
  
  try {
    // 1. Fetch list of all species (contains names)
    console.log('... Fetching Species List (Gen 1-9)...');
    const speciesRes = await fetch(`${POKEAPI_BASE}/pokemon-species?limit=1025`);
    const speciesData = await speciesRes.json();
    
    const allPokemon = [];
    const total = speciesData.results.length;
    
    // Process in chunks to be polite to the API
    const CHUNK_SIZE = 20;
    for (let i = 0; i < total; i += CHUNK_SIZE) {
      const chunk = speciesData.results.slice(i, i + CHUNK_SIZE);
      console.log(`... Processing ${i + 1} to ${Math.min(i + CHUNK_SIZE, total)} of ${total}`);

      const chunkPromises = chunk.map(async (speciesItem) => {
        const id = parseInt(speciesItem.url.split('/').filter(Boolean).pop());
        
        // Fetch Species Details (for Chinese Name)
        const speciesDetailRes = await fetch(speciesItem.url);
        const speciesDetail = await speciesDetailRes.json();
        
        const nameEn = speciesDetail.names.find(n => n.language.name === 'en').name;
        const nameZhObj = speciesDetail.names.find(n => n.language.name === 'zh-Hans');
        const nameZh = nameZhObj ? nameZhObj.name : nameEn; // Fallback to English

        // Fetch Pokemon Details (for Types)
        // Note: Species ID usually matches Pokemon ID, but not always for variants. 
        // For base forms, this URL pattern works.
        const pokemonRes = await fetch(`${POKEAPI_BASE}/pokemon/${id}`);
        const pokemonData = await pokemonRes.json();
        
        const types = pokemonData.types.map(t => capitalize(t.type.name));

        return {
          id: id,
          name: {
            en: nameEn,
            zh: nameZh
          },
          types: types
        };
      });

      const processedChunk = await Promise.all(chunkPromises);
      allPokemon.push(...processedChunk);
    }

    console.log('✅ Fetch Complete!');
    
    // Sort by ID
    allPokemon.sort((a, b) => a.id - b.id);

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allPokemon, null, 2));
    console.log(`🎉 Saved ${allPokemon.length} Pokemon to ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('❌ Error fetching data:', error);
  }
}

fetchAllPokemon();
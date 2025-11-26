// src/utils/spriteHelper.js

const GITHUB_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
const MIRROR_BASE = "https://cdn.jsdelivr.net/gh/PokeAPI/sprites/sprites/pokemon";

// 1. Define the race logic
const raceForFastest = async () => {
  const check = (base) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(base);
      img.onerror = () => reject(base);
      img.src = `${base}/1.png?t=${Date.now()}`;
      setTimeout(() => reject(base), 2000); // 2s timeout
  });

  try {
    // Determine winner
    const winner = await Promise.any([
      check(GITHUB_BASE),
      check(MIRROR_BASE)
    ]);
    console.log("⚡️ Selected Source:", winner.includes('jsdelivr') ? 'Mirror' : 'GitHub');
    return winner;
  } catch (e) {
    return GITHUB_BASE; // Default if offline
  }
};

// 2. BLOCKING LINE: The module effectively "pauses" here.
// React will not start rendering until this line finishes.
const activeBase = await raceForFastest();

// 3. Export the simple function
export const getSpriteUrl = (id) => `${activeBase}/${id}.png`;
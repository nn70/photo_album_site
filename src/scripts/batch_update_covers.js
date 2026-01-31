
const fs = require('fs');
const path = require('path');

// Next.js 16 / Node 18+ has native fetch. If not, this might fail, 
// but we are in a modern environment.
// If fetch is missing, we might need https module, but try fetch first.

// Target Raenie's file now
const filePath = path.join(__dirname, '../data/raenie_albums.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

async function fetchOgImage(url) {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        if (!res.ok) return null;
        const html = await res.text();

        // Regex to find og:image
        const match = html.match(/<meta property="og:image" content="([^"]+)"/);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    } catch (e) {
        console.error(`Error fetching ${url}:`, e.message);
        return null;
    }
}

async function run() {
    let count = 0;

    // Iterate years
    for (const yearGroup of data) {
        console.log(`Processing Year: ${yearGroup.year}`);

        for (const album of yearGroup.albums) {
            if (!album.link_href || album.link_href === "#") continue;

            console.log(`  Checking: ${album.title} ...`);

            // Optional: Skip if already updated? 
            // User asked to update all. But checking if it's already a high-res google content might save time?
            // "lh3.googleusercontent.com/pw/" usually indicates the new format we found.
            // Old ones are "lh3.googleusercontent.com/sitesv/".
            // Let's update EVERYTHING as requested, or at least try.

            const newImg = await fetchOgImage(album.link_href);

            if (newImg) {
                // Resize to w1280 if it is a google content URL
                let finalImg = newImg;
                if (finalImg.includes('googleusercontent.com')) {
                    // Often comes as ...=w600-h315-p-k or similar
                    // We want =w1280
                    // Replace parameters at the end
                    finalImg = finalImg.replace(/=w\d+.*$/, '=w1280');
                }

                if (album.img_src !== finalImg) {
                    console.log(`    -> Updated!`);
                    album.img_src = finalImg;
                    count++;
                } else {
                    console.log(`    -> No change.`);
                }
            } else {
                console.log(`    -> Failed to find image.`);
            }

            // Delay to be polite and avoid blocks
            await new Promise(r => setTimeout(r, 1500));
        }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`\nDone! Updated ${count} albums.`);
}

run();

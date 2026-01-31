
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/raenie_albums.json');
const rawData = fs.readFileSync(filePath, 'utf8');
const albumsData = JSON.parse(rawData);

async function fetchOgImage(url) {
    try {
        const res = await fetch(url);
        const text = await res.text();

        // Look for og:image
        // <meta property="og:image" content="..." />
        const match = text.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    } catch (e) {
        console.error(`Failed to fetch ${url}`, e.message);
        return null;
    }
}

async function run() {
    let updatedCount = 0;

    for (const yearGroup of albumsData) {
        for (const album of yearGroup.albums) {
            // Target placeholder images
            if (album.img_src && album.img_src.includes('placeholder')) {
                console.log(`Processing: ${album.title} ...`);
                const ogImage = await fetchOgImage(album.link_href);

                if (ogImage) {
                    console.log(`  Found cover: ${ogImage.substring(0, 50)}...`);
                    album.img_src = ogImage;
                    updatedCount++;
                } else {
                    console.log(`  No og:image found for ${album.link_href}`);
                }
            }
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(filePath, JSON.stringify(albumsData, null, 2));
        console.log(`Updated ${updatedCount} albums.`);
    } else {
        console.log("No updates needed.");
    }
}

run();

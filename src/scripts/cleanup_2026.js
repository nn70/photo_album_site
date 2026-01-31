
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/albums.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const year2026 = data.find(y => y.year === '2026');
if (year2026) {
    console.log(`Original 2026 count: ${year2026.albums.length}`);
    // Keep only Jan (1) and Feb (2)
    // Titles are like "2026年2月..."
    // We can filter by checking if title contains "2026年1月" or "2026年2月"
    // OR we can rely on my previous knowledge that they were created 12 down to 1.

    // Safer to filter by regex or string Includes
    year2026.albums = year2026.albums.filter(album => {
        return album.title.includes('2026年1月') || album.title.includes('2026年2月');
    });

    console.log(`New 2026 count: ${year2026.albums.length}`);
} else {
    console.log("2026 not found");
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Done.");

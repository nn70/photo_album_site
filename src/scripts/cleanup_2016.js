
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/albums.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const year2016 = data.find(y => y.year === '2016');
if (year2016) {
    console.log(`Original 2016 count: ${year2016.albums.length}`);

    // Remote 1月 to 6月.
    // Filter to KEEP months that are NOT 1-6.
    // i.e. Keep 7, 8, 9, 10, 11, 12.
    // Titles contain "2016年X月"

    year2016.albums = year2016.albums.filter(album => {
        const title = album.title;
        // Check if it matches 1-6
        // "2016年1月", "2016年2月" ... "2016年6月"
        // Also check "2016年1月-..." if age is present (though 2016 was birth year, might be negative or handled differently, but standard title starts with Year年Month月)

        // We want to REMOVE if it matches these.
        // So we KEEP if it DOES NOT match.

        const isJanToJun =
            title.includes('2016年1月') ||
            title.includes('2016年2月') ||
            title.includes('2016年3月') ||
            title.includes('2016年4月') ||
            title.includes('2016年5月') ||
            title.includes('2016年6月');

        return !isJanToJun;
    });

    console.log(`New 2016 count: ${year2016.albums.length}`);
} else {
    console.log("2016 not found");
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Done.");

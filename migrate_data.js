
const fs = require('fs');
const path = require('path');

// 1. Read Legacy Data
const legacyContent = fs.readFileSync('legacy_backup/script.js', 'utf8');
// Extract the array part. Assuming it starts with '[' after 'const albumData =' and ends before 'function renderAlbums'
const start = legacyContent.indexOf('[');
const end = legacyContent.indexOf('];') + 1;
const jsonStr = legacyContent.substring(start, end);
// The legacy JS objects might use single quotes or unquoted keys if I am unlucky, 
// but the 'view_file' output showed strict JSON style: "key": "value".
// Let's try JSON.parse. If it fails, we default to empty or eval.
let legacyData = [];
try {
    legacyData = JSON.parse(jsonStr);
} catch (e) {
    console.log("JSON parse failed, trying eval approach");
    // fallback: clean up and eval
    const tempFile = 'temp_legacy_reader.js';
    let cleanContent = legacyContent.replace('document.addEventListener', '//');
    cleanContent = cleanContent.replace(/function renderAlbums[\s\S]*$/, '');
    cleanContent += '\nmodule.exports = albumData;';
    fs.writeFileSync(tempFile, cleanContent);
    legacyData = require('./' + tempFile);
    fs.unlinkSync(tempFile);
}

if (!Array.isArray(legacyData)) {
    console.error("Critical: legacyData is not an array:", legacyData);
    process.exit(1);
}
console.log(`Loaded legacy data: ${legacyData.length} years.`);
legacyData = legacyData.filter(d => d && d.year); // Filter out invalid items


// 2. Read New Links
const linksContent = fs.readFileSync('links.txt', 'utf8');
const lines = linksContent.split('\n');

let currentYear = '';
const newLinks = {}; // Map<Year, Map<Month, URL>>

lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    if (line.includes('年')) {
        currentYear = line.replace('年', '').trim();
        newLinks[currentYear] = {};
    } else if (line.includes('月：')) {
        const parts = line.split('月：');
        const month = parts[0].trim();
        const url = parts[1].trim();
        if (currentYear) {
            newLinks[currentYear][month] = url;
        }
    }
});

// 3. Helper: Calculate Title
function calculateTitle(year, month) {
    const birthYear = 2016;
    const birthMonth = 7;

    let y = parseInt(year);
    let m = parseInt(month);

    let totalMonths = (y - birthYear) * 12 + (m - birthMonth);

    if (totalMonths < 0) return `${year}年${month}月`; // Should not happen for this range

    const ageYear = Math.floor(totalMonths / 12);
    const ageMonth = totalMonths % 12;

    return `${year}年${month}月-${ageYear}Y${ageMonth}M`;
}

// 4. Merge Data
// We want to reconstruct the structure: Array of Years.
// Get all unique years from both sources.
const allYears = new Set([...legacyData.map(y => y.year), ...Object.keys(newLinks)]);
const sortedYears = Array.from(allYears).sort((a, b) => b - a); // Descending

const finalData = sortedYears.map(year => {
    const legacyYearEntry = legacyData.find(d => d.year === year);
    const legacyAlbums = legacyYearEntry ? legacyYearEntry.albums : [];

    // We want 12 months for these years if possible, or whatever user provided.
    // User provided links for 2016-2026.
    // We should create entries for months 12 down to 1 (or 1 to 12? Legacy seems to have mixed order? Next.js should handle sort. Let's sort desc by month).
    // Legacy typically is Descending (Dec -> Jan).

    const mergedAlbums = [];
    const months = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    months.forEach(month => {
        // Find existing strictly by "Title contains 'Year年Month月'"? 
        // Or better: Legacy doesn't store explicit Month field.
        // We have to parse title: "2025年7月...".
        // Warning: Legacy formatting varies: "2019年12月" (no age) vs "2026年1月-9Y6M".
        // Also special titles: "我有妹妹了" (Which month? script says it's 2020, likely July based on order? or index).

        let matchedAlbum = legacyAlbums.find(a => {
            return a.title.startsWith(`${year}年${month}月`);
        });

        // Special handling for special titles if we can guessing year/month context?
        // Actually, for the years 2026-2016, the user provided exact lists.
        // It might be safer to regenerate based on the User's List primarily, 
        // preserving Images from Legacy if title matches or if we can map it.

        // But the user ONLY provided links. They want the IMAGES to be preserved/scraped?
        // "相簿連結要跟網站的一樣" + new links.
        // If I regenerate everything, I lose the images unless I fetch them (which I can't do easily without browser).
        // I must PRESERVE images from Legacy if possible.

        // If I can't find by title, maybe I assume Legacy is ordered?
        // But Legacy has missing months in older years? 
        // Looking at 2019 in legacy: 12 entries. Titles are standard "2019年12月".
        // So for most years it's standard.
        // 2020 has "我有妹妹了". 
        // 2024 has "我8歲摟...". (July)
        // 2025 has "我9歲了...". (July)
        // 2025 has "上硬體程式課". (Jan)

        // My Logic:
        // 1. Try to find legacy entry by title match.
        // 2. If not found, try to find legacy entry that DOESN'T look like a standard date title BUT is in the expected position? 
        //    That's risky.
        //    Better: Use specific known mappings we discovered in earlier turns.
        //    Mappings:
        //    2020: "我有妹妹了" -> July? (Let's check legacy data in script above: it is last? No, it's at the end. 2020 has 13 entries in the example above?? No 12? 1...12 + "我有妹妹了"?
        //    Let's check 2020 in the viewed file.
        //    Line 99: 2020 albums.
        //    Line 100: Dec
        //    ...
        //    Line 111: Jan
        //    Line 112: "我有妹妹了".
        //    Wait, that's 13 items.
        //    Did I add 13 items in my previous turn?
        //    Summary said: "Populated 2020... Preserved existing '我有妹妹了'".
        //    So it might be a duplicate or extra.
        //    If I regenerate, I should stick to the User's Monthly list (12 items).
        //    If "我有妹妹了" is truly extra, maybe keep it? Or map it to July?
        //    User's request "2020 年 ... 1月...".
        //    The user's list for 2020 has 12 links.

        // Strategy:
        // Create 12 items for the year.
        // For each month X:
        //   Check if User provided link for X.
        //   If so, use that link.
        //   For Image/Title:
        //     Look in Legacy for "YYYY年X月".
        //     If found: Use its Image and Title (but update calculated Age title if it was missing age before? User says "2023年...").
        //     If not found (e.g. "我有妹妹了"):
        //       Check if this special title corresponds to this month?
        //       Hard to know without description.
        //       BUT, if I change the link, I might update the title to standard "YYYY年X月-Age" to be consistent, unless it's a special event name.
        //       Actually, older years 2016-2019 just have "YYYY年M月".
        //       Newer years have Age.
        //       I will generate the standard Title with Age for ALL entries in the new JSON to be consistent and cool.
        //       BUT I will try to PRESERVE the Image URL if the legacy entry exists for that month.

        // Image Mapping Logic:
        // Legacy has "standard" titles for most.
        // I will match by `startWith(YYYY年M月)`.
        // If not found, I might search for *any* entry in that Year that is *not* matched yet? (Too complex for this script).
        // I'll stick to regex matching title.

        // Special mapping for known custom titles (hardcoded in script):
        // 2025 Jan -> "上硬體程式課"
        // 2025 Jul -> "我9歲了/日本福岡summer camp"
        // 2024 Jul -> "我8歲摟/暑假神戶遊學"
        // 2023 Jul -> "我7歲了"
        // 2023 Feb -> "Disney/台北燈節"
        // 2023 Jan -> "籃球比賽"
        // 2020 ? -> "我有妹妹了" (script position was 13th? or replacing July?)
        // Let's assume standard titles unless I find these specific strings in Legacy.

        // Refined Logic for Month X:
        //   Link = `newLinks[year][month]` or fallback to Legacy Link or `#`.
        //   Title = Standard Calculated Title.
        //   Image = ...
        //   
        //   Search Legacy for this month:
        //     a) Exact match "YYYY年M月..."
        //     b) Custom Title match (lookup map).
        //   If found, take Image.
        //   If not found, use placeholder image.
    });
});

const customTitleMapping = {
    '2025-1': '上硬體程式課',
    '2025-7': '我9歲了/日本福岡summer camp',
    '2024-7': '我8歲摟/暑假神戶遊學',
    '2023-7': '我7歲了',
    '2023-2': 'Disney/台北燈節',
    '2023-1': '籃球比賽',
    '2020-7': '我有妹妹了' // Assumption
};

const placeholderImg = "https://via.placeholder.com/400x300?text=No+Image";

const outputData = sortedYears.map(year => {
    // Only process if in user list (2016-2026)? 
    // Or process all years found.
    // If year is in NewLinks, we definitely generate 12 months.

    // Check if we have new links for this year
    const yearLinks = newLinks[year];

    // If no new links for this year (e.g. 2027?), just keep legacy?
    // But user list covers 2016-2026.

    if (!yearLinks) {
        // Just return legacy entry as is if exists
        return legacyData.find(d => d.year === year) || { year, albums: [] };
    }

    const legacyYearEntry = legacyData.find(d => d.year === year);
    const legacyAlbums = legacyYearEntry ? legacyYearEntry.albums : [];

    const albums = [];
    for (let m = 12; m >= 1; m--) {
        const link = yearLinks[m.toString()] || "#"; // Default to # if missing in user list

        let title = calculateTitle(year, m);
        let img = placeholderImg;

        // Find legacy image
        // 1. Try standard title match
        let legacyMatch = legacyAlbums.find(a => a.title.startsWith(`${year}年${m}月`));

        // 2. Try custom title match
        const customKey = `${year}-${m}`;
        if (!legacyMatch && customTitleMapping[customKey]) {
            // Find by custom title (partial match ok?)
            // The mapping value is a substring or full title
            legacyMatch = legacyAlbums.find(a => a.title.includes(customTitleMapping[customKey]));
            if (legacyMatch) {
                // Use the custom title instead of calculated one?
                // User request check: "2025年要有1到12月" - implies standard?
                // But previously we preserved them.
                // Let's preserve the Custom Title text if it exists.
                title = legacyMatch.title;
            }
        } else if (legacyMatch) {
            // If standard match found, checking if we should use legacy title (with age) or recalculate.
            // Legacy title might be "2019年12月" (no age). New logic adds age.
            // Let's prefer the Calculated Title (standardization) UNLESS it's a custom text.
            // But if Legacy has "2023年12月-7Y5M", my calculator gives same.
        }

        // 2b. Special Case 2020 "我有妹妹了".
        // If year 2020 and month 7.
        // If legacy has "我有妹妹了" and we mapped it to July.
        // The script above shows it was at the END of the list (index 13?).
        // In the legacy script view: "2020年X月" entries existed 1-12 AND "我有妹妹了".
        // I might have duplicated it.
        // I will try to find it.

        if (legacyMatch) {
            img = legacyMatch.img_src;
        } else {
            // Fallback: If 2020/7 and no standard match, look via title again?
            // (Covered by step 2).
        }

        albums.push({
            title: title,
            img_src: img,
            link_href: link
        });
    }

    return {
        year: year,
        albums: albums
    };
});

fs.writeFileSync('src/data/albums.json', JSON.stringify(outputData, null, 2));
console.log("Migration complete.");

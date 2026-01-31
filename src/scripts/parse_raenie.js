
const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, '../data/raenie_raw.txt');
const outPath = path.join(__dirname, '../data/raenie_albums.json');

const rawData = fs.readFileSync(rawPath, 'utf8');

const lines = rawData.split('\n');
let currentYear = '';
const result = [];

function getYearGroup(year) {
    let group = result.find(g => g.year === year);
    if (!group) {
        group = { year, albums: [] };
        result.push(group);
    }
    return group;
}

for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const yearMatch = line.match(/^(\d{4}) 年/);
    if (yearMatch) {
        currentYear = yearMatch[1];
        continue;
    }

    // Match lines like: 12月 (0Y7M)：https://...
    // Or: 4月~5月 (0Y0M 出生)：https://...
    // We want title to be "2020年12月-0Y7M" format mostly.

    // Regex for content line
    // Matches "12月 (0Y7M)：http..."
    // Matches "4月~5月 (0Y0M 出生)：http..."

    // We want to extract:
    // 1. Month part (everything before first parenthesis or colon)
    // 2. Age/Note part (inside parenthesis)
    // 3. Link

    const parts = line.split('：');
    if (parts.length < 2) continue;

    const link = parts[parts.length - 1].trim();
    let labelPart = parts.slice(0, parts.length - 1).join('：').trim();

    // Extract Age if possible (content in parentheses)
    // e.g. "2月 (5Y9M)" -> Title: "2026年2月-5Y9M"
    // e.g. "4月~5月 (0Y0M 出生)" -> Title: "2020年4月~5月-0Y0M 出生"

    let title = '';

    // Simple parse: Just prepend Year to the label part
    // But we might want to clean it up to match format "YYYY年MM月-Age"

    // Check for "Month月" at start
    // const monthMatch = labelPart.match(/^(\d+月)/);

    // Let's just use "YYYY年" + labelPart, but replace space with - or nothing
    // "2月 (5Y9M)" -> "2026年2月-5Y9M" (removing space and parens if we want standard format)
    // Or keep user format: "2026年2月 (5Y9M)"

    // The previous format was: "2026年2月-9Y7M"
    // Let's try to standardize.

    let cleanLabel = labelPart;
    // Replace " (" with "-" and remove closing ")" ?
    // "2月 (5Y9M)" -> "2月-5Y9M"

    cleanLabel = cleanLabel.replace(/ \(([^)]+)\)/, '-$1'); // Replace " (5Y9M)" with "-5Y9M"

    title = `${currentYear}年${cleanLabel}`;

    // Specific fix for "4月~5月"
    if (title.includes('出生')) {
        // Keep it descriptive
    }

    const yearGroup = getYearGroup(currentYear);
    yearGroup.albums.push({
        title: title,
        img_src: 'https://via.placeholder.com/400x300?text=Fetching...', // Temporary
        link_href: link
    });
}

fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log('Parsed Raenie albums to raenie_albums.json');

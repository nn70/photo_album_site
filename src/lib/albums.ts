
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/albums.json'); // Default

export interface Album {
    title: string;
    img_src: string;
    link_href: string;
}

export interface YearGroup {
    year: string;
    albums: Album[];
}

export async function getAlbums(jsonFilename: string = 'albums.json'): Promise<YearGroup[]> {
    try {
        const filePath = path.join(process.cwd(), 'src/data', jsonFilename);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Failed to read albums from ${jsonFilename}:`, error);
        return [];
    }
}

export async function saveAlbums(albums: YearGroup[], jsonFilename: string = 'albums.json') {
    const filePath = path.join(process.cwd(), 'src/data', jsonFilename);
    await fs.writeFile(filePath, JSON.stringify(albums, null, 2), 'utf-8');
}

// Age Calculation Helper
export function calculateTitle(year: number, month: number, context: 'horton' | 'raenie' = 'horton'): string {
    // Horton: 2016/7, Raenie: 2020/5
    const birthYear = context === 'raenie' ? 2020 : 2016;
    const birthMonth = context === 'raenie' ? 5 : 7;

    let totalMonths = (year - birthYear) * 12 + (month - birthMonth);

    // Default title
    let title = `${year}年${month}月`;

    if (totalMonths >= 0) {
        const ageYear = Math.floor(totalMonths / 12);
        const ageMonth = totalMonths % 12;
        title += `-${ageYear}Y${ageMonth}M`;
    }

    return title;
}

import { createGoogleAlbum, shareAlbum } from "./googlePhotos";

// Target Admin Email for Auto-Creation
// Only use Raenie's account for creation as requested
const ADMIN_EMAILS = ["raeniechang@gmail.com"];

export async function ensureCurrentMonthAlbum(context: 'horton' | 'raenie' = 'horton') {
    const now = new Date();
    // Adjust to Taiwan Time (UTC+8) roughly if server is UTC, 
    // but usually local time is fine if running locally. 
    // For strict UTC+8 on any server:
    const twTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));

    const currentYear = twTime.getFullYear().toString();
    // TEST: Force April to trigger creation again for Sharing Test
    // const currentMonth = 4;
    const currentMonth = twTime.getMonth() + 1; // 0-indexed

    // Determine config based on context
    const jsonFilename = context === 'raenie' ? 'raenie_albums.json' : 'albums.json';
    const titlePrefix = context === 'raenie' ? '寧' : '赫';

    const albumsData = await getAlbums(jsonFilename);

    // Check if year exists
    let yearGroup = albumsData.find(g => g.year === currentYear);
    if (!yearGroup) {
        // New Year! Create group at the top.
        yearGroup = { year: currentYear, albums: [] };
        albumsData.unshift(yearGroup);
    }

    // Check if month album exists (approx check by title start)
    // Title format: "YYYY年MM月"
    const expectedTitleStart = `${currentYear}年${currentMonth}月`;
    const exists = yearGroup.albums.some(a => a.title.startsWith(expectedTitleStart));

    if (!exists) {
        console.log(`Auto-creating album for ${expectedTitleStart} (${context})`);

        // Calculate full title with age (Pass Context!)
        let baseTitle = calculateTitle(parseInt(currentYear), currentMonth, context);

        // Add Prefix: "赫 2026年3月-9Y8M" or "寧 2026年3月-9Y8M"
        // Or simply "赫2026年3月..." ? 
        // User said: "加第一個字為..." -> Usually implies "赫 2026..." or "赫-2026..."
        // Let's use a space for readability: "赫 2026年..."

        const fullTitle = `${titlePrefix} ${baseTitle}`;

        // Try to create real Google Album
        let albumLink = "#";
        // Only one email now
        const email = ADMIN_EMAILS[0];

        // Attempt create
        const creationResult = await createGoogleAlbum(fullTitle, email);
        if (creationResult) {
            console.log(`Created Google Album via ${email}: ${creationResult.id}`);

            // Try to share it to get a public link
            const publicLink = await shareAlbum(creationResult.id, email);
            if (publicLink) {
                console.log(`Shared Album! Public Link: ${publicLink}`);
                albumLink = publicLink;
            } else {
                console.warn("Failed to share album automatically. Using private link.");
                albumLink = creationResult.url;
            }
        } else {
            console.error("Failed to create Google Album. Aborting local save.");
            return false; // Do NOT save if API failed
        }

        const newAlbum: Album = {
            title: baseTitle, // Keep display title clean? Or include prefix? 
            // Usually internal display uses standard format. 
            // But if user asked to "add prefix when creating album", they likely mean the GOOGLE ALBUM title.
            // But maybe also the site title?
            // "為Horton建立相簿時要加..." -> Creating the Google Album. 
            // The website display usually follows the "YYYY年MM月-Age" format.
            // Let's keep website title standard, but Google Album title prefixed.

            // Wait, if I change website title, consistency breaks.
            // I will use `baseTitle` for website display, and `fullTitle` for Google Album.

            img_src: "https://via.placeholder.com/400x300?text=New+Album",
            link_href: albumLink
        };

        // Insert at front of the year's albums (Desc order logic usually)
        yearGroup.albums.unshift(newAlbum);

        await saveAlbums(albumsData, jsonFilename);
        return true; // Created
    }
    return false; // Existed
}

export async function createManualAlbum(year: string, month: string, link: string, customTitle?: string) {
    const albumsData = await getAlbums();

    let yearGroup = albumsData.find(g => g.year === year);
    if (!yearGroup) {
        yearGroup = { year: year, albums: [] };
        // Insert year in correct sort order (Descending)
        const idx = albumsData.findIndex(g => parseInt(g.year) < parseInt(year));
        if (idx === -1) albumsData.push(yearGroup); // Oldest
        else albumsData.splice(idx, 0, yearGroup); // Insert before older year
    }

    const y = parseInt(year);
    const m = parseInt(month);
    const autoTitle = calculateTitle(y, m);

    const newAlbum: Album = {
        title: customTitle || autoTitle,
        img_src: "https://via.placeholder.com/400x300?text=Manual+Create",
        link_href: link || "#"
    };

    // Insert logic (Descending by month)
    // Simple hack: add to top if it's the newest, or resort.
    yearGroup.albums.unshift(newAlbum);
    // Optional: re-sort based on month in title? Complicated parsing.
    // Assuming user creates usually "Next month".

    await saveAlbums(albumsData);
}

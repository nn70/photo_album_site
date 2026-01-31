
import fs from 'fs/promises';
import path from 'path';

const TOKEN_FILE = path.join(process.cwd(), 'src/data/tokens.json');

export async function saveRefreshToken(email: string, token: string) {
    let tokens: Record<string, string> = {};
    try {
        const data = await fs.readFile(TOKEN_FILE, 'utf-8');
        tokens = JSON.parse(data);
    } catch {
        // File might not exist
    }

    tokens[email] = token;
    await fs.writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

export async function getRefreshToken(email: string) {
    try {
        const data = await fs.readFile(TOKEN_FILE, 'utf-8');
        const tokens = JSON.parse(data);
        return tokens[email];
    } catch {
        return null;
    }
}

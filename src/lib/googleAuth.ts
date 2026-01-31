
import { getRefreshToken } from "./tokenStore";

export async function getAccessToken(email: string) {
    const refreshToken = await getRefreshToken(email);
    if (!refreshToken) {
        console.error(`No refresh token found for ${email}`);
        return null;
    }

    const params = new URLSearchParams();
    params.append("client_id", process.env.GOOGLE_CLIENT_ID!);
    params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET!);
    params.append("refresh_token", refreshToken);
    params.append("grant_type", "refresh_token");

    try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Failed to refresh access token", data);
            return null;
        }

        // DEBUG: Check scopes
        try {
            const infoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${data.access_token}`);
            const info = await infoRes.json();
            console.log("DEBUG: Access Token Info:", JSON.stringify(info, null, 2));

            // Log to debug file too
            const fs = await import('fs/promises');
            const path = await import('path');
            await fs.appendFile(path.join(process.cwd(), 'debug_error.log'), `\n[Token Info] ${new Date().toISOString()}\n${JSON.stringify(info, null, 2)}\n\n`);
        } catch (e) {
            console.error("Failed to inspect token", e);
        }

        return data.access_token;
    } catch (error) {
        console.error("Network error refreshing token", error);
        return null;
    }
}

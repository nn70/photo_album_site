
import { getAccessToken } from "./googleAuth";

export async function createGoogleAlbum(title: string, email: string): Promise<{ id: string, url: string } | null> {
    const accessToken = await getAccessToken(email);
    if (!accessToken) {
        console.error(`Could not get access token for ${email}`);
        return null;
    }

    try {
        const response = await fetch('https://photoslibrary.googleapis.com/v1/albums', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                album: { title }
            })
        });

        const data = await response.json();
        if (!response.ok) {
            const errorMsg = `Error creating Google Album: Status ${response.status} ${response.statusText}\nResponse Body: ${JSON.stringify(data, null, 2)}\n`;
            console.error(errorMsg);

            // Write to file for debugging
            try {
                const fs = await import('fs/promises');
                const path = await import('path');
                await fs.appendFile(path.join(process.cwd(), 'debug_error.log'), new Date().toISOString() + '\n' + errorMsg + '\n\n');
            } catch (e) {
                console.error("Failed to write to debug log", e);
            }

            return null;
        }

        return {
            id: data.id,
            url: data.productUrl
        };
    } catch (error) {
        console.error("Network error creating Google Album", error);
        return null;
    }
}

export async function shareAlbum(albumId: string, email: string): Promise<string | null> {
    const accessToken = await getAccessToken(email);
    if (!accessToken) return null;

    try {
        const response = await fetch(`https://photoslibrary.googleapis.com/v1/albums/${albumId}:share`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sharedAlbumOptions: {
                    isCollaborative: true,
                    isCommentable: true
                }
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error(`Error sharing album: ${response.statusText}`, data);
            return null;
        }

        return data.shareInfo?.shareableUrl || null;
    } catch (e) {
        console.error("Error executing shareAlbum", e);
        return null;
    }
}

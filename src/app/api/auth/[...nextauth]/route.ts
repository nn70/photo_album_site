
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { saveRefreshToken } from "@/lib/tokenStore";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    // Adding scope for Google Photos (Append Only is safer/less restricted)
                    scope: "openid email profile https://www.googleapis.com/auth/photoslibrary.appendonly"
                }
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.refresh_token && user.email) {
                console.log(`Saving refresh token for ${user.email}`);
                await saveRefreshToken(user.email, account.refresh_token);
            }
            return true;
        },
        async session({ session }) {
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3002",
    fetchOptions: {
        // Increase timeout for slow database operations
        onRequest: (ctx) => {
            console.log("[Auth] Request:", ctx.method, ctx.url);
            return ctx;
        },
        onSuccess: (ctx) => {
            console.log("[Auth] Success:", ctx.response.status);
        },
        onError: (ctx) => {
            console.error("[Auth] Error:", ctx.error);
        },
    },
});

export const {
    useSession,
    signIn,
    signUp,
    signOut,
} = authClient;

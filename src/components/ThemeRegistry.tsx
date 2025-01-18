// src/components/ThemeRegistry.tsx
"use client";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme/theme";
import { useState } from "react";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const [{ cache, flush }] = useState(() => {
        const cache = createCache({ key: "mui" });
        cache.compat = true;
        return {
            cache,
            flush: () => null,
        };
    });

    useServerInsertedHTML(() => {
        const names = flush();
        if (!names) return null;
        return null;
    });

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}

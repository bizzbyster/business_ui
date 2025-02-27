import { ClerkProvider } from '@clerk/nextjs';
import ThemeRegistry from "../components/ThemeRegistry";

export const metadata = {
    title: "Enterprise Solutions Inc.",
    description: "Enterprise-grade solutions for modern businesses",
    robots: "noindex, nofollow",
    googleBot: "noindex, nofollow",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ClerkProvider>
                    <ThemeRegistry>{children}</ThemeRegistry>
                </ClerkProvider>
            </body>
        </html>
    );
}
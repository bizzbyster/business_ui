import ThemeRegistry from "../components/ThemeRegistry";

export const metadata = {
    title: "Enterprise Solutions Inc.",
    description: "Enterprise-grade solutions for modern businesses",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ThemeRegistry>{children}</ThemeRegistry>
            </body>
        </html>
    );
}

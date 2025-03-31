// app/teaser/layout.tsx

export default async function TeaserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* No header component needed for teaser */}
      {children}
    </div>
  );
}
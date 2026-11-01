import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cahaya Humaira - Auto Dakwah Video | Instagram & YouTube",
  description:
    "Aplikasi otomatisasi dakwah video feminin Islami untuk Instagram Reels @cahayahumaira dan YouTube Shorts / Video di Jambi.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Amiri:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-humaira-cream text-humaira-plum font-sans selection:bg-humaira-pink selection:text-humaira-plum">
        {children}
      </body>
    </html>
  );
}

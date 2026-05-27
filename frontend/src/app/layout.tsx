import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Laboratoire Akrabiolab | Pureté Absolue & Excellence Scientifique",
  description: "Leader en solutions antiseptiques et matières premières de haute pureté à Sidi Moussa, Alger. Découvrez notre gamme de produits certifiés ISO pour l'industrie cosmétique et pharmaceutique.",
  keywords: ["Akrabiolab", "Laboratoire Alger", "Antiseptique", "Cosmétique", "Pharmaceutique", "Sidi Moussa", "Pureté industrielle"],
  authors: [{ name: "Laboratoire Akrabiolab" }],
  openGraph: {
    title: "Laboratoire Akrabiolab | Pureté Absolue",
    description: "Solutions antiseptiques et matières premières de haute pureté à Alger.",
    url: "https://akrabiolab.com", // À mettre à jour avec votre domaine final
    siteName: "Akrabiolab",
    images: [
      {
        url: "/images/akrabilab-logo.png",
        width: 1200,
        height: 630,
        alt: "Logo Akrabiolab",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laboratoire Akrabiolab",
    description: "Excellence scientifique et pureté absolue à Alger.",
    images: ["/images/akrabilab-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

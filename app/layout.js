import "./globals.css";

export const metadata = {
  title: "LOL 2 ?",
  description: "Invitation au cinéma pour LOL 2"
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

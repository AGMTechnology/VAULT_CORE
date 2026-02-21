import "./globals.css";

export const metadata = {
  title: "VAULT_CORE Workspace",
  description: "React/Next control-plane UI for VAULT_CORE hubs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

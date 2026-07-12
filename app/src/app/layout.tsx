import type { Metadata } from "next";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./styles.css";

export const metadata: Metadata = {
  title: "Dhukuti Protocol",
  description: "Trustless rotating savings on Solana"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

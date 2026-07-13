import type { Metadata } from "next";
import { Toaster } from "sonner";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./styles.css";

export const metadata: Metadata = {
  title: "Dhukuti Protocol",
  description: "Trustless rotating savings on Solana",
  icons: {
    icon: "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='14' stroke='%230f766e' stroke-width='1.5' stroke-dasharray='4 3' opacity='0.3'/%3E%3Ccircle cx='16' cy='16' r='9' stroke='%230f766e' stroke-width='1.2' stroke-dasharray='3 4' opacity='0.2'/%3E%3Ccircle cx='16' cy='16' r='2' fill='%230f766e' opacity='0.8'/%3E%3Ccircle cx='16' cy='2' r='1.8' fill='%230f766e' opacity='0.9'/%3E%3Ccircle cx='30' cy='16' r='1.8' fill='%230f766e' opacity='0.7'/%3E%3Ccircle cx='16' cy='30' r='1.8' fill='%230f766e' opacity='0.5'/%3E%3Ccircle cx='2' cy='16' r='1.8' fill='%230f766e' opacity='0.6'/%3E%3C/svg%3E"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}

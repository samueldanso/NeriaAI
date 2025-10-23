import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletConnect } from "@/components/wallet-connect";

const navLinks = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Integrations",
    href: "#integrations",
  },
  {
    title: "Capsules",
    href: "/capsules",
  },
];

export default function Header() {
  return (
    <header className="border-b">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">Neria AI</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <WalletConnect />
        </div>
      </nav>
    </header>
  );
}

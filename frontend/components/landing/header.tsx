import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  {
    title: "Explore",
    href: "/explore",
  },
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Integrations",
    href: "#integrations",
  },
];

export default function Header() {
  return (
    <header className="relative border-b border-border/40">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-6">
        {/* Logo with icon */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/icon.png"
            alt="Neria AI"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="text-xl font-bold">Neria AI</span>
        </Link>

        {/* Center navigation links */}
        <div className="hidden items-center gap-8 md:flex">
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

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ArrowRight, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const [inputValue, setInputValue] = useState("");
  const { authenticated, login } = usePrivy();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (authenticated) {
      window.location.href = "/chat";
    } else {
      // Trigger sign-in
      login();
    }
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28">
      {/* Improved radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent dark:from-blue-400/30 dark:via-purple-400/20 dark:to-transparent" />

      <div className="container mx-auto px-4">
        {/* Announcement Badge */}
        <div className="mb-8 flex justify-center">
          <Link
            href="#features"
            className="group inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-2 text-sm font-medium transition-all hover:bg-accent hover:shadow-md"
          >
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
              NEW
            </span>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              Introducing Neria AI
            </span>
            <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Hero Headline */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="block text-foreground">Verified Knowledge</span>
            <span
              className="relative mt-2 block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
              style={{
                fontFamily: "var(--font-garnett)",
                fontStyle: "italic",
                fontWeight: 600,
              }}
            >
              Permanent On-Chain
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-10 max-w-xl text-sm text-muted-foreground sm:text-base md:text-lg">
            Transform AI reasoning into verified, permanent knowledge assets —
            validated by autonomous agents, minted as NFTs, and discoverable
            through semantic search.
          </p>

          {/* Fake Chat Input Box - Lovable Style */}
          <div className="mx-auto mb-8 max-w-2xl">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center gap-3 rounded-2xl border bg-background/80 backdrop-blur-sm p-4 shadow-lg">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Neria complex questions.."
                  className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-base"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90"
                >
                  <Send className="size-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Enhanced background gradient decoration */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-500/30 via-purple-500/20 to-pink-500/10 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </section>
  );
}

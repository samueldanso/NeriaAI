import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 relative overflow-hidden rounded-3xl border p-12 text-center shadow-lg md:p-16">
          {/* Background decoration */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            aria-hidden="true"
          >
            <div className="absolute -left-20 -top-20 size-64 rounded-full bg-blue-400 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 size-64 rounded-full bg-purple-400 blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm dark:bg-black/20">
              <Sparkles className="size-4 text-blue-600" />
              <span>Start Building Knowledge Today</span>
            </div>

            <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Ready to transform AI outputs into{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                trusted knowledge?
              </span>
            </h2>

            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-base md:text-lg">
              Join researchers, developers, and experts building the future of
              AI-validated knowledge. Start creating verified Knowledge Capsules
              today.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-12 gap-2 rounded-full px-8 text-base font-semibold shadow-lg transition-all hover:shadow-xl"
              >
                <Link href="/capsules">
                  Try Neria AI Free
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-full px-8 text-base font-semibold"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>

            <p className="text-muted-foreground mt-6 text-sm">
              No credit card required • Built on Fetch.ai & ASI Alliance
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

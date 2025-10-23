import { ArrowUp, CheckCircle2, Network, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function FeaturesSection() {
  return (
    <section id="features">
      <div className="py-24">
        <div className="mx-auto w-full max-w-3xl px-6">
          <h2 className="text-foreground text-balance text-3xl font-semibold md:text-4xl">
            <span className="text-muted-foreground">
              Building the future of knowledge work with
            </span>{" "}
            Multi-Agent AI Reasoning
          </h2>
          <div className="@container mt-12 space-y-12">
            <Card className="relative overflow-hidden border-0 p-0 shadow-none sm:col-span-2">
              <div className="bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent dark:from-blue-400/30 dark:via-purple-400/20 dark:to-transparent absolute inset-0" />
              <div className="m-auto max-w-md p-4 sm:p-12">
                <ReasoningIllustration />
              </div>
            </Card>
            <div className="@sm:grid-cols-2 @2xl:grid-cols-3 grid gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Multi-Agent System</h3>
                <p className="text-muted-foreground">
                  Five specialized uAgents collaborate to route, research,
                  reason, validate, and store knowledge.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Autonomous Validation</h3>
                <p className="text-muted-foreground">
                  Multi-agent consensus (2/3 approval) verifies reasoning
                  quality without human bottleneck.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Knowledge Capsule NFTs</h3>
                <p className="text-muted-foreground">
                  Each verified answer becomes an ownable, permanent ERC-721
                  asset on Base L2.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ReasoningIllustration = () => {
  return (
    <Card aria-hidden className="relative space-y-4 p-6">
      <div className="w-fit">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 fill-blue-500 stroke-blue-500" />
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Ask Neria
          </span>
        </div>
        <p className="mt-2 line-clamp-3 text-sm">
          What are the key differences between Layer 1 and Layer 2 blockchain
          solutions?
        </p>
        <ul
          role="list"
          className="text-muted-foreground mt-4 space-y-2 text-sm"
        >
          {[
            { value: "5", emoji: "🤖", label: "AI Agents" },
            { value: "95%", emoji: "✅", label: "Accuracy Rate" },
            { value: "100+", emoji: "📦", label: "Verified Capsules" },
          ].map((stat, index) => (
            <li key={index} className="-ml-0.5 flex items-center gap-2">
              <span>{stat.emoji}</span>
              <span className="text-foreground font-medium">{stat.value}</span>{" "}
              {stat.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-foreground/5 -mx-3 -mb-3 space-y-3 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">Reasoning Status</div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-green-500" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              Validated
            </span>
          </div>
        </div>

        {/* Simplified Flow */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Query classified</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Found 3 related capsules</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Validation complete</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Multi-Agent Chain
            </span>
          </div>

          <Button
            size="sm"
            className="h-7 rounded-full bg-primary text-primary-foreground text-xs"
          >
            <Send className="size-3" strokeWidth={3} />
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
};

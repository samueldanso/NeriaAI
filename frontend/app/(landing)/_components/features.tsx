import { ArrowUp, CheckCircle2, Network, Sparkles } from "lucide-react";
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
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 absolute inset-0" />
              <div className="m-auto max-w-md p-4 sm:p-12">
                <ReasoningIllustration />
              </div>
            </Card>
            <div className="@sm:grid-cols-2 @2xl:grid-cols-3 grid gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Multi-Agent Reasoning</h3>
                <p className="text-muted-foreground">
                  Five specialized AI agents work together to research, reason,
                  and validate complex queries.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Expert Validation</h3>
                <p className="text-muted-foreground">
                  Human experts verify AI reasoning through ASI:One, ensuring
                  accuracy and trust.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Knowledge Capsules</h3>
                <p className="text-muted-foreground">
                  Verified answers become reusable knowledge assets,
                  discoverable and citable.
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
            AI Reasoning
          </span>
        </div>
        <p className="mt-2 line-clamp-3 text-sm">
          How does React useMemo optimize component re-renders and when should I
          use it?
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Multi-Agent Chain
            </span>
          </div>

          <Button size="sm" className="h-7 rounded-full bg-black text-xs">
            <ArrowUp className="size-3" strokeWidth={3} />
            View Capsule
          </Button>
        </div>
      </div>
    </Card>
  );
};

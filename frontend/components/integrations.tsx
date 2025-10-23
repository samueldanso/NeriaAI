import { Plus } from "lucide-react";
import Link from "next/link";
import { ASIOne, DuckDuckGo, SingularityNET } from "@/components/logos";
import { Button } from "@/components/ui/button";

export default function IntegrationsSection() {
  return (
    <section id="integrations">
      <div className="bg-muted dark:bg-background rounded-xl py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-md px-6 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)]">
            <div className="bg-background dark:bg-muted/50 rounded-xl border px-6 pb-8 pt-3 shadow-xl">
              <Integration
                icon={<ASIOne />}
                name="ASI:One"
                description="Advanced AI reasoning powered by ASI Alliance for multi-agent validation."
              />
              <Integration
                icon={<SingularityNET />}
                name="SingularityNET MeTTa"
                description="Structured knowledge representation and logical reasoning framework."
              />
              <Integration
                icon={<DuckDuckGo />}
                name="DuckDuckGo Search"
                description="Privacy-focused web search for real-time information gathering."
              />
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-lg space-y-6 text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl lg:text-5xl">
              Powered by ASI:One LLM & SingularityNET MeTTa & DuckDuckGo Search
            </h2>
            <p className="text-muted-foreground">
              Neria AI leverages advanced LLM and trusted knowledge bases to
              deliver accurate, validated reasoning chains.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              asChild
            >
              <Link href="/chat">Start Asking Questions</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const Integration = ({
  icon,
  name,
  description,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
}) => {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border/40 py-3 last:border-b-0">
      <div className="bg-muted border-foreground/5 flex size-12 items-center justify-center rounded-lg border">
        {icon}
      </div>
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium">{name}</h3>
        <p className="text-muted-foreground line-clamp-1 text-sm">
          {description}
        </p>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        aria-label="Add integration"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
};

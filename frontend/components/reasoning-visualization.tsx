"use client";

interface ReasoningVisualizationProps {
  reasoning: string;
}

export function ReasoningVisualization({
  reasoning,
}: ReasoningVisualizationProps) {
  const steps = reasoning.split("\n").filter((s) => s.trim());

  return (
    <div className="card-base bg-surface-hover border-primary/30">
      <h4 className="font-semibold text-sm mb-3 text-primary">
        Reasoning Chain
      </h4>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
              {i + 1}
            </div>
            <p className="text-sm text-muted flex-1 pt-0.5">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

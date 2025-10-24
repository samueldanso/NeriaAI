"use client";

import {
  Brain,
  CheckCircle,
  ChevronDownIcon,
  ChevronRightIcon,
  Clock,
  Shield,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ReasoningStep {
  step: number;
  title: string;
  description: string;
  status: "completed" | "active" | "pending";
}

interface ValidationResult {
  status: "approved" | "rejected" | "needs_revision";
  confidence: number;
  validators: Array<{
    name: string;
    status: "approved" | "rejected";
    confidence: number;
    address: string;
  }>;
}

interface ReasoningDisplayProps {
  reasoning?: ReasoningStep[];
  validation?: ValidationResult;
  className?: string;
}

export function ReasoningDisplay({
  reasoning,
  validation,
  className,
}: ReasoningDisplayProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  if (!reasoning && !validation) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Reasoning Chain */}
      {reasoning && reasoning.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <Button
              variant="ghost"
              onClick={() => setShowReasoning(!showReasoning)}
              className="flex items-center gap-2 p-0 h-auto font-semibold text-left"
            >
              {showReasoning ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
              <span>🧠 Reasoning Chain</span>
              <Badge variant="secondary" className="ml-auto">
                {reasoning.length} steps
              </Badge>
            </Button>
          </CardHeader>
          {showReasoning && (
            <CardContent className="pt-0">
              <div className="space-y-3">
                {reasoning.map((step) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                          step.status === "completed"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                            : step.status === "active"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 animate-pulse"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {step.status === "completed" ? "✓" : step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    {step.status === "completed" && (
                      <div className="flex-shrink-0 text-green-600 dark:text-green-400 text-lg">
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Validation Results */}
      {validation && (
        <Card>
          <CardHeader className="pb-3">
            <Button
              variant="ghost"
              onClick={() => setShowValidation(!showValidation)}
              className="flex items-center gap-2 p-0 h-auto font-semibold text-left"
            >
              {showValidation ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
              <span>✅ Validation Results</span>
              <Badge
                variant={
                  validation.status === "approved"
                    ? "default"
                    : validation.status === "rejected"
                      ? "destructive"
                      : "secondary"
                }
                className="ml-auto"
              >
                {validation.status.replace("_", " ")}
              </Badge>
            </Button>
          </CardHeader>
          {showValidation && (
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Overall Status */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Overall Status</span>
                    <Badge
                      variant={
                        validation.status === "approved"
                          ? "default"
                          : validation.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {validation.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Confidence: {validation.confidence}%</span>
                    <span>{validation.validators.length} validators</span>
                  </div>
                </div>

                {/* Individual Validators */}
                <div className="space-y-3">
                  {validation.validators.map((validator, index) => (
                    <div key={index} className="p-3 bg-card rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{validator.name}</span>
                        <Badge
                          variant={
                            validator.status === "approved"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {validator.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Confidence: {validator.confidence}%</span>
                        <span className="font-mono text-xs">
                          {validator.address}
                        </span>
                      </div>
                      <div className="mt-2 w-full h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            validator.status === "approved"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${validator.confidence}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Consensus Summary */}
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-primary font-semibold">
                    Consensus:{" "}
                    {
                      validation.validators.filter(
                        (v) => v.status === "approved",
                      ).length
                    }
                    /{validation.validators.length} validators approved
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}

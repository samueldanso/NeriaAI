"use client";

import {
  ArrowRight,
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

interface EnhancedReasoningDisplayProps {
  reasoning?: ReasoningStep[];
  validation?: ValidationResult;
  className?: string;
}

export function EnhancedReasoningDisplay({
  reasoning,
  validation,
  className,
}: EnhancedReasoningDisplayProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  if (!reasoning && !validation) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "active":
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      case "pending":
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

  const getValidationIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "needs_revision":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getValidationColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "needs_revision":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Reasoning Chain */}
      {reasoning && reasoning.length > 0 && (
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="pb-3">
            <Button
              variant="ghost"
              onClick={() => setShowReasoning(!showReasoning)}
              className="flex items-center gap-2 p-0 h-auto font-semibold text-left hover:bg-transparent"
            >
              {showReasoning ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
              <Brain className="w-4 h-4 text-primary" />
              Reasoning Chain ({reasoning.length} steps)
              <Badge variant="outline" className="ml-auto">
                {reasoning.filter((r) => r.status === "completed").length}/
                {reasoning.length} completed
              </Badge>
            </Button>
          </CardHeader>
          {showReasoning && (
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {Math.round(
                        (reasoning.filter((r) => r.status === "completed")
                          .length /
                          reasoning.length) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (reasoning.filter((r) => r.status === "completed")
                        .length /
                        reasoning.length) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  {reasoning.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border"
                    >
                      <div className="flex-shrink-0">
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{step.title}</h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStatusColor(step.status)}`}
                          >
                            {step.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                      {index < reasoning.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Validation Results */}
      {validation && (
        <Card className="border-l-4 border-l-secondary shadow-sm">
          <CardHeader className="pb-3">
            <Button
              variant="ghost"
              onClick={() => setShowValidation(!showValidation)}
              className="flex items-center gap-2 p-0 h-auto font-semibold text-left hover:bg-transparent"
            >
              {showValidation ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
              <Shield className="w-4 h-4 text-secondary" />
              Validation Results
              <Badge
                variant="outline"
                className={`ml-auto ${getValidationColor(validation.status)}`}
              >
                {validation.status}
              </Badge>
            </Button>
          </CardHeader>
          {showValidation && (
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Overall Status */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                  <div className="flex-shrink-0">
                    {getValidationIcon(validation.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">Overall Status</h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getValidationColor(
                          validation.status,
                        )}`}
                      >
                        {validation.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {Math.round(validation.confidence * 100)}%
                    </p>
                  </div>
                </div>

                {/* Validators */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Validators
                  </h4>
                  <div className="space-y-2">
                    {validation.validators.map((validator, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 border"
                      >
                        <div className="flex-shrink-0">
                          {validator.status === "approved" ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {validator.name}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                validator.status === "approved"
                                  ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                  : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                              }`}
                            >
                              {validator.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Confidence: {Math.round(validator.confidence * 100)}
                            %
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}

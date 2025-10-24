"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CapsuleCardProps {
  capsule: {
    id: string;
    title: string;
    creator: string;
    verified: boolean;
    citations: number;
    topic: string;
    date: string;
    description?: string;
  };
}

export function CapsuleCard({ capsule }: CapsuleCardProps) {
  return (
    <Link href={`/capsule/${capsule.id}`}>
      <div className="card-base hover:bg-surface-hover transition-colors cursor-pointer h-full flex flex-col group">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary font-medium">
            {capsule.topic}
          </span>
          {capsule.verified && <span className="text-lg">✅</span>}
        </div>

        <h3 className="font-semibold mb-2 flex-1 line-clamp-2 group-hover:text-primary transition-colors">
          {capsule.title}
        </h3>

        {capsule.description && (
          <p className="text-sm text-muted mb-3 line-clamp-2">
            {capsule.description}
          </p>
        )}

        <div className="space-y-2 text-sm text-muted mb-4 flex-1">
          <p>Creator: {capsule.creator}</p>
          <div className="flex justify-between">
            <span>{capsule.citations} citations</span>
            <span>{new Date(capsule.date).toLocaleDateString()}</span>
          </div>
        </div>

        <Button
          size="sm"
          className="w-full bg-primary text-background hover:bg-primary-dark"
        >
          View Details
        </Button>
      </div>
    </Link>
  );
}

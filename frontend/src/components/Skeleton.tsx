"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
    animate?: boolean;
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
    return (
        <motion.div
            className={cn(
                "rounded-lg bg-foreground/5",
                className
            )}
            animate={animate ? {
                opacity: [0.5, 0.8, 0.5]
            } : undefined}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );
}

export function StatCardSkeleton() {
    return (
        <div className="p-6 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
            <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-9 w-16" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </div>
    );
}

export function ProjectCardSkeleton() {
    return (
        <div className="p-6 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
            <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-16 w-full mb-4" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-lg" />
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-12 w-40 rounded-2xl" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>

            {/* Active Project */}
            <ProjectCardSkeleton />

            {/* All Projects */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                </div>
            </div>
        </div>
    );
}

export function KanbanSkeleton() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-10 w-72" />
                <Skeleton className="h-4 w-96" />
                <div className="flex gap-2">
                    <Skeleton className="h-7 w-16 rounded-lg" />
                    <Skeleton className="h-7 w-16 rounded-lg" />
                    <Skeleton className="h-7 w-20 rounded-lg" />
                </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((col) => (
                    <div key={col} className="space-y-4">
                        <div className="flex items-center gap-3 px-4">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="ml-auto h-4 w-4" />
                        </div>
                        <div className="space-y-3 min-h-[200px] p-3 rounded-2xl bg-foreground/[0.02]">
                            <TaskCardSkeleton />
                            {col === 1 && (
                                <>
                                    <TaskCardSkeleton />
                                    <TaskCardSkeleton />
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TaskCardSkeleton() {
    return (
        <div className="p-4 rounded-xl bg-background border border-foreground/5">
            <div className="flex items-start gap-3">
                <Skeleton className="w-5 h-5 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
            </div>
        </div>
    );
}

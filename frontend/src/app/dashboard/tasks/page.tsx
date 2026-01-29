"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Filter,
    Search,
    LayoutGrid,
    Trophy,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
type TaskPriority = "High" | "Medium" | "Low";
type TaskStatus = "To Do" | "In Progress" | "Review" | "Done";

interface Task {
    id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    assignee: { name: string; avatar: string };
    xp: number;
    dueDate: string;
}

const INITIAL_TASKS: Task[] = [
    {
        id: "1",
        title: "Implement JWT Refresh Flow",
        description: "Secure the authentication system by adding refresh tokens and automatic session renewal.",
        priority: "High",
        status: "To Do",
        assignee: { name: "Xurshid", avatar: "X" },
        xp: 450,
        dueDate: "2 days"
    },
    {
        id: "2",
        title: "Refactor Sidebar Component",
        description: "Clean up CSS and improve accessibility for the dashboard sidebar.",
        priority: "Medium",
        status: "In Progress",
        assignee: { name: "Sarah", avatar: "S" },
        xp: 200,
        dueDate: "5 hours"
    },
    {
        id: "3",
        title: "API Performance Audit",
        description: "Analyze endpoint latency and optimize PostgreSQL queries for the Project Hub. This involves checking long-running queries and adding missing indexes.",
        priority: "High",
        status: "Review",
        assignee: { name: "Marcus", avatar: "M" },
        xp: 800,
        dueDate: "Today"
    },
    {
        id: "4",
        title: "Setup Vitest for Shared Libs",
        description: "Initial unit testing setup for the common utility functions used across the monorepo.",
        priority: "Low",
        status: "Done",
        assignee: { name: "Elena", avatar: "E" },
        xp: 150,
        dueDate: "1 week ago"
    },
    {
        id: "5",
        title: "Glassmorphism UI Kit",
        description: "Create a reusable set of React components for the new design language.",
        priority: "Medium",
        status: "To Do",
        assignee: { name: "Xurshid", avatar: "X" },
        xp: 600,
        dueDate: "3 days"
    }
];

const COLUMNS: TaskStatus[] = ["To Do", "In Progress", "Review", "Done"];

export default function TaskBoardPage() {
    const [tasks] = useState<Task[]>(INITIAL_TASKS);

    const getPriorityColor = (priority: TaskPriority) => {
        switch (priority) {
            case "High": return "text-red-500 bg-red-500/10";
            case "Medium": return "text-amber-500 bg-amber-500/10";
            case "Low": return "text-blue-500 bg-blue-500/10";
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Task Board</h1>
                    <p className="text-foreground/60 font-medium">Coordinate engineering sprints and track milestone progress.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter tasks..."
                            className="h-11 pl-10 pr-4 rounded-xl bg-foreground/[0.03] border border-foreground/5 focus:border-primary/40 outline-none w-48 text-sm font-medium transition-all"
                        />
                    </div>
                    <button className="h-11 px-4 rounded-xl border border-foreground/5 bg-foreground/[0.02] flex items-center gap-2 hover:bg-foreground/[0.05] transition-colors">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-bold">Priority</span>
                    </button>
                    <button className="h-11 px-6 rounded-xl bg-foreground text-background flex items-center gap-2 hover:scale-105 transition-transform shadow-lg">
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-black">New Task</span>
                    </button>
                </div>
            </div>

            {/* Board Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                {COLUMNS.map((column) => (
                    <div key={column} className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-3">
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    column === "To Do" ? "bg-foreground/20" :
                                        column === "In Progress" ? "bg-amber-500" :
                                            column === "Review" ? "bg-blue-500" : "bg-green-500"
                                )} />
                                <h2 className="text-sm font-black uppercase tracking-widest opacity-40">{column}</h2>
                                <span className="text-[10px] font-black bg-foreground/[0.05] px-1.5 py-0.5 rounded-md opacity-30">
                                    {tasks.filter(t => t.status === column).length}
                                </span>
                            </div>
                            <button className="p-1 hover:bg-foreground/5 rounded-md opacity-20 hover:opacity-100 transition-all">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4 min-h-[500px] p-2 rounded-[2rem] bg-foreground/[0.01] border border-dashed border-foreground/5">
                            <AnimatePresence mode="popLayout">
                                {tasks.filter(t => t.status === column).map((task, i) => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="glass-panel group p-5 border border-foreground/5 hover:border-primary/20 hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md",
                                                getPriorityColor(task.priority)
                                            )}>
                                                {task.priority}
                                            </span>
                                            <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-foreground/5 transition-all">
                                                <MoreHorizontal className="w-4 h-4 text-foreground/20" />
                                            </button>
                                        </div>

                                        <h3 className="font-bold text-base leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {task.title}
                                        </h3>

                                        <p className="text-xs text-foreground/50 leading-relaxed mb-6 line-clamp-3">
                                            {task.description}
                                        </p>

                                        <div className="pt-4 border-t border-foreground/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-black shadow-sm ring-2 ring-background">
                                                    {task.assignee.avatar}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-foreground/30">
                                                    <Clock className="w-3 h-3" />
                                                    {task.dueDate}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 text-primary">
                                                <Trophy className="w-3 h-3" />
                                                <span className="text-[10px] font-black">{task.xp} XP</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {tasks.filter(t => t.status === column).length === 0 && (
                                <div className="h-24 flex items-center justify-center">
                                    <p className="text-[10px] font-black uppercase tracking-tighter opacity-10">No Tasks</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

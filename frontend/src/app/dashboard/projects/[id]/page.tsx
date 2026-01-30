"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { ArrowLeft, Sparkles, CheckCircle2, Clock, ListTodo, Loader2, GripVertical, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import { KanbanSkeleton } from "@/components/Skeleton";
import { DeleteConfirmModal } from "@/components/DeleteModal";

interface Project {
    id: number;
    title: string;
    description: string;
    stack: string;
    type: string;
}

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    order: number;
}

const statusConfig = {
    todo: { label: "To Do", icon: ListTodo, color: "text-orange-500", bg: "bg-orange-500/10" },
    in_progress: { label: "In Progress", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
    done: { label: "Done", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" }
};

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = Number(params.id);

    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = async () => {
        try {
            await api.delete(`/projects/${projectId}`);
            toast.success("Project deleted successfully");
            router.push("/dashboard");
        } catch (err) {
            console.error("Failed to delete project:", err);
            toast.error("Failed to delete project");
            throw err;
        }
    };

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [projRes, tasksRes] = await Promise.all([
                api.get(`/projects/${projectId}`),
                api.get(`/tasks/${projectId}`)
            ]);
            setProject(projRes.data);
            setTasks(tasksRes.data);
        } catch (err) {
            console.error("Failed to fetch project:", err);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateTaskStatus = async (taskId: number, newStatus: string) => {
        const task = tasks.find(t => t.id === taskId);
        try {
            await api.patch(`/tasks/${taskId}`, { status: newStatus });
            setTasks(prev => prev.map(t =>
                t.id === taskId ? { ...t, status: newStatus } : t
            ));
            const statusLabels = { todo: "To Do", in_progress: "In Progress", done: "Done" };
            toast.success(`Task moved to ${statusLabels[newStatus as keyof typeof statusLabels]}`);
        } catch (err) {
            console.error("Failed to update task:", err);
            toast.error("Failed to update task");
        }
    };


    const generateTasks = async () => {
        try {
            setIsGeneratingTasks(true);
            const res = await api.post(`/tasks/${projectId}/generate`);
            setTasks(res.data);
            toast.success(`${res.data.length} tasks generated!`);
        } catch (err) {
            console.error("Failed to generate tasks:", err);
            toast.error("Failed to generate tasks");
        } finally {
            setIsGeneratingTasks(false);
        }
    };


    const todoTasks = tasks.filter(t => t.status === "todo");
    const inProgressTasks = tasks.filter(t => t.status === "in_progress");
    const doneTasks = tasks.filter(t => t.status === "done");

    if (isLoading) {
        return <KanbanSkeleton />;
    }


    if (!project) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-black">Project not found</h2>
                <Link href="/dashboard" className="text-primary hover:underline mt-4 inline-block">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-6">
                <div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground transition-colors mb-4 text-sm font-bold"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">{project.title}</h1>
                    <p className="text-foreground/40 max-w-2xl text-sm">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {project.stack.split(',').map((tech, i) => (
                            <span key={i} className="px-3 py-1 bg-foreground/5 rounded-lg text-xs font-bold">
                                {tech.trim()}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {tasks.length === 0 && (
                        <button
                            onClick={generateTasks}
                            disabled={isGeneratingTasks}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-primary text-white hover:scale-105 active:scale-95 transition-all"
                        >
                            {isGeneratingTasks ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Sparkles className="w-5 h-5" />
                            )}
                            Generate Tasks
                        </button>
                    )}
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="p-3 rounded-2xl font-bold text-sm border border-red-500/20 text-red-500 hover:bg-red-500/10 hover:scale-105 active:scale-95 transition-all"
                        title="Delete Project"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>


            {/* Kanban Board */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Todo Column */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4">
                        <div className={`p-2 rounded-lg ${statusConfig.todo.bg}`}>
                            <ListTodo className={`w-4 h-4 ${statusConfig.todo.color}`} />
                        </div>
                        <h3 className="font-black text-sm">{statusConfig.todo.label}</h3>
                        <span className="ml-auto text-xs font-bold text-foreground/30">{todoTasks.length}</span>
                    </div>
                    <div className="space-y-3 min-h-[200px] p-3 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
                        <AnimatePresence>
                            {todoTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusChange={updateTaskStatus}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4">
                        <div className={`p-2 rounded-lg ${statusConfig.in_progress.bg}`}>
                            <Clock className={`w-4 h-4 ${statusConfig.in_progress.color}`} />
                        </div>
                        <h3 className="font-black text-sm">{statusConfig.in_progress.label}</h3>
                        <span className="ml-auto text-xs font-bold text-foreground/30">{inProgressTasks.length}</span>
                    </div>
                    <div className="space-y-3 min-h-[200px] p-3 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
                        <AnimatePresence>
                            {inProgressTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusChange={updateTaskStatus}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Done Column */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4">
                        <div className={`p-2 rounded-lg ${statusConfig.done.bg}`}>
                            <CheckCircle2 className={`w-4 h-4 ${statusConfig.done.color}`} />
                        </div>
                        <h3 className="font-black text-sm">{statusConfig.done.label}</h3>
                        <span className="ml-auto text-xs font-bold text-foreground/30">{doneTasks.length}</span>
                    </div>
                    <div className="space-y-3 min-h-[200px] p-3 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
                        <AnimatePresence>
                            {doneTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusChange={updateTaskStatus}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Project"
                description="Are you sure you want to delete this project?"
                itemName={project.title}
            />
        </div>
    );

}

interface TaskCardProps {
    task: Task;
    onStatusChange: (taskId: number, status: string) => void;
}

function TaskCard({ task, onStatusChange }: TaskCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const nextStatus = {
        todo: "in_progress",
        in_progress: "done",
        done: "todo"
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 rounded-xl bg-background border border-foreground/5 hover:border-foreground/10 transition-all group cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex items-start gap-3">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(task.id, nextStatus[task.status as keyof typeof nextStatus]);
                    }}
                    className={cn(
                        "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110",
                        task.status === "done"
                            ? "border-green-500 bg-green-500"
                            : task.status === "in_progress"
                                ? "border-purple-500"
                                : "border-foreground/20"
                    )}
                >
                    {task.status === "done" && <CheckCircle2 className="w-3 h-3 text-white" />}
                </button>
                <div className="flex-1">
                    <h4 className={cn(
                        "font-bold text-sm transition-colors",
                        task.status === "done" && "line-through text-foreground/40"
                    )}>
                        {task.title}
                    </h4>
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-xs text-foreground/40 mt-2"
                            >
                                {task.description}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

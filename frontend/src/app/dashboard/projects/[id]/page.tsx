"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, CheckCircle2, Clock, ListTodo, Loader2, GripVertical, Trash2, Pencil } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import { KanbanSkeleton } from "@/components/Skeleton";
import { DeleteConfirmModal } from "@/components/DeleteModal";
import { EditProjectModal } from "@/components/EditProjectModal";
import { Project, useTasks, Task } from "@/hooks/useProjects";
import { TaskCard } from "@/components/TaskCard";
import { EditTaskModal } from "@/components/EditTaskModal";
import { TaskDetailModal } from "@/components/TaskDetailModal";

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
    const [isLoadingProject, setIsLoadingProject] = useState(true);

    // Project Modals
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Task Modals & State
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Use hooks
    const {
        tasks,
        generateTasks,
        updateTask,
        deleteTask,
        isLoading: isTasksLoading,
        isGenerating: isGeneratingTasks,
        refetch: refetchTasks
    } = useTasks(isNaN(projectId) ? null : projectId);

    const handleDelete = async () => {
        try {
            await api.delete(`/projects/${projectId}`);
            toast.success("Project deleted successfully");
            router.push("/dashboard");
        } catch (err) {
            console.error("Failed to delete project:", err);
            toast.error("Failed to delete project");
        }
    };

    const handleUpdate = async (id: number, data: Partial<Project>) => {
        try {
            const response = await api.patch(`/projects/${id}`, data);
            setProject(response.data);
            toast.success("Project updated successfully");
        } catch (err) {
            console.error("Failed to update project:", err);
            toast.error("Failed to update project");
        }
    };

    const fetchProject = useCallback(async () => {
        if (isNaN(projectId)) return;
        try {
            setIsLoadingProject(true);
            const res = await api.get(`/projects/${projectId}`);
            setProject(res.data);
        } catch (err) {
            console.error("Failed to fetch project:", err);
        } finally {
            setIsLoadingProject(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    // Task Handlers
    const handleTaskUpdate = async (id: number, data: Partial<Task>) => {
        try {
            await updateTask(id, data);
            toast.success("Task updated");
            setShowEditTaskModal(false);
            setTaskToEdit(null);
        } catch (error) {
            toast.error("Failed to update task");
        }
    };

    const handleTaskDelete = async () => {
        if (!taskToDelete) return;
        try {
            await deleteTask(taskToDelete.id);
            toast.success("Task deleted");
            setTaskToDelete(null);
            setShowDeleteTaskModal(false);
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    const handleStatusChange = async (taskId: number, status: string) => {
        try {
            await updateTask(taskId, { status });
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleGenerateTasks = async () => {
        try {
            await generateTasks();
            toast.success("Tasks generated successfully!");
        } catch (error) {
            // Error handled in hook
        }
    }

    const todoTasks = tasks.filter(t => t.status === "todo");
    const inProgressTasks = tasks.filter(t => t.status === "in_progress");
    const doneTasks = tasks.filter(t => t.status === "done");

    if (isLoadingProject || (isTasksLoading && tasks.length === 0)) {
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
                            onClick={handleGenerateTasks}
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
                        onClick={() => setShowEditModal(true)}
                        className="p-3 rounded-2xl font-bold text-sm border border-foreground/10 text-foreground hover:bg-foreground/5 hover:scale-105 active:scale-95 transition-all"
                        title="Edit Project"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="p-3 rounded-2xl font-bold text-sm border border-red-500/20 text-red-500 hover:bg-red-500/10 hover:scale-105 active:scale-95 transition-all"
                        title="Delete Project"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Edit Project Modal */}
            <EditProjectModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleUpdate}
                project={project}
            />

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
                                    onStatusChange={handleStatusChange}
                                    onEdit={(t) => {
                                        setTaskToEdit(t);
                                        setShowEditTaskModal(true);
                                    }}
                                    onDelete={(t) => {
                                        setTaskToDelete(t);
                                        setShowDeleteTaskModal(true);
                                    }}
                                    onView={(t) => {
                                        setSelectedTask(t);
                                        setShowDetailModal(true);
                                    }}
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
                                    onStatusChange={handleStatusChange}
                                    onEdit={(t) => {
                                        setTaskToEdit(t);
                                        setShowEditTaskModal(true);
                                    }}
                                    onDelete={(t) => {
                                        setTaskToDelete(t);
                                        setShowDeleteTaskModal(true);
                                    }}
                                    onView={(t) => {
                                        setSelectedTask(t);
                                        setShowDetailModal(true);
                                    }}
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
                                    onStatusChange={handleStatusChange}
                                    onEdit={(t) => {
                                        setTaskToEdit(t);
                                        setShowEditTaskModal(true);
                                    }}
                                    onDelete={(t) => {
                                        setTaskToDelete(t);
                                        setShowDeleteTaskModal(true);
                                    }}
                                    onView={(t) => {
                                        setSelectedTask(t);
                                        setShowDetailModal(true);
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Delete Project Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Project"
                description="Are you sure you want to delete this project?"
                itemName={project.title}
            />

            {/* Delete Task Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteTaskModal}
                onClose={() => setShowDeleteTaskModal(false)}
                onConfirm={handleTaskDelete}
                title="Delete Task"
                description="Are you sure you want to delete this task?"
                itemName={taskToDelete?.title}
            />

            {/* Edit Task Modal */}
            {taskToEdit && (
                <EditTaskModal
                    isOpen={showEditTaskModal}
                    onClose={() => setShowEditTaskModal(false)}
                    onSave={handleTaskUpdate}
                    task={taskToEdit}
                />
            )}

            {/* Task Detail Modal */}
            {selectedTask && (
                <TaskDetailModal
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    task={selectedTask}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
}

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface Project {
    id: number;
    owner_id: number;
    title: string;
    description: string;
    stack: string;
    type: string;
    created_at: string;
}

export interface Task {
    id: number;
    project_id: number;
    title: string;
    description: string;
    status: string;
    order: number;
}

export interface Stats {
    projects_count: number;
    total_tasks: number;
    tasks_done: number;
    tasks_in_progress: number;
    tasks_todo: number;
}

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/projects/');
            setProjects(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
            setError('Failed to load projects');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const generateProject = useCallback(async () => {
        try {
            setIsGenerating(true);
            const response = await api.post('/projects/generate');
            // New response format: { project: {...}, tasks: [...] }
            const newProject = response.data.project || response.data;
            setProjects(prev => [newProject, ...prev]);
            return { project: newProject, tasks: response.data.tasks || [] };
        } catch (err) {
            console.error('Failed to generate project:', err);
            throw err;
        } finally {
            setIsGenerating(false);
        }
    }, []);


    const deleteProject = useCallback(async (projectId: number) => {
        try {
            await api.delete(`/projects/${projectId}`);
            setProjects(prev => prev.filter(p => p.id !== projectId));
        } catch (err) {
            console.error('Failed to delete project:', err);
            throw err;
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return {
        projects,
        isLoading,
        isGenerating,
        error,
        generateProject,
        deleteProject,
        refetch: fetchProjects,
    };
}

export function useTasks(projectId: number | null) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTasks = useCallback(async () => {
        if (!projectId) return;

        try {
            setIsLoading(true);
            const response = await api.get(`/tasks/${projectId}`);
            setTasks(response.data);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    const generateTasks = useCallback(async () => {
        if (!projectId) return;

        try {
            const response = await api.post(`/tasks/${projectId}/generate`);
            setTasks(response.data);
            return response.data;
        } catch (err) {
            console.error('Failed to generate tasks:', err);
            throw err;
        }
    }, [projectId]);

    const updateTaskStatus = useCallback(async (taskId: number, status: string) => {
        try {
            const response = await api.patch(`/tasks/${taskId}`, { status });
            setTasks(prev => prev.map(t => t.id === taskId ? response.data : t));
            return response.data;
        } catch (err) {
            console.error('Failed to update task:', err);
            throw err;
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return {
        tasks,
        isLoading,
        generateTasks,
        updateTaskStatus,
        refetch: fetchTasks
    };
}

export function useStats() {
    const [stats, setStats] = useState<Stats>({
        projects_count: 0,
        total_tasks: 0,
        tasks_done: 0,
        tasks_in_progress: 0,
        tasks_todo: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/profile/me');
            if (response.data.stats) {
                setStats(response.data.stats);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, isLoading, refetch: fetchStats };
}

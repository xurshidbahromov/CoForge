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
            setProjects(prev => [response.data, ...prev]);
            return response.data;
        } catch (err) {
            console.error('Failed to generate project:', err);
            throw err;
        } finally {
            setIsGenerating(false);
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
        refetch: fetchProjects,
    };
}

export function useTasks(projectId: number | null) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!projectId) return;

        const fetchTasks = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/tasks/${projectId}`);
                setTasks(response.data);
            } catch (err) {
                console.error('Failed to fetch tasks:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [projectId]);

    return { tasks, isLoading };
}

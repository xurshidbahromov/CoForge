import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OnboardingData {
    first_name: string;
    last_name: string;
    country: string;
    city: string;
    timezone: string;
    language: string;
    primary_role: string;
    level: string;
    bio: string;
    skills: Record<string, string>;
    work_experience: string;
    social_links: Record<string, string>;
    primary_goal: string;
    weekly_availability: string;
    work_preference: {
        mode: 'solo' | 'team' | 'both';
    };
    ai_preference: Record<string, any>;
}

interface OnboardingState {
    step: number;
    totalSteps: number;
    data: OnboardingData;
    setStep: (step: number) => void;
    updateData: (data: Partial<OnboardingData>) => void;
    reset: () => void;
}

const initialData: OnboardingData = {
    first_name: '',
    last_name: '',
    country: '',
    city: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: 'en',
    primary_role: '',
    level: 'junior',
    bio: '',
    skills: {},
    work_experience: '',
    social_links: {},
    primary_goal: 'career_growth',
    weekly_availability: '10-20h',
    work_preference: {
        mode: 'both',
    },
    ai_preference: {},
};

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            step: 1,
            totalSteps: 5,
            data: initialData,
            setStep: (step) => set({ step }),
            updateData: (updates) =>
                set((state) => ({
                    data: { ...state.data, ...updates },
                })),
            reset: () => set({ step: 1, data: initialData }),
        }),
        {
            name: 'onboarding-storage',
        }
    )
);

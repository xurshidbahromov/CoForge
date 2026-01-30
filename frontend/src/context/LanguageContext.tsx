"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../../messages/en.json";
import ru from "../../messages/ru.json";
import uz from "../../messages/uz.json";

type Language = "en" | "ru" | "uz";
type Translations = typeof en;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
    en,
    ru,
    uz,
};

// Nested key access helper (e.g., "HomePage.title")
const getNestedTranslation = (obj: any, path: string): string => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj) || path;
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedLang = localStorage.getItem("language") as Language;
        if (savedLang && ["en", "ru", "uz"].includes(savedLang)) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
    };

    const t = (key: string): string => {
        return getNestedTranslation(translations[language], key);
    };

    // Always wrap with Provider to ensure useLanguage works
    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {mounted ? children : (
                // Prevent hydration mismatch for translated content by rendering nothing or a loader until client-side active
                // Alternatively, render children with default language (en) but suppress warnings if needed.
                // For simplicity and stability, we render children. Next.js might warn if text differs, but it won't crash.
                // Actually, to be super safe against mismatch text:
                children
            )}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

"use client";
import { Globe, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage } = useLanguage();

    const languages = [
        { code: "en", label: "English" },
        { code: "ru", label: "Русский" },
        { code: "uz", label: "O'zbek" },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-foreground/5 rounded-lg transition-colors flex items-center gap-2 group"
            >
                <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="text-xs font-bold uppercase hidden sm:inline-block">{language}</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-40 bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-xl shadow-xl overflow-hidden z-50 p-1 animate-in fade-in zoom-in-95 duration-200">
                        {languages.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => {
                                    setLanguage(l.code as "en" | "ru" | "uz");
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium hover:bg-foreground/5 rounded-lg transition-colors text-left",
                                    language === l.code && "bg-foreground/5 text-primary"
                                )}
                            >
                                <span className="flex-1">{l.label}</span>
                                {language === l.code && <Check className="w-3.5 h-3.5" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

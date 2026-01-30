'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'uz', name: 'O\'zbek', flag: '🇺🇿' }
];

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [currentLocale, setCurrentLocale] = useState('en');

    useEffect(() => {
        // Extract locale from pathname
        const locale = pathname.split('/')[1];
        if (['en', 'ru', 'uz'].includes(locale)) {
            setCurrentLocale(locale);
        }
    }, [pathname]);

    const switchLanguage = (locale: string) => {
        // Remove current locale from path and add new one
        const segments = pathname.split('/').filter(Boolean);
        const newPath = segments[0] && ['en', 'ru', 'uz'].includes(segments[0])
            ? `/${locale}/${segments.slice(1).join('/')}`
            : `/${locale}${pathname}`;

        router.push(newPath);
        setIsOpen(false);
    };

    const currentLang = languages.find(lang => lang.code === currentLocale) || languages[0];

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/50 border border-foreground/10 hover:border-foreground/20 transition-all duration-200"
            >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="text-sm font-medium hidden sm:inline">{currentLang.code.toUpperCase()}</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 glass-panel rounded-xl border border-foreground/10 overflow-hidden z-50"
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => switchLanguage(lang.code)}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-foreground/5 transition-colors ${currentLocale === lang.code ? 'bg-primary/10' : ''
                                    }`}
                            >
                                <span className="text-xl">{lang.flag}</span>
                                <div className="flex-1 text-left">
                                    <div className="text-sm font-medium">{lang.name}</div>
                                    <div className="text-xs opacity-50">{lang.code.toUpperCase()}</div>
                                </div>
                                {currentLocale === lang.code && (
                                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

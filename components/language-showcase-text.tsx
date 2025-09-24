"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const welcomeMessages = [
    { text: "Welcome", lang: "English" },
    { text: "स्वागत है", lang: "Hindi" },
    { text: "स्वागत आहे", lang: "Marathi" },
    { text: "Bienvenue", lang: "French" },
    { text: "Bienvenido", lang: "Spanish" },
    { text: "Benvenuto", lang: "Italian" },
    { text: "Willkommen", lang: "German" },
    { text: "いらっしゃいませ", lang: "Japanese" },
];

export default function LanguageShowcaseText() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        if (!isAnimating) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                return (prevIndex + 1) % welcomeMessages.length;
            });
        }, 2000); // Slower transition for better readability

        return () => clearInterval(interval);
    }, [isAnimating]);

    // Animation variants optimized for the drawer
    const textVariants = {
        hidden: { 
            y: 30, 
            opacity: 0,
            scale: 0.95
        },
        visible: { 
            y: 0, 
            opacity: 1,
            scale: 1
        },
        exit: { 
            y: -30, 
            opacity: 0,
            scale: 0.95
        },
    };

    return (
        <div className="relative flex items-center justify-center min-h-[40px] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    className="text-center"
                    initial={textVariants.hidden}
                    animate={textVariants.visible}
                    exit={textVariants.exit}
                    transition={{ 
                        duration: 0.4, 
                        ease: [0.25, 0.46, 0.45, 0.94] // Apple-style easing
                    }}
                >
                    <div className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight mb-0.5">
                        {welcomeMessages[currentIndex].text}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {welcomeMessages[currentIndex].lang}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
"use client";

import { useState, useEffect } from 'react';
import TypewriterTitle from './type-writer';
import { useBatchTranslation } from '@/hooks/use-batch-translation';

interface TypewriterSequence {
    text: string;
    deleteAfter?: boolean;
    pauseAfter?: number;
}

interface TranslatedTypewriterTitleProps {
    sequences: TypewriterSequence[];
    typingSpeed?: number;
    startDelay?: number;
    autoLoop?: boolean;
    loopDelay?: number;
    context?: string;
}

export default function TranslatedTypewriterTitle({
    sequences,
    typingSpeed = 50,
    startDelay = 500,
    autoLoop = true,
    loopDelay = 2000,
    context = 'default'
}: TranslatedTypewriterTitleProps) {
    const { requestTranslation } = useBatchTranslation();
    const [translatedSequences, setTranslatedSequences] = useState<TypewriterSequence[]>(sequences);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const translateSequences = async () => {
            setIsLoading(true);
            const promises = sequences.map(seq => 
                requestTranslation(seq.text, context)
            );
            
            const translatedTexts = await Promise.all(promises);
            
            const newSequences = sequences.map((seq, index) => ({
                ...seq,
                text: translatedTexts[index]
            }));
            
            setTranslatedSequences(newSequences);
            setIsLoading(false);
        };

        translateSequences();
    }, [sequences, context, requestTranslation]);

    if (isLoading) {
        // Show the first sequence while loading
        return (
            <TypewriterTitle
                sequences={[{ text: sequences[0].text, deleteAfter: false }]}
                typingSpeed={typingSpeed}
                startDelay={0}
                autoLoop={false}
            />
        );
    }

    return (
        <TypewriterTitle
            sequences={translatedSequences}
            typingSpeed={typingSpeed}
            startDelay={startDelay}
            autoLoop={autoLoop}
            loopDelay={loopDelay}
        />
    );
}

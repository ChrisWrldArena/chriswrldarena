/* eslint-disable @typescript-eslint/no-explicit-any */
// Word Count to Time Conversion Utilities

import { ReadingOptions, TimeEstimate, SpeakingOptions } from "./interface";

// Standard reading speeds (words per minute)
export const READING_SPEEDS = {
    SLOW: 150,           // Slow reader
    AVERAGE: 200,        // Average adult reading speed
    FAST: 250,           // Fast reader
    SPEED_READING: 400,  // Speed reading
    SKIMMING: 600        // Skimming/scanning
} as const;

// Standard speaking speeds (words per minute)
export const SPEAKING_SPEEDS = {
    SLOW: 120,           // Slow/deliberate speech
    CONVERSATIONAL: 150, // Normal conversation
    PRESENTATION: 180,   // Presentation/public speaking
    FAST: 200,           // Fast speech
    AUCTIONEER: 250      // Very fast speech
} as const;

/**
 * Calculate reading time from word count
 */
export function calculateReadingTime(
    wordCount: number,
    options: ReadingOptions = {}
): TimeEstimate {
    const {
        wordsPerMinute = READING_SPEEDS.AVERAGE,
        includeSeconds = true,
        roundUp = false
    } = options;

    const totalMinutes = wordCount / wordsPerMinute;
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);
    const totalSeconds = Math.round(totalMinutes * 60);

    let finalMinutes = minutes;
    let finalSeconds = seconds;

    if (roundUp && seconds > 0) {
        finalMinutes = minutes + 1;
        finalSeconds = 0;
    }

    const formattedTime = formatTime(finalMinutes, finalSeconds, includeSeconds);

    return {
        minutes: finalMinutes,
        seconds: finalSeconds,
        totalSeconds,
        formattedTime
    };
}

/**
 * Calculate speaking time from word count
 */
export function calculateSpeakingTime(
    wordCount: number,
    options: SpeakingOptions = {}
): TimeEstimate {
    const {
        wordsPerMinute = SPEAKING_SPEEDS.CONVERSATIONAL,
        includeSeconds = true,
        roundUp = false
    } = options;

    const totalMinutes = wordCount / wordsPerMinute;
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);
    const totalSeconds = Math.round(totalMinutes * 60);

    let finalMinutes = minutes;
    let finalSeconds = seconds;

    if (roundUp && seconds > 0) {
        finalMinutes = minutes + 1;
        finalSeconds = 0;
    }

    const formattedTime = formatTime(finalMinutes, finalSeconds, includeSeconds);

    return {
        minutes: finalMinutes,
        seconds: finalSeconds,
        totalSeconds,
        formattedTime
    };
}

/**
 * Get word count from text
 */
export function getWordCount(text: string): number {
    return text
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0)
        .length;
}

/**
 * Calculate both reading and speaking time
 */
export function calculagreenlTimes(
    wordCount: number,
    readingWPM: number = READING_SPEEDS.AVERAGE,
    speakingWPM: number = SPEAKING_SPEEDS.CONVERSATIONAL
) {
    return {
        reading: calculateReadingTime(wordCount, { wordsPerMinute: readingWPM }),
        speaking: calculateSpeakingTime(wordCount, { wordsPerMinute: speakingWPM }),
        wordCount
    };
}

/**
 * Format time as human-readable string
 */
function formatTime(minutes: number, seconds: number, includeSeconds: boolean = true): string {
    if (minutes === 0 && seconds === 0) {
        return "Less than 1 minute";
    }

    if (minutes === 0) {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }

    if (!includeSeconds || seconds === 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
}

/**
 * Convert time back to estimated word count
 */
export function timeToWordCount(
    minutes: number,
    seconds: number = 0,
    wordsPerMinute: number = READING_SPEEDS.AVERAGE
): number {
    const totalMinutes = minutes + (seconds / 60);
    return Math.round(totalMinutes * wordsPerMinute);
}

/**
 * Get time estimate with multiple reading speeds
 */
export function getReadingTimeRange(wordCount: number) {
    return {
        slow: calculateReadingTime(wordCount, { wordsPerMinute: READING_SPEEDS.SLOW }),
        average: calculateReadingTime(wordCount, { wordsPerMinute: READING_SPEEDS.AVERAGE }),
        fast: calculateReadingTime(wordCount, { wordsPerMinute: READING_SPEEDS.FAST }),
        wordCount
    };
}

// React Hook for live calculation
export function wordTimeCalculator(text: string, readingSpeed: number = READING_SPEEDS.AVERAGE) {
    const wordCount = getWordCount(text);
    const readingTime = calculateReadingTime(wordCount, { wordsPerMinute: readingSpeed });
    const speakingTime = calculateSpeakingTime(wordCount);

    return {
        wordCount,
        readingTime,
        speakingTime,
        updateSpeed: (newSpeed: number) => calculateReadingTime(wordCount, { wordsPerMinute: newSpeed })
    };
}

export function getEditorWordCount(data: any) {
    //console.log(data)
    if (!data || !Array.isArray(data.blocks)) return {};

    let wordCount = 0
    let alltext = ""

    data.blocks.forEach((block: any) => {
        if (block.data && typeof block.data.text === 'string') {
            // Remove HTML tags and count words
            const text = block.data.text.replace(/<[^>]+>/g, '');
            wordCount += block.data.text.split(" ").length;
            alltext += block.data.text
        }
    });
    console.log(wordCount)

    return { text: alltext, wordCount };
}

export function renderEditorContent(data: any): string {
    return data.blocks.map((block: any) => {
        switch (block.type) {
            case 'paragraph':
                return `<p class="mb-4 text-lg leading-relaxed text-gray-800">${block.data.text}</p>`;
            case 'header':
                return `<h${block.data.level} class="mt-8 mb-4 font-bold text-gray-900 ${block.data.level === 1
                        ? 'text-3xl'
                        : block.data.level === 2
                            ? 'text-2xl'
                            : block.data.level === 3
                                ? 'text-xl'
                                : 'text-lg'
                    }">${block.data.text}</h${block.data.level}>`;
            case 'list':
                const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
                const items = block.data.items
                    .map(
                        (item: any) =>
                            `<li class="mb-2 pl-4 relative before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full">${item
                            }</li>`
                    )
                    .join('');
                return `<${tag} class="mb-4 ml-6 list-inside ${tag === 'ol' ? 'list-decimal' : 'list-disc'
                    }">${items}</${tag}>`;
            case 'quote':
                return `<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-6"><p>${block.data.text}</p>${block.data.caption
                        ? `<cite class="block mt-2 text-sm text-gray-400">— ${block.data.caption}</cite>`
                        : ''
                    }</blockquote>`;
            case 'image':
                return `<div class="my-6 flex justify-center"><img src="${block.data.file?.url || ''}" alt="${block.data.caption || ''
                    }" class="rounded-lg shadow-md max-h-96 object-contain"/><div class="text-center text-sm text-gray-500 mt-2">${block.data.caption || ''
                    }</div></div>`;
            default:
                return '';
        }
    }).join('');
}

export function formatNumberShort(value: number): string {
    if (value >= 1_000_000_000_000) {
        return (value / 1_000_000_000_000).toFixed(2).replace(/\.00$/, '') + 'T';
    } else if (value >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + 'B';
    } else if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
    } else if (value >= 1_000) {
        return (value / 1_000).toFixed(2).replace(/\.00$/, '') + 'k';
    }
    return value.toString();
}



export const getDateRange = (): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const formatDate = (date: Date): string =>
        date.toISOString().split('T')[0];

    const start_date = formatDate(yesterday);
    const end_date = formatDate(today);

    return `start_date=${start_date}&end_date=${end_date}`;
};

export const getTitleName = (id: number, titles: any[]) => {
    const title = titles.find(title => title.id === id.toString());
    return title.defaulttitle;
}
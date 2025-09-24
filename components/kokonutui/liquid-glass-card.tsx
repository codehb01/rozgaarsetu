"use client";

/**
 * @author: @dorian_baffier
 * @description: Liquid Glass Card
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { ArrowRight, ArrowLeft, Play, Pause } from "lucide-react";

const liquidbuttonVariants = cva(
    "inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default:
                    "bg-transparent hover:scale-105 duration-300 transition text-primary",
                destructive:
                    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 text-xs gap-1.5 px-4 has-[>svg]:px-4",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                xl: "h-12 rounded-md px-8 has-[>svg]:px-6",
                xxl: "h-14 rounded-md px-10 has-[>svg]:px-8",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "xxl",
        },
    }
);

interface LiquidButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof liquidbuttonVariants> {
    asChild?: boolean;
}

function ButtonGlassFilter() {
    const filterId = React.useId();
    return (
        <svg className="hidden">
            <title>Glass Effect Filter</title>
            <defs>
                <filter
                    id={filterId}
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    colorInterpolationFilters="sRGB"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.05 0.05"
                        numOctaves="1"
                        seed="1"
                        result="turbulence"
                    />
                    <feGaussianBlur
                        in="turbulence"
                        stdDeviation="2"
                        result="blurredNoise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="blurredNoise"
                        scale="70"
                        xChannelSelector="R"
                        yChannelSelector="B"
                        result="displaced"
                    />
                    <feGaussianBlur
                        in="displaced"
                        stdDeviation="4"
                        result="finalBlur"
                    />
                    <feComposite
                        in="finalBlur"
                        in2="finalBlur"
                        operator="over"
                    />
                </filter>
            </defs>
        </svg>
    );
}

const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
    (
        { className, variant, size, asChild = false, children, ...props },
        ref
    ) => {
        const Comp = asChild ? Slot : "button";
        const filterId = React.useId();

        return (
            <>
                <Comp
                    data-slot="button"
                    className={cn(
                        "relative",
                        liquidbuttonVariants({ variant, size, className })
                    )}
                    ref={ref}
                    {...props}
                >
                    <div
                        className="absolute top-0 left-0 z-0 h-full w-full rounded-full 
              shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
          transition-all 
          dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]"
                    />
                    <div
                        className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md"
                        style={{ backdropFilter: `url("#${filterId}")` }}
                    />

                    <div className="pointer-events-none z-10">{children}</div>
                    <ButtonGlassFilter />
                </Comp>
            </>
        );
    }
);

LiquidButton.displayName = "LiquidButton";

const cardVariants = cva(
    "relative overflow-hidden rounded-lg transition-all duration-300 group bg-background/20",
    {
        variants: {
            variant: {
                default:
                    "hover:scale-[1.01] text-foreground backdrop-blur-[2px]",
                primary:
                    "bg-primary/5 hover:bg-primary/5 text-foreground backdrop-blur-[2px]",
                destructive:
                    "bg-destructive/5 hover:bg-destructive/10 text-foreground backdrop-blur-[2px]",
                secondary:
                    "bg-secondary/5 hover:bg-secondary/10 text-foreground backdrop-blur-[2px]",
            },
            size: {
                default: "p-6",
                sm: "p-4",
                lg: "p-8",
                xl: "p-10",
            },
            hover: {
                default: "hover:scale-[1.02]",
                none: "",
                glow: "hover:shadow-lg hover:shadow-primary/20",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            hover: "default",
        },
    }
);

export interface LiquidGlassCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof cardVariants> {
    asChild?: boolean;
    glassEffect?: boolean;
}

function GlassFilter() {
    const filterId = React.useId();

    return (
        <svg className="hidden">
            <title>Glass Effect Filter</title>
            <defs>
                <filter
                    id={filterId}
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                    colorInterpolationFilters="sRGB"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.05 0.05"
                        numOctaves="1"
                        seed="1"
                        result="turbulence"
                    />
                    <feGaussianBlur
                        in="turbulence"
                        stdDeviation="2"
                        result="blurredNoise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="blurredNoise"
                        scale="30"
                        xChannelSelector="R"
                        yChannelSelector="B"
                        result="displaced"
                    />
                    <feGaussianBlur
                        in="displaced"
                        stdDeviation="4"
                        result="finalBlur"
                    />
                    <feComposite
                        in="finalBlur"
                        in2="finalBlur"
                        operator="over"
                    />
                </filter>
            </defs>
        </svg>
    );
}

// Card Header Component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
}

function CardHeader({
    title,
    subtitle,
    icon,
    className,
    ...props
}: CardHeaderProps) {
    return (
        <div
            className={cn("flex items-start justify-between gap-4", className)}
            {...props}
        >
            <div className="space-y-1.5">
                <h3 className="font-semibold leading-none tracking-tight text-foreground">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-sm text-muted-foreground/80">
                        {subtitle}
                    </p>
                )}
            </div>
            {icon && <div className="text-muted-foreground/70">{icon}</div>}
        </div>
    );
}

// Card Content Component
function CardContent({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("pt-6 text-foreground", className)} {...props} />;
}

const LiquidGlassCard = React.forwardRef<HTMLDivElement, LiquidGlassCardProps>(
    (
        {
            className,
            variant,
            size,
            hover,
            asChild = false,
            glassEffect = true,
            children,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : "div";
        const filterId = React.useId();

        return (
            <>
                <Comp
                    ref={ref}
                    className={cn(
                        "relative",
                        cardVariants({ variant, size, hover, className })
                    )}
                    {...props}
                >
                    {/* Glass effect overlay */}
                    <div
                        className="absolute inset-0 z-0 h-full w-full rounded-lg 
          shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
          transition-all 
          pointer-events-none
          dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]"
                    />

                    {/* Glass filter effect */}
                    {glassEffect && (
                        <div
                            className="absolute inset-0 -z-10 h-full w-full overflow-hidden rounded-lg"
                            style={{ backdropFilter: `url("#${filterId}")` }}
                        />
                    )}

                    {/* Content */}
                    <div className="relative z-10">{children}</div>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 z-20 rounded-lg bg-gradient-to-r from-transparent dark:via-white/5 via-black/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none" />

                    {glassEffect && <GlassFilter />}
                </Comp>
            </>
        );
    }
);

LiquidGlassCard.displayName = "LiquidGlassCard";

// Remove the hello text and fix the time display
export function NotificationCenter() {
    // Track current time and playing state
    const [isPlaying, setIsPlaying] = React.useState(true);
    const [currentTime, setCurrentTime] = React.useState(45);
    const totalDuration = React.useMemo(() => 225, []); // 3:45 in seconds

    // Format time in MM:SS
    const formatTime = React.useCallback((timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, []);

    // Calculate progress percentage
    const progress = (currentTime / totalDuration) * 100;

    // Update progress when playing
    React.useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isPlaying && currentTime < totalDuration) {
            intervalId = setInterval(() => {
                setCurrentTime((prev) => {
                    if (prev >= totalDuration) {
                        clearInterval(intervalId);
                        setIsPlaying(false);
                        return totalDuration;
                    }
                    return prev + 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isPlaying, currentTime, totalDuration]);

    // Handle play/pause
    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    // Handle seek
    const handleSeek = (
        e:
            | React.MouseEvent<HTMLButtonElement>
            | React.KeyboardEvent<HTMLButtonElement>
    ) => {
        const bar = e.currentTarget.parentElement;
        if (!bar) return;

        const rect = bar.getBoundingClientRect();
        let percent: number;

        if ("clientX" in e) {
            // Mouse event
            const x = e.clientX - rect.left;
            percent = x / rect.width;
        } else {
            // Keyboard event
            switch (e.key) {
                case "ArrowLeft":
                    percent = (currentTime - 5) / totalDuration;
                    break;
                case "ArrowRight":
                    percent = (currentTime + 5) / totalDuration;
                    break;
                default:
                    return;
            }
        }

        const newTime = percent * totalDuration;
        setCurrentTime(Math.min(Math.max(0, newTime), totalDuration));
    };

    return (
        <div className="w-full max-w-sm">
            <LiquidGlassCard
                variant="primary"
                className="relative z-30"
                hover="glow"
            >
                <div className="flex items-start gap-4">
                    {/* Profile Image */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                        <img
                            src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/portrait2-x5MjJSaQ9ed0HZrewEhH7TkZwjZ66K.jpeg"
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10" />
                    </div>

                    <div className="flex-1">
                        <CardHeader
                            title="Now Playing"
                            subtitle="Lofi Beats - Chill Mix"
                        />
                    </div>
                </div>

                <CardContent>
                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div
                            className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/50 dark:bg-zinc-800/50"
                            role="presentation"
                        >
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-zinc-300/20 via-zinc-300/30 to-zinc-300/20 dark:from-white/5 dark:via-white/10 dark:to-white/5" />

                            {/* Progress indicator */}
                            <div
                                className="absolute inset-y-0 left-0 flex bg-gradient-to-r from-black/50 via-black/50 to-black/50 dark:from-white/80 dark:via-white/80 dark:to-white/80 transition-all duration-200 ease-out"
                                style={{
                                    width: `${progress}%`,
                                }}
                            >
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/5" />
                            </div>

                            {/* Interactive seek button (invisible but functional) */}
                            <button
                                type="button"
                                className="absolute inset-0 h-full w-full cursor-pointer"
                                onClick={handleSeek}
                                onKeyDown={handleSeek}
                                aria-label={`Seek to ${formatTime(currentTime)} of ${formatTime(totalDuration)}`}
                                aria-valuemin={0}
                                aria-valuemax={totalDuration}
                                aria-valuenow={currentTime}
                                role="slider"
                            />
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                            <span className="tabular-nums text-zinc-600 dark:text-zinc-400">
                                {formatTime(currentTime)}
                            </span>
                            <span className="tabular-nums text-zinc-600 dark:text-zinc-400">
                                {formatTime(totalDuration)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-6">
                        <LiquidButton
                            variant="default"
                            size="icon"
                            className="rounded-full text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                            aria-label="Previous track"
                        >
                            <ArrowLeft className="size-5" />
                        </LiquidButton>
                        <LiquidButton
                            variant="default"
                            size="icon"
                            className="rounded-full text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                            aria-label={isPlaying ? "Pause" : "Play"}
                            onClick={handlePlayPause}
                        >
                            {isPlaying ? (
                                <Pause className="size-5" />
                            ) : (
                                <Play className="size-5" />
                            )}
                        </LiquidButton>
                        <LiquidButton
                            variant="default"
                            size="icon"
                            className="rounded-full text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                            aria-label="Next track"
                        >
                            <ArrowRight className="size-5" />
                        </LiquidButton>
                    </div>
                </CardContent>
            </LiquidGlassCard>
        </div>
    );
}

export default NotificationCenter;

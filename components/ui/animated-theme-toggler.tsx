"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { setTheme } = useTheme()
  const [isDark, setIsDark] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current || isAnimating) return

    setIsAnimating(true)

    // Add smooth fade-out effect to entire page
    document.documentElement.style.transition = 'opacity 0.25s ease-in-out'
    document.documentElement.style.opacity = '0.5'

    // Wait for fade-out
    await new Promise(resolve => setTimeout(resolve, 100))

    // Toggle theme
    setTheme(isDark ? "light" : "dark")

    // Wait a bit for theme to apply
    await new Promise(resolve => setTimeout(resolve, 50))

    // Fade back in
    document.documentElement.style.opacity = '1'

    // Clean up and reset after animation completes
    setTimeout(() => {
      document.documentElement.style.transition = ''
      document.documentElement.style.opacity = ''
      setIsAnimating(false)
    }, 200)
  }, [isDark, setTheme, isAnimating])

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(className)}
      {...props}
    >
      {isDark ? <Sun /> : <Moon />}
    </button>
  )
}

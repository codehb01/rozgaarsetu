// import * as React from "react"

// import { cn } from "@/lib/utils"

// function Input({ className, type, ...props }: React.ComponentProps<"input">) {
//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={cn(
//         "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//         "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
//         "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// export { Input }


import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export default function Input({ label, hint, id, className = "", disabled, ...rest }: Props) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <label className={`flex w-full flex-col gap-1.5 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {label && <span className="text-[13px] font-medium text-[var(--apple-text-secondary)] tracking-wide">{label}</span>}
      <div className="relative group">
        <input
          id={inputId}
          disabled={disabled}
          className={`peer w-full h-11 rounded-2xl px-4 text-[13px] font-medium bg-[var(--apple-bg-alt)]/60 border border-[var(--apple-border)] placeholder:text-[var(--apple-text-secondary)] text-[var(--apple-text)] outline-none transition-base focus:border-[var(--apple-accent)] focus:ring-2 focus:ring-[var(--apple-accent)]/30 focus:bg-[var(--apple-bg)] hover:border-[var(--apple-border-strong)] ${className}`}
          {...rest}
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 peer-focus:ring-0" />
      </div>
      {hint && <span className="text-[11px] text-[var(--apple-text-secondary)]">{hint}</span>}
    </label>
  );
}

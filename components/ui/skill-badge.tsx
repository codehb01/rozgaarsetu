import React from 'react';

type Props = {
  skill: string;
  className?: string;
};

const COLOR_MAP: Record<string, string> = {
  // Match exactly the visible skill pills with subtle, readable tints
  'plumbing': 'bg-amber-50 text-amber-700 border border-amber-100',
  'electrical': 'bg-amber-50 text-amber-700 border border-amber-100',
  'carpentry': 'bg-orange-50 text-orange-700 border border-orange-100',
  'painting': 'bg-pink-50 text-pink-700 border border-pink-100',
  'cleaning': 'bg-sky-50 text-sky-700 border border-sky-100',
  'gardening': 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  'ac repair': 'bg-cyan-50 text-cyan-700 border border-cyan-100',
  'appliance repair': 'bg-cyan-50 text-cyan-700 border border-cyan-100',
  'masonry': 'bg-rose-50 text-rose-700 border border-rose-100',
  'welding': 'bg-rose-50 text-rose-700 border border-rose-100',
  'roofing': 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100',
  'flooring': 'bg-amber-50 text-amber-700 border border-amber-100',
  'pest control': 'bg-lime-50 text-lime-800 border border-lime-100',
  'moving': 'bg-slate-50 text-slate-800 border border-slate-100',
  'handyman': 'bg-violet-50 text-violet-800 border border-violet-100',

  // keep some fallbacks for legacy keys
  electrician: 'bg-amber-50 text-amber-700 border border-amber-100',
  plumber: 'bg-cyan-100 text-cyan-800 border border-cyan-200',
  carpenter: 'bg-orange-50 text-orange-700 border border-orange-100',
  painter: 'bg-pink-50 text-pink-700 border border-pink-100',
  cleaner: 'bg-sky-50 text-sky-700 border border-sky-100',
  mechanic: 'bg-green-50 text-green-700 border border-green-100',
  gardener: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  driver: 'bg-violet-50 text-violet-700 border border-violet-100',
  'ac technician': 'bg-cyan-50 text-cyan-700 border border-cyan-100',
};

export default function SkillBadge({ skill, className = '' }: Props) {
  const key = String(skill || '').trim().toLowerCase();
  const color = COLOR_MAP[key] ?? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200';

  return (
    <div className={`inline-flex items-center rounded-md px-2 py-0.5 text-sm font-medium ${color} ${className}`}>
      {skill}
    </div>
  );
}

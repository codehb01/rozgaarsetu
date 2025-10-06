import React from 'react'
import { ArrowRight } from 'lucide-react'

export default function StickyFooterContent() {
  return (
    <div className='bg-slate-900 py-8 px-12 h-full w-full flex flex-col justify-end text-white'>
        <Nav />
        <Section2 />
    </div>
  )
}

const Section2 = () => {
    return (
        <div className='flex justify-between items-end'>
            <h1 className='text-[8vw] md:text-[14vw] leading-[0.8] mt-10 font-bold'>RozgaarSetu</h1>
            <p className='text-slate-400'>©2024 RozgaarSetu. All rights reserved.</p>
        </div>
    )
}

const Nav = () => {
    return (
        <div className='flex flex-wrap gap-12 md:gap-20 mb-8'>
            <div className='flex flex-col gap-2'>
                <h3 className='mb-2 uppercase text-slate-400 font-semibold'>Platform</h3>
                <MenuAnimationItem text="Find Workers" />
                <MenuAnimationItem text="Post Jobs" />
                <MenuAnimationItem text="Pricing" />
                <MenuAnimationItem text="How it Works" />
            </div>
            <div className='flex flex-col gap-2'>
                <h3 className='mb-2 uppercase text-slate-400 font-semibold'>Workers</h3>
                <MenuAnimationItem text="Browse Jobs" />
                <MenuAnimationItem text="Worker Home" />
                <MenuAnimationItem text="Earnings" />
                <MenuAnimationItem text="Reviews" />
            </div>
            <div className='flex flex-col gap-2'>
                <h3 className='mb-2 uppercase text-slate-400 font-semibold'>Customers</h3>
                <MenuAnimationItem text="Customer Home" />
                <MenuAnimationItem text="Bookings" />
                <MenuAnimationItem text="Search Workers" />
                <MenuAnimationItem text="Profile" />
            </div>
            <div className='flex flex-col gap-2'>
                <h3 className='mb-2 uppercase text-slate-400 font-semibold'>Support</h3>
                <MenuAnimationItem text="Help Center" />
                <MenuAnimationItem text="Contact Us" />
                <MenuAnimationItem text="Safety" />
                <MenuAnimationItem text="Terms of Service" />
            </div>
        </div>
    )
}

const MenuAnimationItem = ({ text }: { text: string }) => {
    return (
        <div className="group flex items-center gap-2 overflow-hidden">
            <ArrowRight className="size-4 -translate-x-full text-white opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:text-blue-400 group-hover:opacity-100" />
            <p className="z-10 -translate-x-6 cursor-pointer text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:text-blue-400">
                {text}
            </p>
        </div>
    )
}
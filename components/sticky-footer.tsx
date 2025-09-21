import React from 'react'
import StickyFooterContent from './sticky-footer-content';

export default function StickyFooter() {
  return (
    <div 
        className='relative h-[800px] z-10'
        style={{clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"}}
    >
        <div className='relative h-[calc(100vh+800px)] -top-[100vh]'>
            <div className='h-[800px] sticky top-[calc(100vh-800px)] z-10'>
                <StickyFooterContent />
            </div>
        </div>
    </div>
  )
}
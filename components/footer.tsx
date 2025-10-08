import React from 'react'
import StickyFooterContent from './sticky-footer-content';
import { StickyFooter } from './ui/sticky-footer';

export default function Footer() {
  return (
    <StickyFooter
      heightValue="100dvh"
      className="text-white"
    >
      <StickyFooterContent />
    </StickyFooter>
  )
}

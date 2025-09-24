"use client";

import { useState } from "react";
import { Navbar as RBNavbar, NavBody, NavItems, MobileNav, NavbarLogo, NavbarButton, MobileNavHeader, MobileNavToggle, MobileNavMenu } from "./navbar-components";

// Replacement Navbar using the Resizable Navbar component set.
export default function Navbar() {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Employer", link: "/customer" },
    { name: "Worker", link: "/worker" },
    { name: "Profile", link: "/customer/profile" }
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="relative w-full">
      <RBNavbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {/* <NavbarButton href="/auth/login" variant="secondary">Login</NavbarButton> */}
            <NavbarButton href="/auth/login" variant="primary">Get Started</NavbarButton>
          </div>
        </NavBody>
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(o=>!o)} />
          </MobileNavHeader>
          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a key={`mobile-link-${idx}`} href={item.link} onClick={() => setIsMobileMenuOpen(false)} className="relative text-neutral-600">
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} variant="primary" className="w-full">Login</NavbarButton>
              <NavbarButton href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} variant="primary" className="w-full">Get Started</NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </RBNavbar>
    </div>
  );
}

"use client";

import React from "react";

export const AuroraBackground = ({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Aurora Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="aurora-container">
          <div className="aurora-gradient aurora-gradient-1"></div>
          <div className="aurora-gradient aurora-gradient-2"></div>
          <div className="aurora-gradient aurora-gradient-3"></div>
          <div className="aurora-gradient aurora-gradient-4"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      <style jsx>{`
        .aurora-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        
        .aurora-gradient {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          mix-blend-mode: multiply;
          animation: aurora-float 20s ease-in-out infinite;
          opacity: 0.7;
        }
        
        .aurora-gradient-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          top: -200px;
          left: -200px;
          animation-delay: 0s;
        }
        
        .aurora-gradient-2 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          top: 50%;
          right: -150px;
          animation-delay: -7s;
        }
        
        .aurora-gradient-3 {
          width: 500px;
          height: 300px;
          background: linear-gradient(225deg, #8b5cf6, #7c3aed);
          bottom: -150px;
          left: 30%;
          animation-delay: -14s;
        }
        
        .aurora-gradient-4 {
          width: 250px;
          height: 250px;
          background: linear-gradient(315deg, #06b6d4, #0891b2);
          top: 20%;
          left: 20%;
          animation-delay: -3s;
        }
        
        @keyframes aurora-float {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(50px, -30px) rotate(90deg) scale(1.1);
          }
          50% {
            transform: translate(-30px, 50px) rotate(180deg) scale(0.9);
          }
          75% {
            transform: translate(-50px, -20px) rotate(270deg) scale(1.05);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .aurora-gradient {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AuroraBackground;
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

// Debug function to check if confetti is loaded
export const checkConfetti = () => {
  console.log("🔍 Checking confetti availability...");
  console.log("Confetti type:", typeof confetti);
  console.log("Confetti function:", confetti);

  if (typeof window !== "undefined") {
    console.log("Window object available");
    console.log("Document ready state:", document.readyState);
  } else {
    console.log("❌ Window object not available (SSR)");
  }
};

export function ConfettiSideCannons() {
  const handleClick = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return (
    <div className="relative">
      <Button onClick={handleClick}>Trigger Side Cannons</Button>
    </div>
  );
}

// Automatic confetti effect function
export const triggerConfettiCelebration = () => {
  console.log("🎉 Confetti celebration triggered!"); // Debug log

  const duration = 3 * 1000; // 3 seconds
  const end = Date.now() + duration;
  const colors = ["#10b981", "#059669", "#047857", "#065f46", "#ecfdf5"];

  // Initial big burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });

  const frame = () => {
    if (Date.now() > end) return;

    // Left side cannon
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });

    // Right side cannon
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });

    // Center burst
    if (Math.random() < 0.4) {
      confetti({
        particleCount: 8,
        angle: 90,
        spread: 60,
        startVelocity: 50,
        origin: { x: 0.5, y: 0.3 },
        colors: colors,
      });
    }

    requestAnimationFrame(frame);
  };

  frame();
};

// Manual trigger function for testing
export const testConfetti = () => {
  console.log("🧪 Testing confetti...");

  // Check if confetti function exists
  if (typeof confetti !== "function") {
    console.error("❌ Confetti function not available");
    return;
  }

  try {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#059669", "#047857"],
    });
    console.log("✅ Confetti test executed successfully");
  } catch (error) {
    console.error("❌ Error executing confetti:", error);
  }
};

// Simple burst confetti for immediate effect
export const simpleBurst = () => {
  console.log("💥 Simple burst confetti");

  if (typeof confetti !== "function") {
    console.error("❌ Confetti function not available for simple burst");
    return;
  }

  try {
    // Multiple quick bursts
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, i * 200);
    }
    console.log("✅ Simple burst executed");
  } catch (error) {
    console.error("❌ Error in simple burst:", error);
  }
};

// Basic confetti without canvas-confetti library (fallback)
export const basicConfettiEffect = () => {
  console.log("🎈 Basic confetti effect (no library)");

  if (typeof window === "undefined") {
    console.log("❌ Window not available (SSR)");
    return;
  }

  // Create confetti elements
  const colors = ["#10b981", "#059669", "#047857", "#065f46"];

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
    }, i * 10);
  }
};

const createConfettiPiece = (color: string) => {
  const confetti = document.createElement("div");
  confetti.style.position = "fixed";
  confetti.style.width = "10px";
  confetti.style.height = "10px";
  confetti.style.backgroundColor = color;
  confetti.style.left = Math.random() * window.innerWidth + "px";
  confetti.style.top = "-10px";
  confetti.style.zIndex = "9999";
  confetti.style.pointerEvents = "none";
  confetti.style.borderRadius = "50%";

  document.body.appendChild(confetti);

  const fallSpeed = Math.random() * 3 + 2;
  const sway = Math.random() * 2 - 1;

  const animate = () => {
    const rect = confetti.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      document.body.removeChild(confetti);
      return;
    }

    confetti.style.top = rect.top + fallSpeed + "px";
    confetti.style.left = rect.left + sway + "px";
    confetti.style.transform = `rotate(${rect.top * 2}deg)`;

    requestAnimationFrame(animate);
  };

  animate();
};

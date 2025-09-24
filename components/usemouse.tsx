"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export const useMouse = () => {
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    elementPositionX: 0,
    elementPositionY: 0,
  });
  
  const ref = useRef<HTMLDivElement>(null);

  const updateMouse = useCallback((event: MouseEvent) => {
    if (ref.current) {
      const { left, top } = ref.current.getBoundingClientRect();
      const elementPositionX = left + window.scrollX;
      const elementPositionY = top + window.scrollY;
      const elementX = event.pageX - elementPositionX;
      const elementY = event.pageY - elementPositionY;

      setMouse({
        x: event.pageX,
        y: event.pageY,
        elementX: elementX,
        elementY: elementY,
        elementPositionX: elementPositionX,
        elementPositionY: elementPositionY,
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", updateMouse);

    return () => {
      document.removeEventListener("mousemove", updateMouse);
    };
  }, [updateMouse]);

  return [mouse, ref] as const;
};
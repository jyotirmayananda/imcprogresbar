"use client";

import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useEffect } from "react";

export function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 300,
    mass: 1
  });

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  const display = useTransform(springValue, (current) => 
    `${prefix}${Math.round(current).toLocaleString()}${suffix}`
  );

  return <motion.span>{display}</motion.span>;
}

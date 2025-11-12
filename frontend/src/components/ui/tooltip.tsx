"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  delay?: number;
}

const compose = (
  a?: (e: React.SyntheticEvent) => void,
  b?: (e: React.SyntheticEvent) => void
) => {
  if (!a && !b) return undefined;
  return (e: React.SyntheticEvent) => {
    if (typeof a === "function") a(e);
    if (typeof b === "function") b(e);
  };
};

export const Tooltip = ({ content, children, delay = 120 }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);
  const id = useMemo(() => `tt-${Math.random().toString(36).slice(2, 9)}`, []);

  const show = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const childProps = {
    "aria-describedby": visible ? id : undefined,
    onMouseEnter: compose(children.props.onMouseEnter, show),
    onMouseLeave: compose(children.props.onMouseLeave, hide),
    onFocus: compose(children.props.onFocus, show),
    onBlur: compose(children.props.onBlur, hide),
  } as const;

  return (
    <div className="relative inline-block">
      {React.cloneElement(children, childProps)}
      <AnimatePresence>
        {visible && (
          <motion.div
            role="tooltip"
            id={id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-lg ring-1 ring-border"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
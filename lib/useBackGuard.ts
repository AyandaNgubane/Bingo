"use client";

import { useEffect, useRef } from "react";

/**
 * Traps the back button (browser back, mobile swipe/hardware back) while
 * `enabled` is true. Instead of letting the navigation happen, it re-asserts
 * the current page in history and calls `onBack` so the caller can show its
 * own confirmation prompt.
 */
export function useBackGuard(enabled: boolean, onBack: () => void) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!enabled) return;

    // Buffer entry: the first back press lands here instead of leaving the page.
    window.history.pushState({ bingoGuard: true }, "", window.location.href);

    function handlePopState() {
      // Immediately cancel the back navigation, then hand off to the caller.
      window.history.pushState({ bingoGuard: true }, "", window.location.href);
      onBackRef.current();
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [enabled]);
}

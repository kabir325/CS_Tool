"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type UseAnimationTimelineOptions = {
  stepCount: number;
  autoPlayInterval?: number;
};

export function useAnimationTimeline({
  stepCount,
  autoPlayInterval = 1800,
}: UseAnimationTimelineOptions) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    if (currentStep >= stepCount - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCurrentStep((step) => Math.min(step + 1, stepCount - 1));
    }, autoPlayInterval);

    return () => window.clearTimeout(timer);
  }, [autoPlayInterval, currentStep, isPlaying, stepCount]);

  const play = useCallback(() => {
    if (currentStep >= stepCount - 1) {
      setCurrentStep(0);
    }

    setIsPlaying(true);
  }, [currentStep, stepCount]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const nextStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((step) => Math.min(step + 1, stepCount - 1));
  }, [stepCount]);

  const previousStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((step) => Math.max(step - 1, 0));
  }, []);

  const selectStep = useCallback((step: number) => {
    setIsPlaying(false);
    setCurrentStep(step);
  }, []);

  return useMemo(
    () => ({
      currentStep,
      isPlaying,
      canGoBack: currentStep > 0,
      canGoForward: currentStep < stepCount - 1,
      play,
      pause,
      reset,
      nextStep,
      previousStep,
      selectStep,
    }),
    [
      currentStep,
      isPlaying,
      nextStep,
      pause,
      play,
      previousStep,
      reset,
      selectStep,
      stepCount,
    ],
  );
}

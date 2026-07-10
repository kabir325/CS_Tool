"use client";

import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";

type AnimationControlsProps = {
  isPlaying: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-cyan-300/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

export function AnimationControls({
  isPlaying,
  canGoBack,
  canGoForward,
  onPlay,
  onPause,
  onReset,
  onNext,
  onPrevious,
}: AnimationControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ControlButton label={isPlaying ? "Pause" : "Play"} onClick={isPlaying ? onPause : onPlay}>
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </ControlButton>
      <ControlButton label="Previous" onClick={onPrevious} disabled={!canGoBack}>
        <ChevronLeft className="h-4 w-4" />
      </ControlButton>
      <ControlButton label="Next" onClick={onNext} disabled={!canGoForward}>
        <ChevronRight className="h-4 w-4" />
      </ControlButton>
      <ControlButton label="Reset" onClick={onReset}>
        <RotateCcw className="h-4 w-4" />
      </ControlButton>
    </div>
  );
}

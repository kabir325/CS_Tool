"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { AnimationControls } from "@/components/topic/AnimationControls";
import { ExplanationPanel } from "@/components/topic/ExplanationPanel";
import { StepIndicator } from "@/components/topic/StepIndicator";
import { TopicLayout } from "@/components/topic/TopicLayout";
import { useAnimationTimeline } from "@/hooks/use-animation-timeline";
import { getSubnetDetails, parseIpv4Network } from "@/lib/ipv4";
import type { TopicStep } from "@/types/topic";

const FALLBACK_NETWORK = "192.168.10.0/24";

export function SubnettingExperience() {
  const [networkInput, setNetworkInput] = useState(FALLBACK_NETWORK);
  const parsedNetwork = useMemo(() => parseIpv4Network(networkInput), [networkInput]);
  const [targetPrefix, setTargetPrefix] = useState(26);

  useEffect(() => {
    if (!parsedNetwork) {
      return;
    }

    setTargetPrefix((current) => {
      if (current < parsedNetwork.basePrefix) {
        return parsedNetwork.basePrefix;
      }

      return Math.min(current, 30);
    });
  }, [parsedNetwork]);

  const steps = useMemo<TopicStep[]>(() => {
    if (!parsedNetwork) {
      return [
        {
          title: "Enter a valid network",
          description:
            "Use CIDR notation such as 192.168.10.0/24 so the visualizer can normalize the block before subdividing it.",
        },
      ];
    }

    const borrowedBits = targetPrefix - parsedNetwork.basePrefix;
    const totalSubnets = 2 ** borrowedBits;
    const firstSubnet = getSubnetDetails(parsedNetwork.normalizedIp, targetPrefix);

    return [
      {
        title: "Start with the parent network",
        description: `The original network ${parsedNetwork.cidrInput} is your single broadcast domain before any subnetting happens.`,
      },
      {
        title: "Borrow host bits",
        description: `Moving from /${parsedNetwork.basePrefix} to /${targetPrefix} borrows ${borrowedBits} bit${borrowedBits === 1 ? "" : "s"} for subnet IDs.`,
      },
      {
        title: "Split the address space",
        description: `Those borrowed bits create ${totalSubnets} subnet${totalSubnets === 1 ? "" : "s"}, each with the same number of addresses and the same mask.`,
      },
      {
        title: "Inspect one resulting subnet",
        description: `For the first /${targetPrefix} subnet, the usable host range becomes ${firstSubnet.hostRange} with ${firstSubnet.usableHosts.toLocaleString()} usable hosts.`,
      },
    ];
  }, [parsedNetwork, targetPrefix]);

  const {
    currentStep,
    isPlaying,
    canGoBack,
    canGoForward,
    play,
    pause,
    reset,
    nextStep,
    previousStep,
    selectStep,
  } = useAnimationTimeline({
    stepCount: steps.length,
    autoPlayInterval: 2100,
  });

  useEffect(() => {
    reset();
  }, [parsedNetwork?.cidrInput, reset, targetPrefix]);

  if (!parsedNetwork) {
    return (
      <TopicLayout
        title="Subnetting"
        introduction="Understand how one IPv4 network becomes smaller, structured chunks with clear address boundaries."
        meta={[
          { label: "Difficulty", value: "Beginner" },
          { label: "Reading time", value: "7 min" },
          { label: "Format", value: "Interactive SVG" },
        ]}
        tools={
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-100">IPv4 network</span>
              <input
                value={networkInput}
                onChange={(event) => setNetworkInput(event.target.value)}
                className="w-full rounded-2xl border border-rose-400/30 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300/40"
                placeholder="192.168.10.0/24"
              />
            </label>
            <p className="text-sm text-rose-200">
              Enter a valid network in CIDR notation, for example `192.168.10.0/24`.
            </p>
          </div>
        }
        visualization={
          <div className="flex min-h-[420px] items-center justify-center rounded-[24px] border border-dashed border-rose-300/25 bg-rose-400/5 p-8 text-center text-slate-300">
            The visualizer appears as soon as the network is valid.
          </div>
        }
        controls={
          <AnimationControls
            isPlaying={isPlaying}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            onPlay={play}
            onPause={pause}
            onReset={reset}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        }
        stepIndicator={
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onStepSelect={selectStep}
          />
        }
        explanation={
          <ExplanationPanel
            step={steps[currentStep]}
            currentStep={currentStep}
            totalSteps={steps.length}
          />
        }
      />
    );
  }

  const effectivePrefix = Math.max(targetPrefix, parsedNetwork.basePrefix);
  const borrowedBits = effectivePrefix - parsedNetwork.basePrefix;
  const totalSubnets = 2 ** borrowedBits;
  const previewSubnetCount = Math.min(totalSubnets, 12);
  const firstSubnet = getSubnetDetails(parsedNetwork.normalizedIp, effectivePrefix);
  const segmentWidth = 660 / previewSubnetCount;
  const showDivision = currentStep >= 2;

  const subnetLabels = Array.from({ length: previewSubnetCount }, (_, index) => ({
    id: index,
    label:
      totalSubnets > previewSubnetCount && index === previewSubnetCount - 1
        ? `+${totalSubnets - previewSubnetCount + 1} more`
        : `Subnet ${index + 1}`,
  }));

  return (
    <TopicLayout
      title="Subnetting"
      introduction="See how borrowing bits from the host portion creates smaller networks, changes broadcast boundaries, and shrinks the usable host range."
      meta={[
        { label: "Difficulty", value: "Beginner" },
        { label: "Reading time", value: "7 min" },
        { label: "Target prefix", value: `/${effectivePrefix}` },
      ]}
      tools={
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-100">IPv4 network</span>
            <input
              value={networkInput}
              onChange={(event) => setNetworkInput(event.target.value)}
              className="w-full rounded-2xl border border-white/12 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300/40"
              placeholder="192.168.10.0/24"
            />
            <span className="text-xs text-slate-400">
              The visualizer automatically normalizes the entered network.
            </span>
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-200">
              <span>Subnet mask slider</span>
              <span className="rounded-full border border-cyan-300/25 px-3 py-1 text-cyan-100">
                /{effectivePrefix}
              </span>
            </div>
            <input
              type="range"
              min={parsedNetwork.basePrefix}
              max={30}
              value={effectivePrefix}
              onChange={(event) => setTargetPrefix(Number(event.target.value))}
              className="w-full accent-cyan-300"
            />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Original /{parsedNetwork.basePrefix}</span>
              <span>Smaller subnets /30</span>
            </div>
            <p className="text-sm leading-6 text-slate-400">
              Borrowing more bits increases the number of subnets while decreasing usable hosts inside each one.
            </p>
          </div>
        </div>
      }
      visualization={
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/55 p-4">
            <svg viewBox="0 0 760 260" className="w-full">
              <defs>
                <linearGradient id="networkBar" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
              </defs>

              <text x="36" y="40" fill="#dbeafe" fontSize="18" fontWeight="600">
                Original network
              </text>
              <text x="36" y="64" fill="#7dd3fc" fontSize="14">
                {parsedNetwork.cidrInput}
              </text>
              <motion.rect
                x="36"
                y="84"
                rx="18"
                ry="18"
                width="688"
                height="34"
                fill="url(#networkBar)"
                initial={false}
                animate={{ opacity: currentStep === 0 ? 1 : 0.6 }}
                transition={{ duration: 0.35 }}
              />

              <text x="36" y="154" fill="#dbeafe" fontSize="18" fontWeight="600">
                Subnet division
              </text>
              <text x="36" y="178" fill="#94a3b8" fontSize="14">
                {borrowedBits} borrowed bit{borrowedBits === 1 ? "" : "s"} create {totalSubnets.toLocaleString()} subnet
                {totalSubnets === 1 ? "" : "s"}
              </text>

              {subnetLabels.map((segment, index) => {
                const collapsedX = 36;
                const expandedX = 36 + index * segmentWidth;
                const width = Math.max(segmentWidth - 6, 28);

                return (
                  <g key={`${segment.id}-${effectivePrefix}`}>
                    <motion.rect
                      x={collapsedX}
                      y="196"
                      rx="14"
                      ry="14"
                      height="34"
                      initial={false}
                      animate={{
                        x: showDivision ? expandedX : collapsedX,
                        width: showDivision ? width : 688,
                        opacity: currentStep >= 1 ? 1 : 0.14,
                      }}
                      transition={{ duration: 0.55, ease: "easeInOut" }}
                      fill={index % 2 === 0 ? "#38bdf8" : "#2dd4bf"}
                    />
                    {showDivision ? (
                      <text
                        x={expandedX + 10}
                        y="217"
                        fill="#04111f"
                        fontSize="12"
                        fontWeight="700"
                      >
                        {segment.label}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              { label: "Original network", value: parsedNetwork.cidrInput },
              { label: "Network address", value: firstSubnet.networkAddress },
              { label: "Broadcast address", value: firstSubnet.broadcastAddress },
              { label: "Host range", value: firstSubnet.hostRange },
              { label: "Usable hosts", value: firstSubnet.usableHosts.toLocaleString() },
              { label: "Subnet divisions", value: totalSubnets.toLocaleString() },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      }
      controls={
        <AnimationControls
          isPlaying={isPlaying}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onNext={nextStep}
          onPrevious={previousStep}
        />
      }
      stepIndicator={
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          onStepSelect={selectStep}
        />
      }
      explanation={
        <ExplanationPanel
          step={steps[currentStep]}
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      }
    />
  );
}

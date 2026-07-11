"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { AnimationControls } from "@/components/topic/AnimationControls";
import { ExplanationPanel } from "@/components/topic/ExplanationPanel";
import { StepIndicator } from "@/components/topic/StepIndicator";
import { TopicLayout } from "@/components/topic/TopicLayout";
import { useAnimationTimeline } from "@/hooks/use-animation-timeline";
import type { TopicStep } from "@/types/topic";

type DeviceKey = "A" | "B" | "C";

const devicePositions = {
  A: { x: 120, y: 88, label: "PC A" },
  B: { x: 120, y: 292, label: "PC B" },
  C: { x: 620, y: 190, label: "PC C" },
} as const;

const vlanColors: Record<number, string> = {
  10: "#38bdf8",
  20: "#2dd4bf",
  30: "#fbbf24",
};

export function VlansExperience() {
  const [vlansEnabled, setVlansEnabled] = useState(true);
  const [sourcePc, setSourcePc] = useState<DeviceKey>("A");
  const [vlanIds, setVlanIds] = useState<Record<DeviceKey, number>>({
    A: 10,
    B: 10,
    C: 20,
  });

  const steps = useMemo<TopicStep[]>(() => {
    const sourceVlan = vlanIds[sourcePc];
    const reachablePeers = (Object.keys(devicePositions) as DeviceKey[])
      .filter((device) => device !== sourcePc)
      .filter((device) => !vlansEnabled || vlanIds[device] === sourceVlan)
      .map((device) => `PC ${device}`)
      .join(", ");

    return [
      {
        title: "One switch, one flat network",
        description:
          "Without VLAN separation, every access port belongs to the same Layer 2 broadcast domain.",
      },
      {
        title: "Enable VLAN awareness",
        description:
          "Turning VLANs on lets the switch keep traffic isolated by VLAN ID instead of flooding every port equally.",
      },
      {
        title: "Assign access ports",
        description: `PC ${sourcePc} currently sits in VLAN ${sourceVlan}, and the switch learns which other access ports belong to the same segment.`,
      },
      {
        title: "Broadcast inside the VLAN",
        description: vlansEnabled
          ? `When PC ${sourcePc} sends a broadcast, only ${reachablePeers || "no other hosts"} receive it because broadcasts stay inside VLAN ${sourceVlan}.`
          : `With VLANs disabled, the switch floods the broadcast from PC ${sourcePc} to every other access port.`,
      },
    ];
  }, [sourcePc, vlanIds, vlansEnabled]);

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
    autoPlayInterval: 1900,
  });

  useEffect(() => {
    reset();
  }, [reset, sourcePc, vlanIds, vlansEnabled]);

  const sourceVlan = vlanIds[sourcePc];
  const recipients = (Object.keys(devicePositions) as DeviceKey[])
    .filter((device) => device !== sourcePc)
    .filter((device) => !vlansEnabled || vlanIds[device] === sourceVlan);
  const blockedDevices = (Object.keys(devicePositions) as DeviceKey[])
    .filter((device) => device !== sourcePc)
    .filter((device) => vlansEnabled && vlanIds[device] !== sourceVlan);

  return (
    <TopicLayout
      sectionTitle="Networking"
      title="VLANs"
      introduction="Use this page to see how VLANs split one switch into separate Layer 2 broadcast domains."
      overview={
        <div className="space-y-3">
          <p>
            A VLAN is a logical network on a switch. Devices in different VLANs can be plugged into the same switch but still behave as if they are on separate Layer 2 networks.
          </p>
          <p>
            The big idea is that broadcasts stay inside the VLAN unless routing is introduced.
          </p>
        </div>
      }
      process={
        <ol className="list-decimal space-y-2 pl-5">
          <li>Assign switch ports to VLAN IDs.</li>
          <li>Put hosts in the same VLAN if they should share a broadcast domain.</li>
          <li>Send a broadcast from one host.</li>
          <li>Observe that only devices in the same VLAN receive it.</li>
        </ol>
      }
      tools={
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <label className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Enable VLANs</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Toggle between a flat network and isolated broadcast domains.
                </p>
              </div>
              <input
                type="checkbox"
                checked={vlansEnabled}
                onChange={(event) => setVlansEnabled(event.target.checked)}
                className="h-5 w-5 accent-cyan-300"
              />
            </label>
            <div className="mt-5 space-y-3">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-900">Broadcast from</span>
                <select
                  value={sourcePc}
                  onChange={(event) => setSourcePc(event.target.value as DeviceKey)}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none"
                >
                  <option value="A">PC A</option>
                  <option value="B">PC B</option>
                  <option value="C">PC C</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => selectStep(3)}
                className="w-full rounded-md border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-medium text-white"
              >
                Broadcast Packet
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {(Object.keys(devicePositions) as DeviceKey[]).map((device) => (
              <label
                key={device}
                className="rounded-md border border-slate-200 bg-slate-50 p-4"
              >
                <span className="text-sm font-medium text-slate-900">PC {device} VLAN ID</span>
                <select
                  value={vlanIds[device]}
                  onChange={(event) =>
                    setVlanIds((current) => ({
                      ...current,
                      [device]: Number(event.target.value),
                    }))
                  }
                  className="mt-3 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </label>
            ))}
          </div>
        </div>
      }
      visualization={
        <div className="space-y-5">
          <div className="overflow-hidden rounded-lg border border-slate-200 p-4">
            <svg viewBox="0 0 760 380" className="w-full">
              <text x="280" y="42" fill="#0f172a" fontSize="22" fontWeight="700">
                Managed Switch
              </text>
              <motion.rect
                x="280"
                y="92"
                rx="28"
                ry="28"
                width="200"
                height="180"
                fill={vlansEnabled ? "#d1fae5" : "#e2e8f0"}
                initial={false}
                animate={{ opacity: currentStep >= 1 ? 1 : 0.86 }}
                transition={{ duration: 0.35 }}
              />
              <text x="342" y="150" fill="#0f172a" fontSize="16" fontWeight="700">
                VLAN Engine
              </text>
              <text x="319" y="177" fill="#475569" fontSize="13">
                {vlansEnabled ? "Broadcasts filtered by VLAN" : "Flooding all access ports"}
              </text>

              {(Object.keys(devicePositions) as DeviceKey[]).map((device) => {
                const node = devicePositions[device];
                const isSource = device === sourcePc;
                const deviceColor = vlansEnabled ? vlanColors[vlanIds[device]] : "#94a3b8";
                const lineColor =
                  currentStep >= 2 ? deviceColor : "rgba(148, 163, 184, 0.38)";

                return (
                  <g key={device}>
                    <motion.line
                      x1={node.x + (device === "C" ? -60 : 60)}
                      y1={node.y + 24}
                      x2={device === "C" ? 480 : 280}
                      y2="182"
                      stroke={lineColor}
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={false}
                      animate={{ opacity: currentStep >= 1 ? 1 : 0.55 }}
                    />
                    <rect
                      x={device === "C" ? node.x - 60 : node.x}
                      y={node.y}
                      width="120"
                      height="48"
                      rx="18"
                      ry="18"
                      fill={isSource ? "#ffffff" : "#f8fafc"}
                      stroke={isSource ? "#0f172a" : "#94a3b8"}
                      strokeWidth="2"
                    />
                    <text
                      x={device === "C" ? node.x : node.x + 24}
                      y={node.y + 20}
                      fill="#0f172a"
                      fontSize="14"
                      fontWeight="700"
                    >
                      {node.label}
                    </text>
                    <text
                      x={device === "C" ? node.x : node.x + 18}
                      y={node.y + 36}
                      fill={deviceColor}
                      fontSize="12"
                      fontWeight="700"
                    >
                      VLAN {vlanIds[device]}
                    </text>
                  </g>
                );
              })}

              {currentStep >= 3 ? (
                <motion.circle
                  cx={devicePositions[sourcePc].x + (sourcePc === "C" ? -16 : 58)}
                  cy={devicePositions[sourcePc].y + 24}
                  r="8"
                  fill="#f8fafc"
                  initial={false}
                  animate={{ cx: 380, cy: 182 }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                />
              ) : null}

              {currentStep >= 3 &&
                recipients.map((device, index) => {
                  const node = devicePositions[device];
                  const targetX = device === "C" ? node.x - 2 : node.x + 60;

                  return (
                    <motion.circle
                      key={`packet-${device}-${vlanIds[device]}`}
                      cx="380"
                      cy="182"
                      r="8"
                      fill={vlansEnabled ? vlanColors[sourceVlan] : "#f8fafc"}
                      initial={false}
                      animate={{ cx: targetX, cy: node.y + 24 }}
                      transition={{
                        duration: 0.7,
                        ease: "easeInOut",
                        delay: 0.28 + index * 0.1,
                      }}
                    />
                  );
                })}

              {currentStep >= 3 &&
                blockedDevices.map((device) => {
                  const node = devicePositions[device];
                  const targetX = device === "C" ? node.x - 2 : node.x + 60;

                  return (
                    <g key={`blocked-${device}`}>
                      <line
                        x1="380"
                        y1="182"
                        x2={targetX}
                        y2={node.y + 24}
                        stroke="#fb7185"
                        strokeDasharray="8 8"
                        strokeWidth="3"
                        opacity="0.55"
                      />
                      <text
                        x={(380 + targetX) / 2 - 22}
                        y={(182 + node.y + 24) / 2 - 8}
                        fill="#be123c"
                        fontSize="11"
                        fontWeight="700"
                      >
                        blocked
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "VLAN mode", value: vlansEnabled ? "Enabled" : "Disabled" },
              { label: "Source VLAN", value: `VLAN ${sourceVlan}` },
              {
                label: "Broadcast scope",
                value: vlansEnabled
                  ? recipients.length
                    ? recipients.map((device) => `PC ${device}`).join(", ")
                    : "No matching peers"
                  : "All other ports",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-900">{item.value}</p>
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

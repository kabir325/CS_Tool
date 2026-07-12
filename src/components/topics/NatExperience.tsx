"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { AnimationControls } from "@/components/topic/AnimationControls";
import { ExplanationPanel } from "@/components/topic/ExplanationPanel";
import { StepIndicator } from "@/components/topic/StepIndicator";
import { TopicLayout } from "@/components/topic/TopicLayout";
import { useAnimationTimeline } from "@/hooks/use-animation-timeline";
import type { TopicStep } from "@/types/topic";

type NatHost = {
  id: string;
  name: string;
  privateIp: string;
  sourcePort: number;
  translatedPort: number;
  color: string;
  accent: string;
};

const routerPrivateIp = "192.168.1.1";
const routerPublicIp = "203.0.113.5";
const serverIp = "198.51.100.20";

const hosts: NatHost[] = [
  {
    id: "host-a",
    name: "Host A",
    privateIp: "192.168.1.10",
    sourcePort: 51514,
    translatedPort: 40001,
    color: "#38bdf8",
    accent: "text-sky-600",
  },
  {
    id: "host-b",
    name: "Host B",
    privateIp: "192.168.1.11",
    sourcePort: 51515,
    translatedPort: 40002,
    color: "#34d399",
    accent: "text-emerald-600",
  },
  {
    id: "host-c",
    name: "Host C",
    privateIp: "192.168.1.12",
    sourcePort: 51516,
    translatedPort: 40003,
    color: "#f59e0b",
    accent: "text-amber-600",
  },
];

function buildSteps(host: NatHost): TopicStep[] {
  return [
    {
      title: "Private hosts sit behind one public address",
      description: `${host.name} lives on the private LAN with address ${host.privateIp}. The router is the edge device between the private network and the internet, and it owns the public IP ${routerPublicIp}.`,
    },
    {
      title: "The host sends a packet toward the router",
      description: `${host.name} wants to reach the server at ${serverIp}:443. It creates a packet with source ${host.privateIp}:${host.sourcePort} and destination ${serverIp}:443, then forwards it to the default gateway ${routerPrivateIp}.`,
    },
    {
      title: "NAT rewrites the source and records a mapping",
      description: `The router changes the source from ${host.privateIp}:${host.sourcePort} to ${routerPublicIp}:${host.translatedPort}. At the same time it stores a NAT table entry so it can map the reply back to ${host.name}.`,
    },
    {
      title: "The server replies to the public address",
      description: `From the server's point of view, the client is ${routerPublicIp}:${host.translatedPort}. The response is sent back to that public IP and translated port, not directly to the private host.`,
    },
    {
      title: "The router consults the NAT table and forwards the reply",
      description: `The router looks up ${routerPublicIp}:${host.translatedPort}, finds the matching inside local address ${host.privateIp}:${host.sourcePort}, rewrites the destination, and delivers the packet back to ${host.name}.`,
    },
  ];
}

function PacketLabel({
  x,
  y,
  title,
  lineOne,
  lineTwo,
}: {
  x: number;
  y: number;
  title: string;
  lineOne: string;
  lineTwo: string;
}) {
  return (
    <g>
      <rect x={x - 108} y={y - 34} width="216" height="48" rx="10" fill="white" fillOpacity="0.97" />
      <text x={x} y={y - 16} textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">
        {title}
      </text>
      <text x={x} y={y} textAnchor="middle" fill="#475569" fontSize="11">
        {lineOne}
      </text>
      <text x={x} y={y + 14} textAnchor="middle" fill="#475569" fontSize="11">
        {lineTwo}
      </text>
    </g>
  );
}

function NodeBox({
  x,
  y,
  width,
  height,
  title,
  lines,
  active = false,
  stroke = "#cbd5e1",
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  lines: string[];
  active?: boolean;
  stroke?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="24"
        fill="#ffffff"
        stroke={active ? stroke : "#cbd5e1"}
        strokeWidth={active ? "2.5" : "2"}
      />
      <text x={x + width / 2} y={y + 28} textAnchor="middle" fill="#0f172a" fontSize="18" fontWeight="700">
        {title}
      </text>
      {lines.map((line, index) => (
        <text
          key={`${title}-${line}`}
          x={x + width / 2}
          y={y + 50 + index * 16}
          textAnchor="middle"
          fill="#64748b"
          fontSize="11"
          fontWeight={index === 0 ? "700" : "500"}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function NatTablePreview({
  host,
  currentStep,
}: {
  host: NatHost;
  currentStep: number;
}) {
  const hasEntry = currentStep >= 2;
  const stateLabel =
    currentStep < 2 ? "No translation yet" : currentStep === 2 ? "Created" : currentStep === 3 ? "Used for reply" : "Matched and forwarded";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-slate-900">NAT Table</h3>
        <p className="text-sm leading-7 text-slate-600">
          The router tracks which inside local address is currently using which outside translated port.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full table-fixed text-sm">
            <colgroup>
              <col className="w-[28%]" />
              <col className="w-[28%]" />
              <col className="w-[24%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                <th className="px-4 py-3">Inside Local</th>
                <th className="px-4 py-3">Inside Global</th>
                <th className="px-4 py-3">Outside Global</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {hasEntry ? (
                <tr className="align-top text-slate-700">
                  <td className="px-4 py-4 font-mono break-all">{host.privateIp}:{host.sourcePort}</td>
                  <td className="px-4 py-4 font-mono break-all">{routerPublicIp}:{host.translatedPort}</td>
                  <td className="px-4 py-4 font-mono break-all">{serverIp}:443</td>
                  <td className="px-4 py-4 font-medium text-slate-900">{stateLabel}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-slate-500">
                    No entry yet. The mapping appears when the router performs translation.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function NatExperience() {
  const [selectedHostId, setSelectedHostId] = useState(hosts[0].id);
  const selectedHost = useMemo(
    () => hosts.find((host) => host.id === selectedHostId) ?? hosts[0],
    [selectedHostId],
  );
  const steps = useMemo(() => buildSteps(selectedHost), [selectedHost]);

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
  }, [reset, selectedHostId]);

  return (
    <TopicLayout
      sectionTitle="Networking"
      title="Network Address Translation (NAT)"
      introduction="Use this page to see how one public IP can represent many private hosts, how source addresses are rewritten, and how the router uses its translation table to send replies back to the right device."
      overview={
        <div className="space-y-3">
          <p>
            NAT is the process of rewriting packet addresses at the network edge. In home and office networks it usually lets many private hosts share a single public IPv4 address.
          </p>
          <p>
            Without NAT, every internal device would need its own publicly routable address. NAT conserves IPv4 space and hides internal addressing from the outside network.
          </p>
        </div>
      }
      process={
        <div className="space-y-3">
          <p>NAT matters because it solves two problems at once:</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>It allows private RFC1918 addresses to reach public internet destinations.</li>
            <li>It keeps track of which inside host started each conversation so replies can be mapped back correctly.</li>
            <li>The router does this by rewriting the source IP and usually the source port.</li>
            <li>That translation is stored in a NAT table until the traffic flow is finished or times out.</li>
          </ol>
        </div>
      }
      tools={
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900">Choose a private host</p>
            <p className="text-sm leading-7 text-slate-600">
              Pick one LAN device and watch how the router rewrites its packet before sending it to the internet.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {hosts.map((host) => {
              const isActive = host.id === selectedHost.id;

              return (
                <button
                  key={host.id}
                  type="button"
                  onClick={() => setSelectedHostId(host.id)}
                  className={`rounded-xl border px-4 py-4 text-left transition ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-900"
                  }`}
                >
                  <p className="font-semibold">{host.name}</p>
                  <p className={`mt-1 text-sm ${isActive ? "text-slate-200" : "text-slate-500"}`}>
                    {host.privateIp}
                  </p>
                  <p className={`mt-2 text-xs ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                    Source port {host.sourcePort}
                    {" -> "}
                    translated port {host.translatedPort}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 text-sm text-slate-600 lg:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Private LAN</p>
              <p className="mt-1 font-mono text-slate-900">192.168.1.0/24</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Router public IP</p>
              <p className="mt-1 font-mono text-slate-900">{routerPublicIp}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Destination server</p>
              <p className="mt-1 font-mono text-slate-900">{serverIp}:443</p>
            </div>
          </div>
        </div>
      }
      visualizationTitle="Packet Translation"
      visualization={
        <div className="space-y-8">
          <div className="overflow-x-auto">
            <svg viewBox="0 0 900 420" className="w-full">
              <NodeBox
                x={36}
                y={42}
                width={190}
                height={92}
                title="Host A"
                lines={["192.168.1.10", "Private address"]}
                active={selectedHost.id === "host-a"}
                stroke={hosts[0].color}
              />
              <NodeBox
                x={36}
                y={164}
                width={190}
                height={92}
                title="Host B"
                lines={["192.168.1.11", "Private address"]}
                active={selectedHost.id === "host-b"}
                stroke={hosts[1].color}
              />
              <NodeBox
                x={36}
                y={286}
                width={190}
                height={92}
                title="Host C"
                lines={["192.168.1.12", "Private address"]}
                active={selectedHost.id === "host-c"}
                stroke={hosts[2].color}
              />

              <NodeBox
                x={336}
                y={106}
                width={224}
                height={206}
                title="NAT Router"
                lines={[`Inside: ${routerPrivateIp}`, `Outside: ${routerPublicIp}`, "Rewrites source IP and port"]}
                active
                stroke="#0f172a"
              />

              <NodeBox
                x={686}
                y={134}
                width={178}
                height={148}
                title="Web Server"
                lines={[serverIp, "Port 443", "Public internet"]}
                active
                stroke="#a5b4fc"
              />

              <line x1="226" y1="88" x2="336" y2="148" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="226" y1="210" x2="336" y2="210" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="226" y1="332" x2="336" y2="272" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="560" y1="209" x2="686" y2="209" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8" />

              {currentStep >= 1 ? (
                <motion.g
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <line
                    x1="226"
                    y1={selectedHost.id === "host-a" ? "88" : selectedHost.id === "host-b" ? "210" : "332"}
                    x2="336"
                    y2="209"
                    stroke={selectedHost.color}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <polygon points="336,209 318,200 318,218" fill={selectedHost.color} />
                  <PacketLabel
                    x={255}
                    y={selectedHost.id === "host-a" ? 126 : selectedHost.id === "host-b" ? 178 : 304}
                    title="Before NAT"
                    lineOne={`Src ${selectedHost.privateIp}:${selectedHost.sourcePort}`}
                    lineTwo={`Dst ${serverIp}:443`}
                  />
                </motion.g>
              ) : null}

              {currentStep >= 2 ? (
                <motion.g
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <line
                    x1="560"
                    y1="209"
                    x2="686"
                    y2="209"
                    stroke="#0f172a"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <polygon points="686,209 668,200 668,218" fill="#0f172a" />
                  <PacketLabel
                    x={623}
                    y={178}
                    title="After NAT"
                    lineOne={`Src ${routerPublicIp}:${selectedHost.translatedPort}`}
                    lineTwo={`Dst ${serverIp}:443`}
                  />
                </motion.g>
              ) : null}

              {currentStep >= 3 ? (
                <motion.g
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <line
                    x1="686"
                    y1="246"
                    x2="560"
                    y2="246"
                    stroke="#6366f1"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <polygon points="560,246 578,237 578,255" fill="#6366f1" />
                  <PacketLabel
                    x={623}
                    y={283}
                    title="Server Reply"
                    lineOne={`Src ${serverIp}:443`}
                    lineTwo={`Dst ${routerPublicIp}:${selectedHost.translatedPort}`}
                  />
                </motion.g>
              ) : null}

              {currentStep >= 4 ? (
                <motion.g
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <line
                    x1="336"
                    y1="246"
                    x2="226"
                    y2={selectedHost.id === "host-a" ? "88" : selectedHost.id === "host-b" ? "210" : "332"}
                    stroke={selectedHost.color}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <polygon
                    points={
                      selectedHost.id === "host-a"
                        ? "226,88 236,106 218,106"
                        : selectedHost.id === "host-b"
                          ? "226,210 244,219 244,201"
                          : "226,332 244,314 226,314"
                    }
                    fill={selectedHost.color}
                  />
                  <PacketLabel
                    x={255}
                    y={selectedHost.id === "host-a" ? 216 : selectedHost.id === "host-b" ? 260 : 232}
                    title="After Reverse NAT"
                    lineOne={`Src ${serverIp}:443`}
                    lineTwo={`Dst ${selectedHost.privateIp}:${selectedHost.sourcePort}`}
                  />
                </motion.g>
              ) : null}
            </svg>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Address view</h3>
            <dl className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Selected host</dt>
                <dd className="mt-1 font-semibold text-slate-900">{selectedHost.name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Private source</dt>
                <dd className="mt-1 font-mono text-slate-900">
                  {selectedHost.privateIp}:{selectedHost.sourcePort}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Translated source</dt>
                <dd className="mt-1 font-mono text-slate-900">
                  {routerPublicIp}:{selectedHost.translatedPort}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Destination</dt>
                <dd className="mt-1 font-mono text-slate-900">{serverIp}:443</dd>
              </div>
            </dl>
          </div>

          <NatTablePreview host={selectedHost} currentStep={currentStep} />
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

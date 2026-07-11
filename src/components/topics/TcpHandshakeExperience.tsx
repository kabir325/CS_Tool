"use client";

import { motion } from "framer-motion";
import { AnimationControls } from "@/components/topic/AnimationControls";
import { ExplanationPanel } from "@/components/topic/ExplanationPanel";
import { StepIndicator } from "@/components/topic/StepIndicator";
import { TopicLayout } from "@/components/topic/TopicLayout";
import { useAnimationTimeline } from "@/hooks/use-animation-timeline";
import type { TopicStep } from "@/types/topic";

type TcpPacket = {
  label: string;
  from: string;
  to: string;
  sourcePort: number;
  destinationPort: number;
  seq: number;
  ack: number;
  dataOffset: string;
  reserved: string;
  checksum: string;
  urgentPointer: string;
  window: string;
  flags: {
    cwr: 0 | 1;
    ece: 0 | 1;
    urg: 0 | 1;
    ack: 0 | 1;
    psh: 0 | 1;
    rst: 0 | 1;
    syn: 0 | 1;
    fin: 0 | 1;
  };
  note: string;
};

const steps: TopicStep[] = [
  {
    title: "CLOSED to LISTEN",
    description:
      "The client is ready to initiate a connection and the server is already listening for incoming requests.",
  },
  {
    title: "Client sends SYN",
    description:
      "The client sends a SYN segment with its initial sequence number to begin the connection setup.",
  },
  {
    title: "Server replies SYN-ACK",
    description:
      "The server acknowledges the client's sequence number and advertises its own sequence number in the same response.",
  },
  {
    title: "Client sends ACK",
    description:
      "The final ACK confirms the server's sequence number, and both sides transition into the ESTABLISHED state.",
  },
];

const packetsByStep: Record<number, TcpPacket | null> = {
  0: null,
  1: {
    label: "SYN Segment",
    from: "Client:49152",
    to: "Server:443",
    sourcePort: 49152,
    destinationPort: 443,
    seq: 1200,
    ack: 0,
    dataOffset: "5 words",
    reserved: "000",
    checksum: "0x7c21",
    urgentPointer: "0",
    window: "64240",
    flags: { cwr: 0, ece: 0, urg: 0, ack: 0, psh: 0, rst: 0, syn: 1, fin: 0 },
    note: "The client proposes a starting sequence number and asks to open a TCP connection.",
  },
  2: {
    label: "SYN-ACK Segment",
    from: "Server:443",
    to: "Client:49152",
    sourcePort: 443,
    destinationPort: 49152,
    seq: 8400,
    ack: 1201,
    dataOffset: "5 words",
    reserved: "000",
    checksum: "0x91a4",
    urgentPointer: "0",
    window: "65535",
    flags: { cwr: 0, ece: 0, urg: 0, ack: 1, psh: 0, rst: 0, syn: 1, fin: 0 },
    note: "The server acknowledges the client's SYN and sends its own initial sequence number.",
  },
  3: {
    label: "ACK Segment",
    from: "Client:49152",
    to: "Server:443",
    sourcePort: 49152,
    destinationPort: 443,
    seq: 1201,
    ack: 8401,
    dataOffset: "5 words",
    reserved: "000",
    checksum: "0x7c22",
    urgentPointer: "0",
    window: "64240",
    flags: { cwr: 0, ece: 0, urg: 0, ack: 1, psh: 0, rst: 0, syn: 0, fin: 0 },
    note: "The client confirms the server sequence number and the TCP connection becomes established.",
  },
};

function HeaderCell({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-slate-200 px-3 py-2 ${className}`}>
      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function FlagCell({
  label,
  value,
}: {
  label: string;
  value: 0 | 1;
}) {
  return (
    <div className="border border-slate-200 px-2 py-2 text-center">
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-1 font-mono text-sm font-semibold ${
          value === 1 ? "text-slate-900" : "text-slate-400"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TcpHeaderPreview({ packet }: { packet: TcpPacket | null }) {
  if (!packet) {
    return (
      <div className="space-y-3 border-t border-slate-200 pt-6">
        <h3 className="text-base font-semibold text-slate-900">TCP Header</h3>
        <p className="text-sm leading-7 text-slate-600">
          No segment is on the wire yet. When the handshake starts, the active TCP header will appear here and the SYN and ACK bits will change as the exchange progresses.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 border-t border-slate-200 pt-6">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-slate-900">TCP Header</h3>
        <p className="text-sm leading-7 text-slate-600">{packet.note}</p>
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-900">{packet.label}</span>
          {"  "}
          <span className="font-mono text-slate-500">
            {packet.from}
            {" -> "}
            {packet.to}
          </span>
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="grid grid-cols-2">
          <HeaderCell label="Source Port" value={packet.sourcePort} />
          <HeaderCell label="Destination Port" value={packet.destinationPort} className="border-l-0" />
        </div>
        <div className="grid grid-cols-1">
          <HeaderCell label="Sequence Number" value={packet.seq} className="border-t-0" />
        </div>
        <div className="grid grid-cols-1">
          <HeaderCell label="Acknowledgment Number" value={packet.ack} className="border-t-0" />
        </div>
        <div className="grid grid-cols-[1.1fr_0.8fr_2.1fr]">
          <HeaderCell label="Data Offset" value={packet.dataOffset} className="border-t-0" />
          <HeaderCell label="Reserved" value={packet.reserved} className="border-l-0 border-t-0" />
          <div className="border border-l-0 border-t-0 border-slate-200 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Flags</p>
            <div className="mt-2 grid grid-cols-4 gap-0">
              <FlagCell label="CWR" value={packet.flags.cwr} />
              <FlagCell label="ECE" value={packet.flags.ece} />
              <FlagCell label="URG" value={packet.flags.urg} />
              <FlagCell label="ACK" value={packet.flags.ack} />
              <FlagCell label="PSH" value={packet.flags.psh} />
              <FlagCell label="RST" value={packet.flags.rst} />
              <FlagCell label="SYN" value={packet.flags.syn} />
              <FlagCell label="FIN" value={packet.flags.fin} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <HeaderCell label="Window Size" value={packet.window} className="border-t-0" />
          <HeaderCell label="Checksum" value={packet.checksum} className="border-l-0 border-t-0" />
        </div>
        <div className="grid grid-cols-2">
          <HeaderCell label="Urgent Pointer" value={packet.urgentPointer} className="border-t-0" />
          <HeaderCell label="Options" value="None" className="border-l-0 border-t-0" />
        </div>
      </div>
    </div>
  );
}

function ArrowLabel({
  x,
  y,
  title,
  detail,
}: {
  x: number;
  y: number;
  title: string;
  detail: string;
}) {
  return (
    <g>
      <rect
        x={x - 92}
        y={y - 24}
        width="184"
        height="34"
        rx="10"
        fill="white"
        fillOpacity="0.96"
      />
      <text x={x} y={y - 10} textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="700">
        {title}
      </text>
      <text x={x} y={y + 6} textAnchor="middle" fill="#475569" fontSize="12">
        {detail}
      </text>
    </g>
  );
}

function NodeLabel({
  x,
  title,
  state,
  accent,
}: {
  x: number;
  title: string;
  state: string;
  accent: string;
}) {
  return (
    <g>
      <rect x={x} y="54" width="190" height="112" rx="28" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
      <text x={x + 95} y="95" textAnchor="middle" fill="#0f172a" fontSize="22" fontWeight="700">
        {title}
      </text>
      <text x={x + 95} y="126" textAnchor="middle" fill={accent} fontSize="13" fontWeight="700">
        State: {state}
      </text>
    </g>
  );
}

export function TcpHandshakeExperience() {
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
    autoPlayInterval: 1700,
  });

  const clientState =
    currentStep === 0
      ? "CLOSED"
      : currentStep === 1
        ? "SYN-SENT"
        : currentStep === 2
          ? "SYN-SENT"
          : "ESTABLISHED";

  const serverState =
    currentStep === 0
      ? "LISTEN"
      : currentStep === 1
        ? "LISTEN"
        : currentStep === 2
          ? "SYN-RECEIVED"
          : "ESTABLISHED";
  const activePacket = packetsByStep[currentStep];

  return (
    <TopicLayout
      sectionTitle="Networking"
      title="TCP Three-Way Handshake"
      introduction="Use this page to follow the connection setup sequence that TCP uses before data transfer begins."
      overview={
        <div className="space-y-3">
          <p>
            TCP does not start sending application data immediately. First it confirms that both sides are reachable and synchronizes sequence numbers.
          </p>
          <p>
            That setup process is called the three-way handshake.
          </p>
        </div>
      }
      process={
        <div className="space-y-3">
          <p>
            TCP uses a three-step exchange to synchronize sequence numbers before application data is sent.
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>The client sends a segment with the SYN flag set.</li>
            <li>The server responds with SYN and ACK set together.</li>
            <li>The client sends a final ACK to complete the handshake.</li>
            <li>Only after this do both sides move into the ESTABLISHED state.</li>
          </ol>
        </div>
      }
      tools={
        <div className="space-y-4 text-sm leading-7 text-slate-600">
          <p>
            <span className="font-semibold text-slate-900">SYN</span> means synchronize sequence numbers.
            <span className="ml-2 font-semibold text-slate-900">ACK</span> means the acknowledgment field is valid.
          </p>
          <p>
            The handshake uses these flags to prove both sides are reachable and to establish the starting sequence numbers that make ordered delivery possible.
          </p>
          <p>
            Current phase: <span className="font-semibold text-slate-900">{steps[currentStep].title}</span>
          </p>
        </div>
      }
      visualizationTitle="Packet Flow"
      visualization={
        <div className="space-y-8">
          <div className="overflow-x-auto">
            <svg viewBox="0 0 760 320" className="w-full">
              <NodeLabel x={72} title="Client" state={clientState} accent="#38bdf8" />
              <NodeLabel x={498} title="Server" state={serverState} accent="#2dd4bf" />

              <line x1="182" y1="184" x2="182" y2="292" stroke="#334155" strokeWidth="3" />
              <line x1="578" y1="184" x2="578" y2="292" stroke="#334155" strokeWidth="3" />

              {currentStep >= 1 ? (
                <motion.g
                  initial={false}
                  animate={{ opacity: 1, x: currentStep >= 1 ? 0 : -20 }}
                  transition={{ duration: 0.45 }}
                >
                  <line x1="210" y1="208" x2="548" y2="208" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                  <polygon points="548,208 530,198 530,218" fill="#38bdf8" />
                  <ArrowLabel x={379} y={182} title="SYN" detail="Seq 1200 | Ack 0 | SYN=1 ACK=0" />
                </motion.g>
              ) : null}

              {currentStep >= 2 ? (
                <motion.g
                  initial={false}
                  animate={{ opacity: 1, x: currentStep >= 2 ? 0 : 20 }}
                  transition={{ duration: 0.45 }}
                >
                  <line x1="550" y1="238" x2="212" y2="238" stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round" />
                  <polygon points="212,238 230,228 230,248" fill="#2dd4bf" />
                  <ArrowLabel x={379} y={227} title="SYN-ACK" detail="Seq 8400 | Ack 1201 | SYN=1 ACK=1" />
                </motion.g>
              ) : null}

              {currentStep >= 3 ? (
                <motion.g
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.45 }}
                >
                  <line x1="210" y1="268" x2="548" y2="268" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                  <polygon points="548,268 530,258 530,278" fill="#0f172a" />
                  <ArrowLabel x={379} y={272} title="ACK" detail="Seq 1201 | Ack 8401 | SYN=0 ACK=1" />
                </motion.g>
              ) : null}
            </svg>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Connection state</h3>
            <dl className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Step</dt>
                <dd className="mt-1 font-semibold text-slate-900">{currentStep + 1} / {steps.length}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Phase</dt>
                <dd className="mt-1 font-semibold text-slate-900">{steps[currentStep].title}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Client state</dt>
                <dd className="mt-1 font-semibold text-slate-900">{clientState}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Server state</dt>
                <dd className="mt-1 font-semibold text-slate-900">{serverState}</dd>
              </div>
            </dl>
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
        <div className="space-y-6">
          <ExplanationPanel
            step={steps[currentStep]}
            currentStep={currentStep}
            totalSteps={steps.length}
          />
          <TcpHeaderPreview packet={activePacket} />
        </div>
      }
    />
  );
}

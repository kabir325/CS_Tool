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
  seq: number;
  ack: number;
  headerLength: string;
  window: string;
  flags: {
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
    seq: 1200,
    ack: 0,
    headerLength: "20 bytes",
    window: "64240",
    flags: { urg: 0, ack: 0, psh: 0, rst: 0, syn: 1, fin: 0 },
    note: "The client proposes a starting sequence number and asks to open a TCP connection.",
  },
  2: {
    label: "SYN-ACK Segment",
    from: "Server:443",
    to: "Client:49152",
    seq: 8400,
    ack: 1201,
    headerLength: "20 bytes",
    window: "65535",
    flags: { urg: 0, ack: 1, psh: 0, rst: 0, syn: 1, fin: 0 },
    note: "The server acknowledges the client's SYN and sends its own initial sequence number.",
  },
  3: {
    label: "ACK Segment",
    from: "Client:49152",
    to: "Server:443",
    seq: 1201,
    ack: 8401,
    headerLength: "20 bytes",
    window: "64240",
    flags: { urg: 0, ack: 1, psh: 0, rst: 0, syn: 0, fin: 0 },
    note: "The client confirms the server sequence number and the TCP connection becomes established.",
  },
};

function FlagBit({
  name,
  value,
}: {
  name: string;
  value: 0 | 1;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 py-2 last:border-b-0">
      <span className="font-mono text-sm text-slate-600">{name}</span>
      <span
        className={`inline-flex min-w-8 items-center justify-center rounded px-2 py-0.5 text-sm font-semibold ${
          value === 1
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {value}
      </span>
    </div>
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
              <rect x="92" y="54" width="180" height="112" rx="28" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="488" y="54" width="180" height="112" rx="28" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />

              <text x="157" y="95" fill="#0f172a" fontSize="22" fontWeight="700">
                Client
              </text>
              <text x="552" y="95" fill="#0f172a" fontSize="22" fontWeight="700">
                Server
              </text>
              <text x="142" y="124" fill="#7dd3fc" fontSize="13" fontWeight="700">
                State: {clientState}
              </text>
              <text x="538" y="124" fill="#5eead4" fontSize="13" fontWeight="700">
                State: {serverState}
              </text>

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
                  <text x="352" y="192" fill="#0f172a" fontSize="14" fontWeight="700">
                    SYN
                  </text>
                  <text x="278" y="228" fill="#475569" fontSize="12">
                    Seq=1200, Ack=0, Flags=SYN
                  </text>
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
                  <text x="320" y="224" fill="#0f172a" fontSize="14" fontWeight="700">
                    SYN-ACK
                  </text>
                  <text x="277" y="258" fill="#475569" fontSize="12">
                    Seq=8400, Ack=1201, Flags=SYN,ACK
                  </text>
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
                  <text x="354" y="254" fill="#0f172a" fontSize="14" fontWeight="700">
                    ACK
                  </text>
                  <text x="289" y="288" fill="#475569" fontSize="12">
                    Seq=1201, Ack=8401, Flags=ACK
                  </text>
                </motion.g>
              ) : null}
            </svg>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Connection state</h3>
              <dl className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
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

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900">TCP segment</h3>
              {activePacket ? (
                <>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">{activePacket.label}</p>
                    <p>
                      {activePacket.from}
                      {" -> "}
                      {activePacket.to}
                    </p>
                    <p>{activePacket.note}</p>
                  </div>

                  <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <div>
                      <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Sequence</span>
                      <p className="mt-1 font-mono text-slate-900">{activePacket.seq}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Ack</span>
                      <p className="mt-1 font-mono text-slate-900">{activePacket.ack}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Header length</span>
                      <p className="mt-1 font-mono text-slate-900">{activePacket.headerLength}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Window</span>
                      <p className="mt-1 font-mono text-slate-900">{activePacket.window}</p>
                    </div>
                  </div>

                  <div className="grid gap-x-6 sm:grid-cols-2">
                    <div>
                      <FlagBit name="URG" value={activePacket.flags.urg} />
                      <FlagBit name="ACK" value={activePacket.flags.ack} />
                      <FlagBit name="PSH" value={activePacket.flags.psh} />
                    </div>
                    <div>
                      <FlagBit name="RST" value={activePacket.flags.rst} />
                      <FlagBit name="SYN" value={activePacket.flags.syn} />
                      <FlagBit name="FIN" value={activePacket.flags.fin} />
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-600">
                  No packet is on the wire yet. The server is listening and the client has not sent the opening SYN.
                </p>
              )}
            </div>
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

"use client";

import { motion } from "framer-motion";
import { AnimationControls } from "@/components/topic/AnimationControls";
import { ExplanationPanel } from "@/components/topic/ExplanationPanel";
import { StepIndicator } from "@/components/topic/StepIndicator";
import { TopicLayout } from "@/components/topic/TopicLayout";
import { useAnimationTimeline } from "@/hooks/use-animation-timeline";
import type { TopicStep } from "@/types/topic";

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
        <ol className="list-decimal space-y-2 pl-5">
          <li>The client sends a SYN.</li>
          <li>The server replies with SYN-ACK.</li>
          <li>The client responds with ACK.</li>
          <li>Both sides move into the ESTABLISHED state.</li>
        </ol>
      }
      tools={
        <div className="space-y-4">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">Packet meanings</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p><span className="font-medium text-slate-900">SYN:</span> Start the connection.</p>
              <p><span className="font-medium text-slate-900">SYN-ACK:</span> Confirm the SYN and send the server sequence number.</p>
              <p><span className="font-medium text-slate-900">ACK:</span> Confirm the server response and finish setup.</p>
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Current focus: <span className="font-medium text-slate-900">{steps[currentStep].title}</span>
          </div>
        </div>
      }
      visualization={
        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-slate-200 p-4">
            <svg viewBox="0 0 760 320" className="w-full">
              <rect x="92" y="54" width="180" height="112" rx="28" fill="#ffffff" stroke="#38bdf8" strokeWidth="2" />
              <rect x="488" y="54" width="180" height="112" rx="28" fill="#ffffff" stroke="#2dd4bf" strokeWidth="2" />

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
                </motion.g>
              ) : null}
            </svg>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Step", value: `${currentStep + 1} / ${steps.length}` },
              { label: "Current phase", value: steps[currentStep].title },
              { label: "Client state", value: clientState },
              { label: "Server state", value: serverState },
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

"use client";

import { useEffect, useMemo, useState } from "react";
import { TopicLayout } from "@/components/topic/TopicLayout";
import {
  generateEqualSubnets,
  getSubnetDetails,
  parseIpv4Network,
  planSubnetPrefixFromHostCount,
  planSubnetPrefixFromSubnetCount,
} from "@/lib/ipv4";

const FALLBACK_NETWORK = "192.168.10.0/24";
const DOT_PREVIEW_COUNT = 64;
const MAX_PREVIEW_SUBNETS = 8;
const MAX_TABLE_SUBNETS = 16;
const subnetPreviewColors = [
  "bg-slate-900",
  "bg-slate-700",
  "bg-slate-500",
  "bg-slate-400",
  "bg-slate-600",
  "bg-slate-800",
];

export function SubnettingExperience() {
  const [networkInput, setNetworkInput] = useState(FALLBACK_NETWORK);
  const parsedNetwork = useMemo(() => parseIpv4Network(networkInput), [networkInput]);
  const [mode, setMode] = useState<"subnet" | "hosts" | "subnets">("subnet");
  const [targetPrefixInput, setTargetPrefixInput] = useState(26);
  const [desiredSubnets, setDesiredSubnets] = useState(4);
  const [desiredHosts, setDesiredHosts] = useState(62);
  const [appliedTargetPrefix, setAppliedTargetPrefix] = useState(26);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    if (!parsedNetwork) {
      setHasGenerated(false);
      return;
    }

    setTargetPrefixInput((current) => Math.max(current, parsedNetwork.basePrefix));
    setAppliedTargetPrefix((current) => Math.max(current, parsedNetwork.basePrefix));
    setHasGenerated(false);
    setError(null);
  }, [parsedNetwork]);

  function handleGenerate() {
    if (!parsedNetwork) {
      setError("Enter a valid IPv4 network in CIDR notation.");
      return;
    }

    if (mode === "subnet") {
      const safePrefix = Math.min(
        Math.max(targetPrefixInput, parsedNetwork.basePrefix),
        30,
      );

      setAppliedTargetPrefix(safePrefix);
      setError(null);
      setHasGenerated(true);
      return;
    }

    const plan =
      mode === "hosts"
        ? planSubnetPrefixFromHostCount(parsedNetwork.basePrefix, desiredHosts)
        : planSubnetPrefixFromSubnetCount(parsedNetwork.basePrefix, desiredSubnets);

    if (!plan) {
      setError(
        mode === "hosts"
          ? "That host requirement does not fit inside the parent network. Lower the host count or start from a larger network."
          : "That subnet requirement does not fit inside the parent network. Lower the subnet count or start from a larger network.",
      );
      return;
    }

    setAppliedTargetPrefix(plan.targetPrefix);
    setError(null);
    setHasGenerated(true);
  }

  if (!parsedNetwork) {
    return (
      <TopicLayout
        sectionTitle="Networking"
        title="Subnetting"
        introduction="Subnetting divides one IPv4 network into smaller networks so you can control address usage, host ranges, and broadcast boundaries."
        overview={
          <>
            <p>
              The idea is simple: take host bits, turn them into subnet bits, and then recalculate the range for each smaller network.
            </p>
          </>
        }
        process={
          <ol className="list-decimal space-y-2 pl-5">
            <li>Start with one parent network and its prefix length.</li>
            <li>Borrow bits from the host portion to create smaller networks.</li>
            <li>Each smaller network gets its own network address, host range, and broadcast address.</li>
            <li>The first and last addresses in every subnet are reserved.</li>
          </ol>
        }
        tools={
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-900">IPv4 network</span>
              <input
                value={networkInput}
                onChange={(event) => setNetworkInput(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="192.168.10.0/24"
              />
            </label>
            <p className="text-sm text-rose-600">
              Enter a valid network in CIDR notation, for example `192.168.10.0/24`.
            </p>
          </div>
        }
        visualization={
          <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            The visualizer appears as soon as the network is valid.
          </div>
        }
        visualizationTitle="Address Space"
      />
    );
  }

  const effectivePrefix = Math.max(appliedTargetPrefix, parsedNetwork.basePrefix);
  const borrowedBits = effectivePrefix - parsedNetwork.basePrefix;
  const totalSubnets = 2 ** borrowedBits;
  const previewSubnetCount = Math.min(totalSubnets, MAX_PREVIEW_SUBNETS);
  const previewSubnets = generateEqualSubnets(
    parsedNetwork.normalizedIp,
    parsedNetwork.basePrefix,
    effectivePrefix,
    previewSubnetCount,
  );
  const firstSubnet = getSubnetDetails(parsedNetwork.normalizedIp, effectivePrefix);
  const addressesPerSubnet = firstSubnet.hostCount;
  const dotsPerSubnet = Math.max(4, Math.floor(DOT_PREVIEW_COUNT / previewSubnetCount));
  const shownTableRows = generateEqualSubnets(
    parsedNetwork.normalizedIp,
    parsedNetwork.basePrefix,
    effectivePrefix,
    Math.min(totalSubnets, MAX_TABLE_SUBNETS),
  );

  return (
    <TopicLayout
      sectionTitle="Networking"
      title="Subnetting"
      introduction="Use this page to understand the subnetting process and then generate equal-sized subnets from an IPv4 network."
      overview={
        <div className="space-y-3">
          <p>
            Subnetting is the act of taking a parent network and cutting it into smaller equal-sized blocks. Each block gets its own network address, usable host range, and broadcast address.
          </p>
          <p>
            The key tradeoff is always the same: more subnets means fewer usable hosts inside each subnet.
          </p>
        </div>
      }
      process={
        <div className="space-y-3">
          <p>Subnetting works like this:</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>A parent network contains one continuous address range.</li>
            <li>When you increase the prefix length, that range is split into smaller equal-sized networks.</li>
            <li>Every subnet reserves the first address as the network address and the last address as the broadcast address.</li>
            <li>The remaining addresses in the middle are usable by hosts.</li>
            <li>More subnets means smaller host ranges inside each subnet.</li>
          </ol>
        </div>
      }
      tools={
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-900">Parent network</span>
              <input
                value={networkInput}
                onChange={(event) => setNetworkInput(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="192.168.10.0/24"
              />
              <span className="text-xs text-slate-500">
                Example: `192.168.10.0/24`
              </span>
            </label>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Current parent network</p>
              <p className="mt-2 text-sm text-slate-600">{parsedNetwork.cidrInput}</p>
              <p className="mt-1 text-xs text-slate-500">
                Base prefix: /{parsedNetwork.basePrefix}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("subnet")}
              className={`rounded-md border px-3 py-2 text-sm font-medium ${
                mode === "subnet"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              Based on subnet
            </button>
            <button
              type="button"
              onClick={() => setMode("hosts")}
              className={`rounded-md border px-3 py-2 text-sm font-medium ${
                mode === "hosts"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              Based on number of hosts
            </button>
            <button
              type="button"
              onClick={() => setMode("subnets")}
              className={`rounded-md border px-3 py-2 text-sm font-medium ${
                mode === "subnets"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              Based on number of subnets
            </button>
          </div>

          {mode === "subnet" ? (
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-900">Target subnet prefix</span>
                <input
                  type="number"
                  min={parsedNetwork.basePrefix}
                  max={30}
                  value={targetPrefixInput}
                  onChange={(event) => setTargetPrefixInput(Number(event.target.value))}
                  className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                />
              </label>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="rounded-md border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-medium text-white"
                >
                  Generate subnets
                </button>
              </div>
            </div>
          ) : mode === "hosts" ? (
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-900">
                  Usable hosts needed in each subnet
                </span>
                <input
                  type="number"
                  min={1}
                  value={desiredHosts}
                  onChange={(event) => setDesiredHosts(Number(event.target.value))}
                  className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                />
              </label>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="rounded-md border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-medium text-white"
                >
                  Generate subnets
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-900">How many subnets?</span>
                <input
                  type="number"
                  min={1}
                  value={desiredSubnets}
                  onChange={(event) => setDesiredSubnets(Number(event.target.value))}
                  className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                />
              </label>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="rounded-md border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-medium text-white"
                >
                  Generate subnets
                </button>
              </div>
            </div>
          )}

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>
      }
      visualizationTitle="Address Space"
      visualization={
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-900">Address space preview</p>
            <p className="mt-1 text-sm text-slate-600">
              Dots represent the address range conceptually. After generation, the dots are grouped and colored by subnet.
            </p>

            {!hasGenerated ? (
              <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 text-sm font-medium text-slate-700">
                  Parent network: {parsedNetwork.cidrInput}
                </div>
                <div className="grid grid-cols-8 gap-2 sm:grid-cols-16">
                  {Array.from({ length: DOT_PREVIEW_COUNT }, (_, index) => (
                    <span
                      key={index}
                      className="h-3 w-3 rounded-full bg-slate-500"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {previewSubnets.map((subnet, index) => (
                  <div
                    key={subnet.cidr}
                    className="rounded-md border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex h-3 w-3 rounded-full ${
                            subnetPreviewColors[index % subnetPreviewColors.length]
                          }`}
                        />
                        <p className="text-sm font-medium text-slate-900">{subnet.cidr}</p>
                      </div>
                      <p className="text-xs text-slate-500">
                        {subnet.usableHosts.toLocaleString()} usable hosts
                      </p>
                    </div>
                    <div className="mt-3 rounded-md border border-slate-200 bg-white p-3">
                      <div className="grid grid-cols-8 gap-2">
                        {Array.from({ length: dotsPerSubnet }, (_, dotIndex) => {
                          const isReserved =
                            dotIndex === 0 || dotIndex === dotsPerSubnet - 1;

                          return (
                            <span
                              key={`${subnet.cidr}-${dotIndex}`}
                              className={`h-3 w-3 rounded-full ${
                                isReserved
                                  ? "bg-rose-500"
                                  : subnetPreviewColors[index % subnetPreviewColors.length]
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-6 text-slate-500">
                      Reserved: {subnet.networkAddress} (network) and {subnet.broadcastAddress} (broadcast)
                    </p>
                  </div>
                ))}
              </div>
            )}

            {hasGenerated && totalSubnets > previewSubnetCount ? (
              <p className="mt-4 text-xs text-slate-500">
                Showing the first {previewSubnetCount} subnet groups out of {totalSubnets.toLocaleString()} total subnets.
              </p>
            ) : null}
          </div>

          {hasGenerated ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Parent network", value: parsedNetwork.cidrInput },
                  { label: "Generated prefix", value: `/${effectivePrefix}` },
                  { label: "Subnets created", value: totalSubnets.toLocaleString() },
                  { label: "Addresses per subnet", value: addressesPerSubnet.toLocaleString() },
                  { label: "Usable hosts per subnet", value: firstSubnet.usableHosts.toLocaleString() },
                  { label: "First subnet host range", value: firstSubnet.hostRange },
                  { label: "Reserved network", value: firstSubnet.networkAddress },
                  { label: "Reserved broadcast", value: firstSubnet.broadcastAddress },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-md border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-200">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">Generated subnets</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Showing the first {shownTableRows.length} subnet{shownTableRows.length === 1 ? "" : "s"}.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-white">
                      <tr className="text-left text-slate-500">
                        <th className="px-4 py-3 font-medium">Subnet</th>
                        <th className="px-4 py-3 font-medium">Network</th>
                        <th className="px-4 py-3 font-medium">First host</th>
                        <th className="px-4 py-3 font-medium">Last host</th>
                        <th className="px-4 py-3 font-medium">Broadcast</th>
                        <th className="px-4 py-3 font-medium">Reserved addresses</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {shownTableRows.map((subnet) => (
                        <tr key={subnet.cidr}>
                          <td className="px-4 py-3 text-slate-700">{subnet.id}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">{subnet.cidr}</td>
                          <td className="px-4 py-3 text-slate-700">{subnet.firstHostAddress}</td>
                          <td className="px-4 py-3 text-slate-700">{subnet.lastHostAddress}</td>
                          <td className="px-4 py-3 text-slate-700">{subnet.broadcastAddress}</td>
                          <td className="px-4 py-3 text-slate-700">
                            {subnet.networkAddress}, {subnet.broadcastAddress}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      }
    />
  );
}

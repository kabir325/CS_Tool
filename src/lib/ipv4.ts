export type ParsedIpv4Network = {
  cidrInput: string;
  basePrefix: number;
  normalizedIp: number;
  normalizedAddress: string;
};

export type SubnetPlanResult = {
  targetPrefix: number;
  totalSubnets: number;
  usableHostsPerSubnet: number;
  reason: string;
};

export function parseIpv4Network(input: string): ParsedIpv4Network | null {
  const [rawIp, rawPrefix] = input.trim().split("/");
  const octets = rawIp.split(".");

  if (octets.length !== 4) {
    return null;
  }

  const parsedOctets = octets.map((octet) => Number(octet));

  if (parsedOctets.some((octet) => Number.isNaN(octet) || octet < 0 || octet > 255)) {
    return null;
  }

  const basePrefix = rawPrefix === undefined ? 24 : Number(rawPrefix);

  if (Number.isNaN(basePrefix) || basePrefix < 1 || basePrefix > 30) {
    return null;
  }

  const ipNumber = ipToNumber(parsedOctets);
  const normalizedIp = getNetworkAddressNumber(ipNumber, basePrefix);

  return {
    cidrInput: `${numberToIp(normalizedIp)}/${basePrefix}`,
    basePrefix,
    normalizedIp,
    normalizedAddress: numberToIp(normalizedIp),
  };
}

export function getSubnetDetails(networkNumber: number, prefix: number) {
  const hostCount = 2 ** (32 - prefix);
  const broadcastNumber = networkNumber + hostCount - 1;
  const firstHostNumber = hostCount > 2 ? networkNumber + 1 : networkNumber;
  const lastHostNumber = hostCount > 2 ? broadcastNumber - 1 : broadcastNumber;

  return {
    networkAddress: numberToIp(networkNumber),
    broadcastAddress: numberToIp(broadcastNumber),
    firstHostAddress: numberToIp(firstHostNumber),
    lastHostAddress: numberToIp(lastHostNumber),
    hostRange:
      hostCount > 2
        ? `${numberToIp(firstHostNumber)} - ${numberToIp(lastHostNumber)}`
        : "Point-to-point subnet",
    usableHosts: prefix >= 31 ? 0 : Math.max(hostCount - 2, 0),
    hostCount,
  };
}

export function generateEqualSubnets(
  baseNetworkNumber: number,
  basePrefix: number,
  targetPrefix: number,
  limit?: number,
) {
  const totalSubnets = 2 ** (targetPrefix - basePrefix);
  const blockSize = 2 ** (32 - targetPrefix);
  const subnetCountToGenerate = limit ? Math.min(totalSubnets, limit) : totalSubnets;

  return Array.from({ length: subnetCountToGenerate }, (_, index) => {
    const subnetNetworkNumber = baseNetworkNumber + index * blockSize;
    const details = getSubnetDetails(subnetNetworkNumber, targetPrefix);

    return {
      id: index + 1,
      prefix: targetPrefix,
      cidr: `${details.networkAddress}/${targetPrefix}`,
      ...details,
    };
  });
}

export function planSubnetPrefixFromRequirements(
  basePrefix: number,
  subnetCount: number,
  hostsPerSubnet: number,
): SubnetPlanResult | null {
  const requiredSubnetBits =
    subnetCount > 1 ? Math.ceil(Math.log2(Math.max(subnetCount, 1))) : 0;
  const targetPrefix = basePrefix + requiredSubnetBits;

  if (targetPrefix > 30) {
    return null;
  }

  const usableHostsPerSubnet = getSubnetDetails(0, targetPrefix).usableHosts;

  if (usableHostsPerSubnet < hostsPerSubnet) {
    return null;
  }

  return {
    targetPrefix,
    totalSubnets: 2 ** requiredSubnetBits,
    usableHostsPerSubnet,
    reason:
      subnetCount > 1 || hostsPerSubnet > 0
        ? `Need ${subnetCount} subnet${subnetCount === 1 ? "" : "s"} with at least ${hostsPerSubnet} usable host${hostsPerSubnet === 1 ? "" : "s"} each.`
        : "Uses the original network size.",
  };
}

export function planSubnetPrefixFromSubnetCount(
  basePrefix: number,
  subnetCount: number,
): SubnetPlanResult | null {
  const safeSubnetCount = Math.max(1, subnetCount);
  const subnetBits = safeSubnetCount > 1 ? Math.ceil(Math.log2(safeSubnetCount)) : 0;
  const targetPrefix = basePrefix + subnetBits;

  if (targetPrefix > 30) {
    return null;
  }

  return {
    targetPrefix,
    totalSubnets: 2 ** subnetBits,
    usableHostsPerSubnet: getSubnetDetails(0, targetPrefix).usableHosts,
    reason: `Need at least ${safeSubnetCount} subnet${safeSubnetCount === 1 ? "" : "s"}.`,
  };
}

export function planSubnetPrefixFromHostCount(
  basePrefix: number,
  hostsPerSubnet: number,
): SubnetPlanResult | null {
  const safeHostsPerSubnet = Math.max(1, hostsPerSubnet);
  const requiredHostBits = Math.ceil(Math.log2(safeHostsPerSubnet + 2));
  const targetPrefix = 32 - requiredHostBits;

  if (targetPrefix < basePrefix || targetPrefix > 30) {
    return null;
  }

  return {
    targetPrefix,
    totalSubnets: 2 ** (targetPrefix - basePrefix),
    usableHostsPerSubnet: getSubnetDetails(0, targetPrefix).usableHosts,
    reason: `Need at least ${safeHostsPerSubnet} usable host${safeHostsPerSubnet === 1 ? "" : "s"} per subnet.`,
  };
}

export function getNetworkAddressNumber(ipNumber: number, prefix: number) {
  const mask = prefixToMask(prefix);
  return (ipNumber & mask) >>> 0;
}

export function numberToIp(value: number) {
  return [24, 16, 8, 0]
    .map((shift) => (value >>> shift) & 255)
    .join(".");
}

function ipToNumber(octets: number[]) {
  return (
    (((octets[0] << 24) >>> 0) |
      ((octets[1] << 16) >>> 0) |
      ((octets[2] << 8) >>> 0) |
      octets[3]) >>>
    0
  );
}

function prefixToMask(prefix: number) {
  if (prefix <= 0) {
    return 0;
  }

  if (prefix >= 32) {
    return 0xffffffff;
  }

  return (0xffffffff << (32 - prefix)) >>> 0;
}

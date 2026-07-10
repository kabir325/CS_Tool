export type ParsedIpv4Network = {
  cidrInput: string;
  basePrefix: number;
  normalizedIp: number;
  normalizedAddress: string;
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
    hostRange:
      hostCount > 2
        ? `${numberToIp(firstHostNumber)} - ${numberToIp(lastHostNumber)}`
        : "Point-to-point subnet",
    usableHosts: prefix >= 31 ? 0 : Math.max(hostCount - 2, 0),
    hostCount,
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

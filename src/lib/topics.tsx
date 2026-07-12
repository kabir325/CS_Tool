import { ArrowRightLeft, Network, Route, SplitSquareVertical } from "lucide-react";
import { NatExperience } from "@/components/topics/NatExperience";
import { SubnettingExperience } from "@/components/topics/SubnettingExperience";
import { TcpHandshakeExperience } from "@/components/topics/TcpHandshakeExperience";
import { VlansExperience } from "@/components/topics/VlansExperience";
import type { TopicDefinition, TopicSection } from "@/types/topic";

const networkingTopics: TopicDefinition[] = [
  {
    sectionSlug: "networking",
    slug: "subnetting",
    title: "Subnetting",
    description:
      "Split an IPv4 network into smaller equal-sized networks and inspect ranges, usable hosts, and reserved addresses.",
    introduction:
      "Subnetting divides one large IPv4 network into smaller networks so address usage, broadcast scope, and segmentation become easier to control.",
    icon: SplitSquareVertical,
    component: SubnettingExperience,
  },
  {
    sectionSlug: "networking",
    slug: "vlans",
    title: "VLANs",
    description:
      "Understand how one switch can create separate Layer 2 domains and contain broadcasts inside each VLAN.",
    introduction:
      "VLANs let the same physical switch behave like multiple separate switches by grouping ports into logical networks.",
    icon: Network,
    component: VlansExperience,
    isVisible: false,
  },
  {
    sectionSlug: "networking",
    slug: "tcp-three-way-handshake",
    title: "TCP Three-Way Handshake",
    description:
      "Follow SYN, SYN-ACK, and ACK and see how both peers reach an established TCP connection.",
    introduction:
      "The three-way handshake is the process TCP uses to synchronize sequence numbers and confirm both sides are ready.",
    icon: ArrowRightLeft,
    component: TcpHandshakeExperience,
  },
  {
    sectionSlug: "networking",
    slug: "nat",
    title: "Network Address Translation (NAT)",
    description:
      "See how a router rewrites private source addresses into a public IP and uses a NAT table to map replies back to the right host.",
    introduction:
      "NAT allows multiple private hosts to share one public IPv4 address by translating source addresses and tracking active flows.",
    icon: Route,
    component: NatExperience,
  },
];

export const topicSections: TopicSection[] = [
  {
    slug: "networking",
    title: "Networking",
    description: "Core networking concepts and packet flow visualizations.",
    topics: networkingTopics,
  },
];

export const topics = topicSections.flatMap((section) => section.topics);
export const visibleTopicSections: TopicSection[] = topicSections
  .map((section) => ({
    ...section,
    topics: section.topics.filter((topic) => topic.isVisible !== false),
  }))
  .filter((section) => section.topics.length > 0);

export function getSectionBySlug(slug: string) {
  return topicSections.find((section) => section.slug === slug);
}

export function getTopicBySlug(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}

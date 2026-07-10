import { ArrowRightLeft, Network, SplitSquareVertical } from "lucide-react";
import { SubnettingExperience } from "@/components/topics/SubnettingExperience";
import { TcpHandshakeExperience } from "@/components/topics/TcpHandshakeExperience";
import { VlansExperience } from "@/components/topics/VlansExperience";
import type { TopicDefinition } from "@/types/topic";

export const topics: TopicDefinition[] = [
  {
    slug: "subnetting",
    title: "Subnetting",
    description:
      "Borrow bits, divide address space, and see network boundaries change as the prefix moves.",
    difficulty: "Beginner",
    readingTime: "7 min read",
    introduction:
      "Follow the network block as it splits into smaller subnets and updates the network address, broadcast address, and usable host range.",
    icon: SplitSquareVertical,
    component: SubnettingExperience,
  },
  {
    slug: "vlans",
    title: "VLANs",
    description:
      "Visualize how a switch isolates broadcasts when access ports are assigned to different VLAN IDs.",
    difficulty: "Intermediate",
    readingTime: "6 min read",
    introduction:
      "Toggle VLAN mode, assign ports, and broadcast a packet to see how segmentation reshapes the Layer 2 domain.",
    icon: Network,
    component: VlansExperience,
  },
  {
    slug: "tcp-three-way-handshake",
    title: "TCP Three-Way Handshake",
    description:
      "Step through SYN, SYN-ACK, and ACK to understand how both peers reach an established state.",
    difficulty: "Beginner",
    readingTime: "5 min read",
    introduction:
      "Watch the TCP connection setup sequence unfold and track how client and server states change at each step.",
    icon: ArrowRightLeft,
    component: TcpHandshakeExperience,
  },
];

export function getTopicBySlug(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}

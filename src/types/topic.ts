import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

export type TopicStep = {
  title: string;
  description: string;
};

export type TopicDefinition = {
  sectionSlug: string;
  slug: string;
  title: string;
  description: string;
  introduction: string;
  icon: LucideIcon;
  component: ComponentType;
  isVisible?: boolean;
};

export type TopicSection = {
  slug: string;
  title: string;
  description: string;
  topics: TopicDefinition[];
};

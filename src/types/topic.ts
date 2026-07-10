import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

export type TopicDifficulty = "Beginner" | "Intermediate";

export type TopicStep = {
  title: string;
  description: string;
};

export type TopicDefinition = {
  slug: string;
  title: string;
  description: string;
  difficulty: TopicDifficulty;
  readingTime: string;
  introduction: string;
  icon: LucideIcon;
  component: ComponentType;
};

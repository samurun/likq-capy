import { Capy } from "./capy";
import { ARCHETYPES } from "@/lib/quiz/archetypes";
import { ACCENT_TEXT } from "@/lib/quiz/accent";
import type { ArchetypeId } from "@/lib/quiz/types";
import { cn } from "@/lib/utils";

const EYES: Record<ArchetypeId, "open" | "closed" | "happy"> = {
  "zen-master": "closed",
  "foodie-lounger": "happy",
  "adventure-seeker": "open",
  "social-bather": "happy",
  "lone-floater": "closed",
  "hot-spring-sage": "closed",
  sunbather: "happy",
  "night-owl": "open",
};

export function ArchetypeIllustration({
  id,
  className,
  title,
}: {
  id: ArchetypeId;
  className?: string;
  title?: string;
}) {
  const archetype = ARCHETYPES[id];
  return (
    <Capy
      accessory={archetype.accessory}
      eyes={EYES[id]}
      title={title}
      className={cn(className)}
      accentClassName={ACCENT_TEXT[archetype.accent]}
    />
  );
}

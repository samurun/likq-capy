import { getMascot } from "./registry";
import { ARCHETYPES } from "@/lib/quiz/archetypes";
import { ACCENT_TEXT } from "@/lib/quiz/accent";
import { activeTheme } from "@/lib/themes/active";
import type { ArchetypeId } from "@/lib/quiz/types";
import { cn } from "@/lib/utils";

const Mascot = getMascot(activeTheme.mascotId).Component;

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
  const expression = archetype.mascot.expression as
    | "open"
    | "closed"
    | "happy"
    | undefined;
  return (
    <Mascot
      variant={archetype.mascot.variant}
      expression={expression}
      title={title}
      className={cn(className)}
      accentClassName={ACCENT_TEXT[archetype.accent]}
    />
  );
}

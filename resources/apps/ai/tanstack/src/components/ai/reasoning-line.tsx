import { useStopWatch } from "#/hooks/ai/use-stop-watch";
import { LoaderCircleIcon, CircleCheckIcon } from "lucide-react";
import { useState } from "react";
import {
  TraceLine,
  TraceIcon,
  TraceTitle,
  TraceDescription,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
} from "#/components/ui/trace";
import { Markdown } from "#/components/ai/markdown-wrapper";

export function ReasoningLine({
  text,
  thinking,
}: {
  text: string;
  thinking: boolean;
}) {
  const [open, setOpen] = useState<boolean>();
  const duration = useStopWatch(thinking);

  const line = (
    <TraceLine status={thinking ? "running" : undefined}>
      <TraceIcon>
        {thinking ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          <CircleCheckIcon />
        )}
      </TraceIcon>
      <TraceTitle>{thinking ? "Thinking" : "Done thinking"}</TraceTitle>
      {duration && (
        <TraceDescription>{Math.ceil(duration / 1000)}s</TraceDescription>
      )}
    </TraceLine>
  );

  if (text.length === 0) {
    return line;
  }

  return (
    <TraceCollapsible
      defaultOpen
      open={open ?? thinking}
      onOpenChange={setOpen}
    >
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">
        <Markdown>{text}</Markdown>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

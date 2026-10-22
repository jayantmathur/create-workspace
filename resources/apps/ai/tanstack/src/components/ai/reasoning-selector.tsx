import { BrainIcon } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "#/components/ui/combobox";
import { REASONING_EFFORTS, type ReasoningEffort } from "#/agents/types";
import { InputGroupAddon } from "#/components/ui/input-group";
import { actions } from "#/components/ai/stream-provider";

type ReasoningSelectorProps = {
  disabled?: boolean;
  onSelection?: (reasoning: ReasoningEffort) => void;
};

function toSentenceCase(value: string): string {
  return value
    .toLowerCase()
    .replace(
      /(^|[.!?]\s+)(\p{L})/gu,
      (_, prefix: string, letter: string) => prefix + letter.toUpperCase(),
    );
}

export const ReasoningSelector = ({
  disabled = false,
  onSelection,
}: ReasoningSelectorProps) => {
  const { updateAI } = actions;
  const handleReasoningSelect = (reasoning: ReasoningEffort) => {
    updateAI({ reasoning: reasoning });
    onSelection?.(reasoning);
  };

  return (
    <Combobox
      id="reasoning-dropdown"
      items={REASONING_EFFORTS}
      itemToStringLabel={(item) => toSentenceCase(item!)}
      onValueChange={(value: ReasoningEffort | null) =>
        value && handleReasoningSelect(value)
      }
      disabled={disabled}
      autoHighlight
    >
      <ComboboxInput
        className="max-w-48"
        placeholder="Reasoning Effort"
        // showClear
      >
        <InputGroupAddon>
          <BrainIcon />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent>
        <ComboboxEmpty>No values found.</ComboboxEmpty>
        <ComboboxList>
          {(item: ReasoningEffort) => (
            <ComboboxItem key={item} value={item}>
              {toSentenceCase(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

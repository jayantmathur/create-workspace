import { BrainIcon } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";
import { REASONING_EFFORTS, type ReasoningEffort } from "#/lib/ai/types";
import { InputGroupAddon } from "./ui/input-group";

type ReasoningSelectorProps = {
  disabled: boolean;
  onSelection?: (effort: ReasoningEffort) => void;
};

export const ReasoningSelector = ({
  disabled,
  onSelection,
}: ReasoningSelectorProps) => {
  const handleReasoningSelect = (effort: ReasoningEffort) => {
    onSelection?.(effort);
  };

  return (
    <Combobox
      items={REASONING_EFFORTS}
      onValueChange={(value: ReasoningEffort | null) =>
        value && handleReasoningSelect(value)
      }
      disabled={disabled}
      autoHighlight
    >
      <ComboboxInput
        className="max-w-48"
        placeholder="Reasoning Effort"
        showClear
      >
        <InputGroupAddon>
          <BrainIcon />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent>
        <ComboboxEmpty>No providers found.</ComboboxEmpty>
        <ComboboxList>
          {(item: ReasoningEffort) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

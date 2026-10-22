import { SparkleIcon } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "#/components/ui/combobox";
import { LIST_OF_MODELS } from "#/agents/models";
import type { SelectableModel } from "#/agents/types";
import { InputGroupAddon } from "#/components/ui/input-group";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "#/components/ui/item";
import { actions } from "#/components/ai/stream-provider";

type ModelSelectorProps = {
  disabled?: boolean;
  onSelection?: (model: SelectableModel) => void;
};

export const ModelSelector = ({
  disabled = false,
  onSelection,
}: ModelSelectorProps) => {
  const { updateAI } = actions;
  const handleModelSelect = (model: SelectableModel) => {
    updateAI({ model: model });
    onSelection?.(model);
  };

  return (
    <Combobox
      id="model-dropdown"
      items={LIST_OF_MODELS}
      itemToStringLabel={({ metadata: { chef } }: SelectableModel) => chef}
      onValueChange={(value) => value && handleModelSelect(value)}
      disabled={disabled}
      autoHighlight
    >
      <ComboboxInput
        className="max-w-48"
        placeholder="AI Provider"
        // showClear
      >
        <InputGroupAddon>
          <SparkleIcon />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent>
        <ComboboxEmpty>No providers found.</ComboboxEmpty>
        <ComboboxList>
          {(item: SelectableModel) => {
            const {
              metadata: { chef, chefSlug, name, default: isDefault },
            } = item;
            return (
              <ComboboxItem key={`${chefSlug}-${name}`} value={item}>
                <Item size="xs" className="p-0">
                  <ItemContent>
                    <ItemTitle className="whitespace-nowrap">{chef}</ItemTitle>
                    <ItemDescription>{name}</ItemDescription>
                    {isDefault && (
                      <span className="text-xs text-muted">(Default)</span>
                    )}
                  </ItemContent>
                </Item>
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

import { SparkleIcon } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";
import { LIST_OF_MODELS } from "#/lib/ai/models";
import type { SelectableModel } from "#/lib/ai/types";
import { InputGroupAddon } from "./ui/input-group";
import { Item, ItemContent, ItemTitle, ItemDescription } from "./ui/item";

type ModelSelectorProps = {
  disabled: boolean;
  onSelection?: (model: SelectableModel) => void;
};

export const ModelSelector = ({
  disabled,
  onSelection,
}: ModelSelectorProps) => {
  const handleModelSelect = (model: SelectableModel) => {
    onSelection?.(model);
  };

  return (
    <Combobox
      items={LIST_OF_MODELS}
      itemToStringLabel={({ metadata: { chef } }: SelectableModel) => chef}
      onValueChange={(value) => value && handleModelSelect(value)}
      disabled={disabled}
      autoHighlight
    >
      <ComboboxInput className="max-w-48" placeholder="AI Provider" showClear>
        <InputGroupAddon>
          <SparkleIcon />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent>
        <ComboboxEmpty>No providers found.</ComboboxEmpty>
        <ComboboxList>
          {(item: SelectableModel) => {
            const {
              metadata: { chef, chefSlug, name },
            } = item;
            return (
              <ComboboxItem key={`${chefSlug}-${name}`} value={item}>
                <Item size="xs" className="p-0">
                  <ItemContent>
                    <ItemTitle className="whitespace-nowrap">{chef}</ItemTitle>
                    <ItemDescription>{name}</ItemDescription>
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

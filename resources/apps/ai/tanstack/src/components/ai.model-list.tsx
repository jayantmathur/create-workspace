import { useState } from "react";
import { CheckIcon } from "lucide-react";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "#/components/ai-elements/model-selector";
import { Button } from "#/components/ui/button";
import {
  DEFAULT_MODEL,
  LIST_OF_MODELS,
  type SelectedModel,
} from "#/lib/ai/chat/models";

export const ModelList = ({
  onModelSelect,
}: {
  onModelSelect: (model: SelectedModel) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] =
    useState<SelectedModel>(DEFAULT_MODEL);

  const handleModelSelect = (model: SelectedModel) => {
    setSelectedModel(model);
    onModelSelect?.(model);
    setOpen(false);
  };

  // Get unique chefs in order of appearance
  const chefs = [...new Set(LIST_OF_MODELS.map((model) => model.chef))];

  return (
    <ModelSelector onOpenChange={setOpen} open={open}>
      <ModelSelectorTrigger asChild>
        <Button className="w-56 max-w-sm justify-between" variant="ghost">
          {selectedModel?.chefSlug && (
            <ModelSelectorLogo provider={selectedModel.chefSlug} />
          )}
          {selectedModel?.name && (
            <ModelSelectorName>{selectedModel.name}</ModelSelectorName>
          )}
        </Button>
      </ModelSelectorTrigger>
      <ModelSelectorContent>
        <ModelSelectorInput placeholder="Search models..." />
        <ModelSelectorList>
          <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
          {chefs.map((chef) => (
            <ModelSelectorGroup heading={chef} key={chef}>
              {LIST_OF_MODELS.filter((model) => model.chef === chef).map(
                (model) => (
                  <ModelSelectorItem
                    key={model.name}
                    onSelect={() => handleModelSelect(model)}
                    value={model.name}
                  >
                    <ModelSelectorLogo provider={model.chefSlug} />
                    <ModelSelectorName>{model.name}</ModelSelectorName>
                    <ModelSelectorLogoGroup>
                      {model.providers.map(({ id, inference }) => (
                        <ModelSelectorLogo
                          key={`${inference}:${id}`}
                          provider={inference}
                        />
                      ))}
                    </ModelSelectorLogoGroup>
                    {selectedModel.name === model.name ? (
                      <CheckIcon className="ml-auto size-4" />
                    ) : (
                      <div className="ml-auto size-4" />
                    )}
                  </ModelSelectorItem>
                ),
              )}
            </ModelSelectorGroup>
          ))}
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  );
};

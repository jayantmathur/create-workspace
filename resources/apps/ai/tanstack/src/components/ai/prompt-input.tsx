import { useForm } from "@tanstack/react-form";
import { ArrowUpIcon, Square } from "lucide-react";
import * as z from "zod";
import type { ComponentProps } from "react";
import type { ChatClientState } from "@tanstack/ai-client";
import { cn } from "#/lib/utils";
import { Spinner } from "#/components/ui/spinner";
import { Field, FieldError } from "#/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "#/components/ui/input-group";
import { ModelSelector } from "#/components/ai/model-selector";
import { ReasoningSelector } from "#/components/ai/reasoning-selector";

const formId = "ai-prompt-input";

type PromptInputProps = Omit<ComponentProps<"form">, "onSubmit"> & {
  status: ChatClientState;
  onSubmit: (text: string) => void;
  onStop: () => void;
};

const formSchema = z.object({
  description: z.string(),
});

export function PromptInput({
  className,
  onSubmit,
  onStop,
  status,
}: PromptInputProps) {
  const form = useForm({
    defaultValues: {
      description: "",
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value: { description } }) => {
      onSubmit?.(description);
      form.reset();
    },
  });

  return (
    <form
      id={formId}
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className={cn(className, "w-full shrink-0 p-4 border-t")}
    >
      <form.Field name="description">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          const canSend =
            status !== "streaming" && field.state.value.trim().length > 0;

          const PromptButton: typeof InputGroupButton = (props) => {
            switch (status) {
              case "submitted":
                return (
                  <InputGroupButton
                    type="button"
                    size="icon-sm"
                    variant="default"
                    aria-label="Submitted"
                    disabled
                    {...props}
                  >
                    <Spinner />
                  </InputGroupButton>
                );

              case "streaming":
                return (
                  <InputGroupButton
                    type="button"
                    size="icon-sm"
                    variant="default"
                    aria-label="Stop"
                    onPointerDown={onStop}
                    {...props}
                  >
                    <Square />
                  </InputGroupButton>
                );

              case "ready":
              default:
                return (
                  <InputGroupButton
                    type="submit"
                    size="icon-sm"
                    variant="default"
                    disabled={!canSend}
                    aria-label="Send"
                    {...props}
                  >
                    <ArrowUpIcon />
                  </InputGroupButton>
                );
            }
          };

          return (
            <Field data-invalid={isInvalid}>
              <InputGroup>
                <InputGroupTextarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  placeholder={`Ask the agent to do something...`}
                  className="max-h-48 overflow-y-auto resize-none"
                  aria-invalid={isInvalid}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      form.handleSubmit();
                    }
                  }}
                  disabled={status !== "ready"}
                />
                <InputGroupAddon align="block-end" className="justify-between">
                  <PromptButton />
                  <nav
                    className="flex flex-row gap-2"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <ReasoningSelector disabled={status !== "ready"} />
                    <ModelSelector disabled={status !== "ready"} />
                  </nav>
                </InputGroupAddon>
              </InputGroup>

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>
    </form>
  );
}

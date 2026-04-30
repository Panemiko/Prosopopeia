"use client";

import { Button } from "@prosopopeia/ui/components/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@prosopopeia/ui/components/field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@prosopopeia/ui/components/sheet";
import { Textarea } from "@prosopopeia/ui/components/textarea";
import { useForm } from "@tanstack/react-form";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  jobDescription: z.string().trim().min(1, "Campo obrigatório"),
});

export function AddApplicationModal() {
  const form = useForm({
    defaultValues: {
      jobDescription: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    async onSubmit({ value }) {
      toast("Formulário enviado");
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon /> Adicionar nova vaga{" "}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adicionar nova vaga</SheetTitle>
          <SheetDescription>
            Preencha a descrição da vaga para podermos salvar ela.
          </SheetDescription>
        </SheetHeader>
        <form
          id="add-application-modal-form"
          className="px-6"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="jobDescription"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Descrição da vaga
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Digite a descrição da vaga aqui..."
                      autoComplete="off"
                      className="h-80"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
        <SheetFooter>
          <Button
            className="w-full mt-4"
            form="add-application-modal-form"
            type="submit"
          >
            <PlusIcon /> Adicionar vaga
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

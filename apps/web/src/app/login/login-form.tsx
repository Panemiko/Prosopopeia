"use client";

import { Button } from "@prosopopeia/ui/components/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@prosopopeia/ui/components/field";
import { Input } from "@prosopopeia/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z.email("E-mail inválido").trim().min(1),
});

export function LoginForm() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    async onSubmit({ value }) {
      toast.success("Form submitted successfully");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Seu e-mail</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="joao@exemplo.com"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <Button className="w-full mt-4" type="submit">
        Entrar
      </Button>
    </form>
  );
}

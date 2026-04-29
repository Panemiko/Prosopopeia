import z from "zod";

export const userProfileSchema = z.object({
  phone: z.string().min(8, "Telefone inválido"),
  city: z.string().min(2, "Cidade inválida"),
  linkedin: z.string().url("URL do LinkedIn inválida").or(z.literal("")),
  github: z.string().url("URL do GitHub inválida").or(z.literal("")),
  portfolio: z.string().url("URL do portfólio inválida").or(z.literal("")),
  role: z.string().min(2, "Cargo inválido"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  experiences: z.array(
    z.object({
      company: z.string().min(2, "Empresa inválida"),
      role: z.string().min(2, "Cargo inválido"),
      startDate: z.string().min(4, "Data de início inválida"),
      endDate: z.string().optional(),
      description: z
        .string()
        .min(10, "Descrição deve ter pelo menos 10 caracteres"),
    }),
  ),
  projects: z.array(
    z.object({
      name: z.string().min(2, "Nome do projeto inválido"),
      link: z.string().url("URL do projeto inválida").or(z.literal("")),
      description: z
        .string()
        .min(10, "Descrição deve ter pelo menos 10 caracteres"),
    }),
  ),
  education: z.array(
    z.object({
      institution: z.string().min(2, "Instituição inválida"),
      degree: z.string().min(2, "Formação inválida"),
      startDate: z.string().min(4, "Data de início inválida"),
      endDate: z.string().min(4, "Data de fim inválida"),
    }),
  ),
  languages: z.array(
    z.object({
      language: z.string().min(2, "Idioma inválido"),
      level: z.string().min(2, "Nível inválido"),
    }),
  ),
  skills: z.array(z.string().min(1, "Habilidade inválida")),
});

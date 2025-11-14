/**
 * Schemas de validação Zod para formulários de autenticação
 */

import { z } from "zod";

/**
 * Regex para validação de senha forte
 * - Mínimo 8 caracteres
 * - Pelo menos uma letra maiúscula
 * - Pelo menos uma letra minúscula
 * - Pelo menos um número
 * - Pelo menos um caractere especial
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

/**
 * Validação básica de CPF (formato)
 * TODO: Adicionar validação de dígitos verificadores
 */
function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false; // Todos dígitos iguais
  return true; // Simplificado - backend faz validação completa
}

/**
 * Validação básica de CNPJ (formato)
 * TODO: Adicionar validação de dígitos verificadores
 */
function isValidCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, "");
  if (cleaned.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false; // Todos dígitos iguais
  return true; // Simplificado - backend faz validação completa
}

/**
 * Schema de Login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(255, "Email muito longo"),
  password: z.string().min(1, "Senha é obrigatória").min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Schema de Registro
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .max(120, "Nome muito longo"),
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Email inválido")
      .max(255, "Email muito longo"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(12, "Senha deve ter no mínimo 12 caracteres")
      .regex(
        passwordRegex,
        "Senha deve conter letra maiúscula, minúscula, número e caractere especial"
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
    document: z
      .string()
      .min(1, "CPF/CNPJ é obrigatório")
      .refine(
        (doc) => {
          const cleaned = doc.replace(/\D/g, "");
          return isValidCPF(cleaned) || isValidCNPJ(cleaned);
        },
        {
          message: "CPF ou CNPJ inválido",
        }
      ),
    phone: z
      .string()
      .optional()
      .refine(
        (phone) => {
          if (!phone) return true;
          const cleaned = phone.replace(/\D/g, "");
          return cleaned.length >= 10 && cleaned.length <= 11;
        },
        {
          message: "Telefone inválido (formato: (XX) XXXXX-XXXX)",
        }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Schema de Recuperação de Senha
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(255, "Email muito longo"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Schema de MFA (OTP)
 */
export const mfaSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  otp: z
    .string()
    .min(1, "Código é obrigatório")
    .regex(/^\d{6}$/, "Código deve ter 6 dígitos"),
});

export type MfaInput = z.infer<typeof mfaSchema>;


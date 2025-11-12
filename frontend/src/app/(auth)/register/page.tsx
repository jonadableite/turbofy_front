"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { AceternityButton } from "@/components/auth/AceternityButton";
import { registerSchema, type RegisterInput } from "@/lib/validation";
import api from "@/lib/api";
import axios, { AxiosError } from "axios";


interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError("");

      await api.post<RegisterResponse>("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        document: data.document,
        phone: data.phone,
      });

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        if (!axiosErr.response) {
          setError("Falha de conexão com a API. Verifique o backend e tente novamente.");
        } else if (axiosErr.response.data?.message) {
          setError(axiosErr.response.data.message);
        } else {
          setError("Erro ao criar conta. Tente novamente.");
        }
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      /* Nada a fazer – react-hook-form controla isSubmitting */
    }
  };

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Comece a usar o Turbofy hoje mesmo"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Error message */}
        {error && (
          <motion.div
            className="p-3 rounded-md bg-destructive/10 border border-destructive/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {/* Nome completo */}
        <FormInput
          {...register("name")}
          label="Nome completo"
          type="text"
          placeholder="Seu nome"
          autoComplete="name"
          error={errors.name?.message}
        />

        {/* Email */}
        <FormInput
          {...register("email")}
          label="Email"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          error={errors.email?.message}
        />

        {/* CPF/CNPJ */}
        <FormInput
          {...register("document")}
          label="CPF/CNPJ"
          type="text"
          placeholder="000.000.000-00"
          autoComplete="off"
          error={errors.document?.message}
          helperText="Digite apenas números"
        />

        {/* Phone (opcional) */}
        <FormInput
          {...register("phone")}
          label="Telefone (opcional)"
          type="tel"
          placeholder="(11) 99999-9999"
          autoComplete="tel"
          error={errors.phone?.message}
        />

        {/* Password */}
        <div>
          <FormInput
            {...register("password")}
            label="Senha"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
          />
          {passwordValue && (
            <div className="mt-3">
              <PasswordStrengthMeter password={passwordValue} />
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <FormInput
          {...register("confirmPassword")}
          label="Confirmar senha"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />

        {/* Submit button - Estilo Aceternity */}
        <AceternityButton
          type="submit"
          aria-label={isSubmitting ? "Criando conta" : "Criar conta"}
          disabled={!isValid || isSubmitting}
          className="flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Criando conta
            </>
          ) : (
            "Criar conta →"
          )}
        </AceternityButton>


        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Fazer login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}


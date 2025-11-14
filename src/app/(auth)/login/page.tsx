"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormInput } from "@/components/auth/FormInput";
import { AceternityButton } from "@/components/auth/AceternityButton";
import { loginSchema, type LoginInput } from "@/lib/validation";
import { useAuth } from "@/contexts/auth-context";
// reCAPTCHA removido

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30000; // 30 segundos

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  // reCAPTCHA removido
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // Redirecionar se já autenticado
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    }
  }, [authLoading, isAuthenticated, router, searchParams]);

  // Lockout timer countdown
  React.useEffect(() => {
    if (isLocked && lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1000) {
            setIsLocked(false);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLocked, lockoutTimer]);

  const onSubmit = async (data: LoginInput) => {
    if (isLocked) {
      setError(`Conta bloqueada. Tente novamente em ${Math.ceil(lockoutTimer / 1000)} segundos.`);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await login(data.email, data.password);

      // Reset attempts on success
      setAttempts(0);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { error?: { message?: string; code?: string } } } };
      const errorMessage = apiError.response?.data?.error?.message || "Erro ao fazer login. Tente novamente.";

      setError(errorMessage);

      // Incrementar tentativas
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Bloquear após muitas tentativas
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setLockoutTimer(LOCKOUT_DURATION);
        setError("Muitas tentativas falharam. Sua conta foi temporariamente bloqueada.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Redirecionamento em andamento
  }

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Entre na sua conta Turbofy">
      {error && (
        <div className="mb-6 rounded-md bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register("email")}
          disabled={isSubmitting || isLocked}
        />

        <FormInput
          id="password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
          disabled={isSubmitting || isLocked}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary focus:ring-offset-0"
            />
            <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
              Lembrar de mim
            </label>
          </div>
          <Link
            href="/forgot"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <AceternityButton
          type="submit"
          disabled={isSubmitting || isLocked || !isValid}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar →"
          )}
        </AceternityButton>

        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Criar conta
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

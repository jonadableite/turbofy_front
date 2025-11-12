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
import { loginSchema, type LoginInput } from "@/lib/validation";
import { api, ApiException } from "@/lib/api";
import { useRecaptcha } from "@/hooks/useRecaptcha";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30000; // 30 segundos

export default function LoginPage() {
  const router = useRouter();
  const { executeRecaptcha, isReady } = useRecaptcha();
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

  // Lockout timer countdown
  useState(() => {
    if (isLocked && lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  });

  const onSubmit = async (data: LoginInput) => {
    if (isLocked) return;

    try {
      setIsSubmitting(true);
      setError("");

      // Execute reCAPTCHA
      const recaptchaToken = await executeRecaptcha("login");

      // Chamada à API
      const response = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          recaptchaToken,
        }),
      });

      // Reset attempts on success
      setAttempts(0);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      // Increment attempts
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setLockoutTimer(30);
        setError(
          `Muitas tentativas de login. Aguarde ${30} segundos antes de tentar novamente.`
        );
      } else {
        if (err instanceof ApiException) {
          setError(err.message);
        } else {
          setError("Erro ao fazer login. Tente novamente.");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta para continuar"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Error message */}
        {error && (
          <motion.div
            className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Email */}
        <FormInput
          {...register("email")}
          label="Email"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          error={errors.email?.message}
          disabled={isLocked}
        />

        {/* Password */}
        <FormInput
          {...register("password")}
          label="Senha"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          disabled={isLocked}
        />

        {/* Forgot password link */}
        <div className="flex justify-end">
          <Link
            href="/forgot"
            className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={!isValid || isSubmitting || isLocked || !isReady}
          className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium
                     transition-all duration-200 
                     hover:bg-primary/90 
                     focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Entrando...
            </>
          ) : isLocked ? (
            `Aguarde ${lockoutTimer}s`
          ) : (
            "Entrar"
          )}
        </motion.button>

        {/* Register link */}
        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}


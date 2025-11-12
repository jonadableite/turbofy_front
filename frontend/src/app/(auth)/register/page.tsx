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
import { registerSchema, type RegisterInput } from "@/lib/validation";
import { api, ApiException } from "@/lib/api";
import { useRecaptcha } from "@/hooks/useRecaptcha";

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export default function RegisterPage() {
  const router = useRouter();
  const { executeRecaptcha, isReady } = useRecaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: RegisterInput) => {
    try {
      setIsSubmitting(true);
      setError("");

      // Execute reCAPTCHA
      const recaptchaToken = await executeRecaptcha("register");

      // Chamada à API (backend espera: email, password, document, phone?)
      const response = await api<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          document: data.document,
          phone: data.phone,
          recaptchaToken,
        }),
      });

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiException) {
        // Se houver issues do Zod, mostrar a primeira
        if (err.issues && err.issues.length > 0) {
          setError(err.issues[0].message);
        } else {
          setError(err.message);
        }
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Comece a usar o Turbofy hoje mesmo"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={!isValid || isSubmitting || !isReady}
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
              Criando conta...
            </>
          ) : (
            "Criar conta"
          )}
        </motion.button>

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
          >
            Fazer login
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground">
          Ao criar uma conta, você concorda com nossos{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Política de Privacidade
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}


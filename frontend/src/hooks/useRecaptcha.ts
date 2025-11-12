/**
 * Hook para integração com Google reCAPTCHA v3
 */

import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface UseRecaptchaReturn {
  executeRecaptcha: (action: string) => Promise<string>;
  isReady: boolean;
}

export function useRecaptcha(): UseRecaptchaReturn {
  const { executeRecaptcha: executeRecaptchaLib } = useGoogleReCaptcha();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Em desenvolvimento, não bloquear submissão por ausência de reCAPTCHA
    if (executeRecaptchaLib) {
      setIsReady(true);
      return;
    }
    if (process.env.NODE_ENV !== "production") {
      setIsReady(true);
    }
  }, [executeRecaptchaLib]);

  const executeRecaptcha = async (action: string): Promise<string> => {
    // Se provider não estiver pronto ou ausente, não bloquear fluxo em dev
    if (!executeRecaptchaLib) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("reCAPTCHA indisponível em desenvolvimento, seguindo sem token");
        return "";
      }
      console.warn("reCAPTCHA não está pronto");
      return "";
    }

    try {
      const token = await executeRecaptchaLib(action);
      return token;
    } catch (error) {
      // Em desenvolvimento, manter aviso silencioso para evitar poluição de logs
      if (process.env.NODE_ENV !== "production") {
        console.warn("Falha ao executar reCAPTCHA (dev):", error);
        return "";
      }
      // Em produção, ainda não bloquear cadastramento se reCAPTCHA falhar
      return "";
    }
  };

  return {
    executeRecaptcha,
    isReady,
  };
}


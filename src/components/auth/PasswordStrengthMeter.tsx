"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import zxcvbn from "zxcvbn";

interface PasswordStrengthMeterProps {
  password: string;
}

const strengthLabels = ["Muito Fraca", "Fraca", "Média", "Forte", "Muito Forte"];
const strengthColors = [
  "bg-destructive",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-emerald-500",
];

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };

    const result = zxcvbn(password);
    return {
      score: result.score,
      label: strengthLabels[result.score],
      color: strengthColors[result.score],
      feedback: result.feedback,
    };
  }, [password]);

  if (!password) return null;

  const progress = ((strength.score + 1) / 5) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Força da senha:</span>
        <span className="font-medium">{strength.label}</span>
      </div>

      <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${strength.color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {strength.feedback?.warning && (
        <p className="text-xs text-orange-500">
          {strength.feedback.warning}
        </p>
      )}

      {strength.feedback?.suggestions && strength.feedback.suggestions.length > 0 && (
        <ul className="text-xs text-muted-foreground space-y-1">
          {strength.feedback.suggestions.map((suggestion, index) => (
            <li key={index}>• {suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
}


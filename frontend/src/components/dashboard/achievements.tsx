"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface AchievementsProps {
  achievements: Achievement[];
  className?: string;
}

export const Achievements = ({
  achievements,
  className,
}: AchievementsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-lg",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-primary/10 p-2">
          <Trophy className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Conquistas</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
          >
            <div
              className={cn(
                "rounded-lg p-3 transition-transform group-hover:scale-110",
                achievement.color
              )}
            >
              {achievement.icon}
            </div>
            <p className="text-xs font-medium text-center text-foreground">
              {achievement.title}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};


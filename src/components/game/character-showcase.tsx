"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Floating, GlowPulse } from "@/components/animation/floating";
import { CHARACTER_CLASSES } from "@/constants/classes";
import type { Character } from "@/types/game";

interface CharacterShowcaseProps {
  character: Character;
}

export function CharacterShowcase({ character }: CharacterShowcaseProps) {
  const cls = CHARACTER_CLASSES.find((c) => c.id === character.class_id);

  return (
    <Card className="relative overflow-hidden border-primary/20" glow>
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ background: cls?.gradient || "transparent" }}
      />

      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-lg">Character</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-center gap-6">
          <GlowPulse
            color={cls?.gradient ? "rgba(139, 92, 246, 0.3)" : undefined}
            className="rounded-2xl"
          >
            <Floating distance={6} duration={3}>
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-5xl">
                {cls?.icon || "👤"}
              </div>
            </Floating>
          </GlowPulse>

          <div className="flex-1 space-y-1">
            <h3 className="text-xl font-bold">{character.name}</h3>
            <p className="text-sm text-muted-foreground">
              {cls?.name || "Unknown"} • {cls?.language || "?"}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <motion.div
                className="flex items-center gap-1.5"
                whileHover={{ scale: 1.05 }}
              >
                <span>⭐</span>
                <span className="text-sm font-semibold">
                  Level {character.level}
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-1.5"
                whileHover={{ scale: 1.05 }}
              >
                <span>💰</span>
                <span className="text-sm font-semibold text-gradient-gold">
                  {character.gold.toLocaleString()}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

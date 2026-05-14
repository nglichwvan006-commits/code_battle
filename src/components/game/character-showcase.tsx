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
        className="absolute inset-0 opacity-[0.06]"
        style={{ background: cls?.gradient || "transparent" }}
      />

      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="text-gradient-purple font-bold">Character</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-center gap-6">
          <GlowPulse
            color={cls?.gradient ? "rgba(167, 139, 250, 0.25)" : undefined}
            className="rounded-2xl"
          >
            <Floating distance={6} duration={3}>
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 to-primary/5 text-4xl shadow-lg">
                {cls?.icon || "👤"}
              </div>
            </Floating>
          </GlowPulse>

          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-bold">{character.name}</h3>
            <p className="text-sm text-muted-foreground">
              {cls?.name || "Unknown"} • {cls?.language || "?"}
            </p>
            <div className="flex items-center gap-4 pt-1">
              <motion.div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-sm">⭐</span>
                <span className="text-xs font-bold">
                  Lv.{character.level}
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-sm">💰</span>
                <span className="text-xs font-bold text-gradient-gold">
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParticleBackground } from "@/components/animation/particle-background";
import { CHARACTER_CLASSES, type ClassInfo } from "@/constants/classes";
import { toast } from "sonner";

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 text-xs text-muted-foreground">{label}</span>
      <div className="h-2 flex-1 rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${value * 10}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="w-6 text-right text-xs font-semibold">{value}</span>
    </div>
  );
}

function ClassCard({
  cls,
  selected,
  onSelect,
}: {
  cls: ClassInfo;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-xl border p-5 text-left transition-all duration-300 ${
        selected
          ? "border-primary glow-purple bg-primary/10"
          : "border-border/50 glass hover:border-primary/50"
      }`}
    >
      {selected && (
        <motion.div
          layoutId="classSelection"
          className="absolute inset-0 rounded-xl border-2 border-primary"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}

      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-3">
          <span className="text-4xl">{cls.icon}</span>
          <div>
            <h3 className="text-lg font-bold">{cls.name}</h3>
            <span
              className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{
                background: `${cls.gradient}`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {cls.language}
            </span>
          </div>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{cls.description}</p>
        <div className="space-y-1.5">
          <StatBar label="Strength" value={cls.stats.strength} />
          <StatBar label="Intel" value={cls.stats.intelligence} />
          <StatBar label="Agility" value={cls.stats.agility} />
          <StatBar label="Endurance" value={cls.stats.endurance} />
        </div>
      </div>
    </motion.button>
  );
}

export default function CharacterCreatePage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleCreate = async () => {
    if (!name.trim() || !selectedClass) return;

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in");
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("characters").insert({
      profile_id: user.id,
      name: name.trim(),
      class_id: selectedClass,
      level: 1,
      exp: 0,
      gold: 100,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Your character has been born! ⚔️");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <ParticleBackground count={50} />
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-purple-600/15 blur-[128px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl"
      >
        {/* Step indicator */}
        <div className="mb-8 flex justify-center gap-3">
          {["Name", "Class", "Confirm"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-sm ${
                  i <= step ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {i < 2 && (
                <div
                  className={`h-px w-8 ${
                    i < step ? "bg-primary" : "bg-secondary"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-strong mx-auto max-w-md rounded-2xl p-8"
            >
              <h2 className="mb-2 text-center text-2xl font-bold">
                Name Your Hero
              </h2>
              <p className="mb-6 text-center text-sm text-muted-foreground">
                Choose a name that will echo through the realm
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="charName">Character Name</Label>
                  <Input
                    id="charName"
                    placeholder="Enter your hero's name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
                    className="bg-background/50 text-center text-lg"
                    autoFocus
                  />
                </div>
                <Button
                  variant="game"
                  className="w-full"
                  disabled={name.trim().length < 2}
                  onClick={() => setStep(1)}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="class"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2 className="mb-2 text-center text-2xl font-bold">
                Choose Your Class
              </h2>
              <p className="mb-6 text-center text-sm text-muted-foreground">
                Each class specializes in a different programming language
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {CHARACTER_CLASSES.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    cls={cls}
                    selected={selectedClass === cls.id}
                    onSelect={() => setSelectedClass(cls.id)}
                  />
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button
                  variant="game"
                  disabled={!selectedClass}
                  onClick={() => setStep(2)}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-strong mx-auto max-w-md rounded-2xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="mb-4 text-6xl"
              >
                {CHARACTER_CLASSES.find((c) => c.id === selectedClass)?.icon}
              </motion.div>
              <h2 className="mb-1 text-2xl font-bold">{name}</h2>
              <p className="mb-6 text-muted-foreground">
                {CHARACTER_CLASSES.find((c) => c.id === selectedClass)?.name} •{" "}
                {CHARACTER_CLASSES.find((c) => c.id === selectedClass)?.language}
              </p>
              <div className="mb-6 text-left glass rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                  {
                    CHARACTER_CLASSES.find((c) => c.id === selectedClass)
                      ?.description
                  }
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="game"
                  className="flex-1"
                  disabled={loading}
                  onClick={handleCreate}
                >
                  {loading ? "Creating..." : "Begin Adventure!"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

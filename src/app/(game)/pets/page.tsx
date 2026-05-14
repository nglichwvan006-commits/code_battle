"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/animation/fade-in";
import { Floating } from "@/components/animation/floating";
import { toast } from "sonner";

export default function PetsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: character } = useQuery({
    queryKey: ["character-for-pets"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from("characters")
        .select("id")
        .eq("profile_id", user.id)
        .single();
      return data;
    },
  });

  const { data: allPets, isLoading } = useQuery({
    queryKey: ["all-pets"],
    queryFn: async () => {
      const { data } = await supabase.from("pets").select("*").order("name");
      return data || [];
    },
  });

  const { data: ownedPets } = useQuery({
    queryKey: ["owned-pets"],
    enabled: !!character,
    queryFn: async () => {
      if (!character) return [];
      const { data } = await supabase
        .from("user_pets")
        .select("*, pets(*)")
        .eq("character_id", character.id);
      return data || [];
    },
  });

  const activateMutation = useMutation({
    mutationFn: async (petId: string) => {
      if (!character) throw new Error("No character");

      // Deactivate all first
      await supabase
        .from("user_pets")
        .update({ is_active: false })
        .eq("character_id", character.id);

      // Activate selected
      await supabase
        .from("user_pets")
        .update({ is_active: true })
        .eq("character_id", character.id)
        .eq("pet_id", petId);
    },
    onSuccess: () => {
      toast.success("Pet activated! 🐾");
      queryClient.invalidateQueries({ queryKey: ["owned-pets"] });
    },
  });

  const ownedPetIds = new Set(ownedPets?.map((up) => up.pet_id) || []);
  const activePet = ownedPets?.find((up) => up.is_active);

  const rarityColors: Record<string, string> = {
    common: "#9ca3af",
    uncommon: "#22c55e",
    rare: "#3b82f6",
    epic: "#a855f7",
    legendary: "#f59e0b",
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold">Pets</h1>
        <p className="text-sm text-muted-foreground">
          Your loyal companions — each grants unique bonuses
        </p>
      </FadeIn>

      {/* Active pet showcase */}
      {activePet && (
        <FadeIn delay={0.1}>
          <Card className="glass-strong border-primary/20">
            <CardContent className="flex items-center gap-6 p-6">
              <Floating distance={6} duration={3}>
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-5xl border border-primary/30">
                  {(activePet.pets as { icon: string })?.icon || "🐾"}
                </div>
              </Floating>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Active Pet</p>
                <h3 className="text-xl font-bold">
                  {(activePet.pets as { name: string })?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  +{(activePet.pets as { bonus_value: number })?.bonus_value}%{" "}
                  {(activePet.pets as { bonus_type: string })?.bonus_type?.replace(/_/g, " ")}
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Pet grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {allPets?.map((pet, i) => {
            const isOwned = ownedPetIds.has(pet.id);
            const isActive = activePet?.pet_id === pet.id;

            return (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card
                  className={`relative overflow-hidden transition-all duration-300 ${
                    isActive ? "border-primary glow-purple" : ""
                  } ${!isOwned ? "opacity-50" : "hover:border-primary/30"}`}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: rarityColors[pet.rarity] || "#9ca3af" }}
                  />

                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Floating distance={isOwned ? 4 : 0} duration={3}>
                        <div className="text-4xl">{pet.icon}</div>
                      </Floating>
                      <Badge
                        variant={pet.rarity as "common" | "uncommon" | "rare" | "epic" | "legendary"}
                      >
                        {pet.rarity}
                      </Badge>
                    </div>

                    <h3 className="font-semibold mb-1">{pet.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {pet.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        +{pet.bonus_value}% {pet.bonus_type.replace(/_/g, " ")}
                      </span>

                      {isOwned && !isActive && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => activateMutation.mutate(pet.id)}
                          disabled={activateMutation.isPending}
                        >
                          Activate
                        </Button>
                      )}
                      {isActive && (
                        <Badge variant="default">Active</Badge>
                      )}
                      {!isOwned && (
                        <span className="text-xs text-muted-foreground">🔒 Locked</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

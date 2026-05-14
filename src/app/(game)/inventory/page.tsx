"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/animation/fade-in";
import { toast } from "sonner";
import { ShieldCheck, Sword, Gem, Beaker } from "lucide-react";
import type { Tables } from "@/types/database";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  weapon: Sword,
  armor: ShieldCheck,
  accessory: Gem,
  consumable: Beaker,
};

const RARITY_ORDER = ["legendary", "epic", "rare", "uncommon", "common"];

export default function InventoryPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: character } = useQuery({
    queryKey: ["character-for-inventory"],
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

  const { data: inventory, isLoading } = useQuery({
    queryKey: ["inventory"],
    enabled: !!character,
    queryFn: async () => {
      if (!character) return [];
      const { data } = await supabase
        .from("user_inventory")
        .select("*, inventory_items(*)")
        .eq("character_id", character.id);
      return (data || []) as (Tables<"user_inventory"> & { inventory_items: Tables<"inventory_items"> })[];
    },
  });

  const equipMutation = useMutation({
    mutationFn: async ({ inventoryId, equip }: { inventoryId: string; equip: boolean }) => {
      await supabase
        .from("user_inventory")
        .update({ equipped: equip })
        .eq("id", inventoryId);
    },
    onSuccess: (_, vars) => {
      toast.success(vars.equip ? "Item equipped! ⚔️" : "Item unequipped");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  const sortedInventory = [...(inventory || [])].sort((a, b) => {
    const aIdx = RARITY_ORDER.indexOf(a.inventory_items.rarity);
    const bIdx = RARITY_ORDER.indexOf(b.inventory_items.rarity);
    return aIdx - bIdx;
  });

  const equipped = sortedInventory.filter((inv) => inv.equipped);
  const unequipped = sortedInventory.filter((inv) => !inv.equipped);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-sm text-muted-foreground">
          Manage your equipment and items
        </p>
      </FadeIn>

      {/* Equipped */}
      {equipped.length > 0 && (
        <FadeIn delay={0.1}>
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Equipped
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {equipped.map((inv) => (
                  <ItemCard
                    key={inv.id}
                    item={inv.inventory_items}
                    equipped
                    onToggle={() =>
                      equipMutation.mutate({ inventoryId: inv.id, equip: false })
                    }
                    loading={equipMutation.isPending}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* All items */}
      <FadeIn delay={0.2}>
        <h2 className="text-lg font-semibold mb-3">
          Backpack ({unequipped.length} items)
        </h2>
        {unequipped.length === 0 ? (
          <Card className="glass">
            <CardContent className="py-12 text-center">
              <div className="text-5xl mb-4">🎒</div>
              <p className="text-muted-foreground">Your backpack is empty</p>
              <p className="text-xs text-muted-foreground mt-1">
                Solve problems and defeat bosses to earn loot!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {unequipped.map((inv, i) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <ItemCard
                  item={inv.inventory_items}
                  equipped={false}
                  quantity={inv.quantity}
                  onToggle={() =>
                    equipMutation.mutate({ inventoryId: inv.id, equip: true })
                  }
                  loading={equipMutation.isPending}
                />
              </motion.div>
            ))}
          </div>
        )}
      </FadeIn>
    </div>
  );
}

function ItemCard({
  item,
  equipped,
  quantity,
  onToggle,
  loading,
}: {
  item: Tables<"inventory_items">;
  equipped: boolean;
  quantity?: number;
  onToggle: () => void;
  loading: boolean;
}) {
  const TypeIcon = TYPE_ICONS[item.type] || Gem;
  const stats = item.stats as Record<string, number> | null;

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
        equipped ? "border-primary/40 glow-purple" : ""
      }`}
    >
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{
          background:
            item.rarity === "legendary"
              ? "linear-gradient(90deg, #f59e0b, #eab308)"
              : item.rarity === "epic"
              ? "#a855f7"
              : item.rarity === "rare"
              ? "#3b82f6"
              : item.rarity === "uncommon"
              ? "#22c55e"
              : "#6b7280",
        }}
      />
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="text-3xl">{item.icon}</span>
          <Badge variant={item.rarity as "common" | "uncommon" | "rare" | "epic" | "legendary"}>
            {item.rarity}
          </Badge>
        </div>

        <h4 className="font-semibold text-sm mb-0.5">{item.name}</h4>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <TypeIcon className="h-3 w-3" />
          <span className="capitalize">{item.type}</span>
          {quantity && quantity > 1 && <span>×{quantity}</span>}
        </div>

        {stats && Object.keys(stats).length > 0 && (
          <div className="space-y-0.5 mb-3">
            {Object.entries(stats).map(([key, val]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-muted-foreground capitalize">
                  {key.replace(/_/g, " ")}
                </span>
                <span className="text-green-400">+{val}</span>
              </div>
            ))}
          </div>
        )}

        {item.type !== "consumable" && (
          <Button
            size="sm"
            variant={equipped ? "outline" : "game"}
            className="w-full"
            onClick={onToggle}
            disabled={loading}
          >
            {equipped ? "Unequip" : "Equip"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

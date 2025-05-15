import { useEffect, useState } from "react";

export interface TibiaItem {
  id: number;
  name: string;
  type: string;
  image: string;
  [key: string]: any;
}

export const useTibiaItems = () => {
  const [items, setItems] = useState<TibiaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [
          armorsRes,
          helmetsRes,
          clubsRes,
          axesRes,
          fistRes,
          swordsRes,
          wandsRes,
          rodsRes,
          distanceRes,
          crossbowsRes,
          bowsRes,
          shieldsRes,
          legsRes,
          amuletRes,
          bootsRes,
        ] = await Promise.all([
          fetch("/json/armors_dml_format.json"),
          fetch("/json/helmets_dml_format.json"),
          fetch("/json/clubs_dml_format.json"),
          fetch("/json/axes_dml_format.json"),
          fetch("/json/fist_dml_format.json"),
          fetch("/json/swords_dml_format.json"),
          fetch("/json/wands_dml_format.json"),
          fetch("/json/rods_dml_format.json"),
          fetch("/json/distance_dml_format.json"),
          fetch("/json/crossbows_dml_format.json"),
          fetch("/json/bows_dml_format.json"),
          fetch("/json/shields_dml_format.json"),
          fetch("/json/legs_dml_format.json"),
          fetch("/json/amulet_dml_format.json"),
          fetch("/json/boots_dml_format.json"),
        ]);
        if (
          !armorsRes.ok ||
          !helmetsRes.ok ||
          !clubsRes.ok ||
          !axesRes.ok ||
          !fistRes.ok ||
          !swordsRes.ok ||
          !wandsRes.ok ||
          !rodsRes.ok ||
          !distanceRes.ok ||
          !crossbowsRes.ok ||
          !bowsRes.ok ||
          !shieldsRes.ok ||
          !legsRes.ok ||
          !amuletRes.ok ||
          !bootsRes.ok
        ) {
          throw new Error("Failed to fetch item data");
        }
        const [
          armors,
          helmets,
          clubs,
          axes,
          fist,
          swords,
          wands,
          rods,
          distance,
          crossbows,
          bows,
          shields,
          legs,
          amulets,
          boots,
        ] = await Promise.all([
          armorsRes.json(),
          helmetsRes.json(),
          clubsRes.json(),
          axesRes.json(),
          fistRes.json(),
          swordsRes.json(),
          wandsRes.json(),
          rodsRes.json(),
          distanceRes.json(),
          crossbowsRes.json(),
          bowsRes.json(),
          shieldsRes.json(),
          legsRes.json(),
          amuletRes.json(),
          bootsRes.json(),
        ]);
        // Add type to each item for clarity
        const armorsWithType = armors.map((item: any) => ({
          ...item,
          type: "armor",
        }));
        const helmetsWithType = helmets.map((item: any) => ({
          ...item,
          type: "helmet",
        }));
        const clubsWithType = clubs.map((item: any) => ({
          ...item,
          type: "club",
        }));
        const axesWithType = axes.map((item: any) => ({
          ...item,
          type: "axe",
        }));
        const fistWithType = fist.map((item: any) => ({
          ...item,
          type: "fist",
        }));
        const swordsWithType = swords.map((item: any) => ({
          ...item,
          type: "sword",
        }));
        const wandsWithType = wands.map((item: any) => ({
          ...item,
          type: "wand",
        }));
        const rodsWithType = rods.map((item: any) => ({
          ...item,
          type: "rod",
        }));
        const distanceWithType = distance.map((item: any) => ({
          ...item,
          type: "distance",
        }));
        const crossbowsWithType = crossbows.map((item: any) => ({
          ...item,
          type: "crossbow",
        }));
        const bowsWithType = bows.map((item: any) => ({
          ...item,
          type: "bow",
        }));
        const shieldsWithType = shields.map((item: any) => ({
          ...item,
          type: "shield",
        }));
        const legsWithType = legs.map((item: any) => ({
          ...item,
          type: "legs",
        }));
        const amuletsWithType = amulets.map((item: any) => ({
          ...item,
          type: "amulet",
        }));
        const bootsWithType = boots.map((item: any) => ({
          ...item,
          type: "boots",
        }));
        setItems([
          ...armorsWithType,
          ...helmetsWithType,
          ...clubsWithType,
          ...axesWithType,
          ...fistWithType,
          ...swordsWithType,
          ...wandsWithType,
          ...rodsWithType,
          ...distanceWithType,
          ...crossbowsWithType,
          ...bowsWithType,
          ...shieldsWithType,
          ...legsWithType,
          ...amuletsWithType,
          ...bootsWithType,
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  return { items, isLoading, error };
};

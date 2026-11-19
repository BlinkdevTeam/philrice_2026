export type Poster = {
  title: string;
  thumb?: string; // small image for the slider
  image?: string; // large image for the lightbox
};
export type PosterGroup = {
  id: string;
  label: string;
  title: string;
  color: string;
  posters: Poster[];
};

// const glob = (pattern: string) =>
//   import.meta.glob(pattern, { eager: true, import: "default" }) as Record<
//     string,
//     string
//   >;

const full = import.meta.glob("./assets/eposters/*/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const thumbs = import.meta.glob("./assets/eposters/*/thumbs/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

// fallback: raw files, so posters still show before you run the script
const raw = import.meta.glob(
  "./assets/eposters/*/*.{jpg,jpeg,png,JPG,JPEG,PNG}",
  { eager: true, import: "default" },
) as Record<string, string>;

const base = (path: string) =>
  path.split("/").pop()!.replace(/\.[^.]+$/, "");

// "t1_07" becomes "Theme 1 · Poster 7"; other names are tidied up
const titleOf = (name: string) => {
  const m = name.match(/^t(\d+)[_-](\d+)$/i);
  return m
    ? `Theme ${m[1]} · Poster ${Number(m[2])}`
    : name.replace(/[-_]+/g, " ").trim();
};

const load = (folder: string, placeholders = 6): Poster[] => {
  const optimized = Object.keys(full).some((k) =>
    k.includes(`/eposters/${folder}/`),
  );
  const source = optimized ? full : raw;

  const found = Object.keys(source)
    .filter((k) => k.includes(`/eposters/${folder}/`))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((k) => {
      const name = base(k);
      return {
        title: titleOf(name),
        image: source[k],
        thumb: thumbs[`./assets/eposters/${folder}/thumbs/${name}.webp`],
      };
    });

  return found.length
    ? found
    : Array.from({ length: placeholders }, (_, i) => ({
        title: `Poster ${i + 1}`,
      }));
};

export const POSTER_GROUPS: PosterGroup[] = [
  { id: "theme-1", label: "Theme 1", title: "Rice Variety Innovation", color: "#4d9cff", posters: load("theme-1") },
  { id: "theme-2", label: "Theme 2", title: "Smart Crop, Soil, Farm Systems, and Mechanization", color: "#34d399", posters: load("theme-2") },
  { id: "theme-3", label: "Theme 3", title: "Rice-Based Value and Food Innovations", color: "#f59e0b", posters: load("theme-3") },
  { id: "theme-4", label: "Theme 4", title: "Cross-Cutting Solutions", color: "#fb7185", posters: load("theme-4") },
];
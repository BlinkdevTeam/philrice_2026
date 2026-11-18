export function SectionLabel({ num, name }: { num: string; name: string }) {
  return (
    <p className="text-xs font-medium tracking-widest">
      {num} / {name}
    </p>
  );
}

export const WRAP = "mx-auto w-full max-w-[1280px] px-6";

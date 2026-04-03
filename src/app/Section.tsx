"use client";

export default function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <span className="px-3 sm:px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm inline-block mb-4 sm:mb-6">
            {eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 px-4">{title}</h2>
          <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">{children}</p>
        </div>
      </div>
    </section>
  );
}

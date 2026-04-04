const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/LegacyLanding.tsx');
let s = fs.readFileSync(file, 'utf8');

const oldBlock = /<div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10 sm:mb-12">[\s\S]*?<\/div>\n\n\s*<div className="rounded-3xl p-6 md:p-8 border border-white\/10 bg-white\/5">/m;

const replacement = `<div className="-mx-4 sm:mx-0 mb-10 sm:mb-12">\n            <div className="flex gap-3 px-4 sm:px-0 overflow-x-auto sm:overflow-visible sm:grid sm:grid-cols-4 sm:gap-6 [scrollbar-width:none] [-ms-overflow-style:none]">\n              <div className="min-w-[240px] sm:min-w-0 rounded-3xl p-4 sm:p-8 border border-white/10 bg-white/5">\n                <div className="text-xs sm:text-sm text-gray-400">Outdoor PM2.5</div>\n                <div className="mt-2 sm:mt-3 text-3xl sm:text-5xl font-bold">{outer?.pm25 != null ? outer.pm25.toFixed(1) : "--"}</div>\n                <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">µg/m³</div>\n              </div>\n\n              <div className="min-w-[240px] sm:min-w-0 rounded-3xl p-4 sm:p-8 border border-white/10 bg-white/5">\n                <div className="text-xs sm:text-sm text-gray-400">Purified PM2.5</div>\n                <div className="mt-2 sm:mt-3 text-3xl sm:text-5xl font-bold">{purified?.pm25 != null ? purified.pm25.toFixed(1) : "--"}</div>\n                <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">µg/m³</div>\n                <div className={\`mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium \${status.color}\`}>{status.text}</div>\n              </div>\n\n              <div className="min-w-[240px] sm:min-w-0 rounded-3xl p-4 sm:p-8 border border-white/10 bg-white/5">\n                <div className="text-xs sm:text-sm text-gray-400">Outdoor PM10</div>\n                <div className="mt-2 sm:mt-3 text-3xl sm:text-5xl font-bold">{outer?.pm10 != null ? outer.pm10.toFixed(1) : "--"}</div>\n                <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">µg/m³</div>\n              </div>\n\n              <div className="min-w-[240px] sm:min-w-0 rounded-3xl p-4 sm:p-8 border border-white/10 bg-white/5">\n                <div className="text-xs sm:text-sm text-gray-400">Purified PM10</div>\n                <div className="mt-2 sm:mt-3 text-3xl sm:text-5xl font-bold">{purified?.pm10 != null ? purified.pm10.toFixed(1) : "--"}</div>\n                <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">µg/m³</div>\n              </div>\n            </div>\n          </div>\n\n          <div className="rounded-3xl p-6 md:p-8 border border-white/10 bg-white/5">`;

if (!oldBlock.test(s)) {
  console.error('Could not find old metrics block to replace.');
  process.exit(1);
}

s = s.replace(oldBlock, replacement);

// Add global webkit scrollbar hide utility in globals via Tailwind syntax isn't available here; use a class
// We'll just rely on scrollbar-width none + ms-overflow-style none; Safari will still show minimal bar.

fs.writeFileSync(file, s);
console.log('Patched metrics to horizontal scroll on tiny screens and added PM10 cards.');

const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/LegacyLanding.tsx');
let s = fs.readFileSync(file, 'utf8');

// Replace ONLY the dashboard metrics grid block
s = s.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">[\s\S]*?<\/div>\n\n\s*<div className="rounded-3xl p-6 md:p-8 border border-white\/10 bg-white\/5">/m,
  `<div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10 sm:mb-12">\n            <div className="rounded-3xl p-4 sm:p-8 border border-white/10 bg-white/5">\n              <div className="text-xs sm:text-sm text-gray-400">Outdoor PM2.5</div>\n              <div className="mt-2 sm:mt-3 text-3xl sm:text-5xl font-bold">{outer?.pm25 != null ? outer.pm25.toFixed(1) : "--"}</div>\n              <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">µg/m³</div>\n            </div>\n            <div className="rounded-3xl p-4 sm:p-8 border border-white/10 bg-white/5">\n              <div className="text-xs sm:text-sm text-gray-400">Purified PM2.5</div>\n              <div className="mt-2 sm:mt-3 text-3xl sm:text-5xl font-bold">{purified?.pm25 != null ? purified.pm25.toFixed(1) : "--"}</div>\n              <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">µg/m³</div>\n              <div className={\`mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium \${status.color}\`}>{status.text}</div>\n            </div>\n            <div className="rounded-3xl p-4 sm:p-8 border border-white/10 bg-white/5">\n              <div className="text-xs sm:text-sm text-gray-400">Efficiency</div>\n              <div className="mt-2 sm:mt-3 text-3xl sm:text-5xl font-bold">{efficiency == null ? "--" : \`\${Math.max(0, Math.min(100, efficiency)).toFixed(0)}%\`}</div>\n              <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">PM2.5 reduction</div>\n            </div>\n          </div>\n\n          <div className="rounded-3xl p-6 md:p-8 border border-white/10 bg-white/5">`
);

// Reduce chart height
s = s.replace(/<div className="h-\[350px\] w-full">/g, '<div className="h-[240px] sm:h-[320px] w-full">');

fs.writeFileSync(file, s);
console.log('Patched dashboard layout.');

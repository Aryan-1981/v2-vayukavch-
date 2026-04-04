const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'LegacyLanding.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  '<motion.div variants={fadeInUp} className="mb-6 flex justify-center">\n            <span className="px-3 sm:px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm">\n              SMART ROOFTOP AIR PURIFICATION\n            </span>\n          </div>',
  '<motion.div variants={fadeInUp} className="mb-6 flex justify-center">\n            <span className="px-3 sm:px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm">\n              SMART ROOFTOP AIR PURIFICATION\n            </span>\n          </motion.div>'
);

content = content.replace(
  '<motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8">\n            Purifying Air <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">On The Move</span>\n          </h1>',
  '<motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8">\n            Purifying Air <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">On The Move</span>\n          </motion.h1>'
);

content = content.replace(
  '<motion.p variants={fadeInUp} className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2">\n            A rooftop-mounted air purification system for urban vehicles. Actively cleans polluted air while driving, verified by\n            real-time PM7003 sensor readings.\n          </p>',
  '<motion.p variants={fadeInUp} className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2">\n            A rooftop-mounted air purification system for urban vehicles. Actively cleans polluted air while driving, verified by\n            real-time PM7003 sensor readings.\n          </motion.p>'
);

content = content.replace(
  '<motion.div variants={fadeInUp} className="mx-auto mb-12 flex justify-center">\n            <PurifierLogo animated size={120} variant="icon" theme="dark" />\n          </div>',
  '<motion.div variants={fadeInUp} className="mx-auto mb-12 flex justify-center">\n            <PurifierLogo animated size={120} variant="icon" theme="dark" />\n          </motion.div>'
);

content = content.replace(
  '<motion.div variants={fadeInUp} className="mx-auto mb-8 flex max-w-xl items-center justify-center gap-6 text-xs">\n            <span className="text-orange-400">Polluted Air In</span>\n            <span className="text-white/30">•</span>\n            <span className="text-emerald-300">Clean Air Out</span>\n          </div>',
  '<motion.div variants={fadeInUp} className="mx-auto mb-8 flex max-w-xl items-center justify-center gap-6 text-xs">\n            <span className="text-orange-400">Polluted Air In</span>\n            <span className="text-white/30">•</span>\n            <span className="text-emerald-300">Clean Air Out</span>\n          </motion.div>'
);

content = content.replace(
  '<motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center px-4">\n            <a\n              href="#dashboard"\n              className="px-6 sm:px-8 py-3 sm:py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-medium text-sm sm:text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transform hover:-translate-y-1"\n            >\n              View Live Performance\n            </a>\n            <a\n              href="#system"\n              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-medium text-sm sm:text-base transition-all backdrop-blur-md"\n            >\n              How It Works\n            </a>\n          </div>',
  '<motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center px-4">\n            <a\n              href="#dashboard"\n              className="px-6 sm:px-8 py-3 sm:py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-medium text-sm sm:text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transform hover:-translate-y-1"\n            >\n              View Live Performance\n            </a>\n            <a\n              href="#system"\n              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-medium text-sm sm:text-base transition-all backdrop-blur-md"\n            >\n              How It Works\n            </a>\n          </motion.div>'
);

fs.writeFileSync(filePath, content);
console.log('Fixed closing tags');

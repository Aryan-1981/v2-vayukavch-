const fs = require('fs');
const file = './src/app/LegacyLanding.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `      {/* Problem */}
      <section id="problem" className={\`min-h-screen py-16 sm:py-24 relative \${visibleSections.problem ? "scroll-reveal" : ""}\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* WHAT MAKES US DIFFERENT Banner */}
          <div className="mb-20 sm:mb-32">
            <div className="rounded-3xl p-8 sm:p-12 border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="flex-1">
                  <span className="px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm inline-block mb-4">
                    WHAT MAKES US DIFFERENT
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                    We don't clean air miles away.<br />
                    We clean it right where you breathe.
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base max-w-2xl">
                    Instead of massive, stationary smog towers that are inefficient and expensive, our system is mobile, utilizing existing vehicle movement to capture and purify the most hazardous air in the city.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* THE URBAN CHALLENGE Section */}
          <div className="text-center mb-16">
            <span className="px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm inline-block mb-4">
              THE URBAN CHALLENGE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Vehicles: From <span className="text-red-400">Polluters</span> to <span className="text-green-400">Purifiers</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto mb-16">
              Modern cities face a dense concentration of pollution at ground level. VayuKavach specifically targets the most harmful zones—the roads—using simple aerodynamics.
            </p>
          </div>

          {/* 3 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl p-8 border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-6 text-2xl border border-red-500/30">
                💨
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Traffic Exhaust Zones</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                The highest levels of toxic PM2.5 and PM10 particles hang in layers exactly where pedestrians, cyclists, and drivers commute.
              </p>
            </div>
            
            <div className="rounded-3xl p-8 border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 text-2xl border border-blue-500/30">
                ⚡
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Passive Air Intake</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Moving vehicles naturally encounter immense air resistance. We capture this incoming air through passive scoops, relying less on internal fans.
              </p>
            </div>
            
            <div className="rounded-3xl p-8 border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6 text-2xl border border-green-500/30">
                🚌
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Wasted Rooftop Space</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Millions of buses, cabs, and delivery trucks drive empty, flat roofs around the city all day. We transform this unused asset into an active filtration grid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard */}`;

content = content.replace(/\{\/\* Problem \*\/\}.*?\{\/\* Dashboard \*\/\}/s, replacement);
fs.writeFileSync(file, content);

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'LegacyLanding.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  '<motion.div \n          className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto py-20"\n          initial="hidden"\n          animate="visible"\n          variants={staggerContainer}\n        >',
  '<motion.div \n          className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto py-20"\n          initial="hidden"\n          animate="visible"\n          variants={staggerContainer}\n        >'
);

// We need to double check the close tag
content = content.replace(
  '        </motion.div>\n      </section>\n\n            {/* Problem */}',
  '        </motion.div>\n      </section>\n\n            {/* Problem */}'
);

if (content.indexOf('</motion.div>\n      </section>\n\n            {/* Problem */}') === -1) {
  content = content.replace(
    '        </div>\n      </section>\n\n            {/* Problem */}',
    '        </motion.div>\n      </section>\n\n            {/* Problem */}'
  );
}

fs.writeFileSync(filePath, content);

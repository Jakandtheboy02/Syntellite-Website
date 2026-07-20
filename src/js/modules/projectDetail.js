/**
 * Project Detail Page Dynamic Loader
 */

const PROJECT_CARDS = [
  "/src/assets/images/Project Card 1.png",
  "/src/assets/images/Project Card 2.png",
  "/src/assets/images/Project Card 3.png",
  "/src/assets/images/Project Card 4.png",
  "/src/assets/images/Project Card 5.png",
  "/src/assets/images/Project Card 6.png"
];

const PROJECTS_DATA = {
  "1": {
    title: "Aura Cosmetic System",
    sub: "UI/UX & Creative Frontend",
    chips: ["UI/UX Design", "Creative Frontend"],
    headline: `Crafting high-touch visual commerce experiences that <span class="text-muted-highlight">harmonize motion, aesthetics, and performance.</span>`,
    features: [
      { title: "Clarity", desc: "Fluid typographic hierarchy built for intuitive navigation and instant brand recognition." },
      { title: "Adaptability", desc: "Seamless responsive grid architecture matching all modern mobile and desktop viewports." },
      { title: "Focus", desc: "Precision micro-interactions engineered with sub-16ms frame budgeting." }
    ],
    heroImg: PROJECT_CARDS[0],
    gallery: [
      PROJECT_CARDS[0],
      PROJECT_CARDS[1],
      PROJECT_CARDS[2],
      PROJECT_CARDS[3],
      PROJECT_CARDS[4],
      PROJECT_CARDS[5]
    ]
  },
  "2": {
    title: "Krypton Asset Protocol",
    sub: "Web3 Protocol & Performance",
    chips: ["Web3 Protocol", "Performance"],
    headline: `Engineering real-time financial data visualization with <span class="text-muted-highlight">zero latency and industrial-grade security.</span>`,
    features: [
      { title: "Throughput", desc: "Processing 50,000+ real-time state changes per second with zero UI lag." },
      { title: "Security", desc: "Encrypted WebSocket channels paired with robust state management." },
      { title: "Analytics", desc: "Customizable dashboard widgets built with WebGL acceleration." }
    ],
    heroImg: PROJECT_CARDS[1],
    gallery: [
      PROJECT_CARDS[1],
      PROJECT_CARDS[2],
      PROJECT_CARDS[3],
      PROJECT_CARDS[4],
      PROJECT_CARDS[5],
      PROJECT_CARDS[0]
    ]
  },
  "3": {
    title: "Valo Intelligent Wear",
    sub: "E-Commerce & Motion Design",
    chips: ["E-Commerce", "Motion Design"],
    headline: `Redefining smart apparel e-commerce with <span class="text-muted-highlight">3D product customization and fluid scroll reveals.</span>`,
    features: [
      { title: "Immersion", desc: "Real-time 3D web material configurators directly in the browser." },
      { title: "Checkout", desc: "1-click frictionless payment integration with instant cart sync." },
      { title: "Speed", desc: "Optimized asset delivery delivering sub-second page loads globally." }
    ],
    heroImg: PROJECT_CARDS[2],
    gallery: [
      PROJECT_CARDS[2],
      PROJECT_CARDS[3],
      PROJECT_CARDS[4],
      PROJECT_CARDS[5],
      PROJECT_CARDS[0],
      PROJECT_CARDS[1]
    ]
  },
  "4": {
    title: "Charger App Ecosystem",
    sub: "Mobile App & iOS/Android",
    chips: ["Mobile App", "iOS & Android"],
    headline: `Connecting electric vehicle drivers with smart charging networks <span class="text-muted-highlight">through intuitive mobile software.</span>`,
    features: [
      { title: "Navigation", desc: "Real-time GPS station availability and dynamic route optimization." },
      { title: "Telemetry", desc: "Live battery state analysis and charging curve predictions." },
      { title: "Simplicity", desc: "Tap-to-charge NFC authentication and unified monthly billing." }
    ],
    heroImg: PROJECT_CARDS[3],
    gallery: [
      PROJECT_CARDS[3],
      PROJECT_CARDS[4],
      PROJECT_CARDS[5],
      PROJECT_CARDS[0],
      PROJECT_CARDS[1],
      PROJECT_CARDS[2]
    ]
  },
  "5": {
    title: "Syntellite Brand Narrative",
    sub: "Brand Identity & Design System",
    chips: ["Brand Identity", "Design System"],
    headline: `Building a cohesive visual language and <span class="text-muted-highlight">scalable multi-platform component ecosystem.</span>`,
    features: [
      { title: "Identity", desc: "Distinctive dark glassmorphic brand aesthetic tailored for tech pioneers." },
      { title: "System", desc: "200+ accessible Figma & CSS components for rapid engineering." },
      { title: "Cohesion", desc: "Unified cross-channel brand guidelines across web, mobile, and print." }
    ],
    heroImg: PROJECT_CARDS[4],
    gallery: [
      PROJECT_CARDS[4],
      PROJECT_CARDS[5],
      PROJECT_CARDS[0],
      PROJECT_CARDS[1],
      PROJECT_CARDS[2],
      PROJECT_CARDS[3]
    ]
  },
  "6": {
    title: "Nexus 3D Concept Space",
    sub: "3D WebGL & Interactive Concept",
    chips: ["3D WebGL", "Interactive Concept"],
    headline: `Pushing the boundaries of spatial web development <span class="text-muted-highlight">with shaders and immersive physics.</span>`,
    features: [
      { title: "Spatial UX", desc: "6DOF camera movement controlled by natural mouse parallax." },
      { title: "Shaders", desc: "Custom GLSL raymarching and reflective glass materials." },
      { title: "Optimization", desc: "Automated LOD mesh switching for 60fps performance." }
    ],
    heroImg: PROJECT_CARDS[5],
    gallery: [
      PROJECT_CARDS[5],
      PROJECT_CARDS[0],
      PROJECT_CARDS[1],
      PROJECT_CARDS[2],
      PROJECT_CARDS[3],
      PROJECT_CARDS[4]
    ]
  },
  "7": {
    title: "Apex AI Assistant Platform",
    sub: "AI Logic & Agentic UX",
    chips: ["AI Logic", "Agentic UX"],
    headline: `Next-generation enterprise AI workbench featuring <span class="text-muted-highlight">autonomous workflows and model orchestration.</span>`,
    features: [
      { title: "Autonomy", desc: "Intelligent multi-agent orchestration for complex business logic." },
      { title: "Interface", desc: "Contextual floating workbench controls with streaming token outputs." },
      { title: "Control", desc: "Enterprise policy auditing and human-in-the-loop review." }
    ],
    heroImg: PROJECT_CARDS[0],
    gallery: [
      PROJECT_CARDS[0],
      PROJECT_CARDS[2],
      PROJECT_CARDS[4],
      PROJECT_CARDS[1],
      PROJECT_CARDS[3],
      PROJECT_CARDS[5]
    ]
  },
  "8": {
    title: "Starlight Quantum Exchange",
    sub: "Fintech & Real-Time Analytics",
    chips: ["Fintech", "Real-Time Analytics"],
    headline: `Ultra-low-latency financial trading dashboard <span class="text-muted-highlight">delivering high-frequency market intelligence.</span>`,
    features: [
      { title: "Latency", desc: "Microsecond chart updates powered by web worker data pipelines." },
      { title: "Depth", desc: "Multi-exchange orderbook visualization with depth heatmaps." },
      { title: "Customization", desc: "Drag-and-drop workspace layout matching professional trader preferences." }
    ],
    heroImg: PROJECT_CARDS[1],
    gallery: [
      PROJECT_CARDS[1],
      PROJECT_CARDS[3],
      PROJECT_CARDS[5],
      PROJECT_CARDS[0],
      PROJECT_CARDS[2],
      PROJECT_CARDS[4]
    ]
  },
  "9": {
    title: "Vortex Spatial Studio",
    sub: "Spatial Computing & WebVR",
    chips: ["Spatial Computing", "WebVR"],
    headline: `Immersive web studio enabling 3D product previews <span class="text-muted-highlight">and spatial design collaboration.</span>`,
    features: [
      { title: "Collaboration", desc: "Multi-user spatial room sync over WebSockets." },
      { title: "Realism", desc: "Physically-based rendering (PBR) studio lighting setups." },
      { title: "Cross-Platform", desc: "Zero-install browser experience compatible with VR headsets and desktops." }
    ],
    heroImg: PROJECT_CARDS[2],
    gallery: [
      PROJECT_CARDS[2],
      PROJECT_CARDS[4],
      PROJECT_CARDS[0],
      PROJECT_CARDS[1],
      PROJECT_CARDS[3],
      PROJECT_CARDS[5]
    ]
  },
  "10": {
    title: "Hyperion Mobility Dashboard",
    sub: "Automotive UI & Embedded System",
    chips: ["Automotive UI", "Embedded System"],
    headline: `Next-gen vehicle cockpit interface designed <span class="text-muted-highlight">for touch and gesture control with telemetry.</span>`,
    features: [
      { title: "Telemetry", desc: "Real-time vehicle diagnostics and sensor mesh visualizations." },
      { title: "Safety", desc: "High-contrast glanceable typography designed for zero distraction." },
      { title: "Adaptability", desc: "Dynamic night/day theme switching based on ambient light sensors." }
    ],
    heroImg: PROJECT_CARDS[3],
    gallery: [
      PROJECT_CARDS[3],
      PROJECT_CARDS[5],
      PROJECT_CARDS[1],
      PROJECT_CARDS[2],
      PROJECT_CARDS[4],
      PROJECT_CARDS[0]
    ]
  },
  "11": {
    title: "Pulse Healthcare Portal",
    sub: "Healthcare & Cloud Infrastructure",
    chips: ["Healthcare", "Cloud Infrastructure"],
    headline: `HIPAA-compliant telemedicine platform connecting patients <span class="text-muted-highlight">and specialists with video workflows.</span>`,
    features: [
      { title: "Privacy", desc: "End-to-end encrypted WebRTC video sessions and medical record vaults." },
      { title: "Triage", desc: "AI-assisted symptom intake and specialist matching logic." },
      { title: "Accessibility", desc: "AA-level WCAG compliant interface optimized for all ages." }
    ],
    heroImg: PROJECT_CARDS[4],
    gallery: [
      PROJECT_CARDS[4],
      PROJECT_CARDS[0],
      PROJECT_CARDS[2],
      PROJECT_CARDS[3],
      PROJECT_CARDS[5],
      PROJECT_CARDS[1]
    ]
  },
  "12": {
    title: "Cipher Security Command",
    sub: "Cybersecurity & Data Viz",
    chips: ["Cybersecurity", "Data Visualization"],
    headline: `Unified threat monitoring console delivering <span class="text-muted-highlight">instant anomaly detection and security responses.</span>`,
    features: [
      { title: "Detection", desc: "Real-time anomaly graph visualizations powered by machine learning filters." },
      { title: "Action", desc: "One-click threat mitigation and dynamic firewall rule deployment." },
      { title: "Reporting", desc: "Automated compliance audit reports generated in real time." }
    ],
    heroImg: PROJECT_CARDS[5],
    gallery: [
      PROJECT_CARDS[5],
      PROJECT_CARDS[1],
      PROJECT_CARDS[3],
      PROJECT_CARDS[4],
      PROJECT_CARDS[0],
      PROJECT_CARDS[2]
    ]
  }
};

export function initProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || "1";

  const data = PROJECTS_DATA[id] || PROJECTS_DATA["1"];
  const currentId = parseInt(id, 10) || 1;

  // Compute prev and next project IDs
  const prevId = currentId === 1 ? 12 : currentId - 1;
  const nextId = currentId === 12 ? 1 : currentId + 1;
  const prevData = PROJECTS_DATA[prevId.toString()];
  const nextData = PROJECTS_DATA[nextId.toString()];

  // Page title
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) pageTitle.textContent = `${data.title} | Syntellite Agency`;

  // Hero Image & Overlay
  const heroImg = document.getElementById('detail-hero-img');
  if (heroImg) heroImg.src = data.heroImg;

  const overlayTitle = document.getElementById('detail-hero-overlay-title');
  if (overlayTitle) overlayTitle.textContent = data.title;

  const overlaySub = document.getElementById('detail-hero-overlay-sub');
  if (overlaySub) overlaySub.textContent = data.sub;

  // Chips
  const chipsContainer = document.getElementById('detail-chips');
  if (chipsContainer && data.chips) {
    chipsContainer.innerHTML = data.chips.map(chip => `<span class="project-chip">${chip}</span>`).join('');
  }

  // Headline
  const headline = document.getElementById('detail-headline');
  if (headline) headline.innerHTML = data.headline;

  // Features
  if (data.features) {
    data.features.forEach((feat, index) => {
      const idx = index + 1;
      const t = document.getElementById(`feature-${idx}-title`);
      const d = document.getElementById(`feature-${idx}-desc`);
      if (t) t.textContent = feat.title;
      if (d) d.textContent = feat.desc;
    });
  }

  // Gallery Images (populates strictly Project Cards 1 through 6)
  if (data.gallery) {
    data.gallery.forEach((imgSrc, index) => {
      const img = document.getElementById(`gallery-img-${index + 1}`);
      if (img) img.src = imgSrc;
    });
  }

  // Prev / Next Navigation
  const prevLink = document.getElementById('prev-project-link');
  const prevName = document.getElementById('prev-project-name');
  if (prevLink && prevData) {
    prevLink.href = `/project-detail.html?id=${prevId}`;
    if (prevName) prevName.textContent = prevData.title;
  }

  const nextLink = document.getElementById('next-project-link');
  const nextName = document.getElementById('next-project-name');
  if (nextLink && nextData) {
    nextLink.href = `/project-detail.html?id=${nextId}`;
    if (nextName) nextName.textContent = nextData.title;
  }
}

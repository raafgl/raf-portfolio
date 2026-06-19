import { PROJECTS, BRAND_PARTNERS, CV_ITEMS, WORKED_FOR_BRANDS } from './data.js';

// State Management
let enableSound = true;
let activeSegment = 'welcome';
let activeTab = 'all';

// Audio Context Web Audio API Synth Definition
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Tactical Metallic Sound effect
export function playTick() {
  if (!enableSound) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

    gainNode.gain.setValueAtTime(0.06, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch (error) {
    console.debug('Audio blocked or unsupported');
  }
}

// High-to-low Success sound effect
export function playSuccess() {
  if (!enableSound) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode1 = ctx.createGain();
    const gainNode2 = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(600, now);
    osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
    gainNode1.gain.setValueAtTime(0.04, now);
    gainNode1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc1.connect(gainNode1);
    gainNode1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.16);

    setTimeout(() => {
      try {
        const delayedNow = ctx.currentTime;
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1200, delayedNow);
        gainNode2.gain.setValueAtTime(0.05, delayedNow);
        gainNode2.gain.exponentialRampToValueAtTime(0.001, delayedNow + 0.2);

        osc2.connect(gainNode2);
        gainNode2.connect(ctx.destination);
        osc2.start(delayedNow);
        osc2.stop(delayedNow + 0.21);
      } catch (e) {}
    }, 120);
  } catch (error) {
    console.debug('Audio blocked or unsupported');
  }
}

// Micro tone hum high-contrast hover sound effect
export function playHover() {
  if (!enableSound) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(250, now + 0.05);

    gainNode.gain.setValueAtTime(0.03, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch (error) {
    console.debug('Audio blocked or unsupported');
  }
}

// Expose sound triggers to window for HTML inline access
window.playTick = playTick;
window.playHover = playHover;

// Scroll to segment index logic
window.scrollToSegment = function(index) {
  playTick();
  const container = document.getElementById('scroll-container');
  if (container) {
    container.scrollTo({
      top: index * window.innerHeight,
      behavior: 'smooth'
    });
  }
};

// Scanlines CRT filter Toggle controller
window.toggleScanlines = function() {
  playTick();
  const root = document.getElementById('body-root');
  const btn = document.getElementById('scanlines-toggle');
  if (root.classList.contains('scanlines')) {
    root.classList.remove('scanlines');
    btn.innerHTML = `<i data-lucide="tv" class="w-3 h-3"></i> scanlines: off`;
    btn.classList.add('text-zinc-500');
  } else {
    root.classList.add('scanlines');
    btn.innerHTML = `<i data-lucide="tv" class="w-3 h-3"></i> CRT`;
    btn.classList.remove('text-zinc-500');
  }
  lucide.createIcons();
};

// Toggle general Audio effects block
window.toggleSound = function() {
  enableSound = !enableSound;
  const btn = document.getElementById('sound-toggle');
  const icon = document.getElementById('sound-icon');
  if (enableSound) {
    playTick();
    btn.innerHTML = `<i data-lucide="volume-2" id="sound-icon" class="w-3 h-3 text-brand-orange"></i> sound`;
    btn.classList.remove('text-zinc-500');
  } else {
    btn.innerHTML = `<i data-lucide="volume-x" id="sound-icon" class="w-3 h-3 text-zinc-500"></i> sound: off`;
    btn.classList.add('text-zinc-500');
  }
  lucide.createIcons();
};

// Scroll listener handler for active navigation highlighting and vertical tracking
const handleScrollTracker = () => {
  const container = document.getElementById('scroll-container');
  if (!container) return;
  
  const scrollY = container.scrollTop;
  const height = window.innerHeight;
  const index = Math.round(scrollY / height);
  
  const segments = ['welcome', 'branding', 'interface', 'print', 'worked-for'];
  const newActive = segments[index] || 'welcome';
  
  if (newActive !== activeSegment) {
    activeSegment = newActive;
    playHover();
    updateNavigationHighlight();
  }

  const maxScroll = container.scrollHeight - container.clientHeight;
  const percent = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
  
  // Update indicator vertical bar translate height
  const indicator = document.getElementById('scroll-indicator');
  if (indicator) {
    indicator.style.transform = `translateY(${ (percent / 100) * 400 }%)`;
  }
};

const updateNavigationHighlight = () => {
  const ids = {
    welcome: 'branding-logo',
    branding: 'nav-branding',
    interface: 'nav-interface',
    print: 'nav-print',
    'worked-for': 'nav-worked-for'
  };

  // Reset colors on all headers anchors
  Object.keys(ids).forEach((seg) => {
    const el = document.getElementById(ids[seg]);
    if (el && seg !== 'welcome') {
      if (seg === activeSegment) {
        el.className = "nav-anchor transition-colors py-1 lowercase cursor-pointer bg-transparent border-0 text-brand-orange font-bold font-mono";
      } else {
        el.className = "nav-anchor transition-colors py-1 lowercase cursor-pointer bg-transparent border-0 text-zinc-400 hover:text-white";
      }
    }
  });
};

// Render lists dynamically in pristine brutalist formats
const renderProjectsLists = () => {
  const brandingGrid = document.getElementById('branding-grid');
  const interfaceGrid = document.getElementById('interface-grid');
  const printGrid = document.getElementById('print-grid');

  if (brandingGrid) {
    brandingGrid.innerHTML = PROJECTS.filter(p => p.category === 'branding').map(proj => `
      <div 
        onclick="openProjectModal('${proj.id}')"
        onmouseenter="playHover()"
        class="bg-brand-surface-card/85 hover:bg-black/90 p-5 border border-brand-outline/20 hover:border-brand-orange transition-all cursor-pointer rounded group"
      >
        <h3 class="font-sans text-lg font-bold group-hover:text-brand-orange transition-colors mb-2 lowercase">${proj.title}</h3>
        <span class="inline-flex items-center gap-1 font-mono text-[10px] text-brand-orange mt-4 uppercase group-hover:translate-x-1 transition-transform">
          .view project <i data-lucide="chevron-right" class="w-3 h-3 inline"></i>
        </span>
      </div>
    `).join('');
  }

  if (interfaceGrid) {
    interfaceGrid.innerHTML = PROJECTS.filter(p => p.category === 'interface').map(proj => `
      <div 
        onclick="openProjectModal('${proj.id}')"
        onmouseenter="playHover()"
        class="bg-brand-surface-card/85 hover:bg-black/90 p-5 border border-brand-outline/20 hover:border-brand-orange transition-all cursor-pointer rounded group"
      >
        <h3 class="font-sans text-lg font-bold group-hover:text-brand-orange transition-colors mb-2 lowercase">${proj.title}</h3>
        <span class="inline-flex items-center gap-1 font-mono text-[10px] text-brand-orange mt-4 uppercase group-hover:translate-x-1 transition-transform">
          .view project <i data-lucide="chevron-right" class="w-3 h-3 inline"></i>
        </span>
      </div>
    `).join('');
  }

  if (printGrid) {
    printGrid.innerHTML = PROJECTS.filter(p => p.category === 'print').map(proj => `
      <div 
        onclick="openProjectModal('${proj.id}')"
        onmouseenter="playHover()"
        class="bg-brand-surface-card/85 hover:bg-black/90 p-5 border border-brand-outline/20 hover:border-brand-orange transition-all cursor-pointer rounded group md:col-span-2"
      >
        <h3 class="font-sans text-lg font-bold group-hover:text-brand-orange transition-colors mb-2 lowercase">${proj.title}</h3>
        <span class="inline-flex items-center gap-1 font-mono text-[10px] text-brand-orange mt-4 uppercase group-hover:translate-x-1 transition-transform">
          .view project <i data-lucide="chevron-right" class="w-3 h-3 inline"></i>
        </span>
      </div>
    `).join('');
  }

  const workedGrid = document.getElementById('worked-for-grid');
  if (workedGrid) {
    workedGrid.innerHTML = WORKED_FOR_BRANDS.map(brand => `
      <div class="py-1.5 border-b border-white/5 hover:text-brand-orange hover:border-brand-orange/30 transition-all cursor-default">
        ${brand}
      </div>
    `).join('');
  }
};

// Interactive Case Study details view
window.openProjectModal = function(id) {
  playSuccess();
  const proj = PROJECTS.find(p => p.id === id);
  if (!proj) return;

  // Insert items securely
  document.getElementById('modal-project-category').innerText = `case study / ${proj.category}`;
  document.getElementById('modal-project-title').innerText = proj.title;
  document.getElementById('modal-project-subtitle').innerText = proj.subtitle;
  document.getElementById('modal-project-desc').innerText = proj.longDescription || proj.description;
  document.getElementById('modal-project-year').innerText = `${proj.year} / completed`;

  const img = document.getElementById('modal-project-image');
  img.src = proj.image;
  img.alt = proj.title;

  const kitContainer = document.getElementById('modal-project-toolkit');
  kitContainer.innerHTML = proj.tools.map(tool => `
    <span class="px-2 py-0.5 bg-brand-surface border border-brand-outline/20 font-mono text-[11px] uppercase rounded-sm">
      ${tool}
    </span>
  `).join('');

  const featuresContainer = document.getElementById('modal-project-features');
  if (proj.features && proj.features.length > 0) {
    featuresContainer.innerHTML = proj.features.map(feature => `
      <li class="flex items-start gap-2 text-xs text-brand-text-muted font-sans border-l border-brand-orange pl-3 lowercase py-0.5">
        ${feature}
      </li>
    `).join('');
  } else {
    featuresContainer.innerHTML = '';
  }

  const modal = document.getElementById('project-modal');
  const inner = document.getElementById('project-modal-content');
  modal.classList.remove('hidden');
  
  // Staggered translate effect
  setTimeout(() => {
    inner.classList.remove('translate-x-full');
  }, 50);

  lucide.createIcons();
};

window.closeProjectModal = function() {
  playTick();
  const modal = document.getElementById('project-modal');
  const inner = document.getElementById('project-modal-content');
  inner.classList.add('translate-x-full');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 500);
};


// Interactive Resume credentials dashboard modal controller
window.openResumeModal = function() {
  playSuccess(); // play confirm synthesiser
  
  // Populate skills matrices once
  const skillsMatrices = document.getElementById('skills-matrices');
  const skillSets = [
    { category: '.brand architecture', items: ['brand guidelines', 'logo creation', 'visual systems', 'stationery sets'] },
    { category: '.digital interfaces', items: ['UX/UI design', 'Figma prototypes', 'React coding', 'mobile styling'] },
    { category: '.fine print tech', items: ['silkscreen prints', 'pantone mapping', 'typographic books', 'material curation'] },
    { category: '.creative motion', items: ['commercial trailers', 'logo stings', 'product mockups', 'After Effects'] },
  ];

  skillsMatrices.innerHTML = skillSets.map(group => `
    <div class="border-l border-brand-outline/20 pl-3">
      <h4 class="font-mono text-xs text-brand-text font-bold uppercase mb-1">${group.category}</h4>
      <div class="flex flex-wrap gap-1">
        ${group.items.map(item => `
          <span class="px-2 py-0.5 bg-brand-surface/40 border border-brand-outline/10 text-[10px] text-brand-text-muted hover:text-brand-orange rounded-sm transition-colors uppercase font-mono">
            ${item}
          </span>
        `).join('')}
      </div>
    </div>
  `).join('');

  // Initial timeline ledger render with "all" status active
  filterLedger('all');

  const modal = document.getElementById('resume-modal');
  const content = document.getElementById('resume-modal-content');
  modal.classList.remove('hidden');
  setTimeout(() => {
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
  }, 50);

  lucide.createIcons();
};

window.closeResumeModal = function() {
  playTick();
  const modal = document.getElementById('resume-modal');
  const content = document.getElementById('resume-modal-content');
  content.classList.add('scale-95');
  content.classList.remove('scale-100');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 200);
};

window.filterLedger = function(tab) {
  playTick();
  activeTab = tab;

  // Render tab toggle highlight states
  const tabs = ['all', 'experience', 'education'];
  tabs.forEach(t => {
    const el = document.getElementById(`filter-${t}`);
    if (el) {
      if (t === tab) {
        el.className = "cv-tab-btn px-3 py-1 text-xs font-mono lowercase border transition-all rounded-sm bg-brand-orange border-brand-orange text-brand-orange-light";
      } else {
        el.className = "cv-tab-btn px-3 py-1 text-xs font-mono lowercase border transition-all rounded-sm border-brand-outline/20 hover:border-brand-orange text-brand-text-muted";
      }
    }
  });

  // Render timeline lists
  const timelineList = document.getElementById('timeline-list');
  const filtered = CV_ITEMS.filter(item => tab === 'all' || item.type === tab);

  timelineList.innerHTML = filtered.map(item => `
    <div 
      onmouseenter="playHover()"
      class="relative pl-6 border-l border-brand-outline/20 hover:border-brand-orange group transition-colors pb-1"
    >
      <!-- Bullet node circle -->
      <div class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full border border-brand-surface-card bg-brand-outline group-hover:bg-brand-orange transition-colors"></div>
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
        <h4 class="font-sans text-sm font-bold text-brand-text uppercase tracking-tight group-hover:text-brand-orange transition-colors">
          ${item.title}
        </h4>
        <span class="shrink-0 font-mono text-[10px] uppercase text-brand-orange-hover bg-brand-orange/10 px-2 py-0.5 border border-brand-orange/20 rounded-sm">
          ${item.date}
        </span>
      </div>

      <p class="font-mono text-xs text-brand-text-muted font-medium mb-2 lowercase">
        ${item.subtitle}
      </p>

      <p class="font-sans text-xs text-brand-text-muted/80 leading-relaxed lowercase">
        ${item.description}
      </p>
    </div>
  `).join('');
};

window.downloadPDF = function() {
  playTick();
  alert('CV printed simulated dispatch! In production, this hosts your secure portfolio PDF file.');
};


// Main setup initialization block
document.addEventListener('DOMContentLoaded', () => {
  renderProjectsLists();
  
  const container = document.getElementById('scroll-container');
  if (container) {
    container.addEventListener('scroll', handleScrollTracker, { passive: true });
  }

  // Bind Behance mock click
  const behanceLink = document.getElementById('behance-link');
  if (behanceLink) {
    behanceLink.addEventListener('click', (e) => {
      e.preventDefault();
      playTick();
      alert('Redirecting to Behance network mockup! Ready for physical link.');
    });
  }

  // Render Lucide SVGs initially
  lucide.createIcons();
});

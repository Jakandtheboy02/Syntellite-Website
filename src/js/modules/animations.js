/**
 * Animations & Interactions Scaffolding
 */
import { subscribeScroll } from './smoothScroll.js';


/**
 * Initializes IntersectionObserver to trigger scroll reveals on elements with class '.scroll-reveal'
 */
export function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if (revealElements.length) {
    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => {
      observer.observe(el);
    });
  }
}

/**
 * Fallbacks for browsers that lack CSS Scroll-Driven Animations support.
 */
export function initScrollFallbacks() {
  const supportsScrollTimeline = CSS.supports('animation-timeline', 'scroll()');

  if (supportsScrollTimeline) return;

  console.log('Scroll timelines not supported. Loading JS scroll fallbacks.');

  const scrollProgress = document.getElementById('scroll-progress');
  const mainHeader = document.getElementById('main-header');

  const onScroll = () => {
    const scrollY = window.scrollY;

    // 1. Scroll Progress Bar
    if (scrollProgress) {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight > 0) {
        const progressPercent = scrollY / scrollableHeight;
        scrollProgress.style.transform = `scaleX(${progressPercent})`;
      }
    }

    // 2. Shrinking Header
    if (mainHeader) {
      if (scrollY > 50) {
        mainHeader.classList.add('header-scrolled');
      } else {
        mainHeader.classList.remove('header-scrolled');
      }
    }

    // 3. Background Video Scroll Parallax Fallback (Shrinks frame & rounded corners)
    const container = document.querySelector('.hero-video-container');
    if (container) {
      const limit = window.innerHeight;
      const p = Math.min(1, Math.max(0, scrollY / limit));

      // Phase 1: Shrink frame and round corners (from p = 0 to p = 0.5)
      const shrinkP = Math.min(1, p / 0.5);
      const width = 100 - 10 * shrinkP;          // 100% -> 90%
      const height = 100 - 20 * shrinkP;         // 100% -> 80%
      const left = 5 * shrinkP;                  // 0% -> 5%
      const borderRadius = 24 * shrinkP;         // 0px -> 24px

      // Continuous linear vertical slide up off-screen
      const topVal = -110 * p;                   // 0% -> -110%

      container.style.width = `${width}%`;
      container.style.height = `${height}vh`;
      container.style.left = `${left}%`;
      container.style.top = `${topVal}vh`;
      container.style.borderRadius = `${borderRadius}px`;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once initially
}

/**
 * Handles mobile hamburger toggle and overlays.
 */
export function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const headerNav = document.getElementById('header-nav');

  if (!menuToggle || !headerNav) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

    menuToggle.setAttribute('aria-expanded', !isOpen);
    menuToggle.classList.toggle('active');
    headerNav.classList.toggle('nav-open');

    // Force expand the links card when menu toggle is clicked
    if (headerNav.classList.contains('nav-collapsed')) {
      headerNav.classList.remove('nav-collapsed');
    }
  });

  // Close menu when clicking link
  headerNav.querySelectorAll('.nav-link, .nav-item').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('active');
      headerNav.classList.remove('nav-open');
    });
  });

  // Dynamic Scroll Collapse: collapse inactive links when scrolling down, expand on scrolling up
  let lastScrollY = window.scrollY;
  const onScroll = () => {
    const currentScrollY = window.scrollY;

    // If the mobile menu toggle is active, keep header expanded
    if (menuToggle.classList.contains('active') || headerNav.classList.contains('nav-open')) {
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > lastScrollY && currentScrollY > 120) {
      // Scroll Down -> Collapse Center Card to Active item only
      headerNav.classList.add('nav-collapsed');
    } else if (currentScrollY < lastScrollY) {
      // Scroll Up -> Expand back to default state
      headerNav.classList.remove('nav-collapsed');
    }
    lastScrollY = currentScrollY;
  };

  subscribeScroll(onScroll);
  onScroll();
}

/**
 * Premium Form Validation and Auto-Expanding Textarea on the Contact page
 */
export function initContactForm() {
  const form = document.getElementById('contact-new-form') || document.getElementById('agency-contact-form');
  
  // Auto-expanding textarea logic with max-height and scrolling
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach((textarea) => {
    const adjustHeight = () => {
      textarea.style.height = 'auto';
      const maxHeight = 180;
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    };

    textarea.addEventListener('input', adjustHeight);
    textarea.addEventListener('wheel', (e) => {
      if (textarea.scrollHeight > textarea.clientHeight) {
        e.stopPropagation();
      }
    }, { passive: true });
    adjustHeight();
  });

  if (!form) return;

  // Handle Form Submission to Info@syntellite.com
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    const nameInput = form.querySelector('#contact-name') || form.querySelector('[name="name"]');
    const emailInput = form.querySelector('#contact-email') || form.querySelector('[name="email"]');
    const messageInput = form.querySelector('#contact-message') || form.querySelector('[name="message"]');

    const name = nameInput?.value.trim() || 'Website Visitor';
    const email = emailInput?.value.trim() || '';
    const message = messageInput?.value.trim() || '';

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    const span = submitBtn.querySelector('span');
    if (span) span.textContent = 'Sending Message...';

    const mailtoSubject = encodeURIComponent(`New Website Inquiry from ${name}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const mailtoUrl = `mailto:Info@syntellite.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    try {
      // 1. Post to FormSubmit AJAX endpoint for direct email delivery to Info@syntellite.com
      const response = await fetch('https://formsubmit.co/ajax/Info@syntellite.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `New Contact Submission from ${name}`
        })
      });

      if (!response.ok) {
        // Fallback to mailto link
        window.location.href = mailtoUrl;
      }
    } catch (err) {
      // Fallback to mailto link
      window.location.href = mailtoUrl;
    }

    // Success UI Feedback & Toast Popup Trigger
    if (span) span.textContent = 'Message Sent! ✓';
    submitBtn.style.opacity = '1';
    form.reset();

    // Show professional success notification popup
    showSuccessToast();

    // Reset textarea height after form reset
    textareas.forEach((ta) => {
      ta.style.height = 'auto';
      ta.style.overflowY = 'hidden';
    });

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 3500);
  });
}

/**
 * Triggers the floating success toast popup notification
 */
function showSuccessToast() {
  const toast = document.getElementById('contact-success-toast');
  if (!toast) return;

  toast.classList.add('active');
  toast.setAttribute('aria-hidden', 'false');

  const closeBtn = toast.querySelector('.toast-close-btn');
  const dismiss = () => {
    toast.classList.remove('active');
    toast.setAttribute('aria-hidden', 'true');
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', dismiss, { once: true });
  }

  setTimeout(dismiss, 5500);
}


/**
 * Tracks what is actually painted behind the bottom floating nav bar and adapts
 * its CSS variables accordingly.
 *
 * Rather than matching the nav's centre against the section list (which misses
 * overlapping / pinned sections and any section whose visible colour comes from
 * a parent or a transparent background), this hit-tests the element stack at a
 * few points behind the nav and resolves the first backdrop that actually paints
 * something: an explicit data-bg / *-section hint, a photographic background, or
 * an opaque background colour whose relative luminance decides light vs dark.
 */
export function initBottomNavThemeTracker() {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;

  // Horizontal sample positions across the nav (fractions of its width)
  const SAMPLE_RATIOS = [0.12, 0.5, 0.88];
  // Above this backdrop luminance the default translucent-white capsule stops
  // reading, so the nav flips to its dark capsule.
  const LIGHT_THRESHOLD = 0.35;

  const parseColor = (value) => {
    const match = /rgba?\(([^)]+)\)/.exec(value || '');
    if (!match) return null;
    const parts = match[1].split(/[,\s/]+/).filter(Boolean).map(parseFloat);
    if (parts.length < 3 || parts.some(Number.isNaN)) return null;
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };

  // WCAG relative luminance
  const relativeLuminance = ({ r, g, b }) => {
    const [lr, lg, lb] = [r, g, b].map((channel) => {
      const c = channel / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
  };

  // Resolves light (true) / dark (false) / undecided (null) at one point
  const sampleAt = (x, y) => {
    const stack = document.elementsFromPoint(x, y);

    for (const el of stack) {
      if (el === nav || nav.contains(el)) continue;

      // Explicit author intent always wins over computed colour
      const hint = el.dataset ? el.dataset.bg : null;
      if (hint === 'light') return true;
      if (hint === 'dark') return false;
      if (el.classList.contains('light-section')) return true;
      if (el.classList.contains('dark-section')) return false;

      const style = getComputedStyle(el);

      // Photographic backdrop of unknown colour: keep the white capsule
      if (style.backgroundImage.includes('url(')) return false;

      const bg = parseColor(style.backgroundColor);
      if (bg && bg.a >= 0.5) return relativeLuminance(bg) > LIGHT_THRESHOLD;
      // Transparent / near-transparent: keep walking down the stack
    }

    return null;
  };

  let appliedLight = null;

  const resolveTheme = () => {
    const rect = nav.getBoundingClientRect();
    const y = rect.top + rect.height / 2;

    let lightVotes = 0;
    let darkVotes = 0;

    for (const ratio of SAMPLE_RATIOS) {
      const result = sampleAt(rect.left + rect.width * ratio, y);
      if (result === true) lightVotes++;
      else if (result === false) darkVotes++;
    }

    // Nothing resolved (e.g. off-screen during load): fall back to the page background
    if (!lightVotes && !darkVotes) {
      const pageBg = parseColor(getComputedStyle(document.body).backgroundColor)
        || parseColor(getComputedStyle(document.documentElement).backgroundColor);
      const isLight = pageBg && pageBg.a >= 0.5
        ? relativeLuminance(pageBg) > LIGHT_THRESHOLD
        : false;
      lightVotes = isLight ? 1 : 0;
      darkVotes = isLight ? 0 : 1;
    }

    const isLight = lightVotes > darkVotes;
    if (isLight === appliedLight) return;

    appliedLight = isLight;
    nav.classList.toggle('nav-light-bg', isLight);
  };

  // Coalesce every scroll/resize event down to at most one hit-test per frame
  let frame = 0;
  const scheduleCheck = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      resolveTheme();
    });
  };

  subscribeScroll(scheduleCheck);
  // Native scroll as a safety net for anything Lenis does not drive (touch
  // momentum, scroll restoration, programmatic jumps) - the rAF gate above
  // collapses the duplicate signal, so this costs nothing.
  window.addEventListener('scroll', scheduleCheck, { passive: true });
  window.addEventListener('resize', scheduleCheck, { passive: true });
  window.addEventListener('load', scheduleCheck);
  resolveTheme(); // Run once immediately so the nav never flashes the wrong theme
}

/**
 * Handles the fading of the scroll indicator pill upon scrolling.
 */
export function initScrollPill() {
  const scrollPill = document.getElementById('scroll-pill');
  if (!scrollPill) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      scrollPill.classList.add('fade-out');
      window.removeEventListener('scroll', onScroll);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Scroll-driven continuous layout morph between fanned showcase cards and Projects masonry grid
 */
export function initPortfolioMorph() {
  const wrapper = document.getElementById('portfolio-wrapper');
  const cards = document.querySelectorAll('.morphing-cards-overlay .showcase-card');
  const showcaseTitleBlock = document.querySelector('.showcase-title-block');
  const showcaseTitle = showcaseTitleBlock ? showcaseTitleBlock.querySelector('.showcase-title') : null;
  const showcaseSubtitle = showcaseTitleBlock ? showcaseTitleBlock.querySelector('.showcase-subtitle') : null;
  const projectsTitleBlock = document.querySelector('.projects-title-block');
  const ctaOverlay = document.querySelector('.projects-cta-overlay');

  if (!wrapper || !cards.length) return;

  let targetP = 0;
  let currentP = 0;

  const calculateTargetP = () => {
    const wrapperRect = wrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrolled = -wrapperRect.top;
    const totalScrollableDistance = wrapperRect.height - windowHeight;

    if (totalScrollableDistance <= 0) return 0;

    const PRE_PHASE_DISTANCE = windowHeight * 0.2; // subtle entry buffer (20% of viewport)
    const combinedScrolled = scrolled + PRE_PHASE_DISTANCE;
    const combinedTotal = totalScrollableDistance + PRE_PHASE_DISTANCE;
    return Math.min(1, Math.max(0, combinedScrolled / combinedTotal));
  };

  const onScroll = () => {
    targetP = calculateTargetP();
  };

  const render = (p) => {
    const wrapperRect = wrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const overlayWidth = wrapper.offsetWidth;
    const overlayHeight = windowHeight;

    // Determine the grid start Y position based on screen width to sit below Projects title (adjusted down for top padding)
    let gridStartY = 320;
    if (window.innerWidth <= 768) {
      gridStartY = 220;
    } else if (window.innerWidth <= 992) {
      gridStartY = 260;
    }

    // Determine the fanned showcase start Y position based on screen width/height to center cards vertically
    let showcaseStartY = 380;
    if (window.innerWidth <= 768) {
      const subtitleBottom = showcaseSubtitle ? (showcaseSubtitle.getBoundingClientRect().height + (window.innerWidth <= 480 ? 115 : 130)) : 180;
      const bottomLimit = overlayHeight - 80;
      const cardHeight = cards.length > 0 ? parseFloat(getComputedStyle(cards[0]).getPropertyValue('--card-size') || 190) : 190;
      showcaseStartY = Math.max(subtitleBottom + 30, Math.round((subtitleBottom + bottomLimit) / 2 - cardHeight / 2 + 10));
    } else if (window.innerWidth <= 992) {
      showcaseStartY = 330;
    }

    // Read grid size variables from first card to calculate dynamic overflow scroll translation
    let gridW = 1200;
    let gridH = 760;
    if (cards.length > 0) {
      const firstCardStyle = getComputedStyle(cards[0]);
      gridW = parseFloat(firstCardStyle.getPropertyValue('--grid-w') || 1200);
      gridH = parseFloat(firstCardStyle.getPropertyValue('--grid-h') || 760);
    }

    // Calculate dynamic scaling factor so margins and gaps are equal
    let scale = 1;
    if (window.innerWidth > 992) {
      // Desktop base grid: 1200px wide, column sum: 1170px, gap: 30px. Math: (1170 + 3 * 30) = 1260px.
      scale = Math.min(1.4, overlayWidth / 1260);
    } else if (window.innerWidth > 768) {
      // Tablet base grid: 600px wide, column sum: 585px, gap: 15px. Math: (585 + 3 * 15) = 630px.
      scale = Math.min(1.25, overlayWidth / 630);
    } else {
      // Mobile: margin 20px, so grid width fills screen minus 40px
      scale = Math.min(1.15, (overlayWidth - 40) / 300);
    }

    const scaledGridW = gridW * scale;
    const scaledGridH = gridH * scale;

    // Dynamic vertical scroll translation for overflow grid layouts (safeguard bottom crops on short viewports)
    const ctaHeight = ctaOverlay ? (ctaOverlay.offsetHeight || 80) : 80;
    const gridTotalHeight = gridStartY + scaledGridH;
    let scrollOffset = 0;
    if (gridTotalHeight > overlayHeight) {
      const overflowY = gridTotalHeight - overlayHeight + 40 * scale + ctaHeight + 60; // scale row gap
      if (p > 0.9) {
        const p_scroll = Math.min(1, Math.max(0, (p - 0.9) / 0.1));
        scrollOffset = overflowY * p_scroll;
      }
    }

    // Position the "more Projects" CTA below the grid during Phase 4
    if (ctaOverlay) {
      if (p >= 0.9) {
        const ctaTop = gridStartY + scaledGridH + 40 * scale - scrollOffset; // gap scales too
        ctaOverlay.style.top = `${ctaTop}px`;
        const ctaOpacity = Math.min(1, (p - 0.9) / 0.08);
        ctaOverlay.style.opacity = ctaOpacity;
        ctaOverlay.style.pointerEvents = ctaOpacity > 0.5 ? 'auto' : 'none';
      } else {
        ctaOverlay.style.opacity = 0;
        ctaOverlay.style.pointerEvents = 'none';
      }
    }

    // 2. Animate and Crossfade Title Blocks based on timeline
    if (showcaseTitleBlock && projectsTitleBlock) {
      // Progressive scroll-linked mask color sweeps for Showcase title & subtitle (bidirectional)
      const showcase_title_p = Math.min(1, Math.max(0, (p - 0.02) / 0.32));
      const showcase_subtitle_p = Math.min(1, Math.max(0, (p - 0.08) / 0.30));
      if (showcaseTitle) showcaseTitle.style.setProperty('--reveal-progress', showcase_title_p.toFixed(4));
      if (showcaseSubtitle) showcaseSubtitle.style.setProperty('--reveal-progress', showcase_subtitle_p.toFixed(4));

      const projectsTitle = projectsTitleBlock.querySelector('.projects-title');
      const isMobile = window.innerWidth <= 768;
      const floatDistance = isMobile ? 120 : 220;

      // Calculate initial Y offset placing Projects title directly behind the showcase cards stack
      const titleSettledTop = isMobile ? 55 : (window.innerWidth <= 992 ? 100 : 140);
      const startBehindCardsY = Math.max(150, showcaseStartY - titleSettledTop + 30);

      if (p < 0.35) {
        // Phase 1: Showcase Title centered, Projects Title tucked behind the showcase cards stack
        showcaseTitleBlock.style.opacity = '1';
        showcaseTitleBlock.style.transform = 'translate3d(0, 0px, 0)';
        projectsTitleBlock.style.opacity = '0';
        projectsTitleBlock.style.transform = `translate3d(0, ${startBehindCardsY}px, 0)`;
        if (projectsTitle) {
          projectsTitle.style.setProperty('--reveal-progress', '0');
        }
      } else if (p < 0.75) {
        // Phase 2/3: Slow, graceful rise-up from behind the showcase cards stack up to the header area
        // Spans p from 0.35 to 0.75 (0.40 progress span) for a slow, stately motion matched to scroll speed
        const p_rise = (p - 0.35) / 0.40;
        // Smoothstep easing for natural physical inertia
        const easeRise = p_rise * p_rise * (3 - 2 * p_rise);
        const showcaseOpacity = Math.max(0, 1 - easeRise * 1.15).toFixed(4);
        const showcaseTranslateY = (-floatDistance * easeRise).toFixed(2);
        const projectsTranslateY = (startBehindCardsY * (1 - easeRise) - scrollOffset).toFixed(2);
        const projectsOpacity = Math.min(1, easeRise * 1.5).toFixed(4);

        showcaseTitleBlock.style.opacity = showcaseOpacity;
        showcaseTitleBlock.style.transform = `translate3d(0, ${showcaseTranslateY}px, 0)`;
        projectsTitleBlock.style.opacity = projectsOpacity;
        projectsTitleBlock.style.transform = `translate3d(0, ${projectsTranslateY}px, 0)`;

        if (projectsTitle) {
          projectsTitle.style.setProperty('--reveal-progress', easeRise.toFixed(4));
        }
      } else {
        // Phase 4: Showcase Title completely pushed off-screen, Projects Title settled at top header
        showcaseTitleBlock.style.opacity = '0';
        showcaseTitleBlock.style.transform = `translate3d(0, ${-floatDistance}px, 0)`;
        projectsTitleBlock.style.opacity = '1';
        projectsTitleBlock.style.transform = `translate3d(0, ${-scrollOffset.toFixed(2)}px, 0)`;
        if (projectsTitle) {
          projectsTitle.style.setProperty('--reveal-progress', '1');
        }
      }
    }

    // 3. Continuous Scroll-linked layout transitions for overlay cards
    cards.forEach((card) => {
      const style = getComputedStyle(card);
      const tx = parseFloat(style.getPropertyValue('--tx') || 0);
      const ty = parseFloat(style.getPropertyValue('--ty') || 0);
      const rot = parseFloat(style.getPropertyValue('--rot') || 0);
      const gridX = parseFloat(style.getPropertyValue('--grid-x') || 0);
      const gridY = parseFloat(style.getPropertyValue('--grid-y') || 0);
      const gridWidth = parseFloat(style.getPropertyValue('--grid-width') || 230);
      const gridHeight = parseFloat(style.getPropertyValue('--grid-height') || 230);
      const cardSize = parseFloat(style.getPropertyValue('--card-size') || 230);

      // Ensure fanned cards stay cleanly within overlayWidth with a minimum margin on mobile
      let showcaseScale = 1;
      const maxCardSpanHalf = Math.abs(tx) + cardSize / 2;
      const maxAllowedSpanHalf = (overlayWidth - 24) / 2;
      if (maxAllowedSpanHalf > 0 && maxCardSpanHalf > maxAllowedSpanHalf) {
        showcaseScale = maxAllowedSpanHalf / maxCardSpanHalf;
      }

      const effectiveCardSize = cardSize * Math.min(1, Math.max(0.65, showcaseScale));
      const effectiveTx = tx * showcaseScale;

      const showcaseLeft = overlayWidth / 2 + effectiveTx - effectiveCardSize / 2;
      const showcaseTop = showcaseStartY + ty;

      const centerLeft = overlayWidth / 2 - effectiveCardSize / 2;
      const centerTop = showcaseStartY + 80;

      const projectsLeft = overlayWidth / 2 - scaledGridW / 2 + (gridX * scale);
      const projectsTop = gridStartY + (gridY * scale) - scrollOffset;

      if (p < 0.3) {
        const p1 = Math.min(1, Math.max(0, p / 0.3));
        const currentLeft = centerLeft + (showcaseLeft - centerLeft) * p1;
        const currentTop = centerTop + (showcaseTop - centerTop) * p1;
        const currentRot = rot * p1;
        const currentScale = 0.9 + 0.1 * p1;

        card.style.opacity = 1;
        card.style.width = `${effectiveCardSize}px`;
        card.style.height = `${effectiveCardSize}px`;
        card.style.left = `${currentLeft}px`;
        card.style.top = `${currentTop}px`;
        card.style.transform = `rotate(${currentRot}deg) scale(${currentScale})`;

        const info = card.querySelector('.project-info');
        if (info) info.style.opacity = 0;
        card.style.setProperty('--overlay-op', 0);
      } else if (p < 0.65) {
        card.style.opacity = 1;
        card.style.width = `${effectiveCardSize}px`;
        card.style.height = `${effectiveCardSize}px`;
        card.style.left = `${showcaseLeft}px`;
        card.style.top = `${showcaseTop}px`;
        card.style.transform = `rotate(${rot}deg) scale(1)`;

        const info = card.querySelector('.project-info');
        if (info) info.style.opacity = 0;
        card.style.setProperty('--overlay-op', 0);
      } else {
        const p_morph = Math.min(1, Math.max(0, (p - 0.65) / 0.25));
        const w = effectiveCardSize + ((gridWidth * scale) - effectiveCardSize) * p_morph;
        const h = effectiveCardSize + ((gridHeight * scale) - effectiveCardSize) * p_morph;
        const currentLeft = showcaseLeft + (projectsLeft - showcaseLeft) * p_morph;
        const currentTop = showcaseTop + (projectsTop - showcaseTop) * p_morph;
        const currentRot = rot * (1 - p_morph);

        card.style.opacity = 1;
        card.style.width = `${w}px`;
        card.style.height = `${h}px`;
        card.style.left = `${currentLeft}px`;
        card.style.top = `${currentTop}px`;
        card.style.transform = `rotate(${currentRot}deg) scale(1)`;

        const info = card.querySelector('.project-info');
        if (info) {
          const textOp = Math.min(1, Math.max(0, (p_morph - 0.45) / 0.35));
          info.style.opacity = textOp;
          info.style.transform = `translateY(${(1 - textOp) * 15}px)`;
        }
        card.style.setProperty('--overlay-op', p_morph);
      }

      const hoverWrapper = card.querySelector('.card-hover-wrapper');
      if (hoverWrapper) {
        hoverWrapper.style.backgroundPositionY = `${15 + 70 * p}%`;
      }
    });
  };

  const loop = () => {
    // Liquid Inertia LERP smoothing (0.075 interpolation factor for 60fps/120fps motion)
    const diff = targetP - currentP;
    if (Math.abs(diff) > 0.00005) {
      currentP += diff * 0.075;
    } else {
      currentP = targetP;
    }

    render(currentP);

    requestAnimationFrame(loop);
  };

  // Subscribe to Lenis smooth-scroll tick and window events
  subscribeScroll(onScroll);
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
  currentP = targetP;

  // Launch continuous 60fps/120fps physics render loop
  requestAnimationFrame(loop);
}

export function initTrustAnimation() {
  const section = document.getElementById('trust');
  const lines = document.querySelectorAll('.trust-line');
  const image = section ? section.querySelector('.trust-image') : null;

  if (!section || !lines.length) return;

  const onScroll = () => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const entryProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
    const p = Math.min(1, Math.max(0, entryProgress));

    lines.forEach((line, index) => {
      const startReveal = 0.1 + index * 0.08;
      const endReveal = 0.4 + index * 0.08;
      const reveal_p = Math.min(1, Math.max(0, (p - startReveal) / (endReveal - startReveal)));
      const easedReveal = reveal_p * reveal_p * (3 - 2 * reveal_p);

      const opacity = easedReveal;
      const translateY = (1 - easedReveal) * 40;

      const direction = (index % 2 === 0) ? 1 : -1;
      const maxShift = window.innerWidth <= 480 ? 25 : (window.innerWidth <= 768 ? 45 : 80);
      const shiftX = direction * (-maxShift + (maxShift * 2) * p);

      line.style.opacity = opacity;
      line.style.transform = `translateY(${translateY}px) translateX(${shiftX}px)`;
      line.style.setProperty('--reveal-progress', easedReveal);
    });

    if (image) {
      const imgReveal = Math.min(1, Math.max(0, p / 0.3));
      const imgEased = imgReveal * imgReveal * (3 - 2 * imgReveal);

      // Continuous vertical float parallax relative to scroll position
      const parallaxY = (p - 0.5) * -120; // Moves from +60px to -60px
      const scale = 0.92 + 0.12 * p;      // Scales up slightly as you scroll down

      image.style.opacity = imgEased;
      image.style.transform = `translateY(${parallaxY}px) scale(${scale})`;
    }
  };

  // Subscribe to Lenis smooth-scroll tick for buttery parallax in sync with smooth position
  subscribeScroll(onScroll);
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}

/**
 * Initializes the Services horizontal carousel with dynamic scroll-linked offset,
 * auto-playing ticker, and manual grab-drag horizontal controls.
 */
export function initServicesSection() {
  const section = document.getElementById('services');
  const title = section ? section.querySelector('.services-title') : null;
  const subtitle = section ? section.querySelector('.services-subtitle') : null;
  const carousel = section ? section.querySelector('.services-carousel') : null;

  if (!section || !carousel) return;

  // Clone cards to double the scroll width for seamless infinite loop wrapping
  const originalCards = Array.from(carousel.children);
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    carousel.appendChild(clone);
  });

  let autoScrollX = 0;
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let dragPauseTimer = null;

  const getSingleSetWidth = () => {
    return carousel.scrollWidth / 2;
  };

  // Mouse drag horizontal scroll
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    carousel.classList.add('dragging');
    startX = e.pageX - carousel.offsetLeft;
    startScrollLeft = carousel.scrollLeft;
    if (dragPauseTimer) clearTimeout(dragPauseTimer);
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      carousel.classList.remove('dragging');
      autoScrollX = carousel.scrollLeft; // Sync auto-scroll pos with manual offset
      carousel.dataset.paused = "true";
      dragPauseTimer = setTimeout(() => {
        carousel.dataset.paused = "false";
      }, 2000);
    }
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;

    let targetScroll = startScrollLeft - walk;
    const singleWidth = getSingleSetWidth();

    // Wrap scroll position infinitely during active drag
    if (singleWidth > 0) {
      if (targetScroll >= singleWidth) {
        targetScroll -= singleWidth;
        startScrollLeft -= singleWidth;
      } else if (targetScroll < 0) {
        targetScroll += singleWidth;
        startScrollLeft += singleWidth;
      }
    }
    carousel.scrollLeft = targetScroll;
  });

  // Touch swipe horizontal scroll (mobile support)
  carousel.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - carousel.offsetLeft;
    startScrollLeft = carousel.scrollLeft;
    if (dragPauseTimer) clearTimeout(dragPauseTimer);
  });

  carousel.addEventListener('touchend', () => {
    isDragging = false;
    autoScrollX = carousel.scrollLeft; // Sync auto-scroll pos with manual offset
    carousel.dataset.paused = "true";
    dragPauseTimer = setTimeout(() => {
      carousel.dataset.paused = "false";
    }, 2000);
  });

  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;

    let targetScroll = startScrollLeft - walk;
    const singleWidth = getSingleSetWidth();

    // Wrap scroll position infinitely during touch swipe
    if (singleWidth > 0) {
      if (targetScroll >= singleWidth) {
        targetScroll -= singleWidth;
        startScrollLeft -= singleWidth;
      } else if (targetScroll < 0) {
        targetScroll += singleWidth;
        startScrollLeft += singleWidth;
      }
    }
    carousel.scrollLeft = targetScroll;
  });

  // Continuous frame updates for autoplay
  function tick() {
    const singleWidth = getSingleSetWidth();
    if (singleWidth > 0) {
      // Loop wrapping check during auto-scroll
      if (carousel.scrollLeft >= singleWidth) {
        carousel.scrollLeft -= singleWidth;
        autoScrollX = carousel.scrollLeft;
      } else if (carousel.scrollLeft < 0) {
        carousel.scrollLeft += singleWidth;
        autoScrollX = carousel.scrollLeft;
      }

      if (!isDragging && carousel.dataset.paused !== "true") {
        autoScrollX += 0.45; // Auto-move step size per frame
        if (autoScrollX >= singleWidth) {
          autoScrollX -= singleWidth;
        }

        // Add scroll-linked page scroll parallax offset
        const pageScrollOffset = parseFloat(carousel.dataset.scrollOffset || 0);
        carousel.scrollLeft = autoScrollX + pageScrollOffset;
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Scroll timeline triggers (staggered titles progressive reveal + horizontal offset calculations)
  const onScroll = () => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // 0 when section top enters viewport bottom, 1 when section bottom reaches viewport top
    const entryProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
    const p = Math.min(1, Math.max(0, entryProgress));

    // Showcase-matching progressive feathered mask reveals
    const title_p = Math.min(1, Math.max(0, (p - 0.15) / 0.22));
    const subtitle_p = Math.min(1, Math.max(0, (p - 0.22) / 0.22));

    if (title) title.style.setProperty('--reveal-progress', title_p);
    if (subtitle) subtitle.style.setProperty('--reveal-progress', subtitle_p);

    // Calculate vertical scroll influence on horizontal carousel shift
    if (!isDragging) {
      const singleWidth = getSingleSetWidth();
      const scrollInfluence = p * singleWidth * 0.35; // Shifts up to 35% of total width as you scroll past
      carousel.dataset.scrollOffset = scrollInfluence;
    }
  };

  subscribeScroll(onScroll);
  onScroll();
}

/**
 * Initializes the Our Process section with dynamic 3D scroll elevation parallax
 * and random shuffled active cards each time the user returns to the section.
 */
/**
 * Interactive 4-step Our Process sequence with scroll progress,
 * 3-second auto-play idle loop, and manual prev/next navigation.
 */
export function initProcessSection() {
  const pinSection = document.getElementById('process');
  if (!pinSection) return;

  const stepItems = pinSection.querySelectorAll('.process-step-item');
  const prevBtn = pinSection.querySelector('.process-nav-btn.prev-btn');
  const nextBtn = pinSection.querySelector('.process-nav-btn.next-btn');

  if (!stepItems.length) return;

  let currentStep = 1; // 1-indexed (1, 2, 3, 4)
  let autoTimer = null;
  let isClickInteracting = false;
  let clickTimeout = null;
  let rafId = null;

  const updateStepUI = (activeStep) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      currentStep = activeStep;
      stepItems.forEach((item) => {
        const stepNum = parseInt(item.getAttribute('data-step') || '1', 10);
        item.classList.remove('is-active', 'is-next', 'is-muted');

        if (stepNum === activeStep) {
          item.classList.add('is-active');
        } else if (stepNum === (activeStep % 4) + 1) {
          item.classList.add('is-next');
        } else {
          item.classList.add('is-muted');
        }
      });
    });
  };

  const startAutoTimer = () => {
    clearAutoTimer();
    autoTimer = setInterval(() => {
      if (!isClickInteracting) {
        const nextStep = (currentStep % 4) + 1;
        updateStepUI(nextStep);
      }
    }, 5000);
  };

  const clearAutoTimer = () => {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  const resetIdleTimer = () => {
    startAutoTimer();
  };

  const handleButtonClick = (stepNum) => {
    isClickInteracting = true;
    updateStepUI(stepNum);

    if (clickTimeout) clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      isClickInteracting = false;
    }, 1500);

    resetIdleTimer();
  };

  // 1. Scroll-linked Step Calculation (Forward & Backward)
  const onScroll = () => {
    const rect = pinSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const isInViewport = rect.top <= windowHeight && rect.bottom >= 0;

    if (isInViewport) {
      const totalDist = rect.height - windowHeight;
      if (totalDist > 0 && rect.top <= 0) {
        const p = Math.min(0.99, Math.max(0, -rect.top / totalDist));
        const calculatedStep = Math.min(4, Math.floor(p * 4) + 1);

        // Update step dynamically when scrolling forward or backward
        if (!isClickInteracting && calculatedStep !== currentStep) {
          updateStepUI(calculatedStep);
        }
      }

      // Reset 5s idle timer whenever scrolling
      resetIdleTimer();
    } else {
      clearAutoTimer();
    }
  };

  // 2. Click interactions for numbers & nav buttons
  stepItems.forEach((item) => {
    item.addEventListener('click', () => {
      const stepNum = parseInt(item.getAttribute('data-step') || '1', 10);
      handleButtonClick(stepNum);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prevStep = (currentStep - 2 + 4) % 4 + 1;
      handleButtonClick(prevStep);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextStep = (currentStep % 4) + 1;
      handleButtonClick(nextStep);
    });
  }

  subscribeScroll(onScroll);
  onScroll();
  updateStepUI(1);
  startAutoTimer();
}

/**
 * Infinite Autoplay Marquee with Drag-to-Scroll & Touch Support for Clients Section
 */
export function initClientsMarquee() {
  const marquee = document.getElementById('clients-marquee');
  if (!marquee) return;

  const originalLogos = Array.from(marquee.children);
  if (!originalLogos.length) return;

  // Clone twice to make sure we always have enough overflow width on all resolutions
  originalLogos.forEach(logo => marquee.appendChild(logo.cloneNode(true)));
  originalLogos.forEach(logo => marquee.appendChild(logo.cloneNode(true)));

  const allLogos = Array.from(marquee.children);

  let isDown = false;
  let startX;
  let scrollLeft;
  const speed = 0.65; // Pixels per frame (slow, smooth, premium!)

  // Drag and drop event listeners
  marquee.addEventListener('pointerdown', (e) => {
    isDown = true;
    marquee.classList.add('grabbing');
    startX = e.pageX - marquee.offsetLeft;
    scrollLeft = marquee.scrollLeft;
  });

  marquee.addEventListener('pointerleave', () => {
    isDown = false;
    marquee.classList.remove('grabbing');
  });

  marquee.addEventListener('pointerup', () => {
    isDown = false;
    marquee.classList.remove('grabbing');
  });

  marquee.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - marquee.offsetLeft;
    const walk = (x - startX) * 1.5;
    marquee.scrollLeft = scrollLeft - walk;
  });

  marquee.addEventListener('touchend', () => {
    isDown = false;
  }, { passive: true });

  // Function to detect center-most logo and activate its full color state
  const updateCenterHighlight = () => {
    const marqueeRect = marquee.getBoundingClientRect();
    const centerPoint = marqueeRect.left + marqueeRect.width / 2;
    const threshold = Math.min(100, marqueeRect.width * 0.3);

    let closestLogo = null;
    let minDistance = Infinity;

    allLogos.forEach(logo => {
      const logoRect = logo.getBoundingClientRect();
      const logoCenter = logoRect.left + logoRect.width / 2;
      const dist = Math.abs(logoCenter - centerPoint);

      if (dist < minDistance) {
        minDistance = dist;
        closestLogo = logo;
      }
    });

    allLogos.forEach(logo => {
      if (logo === closestLogo && minDistance < threshold) {
        logo.classList.add('is-centered');
      } else {
        logo.classList.remove('is-centered');
      }
    });
  };

  // Continuous auto-scroll & center-spotlight loop
  const step = () => {
    // Auto scroll ALWAYS unless user is actively holding/dragging with mouse/finger
    if (!isDown) {
      marquee.scrollLeft += speed;

      // Infinite loop wrap calculation:
      // Since we duplicated the logos twice, loop width is scrollWidth / 3.
      const loopWidth = marquee.scrollWidth / 3;
      if (marquee.scrollLeft >= loopWidth) {
        marquee.scrollLeft -= loopWidth;
      }
    }

    // Continuously update center spotlight highlight as the marquee streams past
    updateCenterHighlight();

    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/**
 * Scroll-driven progressive feathered sweep reveal for the Testimonials Section Title & Staggered Rising Cards
 */
export function initTestimonialsSection() {
  const section = document.getElementById('testimonials');
  const title = section ? section.querySelector('.testimonials-title') : null;
  const cards = section ? section.querySelectorAll('.testimonial-card') : [];
  if (!section) return;

  let targetP = 0;
  let currentP = 0;

  const onScroll = () => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // 0 when section top enters viewport bottom, 1 when section bottom leaves viewport top
    const entryProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
    targetP = Math.min(1, Math.max(0, entryProgress));
  };

  subscribeScroll(onScroll);
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // 120fps rAF lerp loop for silky-smooth motion inertia
  const render = () => {
    // Smoothly interpolate currentP towards targetP
    currentP += (targetP - currentP) * 0.08;

    // Title progressive feathered mask reveal sweep
    if (title) {
      const reveal_p = Math.min(1, Math.max(0, (currentP - 0.08) / 0.28));
      title.style.setProperty('--reveal-progress', reveal_p);
    }

    // Staggered rise animation for Testimonial Cards
    cards.forEach((card, index) => {
      const startReveal = 0.10 + index * 0.06;
      const endReveal = 0.35 + index * 0.06;
      const card_p = Math.min(1, Math.max(0, (currentP - startReveal) / (endReveal - startReveal)));
      const easedCard = card_p * card_p * (3 - 2 * card_p); // Smooth cubic ease-in-out

      const cardTranslateY = (1 - easedCard) * 75; // Smoothly rises 75px
      const cardOpacity = easedCard;
      const cardScale = 0.95 + 0.05 * easedCard;

      card.style.setProperty('--card-rise-y', `${cardTranslateY.toFixed(2)}px`);
      card.style.setProperty('--card-opacity', cardOpacity.toFixed(3));
      card.style.setProperty('--card-scale', cardScale.toFixed(3));
    });

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

/**
 * Scroll-driven progressive rise-in animation for the Footer Card
 * and dynamic lock-in alignment for #bottom-nav with footer bottom bar (.footer-bottom-flex)
 */
export function initFooterAnimation() {
  const footer = document.getElementById('main-footer');
  if (!footer) return;

  const cardContainer = footer.querySelector('.footer-card-container');
  const footerBottomFlex = footer.querySelector('.footer-bottom-flex');
  const bottomNav = document.getElementById('bottom-nav');
  if (!cardContainer) return;

  let targetP = 0;
  let currentP = 0;

  const onScroll = () => {
    const rect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // 0 when top of footer enters bottom of viewport, 1 when footer card is in view
    const entryProgress = (windowHeight - rect.top) / (windowHeight * 0.7);
    targetP = Math.min(1, Math.max(0, entryProgress));
  };

  subscribeScroll(onScroll);
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // 120fps rAF lerp loop for smooth rise-in animation and bottom-nav alignment
  const render = () => {
    currentP += (targetP - currentP) * 0.08;

    const el_p = Math.min(1, Math.max(0, currentP / 0.75));
    const eased = el_p * el_p * (3 - 2 * el_p); // Smooth cubic ease-in-out

    const translateY = (1 - eased) * 60; // Smoothly rises 60px
    const opacity = eased;
    const scale = 0.96 + 0.04 * eased;

    cardContainer.style.setProperty('--footer-rise-y', `${translateY.toFixed(2)}px`);
    cardContainer.style.setProperty('--footer-opacity', opacity.toFixed(3));
    cardContainer.style.setProperty('--footer-scale', scale.toFixed(3));

    // Dynamic vertical alignment of #bottom-nav with .footer-bottom-flex
    if (bottomNav && footerBottomFlex) {
      const flexRect = footerBottomFlex.getBoundingClientRect();
      const navRect = bottomNav.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Distance from viewport bottom to vertical center of .footer-bottom-flex
      const flexCenterYFromBottom = windowHeight - (flexRect.top + flexRect.height / 2);

      // Target bottom px so bottomNav vertical center matches flexCenterYFromBottom
      const targetNavBottom = flexCenterYFromBottom - navRect.height / 2;
      const defaultNavBottom = 30;

      if (targetNavBottom > defaultNavBottom && flexRect.top < windowHeight) {
        bottomNav.style.bottom = `${targetNavBottom.toFixed(1)}px`;
      } else {
        bottomNav.style.bottom = '';
      }
    }

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

/**
 * Scroll-driven progressive text mask reveal and staggered rise animation for Projects Hero Banner
 */
export function initProjectsHeroAnimation() {
  const section = document.getElementById('projects-hero');
  if (!section) return;

  const lines = section.querySelectorAll('.projects-hero-line');
  const subtitle = section.querySelector('.projects-hero-subtitle');
  const filterWrapper = section.querySelector('.projects-filter-wrapper');

  let targetP = 0;
  let currentP = 0;

  // Trigger load reveal animation on page entry
  setTimeout(() => {
    targetP = 1;
  }, 50);

  const onScroll = () => {
    const scrollY = window.scrollY;
    // When user scrolls down significantly past top section, update progress
    if (scrollY > 100) {
      const rect = section.getBoundingClientRect();
      const exitProgress = (rect.bottom) / (rect.height);
      targetP = Math.min(1, Math.max(0, exitProgress));
    }
  };

  subscribeScroll(onScroll);
  window.addEventListener('resize', onScroll, { passive: true });

  // 120fps rAF lerp loop for smooth load & scroll mask reveal
  const render = () => {
    currentP += (targetP - currentP) * 0.07; // Silky smooth cubic lerp

    // Staggered multi-line reveal for title lines
    lines.forEach((line, index) => {
      const startReveal = index * 0.15;
      const endReveal = 0.55 + index * 0.15;
      const line_p = Math.min(1, Math.max(0, (currentP - startReveal) / (endReveal - startReveal)));
      const easedLine = line_p * line_p * (3 - 2 * line_p);

      const opacity = easedLine;
      const translateY = (1 - easedLine) * 35;

      line.style.opacity = opacity.toFixed(3);
      line.style.transform = `translateY(${translateY.toFixed(2)}px)`;
      line.style.setProperty('--reveal-progress', easedLine.toFixed(3));
    });

    // Subtitle reveal
    if (subtitle) {
      const startSub = 0.32;
      const endSub = 0.80;
      const sub_p = Math.min(1, Math.max(0, (currentP - startSub) / (endSub - startSub)));
      const easedSub = sub_p * sub_p * (3 - 2 * sub_p);

      subtitle.style.opacity = easedSub.toFixed(3);
      subtitle.style.transform = `translateY(${((1 - easedSub) * 25).toFixed(2)}px)`;
      subtitle.style.setProperty('--reveal-progress', easedSub.toFixed(3));
    }

    // Filter pill reveal
    if (filterWrapper) {
      const startFilter = 0.48;
      const endFilter = 0.95;
      const filter_p = Math.min(1, Math.max(0, (currentP - startFilter) / (endFilter - startFilter)));
      const easedFilter = filter_p * filter_p * (3 - 2 * filter_p);

      filterWrapper.style.opacity = easedFilter.toFixed(3);
      filterWrapper.style.transform = `translateY(${((1 - easedFilter) * 20).toFixed(2)}px)`;
    }

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

/**
 * Filter tab click handler for ALL, B2B, B2C project cards
 */
export function initProjectFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.projects-page-card');

  if (!filterTabs.length || !projectCards.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');

      // Update active tab button state
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter project cards with smooth fade/scale transition
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * About Page Hero Banner Entrance & Scroll Reveal Animation
 */
export function initAboutHeroAnimation() {
  const title = document.getElementById('about-title-reveal');
  const imageFrame = document.getElementById('about-image-frame');
  if (!title && !imageFrame) return;

  let targetP = 0;
  let currentP = 0;

  // Dark -> Light hero image crossfade progress (0 = dark, 1 = light)
  let targetSwap = 0;
  let currentSwap = 0;

  if (imageFrame) {
    imageFrame.style.setProperty('--img-swap', '0');
  }

  // Trigger load reveal animation on page entry
  setTimeout(() => {
    targetP = 1;
    if (imageFrame) {
      imageFrame.classList.add('is-revealed');
    }
  }, 60);

  const onScroll = () => {
    const scrollY = window.scrollY;
    const section = document.getElementById('about-hero-banner');
    if (!section) return;

    const rect = section.getBoundingClientRect();

    if (scrollY > 100) {
      const exitProgress = (rect.bottom) / (rect.height);
      targetP = Math.min(1, Math.max(0, exitProgress));
    }

    // Fully swapped to the light image after scrolling half the hero height
    const swapDistance = Math.max(1, rect.height * 0.5);
    targetSwap = Math.min(1, Math.max(0, -rect.top / swapDistance));
  };

  subscribeScroll(onScroll);
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // 120fps rAF lerp loop for smooth load & scroll mask reveal
  const render = () => {
    currentP += (targetP - currentP) * 0.08;

    currentSwap += (targetSwap - currentSwap) * 0.12;

    if (title) {
      const easedTitle = currentP * currentP * (3 - 2 * currentP);
      title.style.setProperty('--reveal-progress', easedTitle.toFixed(3));
    }

    if (imageFrame) {
      const easedSwap = currentSwap * currentSwap * (3 - 2 * currentSwap);
      imageFrame.style.setProperty('--img-swap', easedSwap.toFixed(3));
    }

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

/**
 * About Page Top Banner Auto-Rotating Stat Ticker (Every 3 seconds)
 */
export function initHeroStatTicker() {
  const tickerContainer = document.getElementById('about-hero-ticker');
  const statNum = document.getElementById('hero-stat-num');
  const statLabel = document.getElementById('hero-stat-label');

  if (!tickerContainer || !statNum || !statLabel) return;

  const stats = [
    { num: '20+', label: 'brands launched' },
    { num: '2025', label: 'established since' },
    { num: '30+', label: 'clients served' },
    { num: '100+', label: 'success score' }
  ];

  let currentIndex = 0;

  setInterval(() => {
    // 1. Smoothly slide out to left (staggered num then label)
    tickerContainer.classList.add('is-changing');

    setTimeout(() => {
      // 2. Change text
      currentIndex = (currentIndex + 1) % stats.length;
      statNum.textContent = stats[currentIndex].num;
      statLabel.textContent = stats[currentIndex].label;

      // 3. Position at right entrance instantly
      tickerContainer.classList.remove('is-changing');
      tickerContainer.classList.add('is-entering');

      // Force browser reflow frame
      void tickerContainer.offsetWidth;

      // 4. Smoothly slide in from right (staggered num then label)
      requestAnimationFrame(() => {
        tickerContainer.classList.remove('is-entering');
      });
    }, 650);
  }, 3000);
}

/**
 * Our Story Section Scroll Mask Reveal & Timeline 3-Dot Animation (Forward & Backward Scroll Scrubbing)
 */
export function initOurStoryAnimation() {
  const section = document.getElementById('our-story');
  if (!section) return;

  const title = document.getElementById('our-story-title');
  const timeline = document.getElementById('story-timeline');
  if (!title && !timeline) return;

  let targetP = 0;
  let currentP = 0;

  const onScroll = () => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Progress p goes from 0 (entering from bottom) to 1 (scrolled up)
    const startY = windowHeight * 0.92;
    const endY = windowHeight * 0.15;
    let p = (startY - rect.top) / (startY - endY);
    targetP = Math.min(1, Math.max(0, p));
  };

  subscribeScroll(onScroll);
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // 120fps rAF lerp loop for bidirectional continuous scroll scrubbing
  const render = () => {
    // Silky smooth cubic lerp tracking scroll position in both directions
    currentP += (targetP - currentP) * 0.08;

    // Title reveal progress
    if (title) {
      const title_p = Math.min(1, Math.max(0, currentP * 1.25));
      const easedTitle = title_p * title_p * (3 - 2 * title_p);
      title.style.setProperty('--reveal-progress', easedTitle.toFixed(3));
    }

    // Timeline Line & 3 Dots scroll-driven sequence
    if (timeline) {
      // 1. Center dot: scale from p = 0.0 to 0.15
      const center_p = Math.min(1, Math.max(0, currentP / 0.15));
      const centerScale = center_p * center_p * (3 - 2 * center_p);

      // 2. Timeline Line: scaleX from p = 0.10 to 0.70
      const line_p = Math.min(1, Math.max(0, (currentP - 0.10) / 0.60));
      const lineScaleX = line_p * line_p * (3 - 2 * line_p);

      // 3. Side Dots (Left & Right): scale from p = 0.65 to 0.90
      const side_p = Math.min(1, Math.max(0, (currentP - 0.65) / 0.25));
      const sideScale = side_p * side_p * (3 - 2 * side_p);

      timeline.style.setProperty('--dot-center-scale', centerScale.toFixed(3));
      timeline.style.setProperty('--line-scale-x', lineScaleX.toFixed(3));
      timeline.style.setProperty('--dot-side-scale', sideScale.toFixed(3));
    }

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

/**
 * About Page Skillset Section Text Mask Reveal & Re-triggerable Counter Countdown
 */
export function initAboutSkillsetAnimation() {
  const section = document.getElementById('about-skillset');
  if (!section) return;

  const title = document.getElementById('skillset-title-reveal');
  const desc = document.getElementById('skillset-desc-reveal');
  const counters = section.querySelectorAll('.stat-counter-num');

  let animated = false;
  let counterAnimationFrameId = null;

  const runCounterAnimation = () => {
    const duration = 1500; // ms
    const startTime = performance.now();

    const animateCounters = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Easing: easeOutCubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      counters.forEach((el) => {
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const currentVal = Math.round(target * easedProgress);
        el.textContent = currentVal + suffix;
      });

      if (progress < 1) {
        counterAnimationFrameId = requestAnimationFrame(animateCounters);
      }
    };

    if (counterAnimationFrameId) cancelAnimationFrame(counterAnimationFrameId);
    counterAnimationFrameId = requestAnimationFrame(animateCounters);
  };

  const onScroll = () => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Mask reveal progress for skillset title and description
    const startY = windowHeight * 0.90;
    const endY = windowHeight * 0.20;
    let p = (startY - rect.top) / (startY - endY);
    p = Math.min(1, Math.max(0, p));

    const easedP = p * p * (3 - 2 * p);
    if (title) title.style.setProperty('--reveal-progress', easedP.toFixed(3));
    if (desc) desc.style.setProperty('--reveal-progress', easedP.toFixed(3));

    // Re-triggerable countdown animation when section is in view
    if (rect.top <= windowHeight * 0.82 && rect.bottom >= windowHeight * 0.18) {
      if (!animated) {
        animated = true;
        runCounterAnimation();
      }
    } else {
      // Reset when user scrolls completely out of view so it re-triggers upon scrolling back
      if (rect.top > windowHeight || rect.bottom < 0) {
        if (animated) {
          animated = false;
          counters.forEach((el) => {
            const suffix = el.getAttribute('data-suffix') || '';
            el.textContent = '0' + suffix;
          });
        }
      }
    }
  };

  subscribeScroll(onScroll);
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}

/**
 * About Page "Engineered by Experts" Section Mask Reveal Animation
 */
export function initAboutExpertsAnimation() {
  const section = document.getElementById('about-experts');
  if (!section) return;

  const title = document.getElementById('experts-title-reveal');
  const desc = document.getElementById('experts-desc-reveal');
  const avatarCircles = document.querySelectorAll('#about-experts .avatar-circle');

  const onScroll = () => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Mask reveal progress when section enters viewport (forward & backward scroll)
    const startY = windowHeight * 0.92;
    const endY = windowHeight * 0.18;
    let p = (startY - rect.top) / (startY - endY);
    p = Math.min(1, Math.max(0, p));

    const easedP = p * p * (3 - 2 * p);
    if (title) title.style.setProperty('--reveal-progress', easedP.toFixed(3));
    if (desc) desc.style.setProperty('--reveal-progress', easedP.toFixed(3));

    // Staggered scroll-driven avatar circles reveal
    if (avatarCircles.length) {
      avatarCircles.forEach((circle, idx) => {
        const delay = idx * 0.035;
        let ap = Math.min(1, Math.max(0, (p - delay) / (1 - delay * 0.5)));
        const easedAp = ap * ap * (3 - 2 * ap);
        circle.style.setProperty('--avatar-progress', easedAp.toFixed(3));
      });
    }
  };

  subscribeScroll(onScroll);
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}

/**
 * Standalone Interactive Background Canvas (Center Heartbeat Waves & Halftone Grid)
 */
export function initContactBgCanvas() {
  const canvas = document.getElementById('contact-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;

  const resize = () => {
    const parent = canvas.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
    width = canvas.width = rect.width || window.innerWidth;
    height = canvas.height = rect.height || window.innerHeight;
  };
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const startTime = performance.now();

  // Slow, calm resting heartbeat rhythm (4.0 second cycle)
  function getHeartbeatPulse(t) {
    const cycle = (t % 4.0) / 4.0;
    if (cycle < 0.10) {
      const p = cycle / 0.10;
      return Math.sin(p * Math.PI) * 0.40;
    } else if (cycle > 0.15 && cycle < 0.27) {
      const p = (cycle - 0.15) / 0.12;
      return Math.sin(p * Math.PI) * 0.55;
    }
    return 0;
  }

  function render(now) {
    const elapsed = (now - startTime) / 1000;
    ctx.clearRect(0, 0, width, height);

    // 1. Base vertical gradient (Black to White)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0.0, '#000000');
    bgGrad.addColorStop(0.35, '#131313ff');
    bgGrad.addColorStop(0.70, '#666666');
    bgGrad.addColorStop(1.0, '#ffffff');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Heartbeat pulse & center variables
    const cx = width / 2;
    const cy = height / 2;
    const beat = getHeartbeatPulse(elapsed);
    const waveSpeed = elapsed * 1.8;

    // Grid spacing matching reference image halftone grid
    const spacing = 18;
    const cols = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;
    const startX = (width - cols * spacing) / 2;
    const startY = (height - rows * spacing) / 2;

    for (let r = 0; r < rows; r++) {
      const y = startY + r * spacing;
      for (let c = 0; c < cols; c++) {
        const x = startX + c * spacing;

        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Concentric expanding waves radiating from center
        const wave = Math.sin(dist * 0.024 - waveSpeed);

        const maxRadius = Math.min(width, height) * 0.48;
        const radialFactor = Math.max(0, 1 - dist / (maxRadius * (1.1 + beat * 0.4)));

        // Combine wave, radial distance, and heartbeat pulse
        let sizeFactor = 0.5 + 0.5 * wave;
        sizeFactor = sizeFactor * (0.6 + radialFactor * 0.8) + beat * radialFactor * 0.8;

        // Enhance glowing center circle field matching reference image
        const centerGlowRadius = 220 + beat * 70;
        let centerGlow = 0;
        if (dist < centerGlowRadius) {
          centerGlow = 1 - (dist / centerGlowRadius);
          sizeFactor += centerGlow * 0.7;
        }

        const normalizedY = y / height;
        let baseAlpha = 0.32 + (1 - normalizedY) * 0.28;
        if (centerGlow > 0) {
          baseAlpha += centerGlow * 0.45;
        }

        const alpha = Math.min(0.92, Math.max(0.06, baseAlpha * (0.55 + sizeFactor * 0.45)));
        const dotRadius = Math.min(5.2, Math.max(1.1, 2.2 * sizeFactor));

        // Draw halftone vector dot grid
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/**
 * Dynamic Client Portal Popup & Context-Aware Logo Click Handling
 * Shows popup when user is at Showcase Cards section on Home Page.
 * Changes logo click action to open Client Portal ONLY when at Showcase Cards section.
 */
export function initClientPortalPopup() {
  const logoCard = document.querySelector('.nav-logo-card');
  const popup = document.getElementById('logo-portal-popup');
  const portfolioWrapper = document.getElementById('portfolio-wrapper');

  if (!logoCard || !popup) return;

  let isPortalActive = false;

  const checkShowcaseSection = () => {
    // Only check on pages containing #portfolio-wrapper (Home Page)
    if (portfolioWrapper) {
      const rect = portfolioWrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance > 0) {
        const scrolled = -rect.top;
        const PRE_PHASE_DISTANCE = windowHeight;
        const combinedScrolled = scrolled + PRE_PHASE_DISTANCE;
        const combinedTotal = totalScrollableDistance + PRE_PHASE_DISTANCE;
        const p = Math.min(1, Math.max(0, combinedScrolled / combinedTotal));

        // Showcase section is active when wrapper is locked in view and p is in the showcase phase (< 0.52)
        const isInShowcaseSection = rect.top <= windowHeight * 0.4 && rect.bottom >= windowHeight * 0.35 && p < 0.52;

        if (isInShowcaseSection) {
          if (!isPortalActive) {
            isPortalActive = true;
            popup.classList.add('active');
            popup.setAttribute('aria-hidden', 'false');
            logoCard.classList.add('portal-mode');
          }
          return;
        }
      }
    }

    // In all other sections or pages: deactivate popup & reset logo behavior
    if (isPortalActive) {
      isPortalActive = false;
      popup.classList.remove('active');
      popup.setAttribute('aria-hidden', 'true');
      logoCard.classList.remove('portal-mode');
    }
  };

  subscribeScroll(checkShowcaseSection);
  window.addEventListener('resize', checkShowcaseSection, { passive: true });
  checkShowcaseSection();

  // Intercept logo card click ONLY when at showcase cards section
  logoCard.addEventListener('click', (e) => {
    if (isPortalActive) {
      e.preventDefault();
      window.location.href = '/client-portal.html';
    }
  });

  // Popup pill click
  popup.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/client-portal.html';
  });
}

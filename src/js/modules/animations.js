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
  });

  // Close menu when clicking link
  headerNav.querySelectorAll('.nav-link, .nav-item').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('active');
      headerNav.classList.remove('nav-open');
    });
  });
}

/**
 * Premium Form Validation and Micro-Interactions on the Contact page
 */
export function initContactForm() {
  const form = document.getElementById('agency-contact-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input, select, textarea');

  const validateInput = (input) => {
    const formGroup = input.closest('.form-group');
    const errorMsg = formGroup.querySelector('.error-msg');
    let isValid = true;
    let message = '';

    // Custom validity checks
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      message = 'This field is required.';
    } else if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        message = 'Please enter a valid email address.';
      }
    }

    if (errorMsg) {
      errorMsg.textContent = message;
    }

    if (isValid) {
      formGroup.classList.remove('has-error');
      formGroup.classList.add('is-valid');
    } else {
      formGroup.classList.add('has-error');
      formGroup.classList.remove('is-valid');
    }

    return isValid;
  };

  // Live input validations
  inputs.forEach((input) => {
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => {
      // If previously had error, revalidate live on typing
      const formGroup = input.closest('.form-group');
      if (formGroup.classList.contains('has-error')) {
        validateInput(input);
      }
    });
  });

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    inputs.forEach((input) => {
      const isValid = validateInput(input);
      if (!isValid) isFormValid = false;
    });

    if (isFormValid) {
      // Premium submit micro-interaction success
      const submitBtn = document.getElementById('submit-button');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';

      // Simulate API post
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent! ✓';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        form.reset();

        // Clear validity highlights
        form.querySelectorAll('.form-group').forEach((group) => {
          group.classList.remove('is-valid');
        });

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
        }, 3000);
      }, 1500);
    }
  });
}

/**
 * Tracks which section overlaps the bottom floating nav bar and adapts CSS variables accordingly.
 */
export function initBottomNavThemeTracker() {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;

  const sections = document.querySelectorAll('section, footer');

  const checkTheme = () => {
    const navRect = nav.getBoundingClientRect();
    const navCenterY = navRect.top + navRect.height / 2;

    let currentSection = null;
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (navCenterY >= rect.top && navCenterY <= rect.bottom) {
        currentSection = section;
        break;
      }
    }

    if (currentSection) {
      // Detect light background sections using class name, data attribute or computed style background
      const isLight = currentSection.classList.contains('light-section') ||
        currentSection.getAttribute('data-bg') === 'light' ||
        getComputedStyle(currentSection).backgroundColor === 'rgb(255, 255, 255)';

      if (isLight) {
        nav.classList.add('nav-light-bg');
      } else {
        nav.classList.remove('nav-light-bg');
      }
    }
  };

  window.addEventListener('scroll', checkTheme, { passive: true });
  window.addEventListener('resize', checkTheme);
  checkTheme(); // Run once initially
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
  const projectsTitleBlock = document.querySelector('.projects-title-block');
  const ctaOverlay = document.querySelector('.projects-cta-overlay');

  if (!wrapper || !cards.length) return;

  const onScroll = () => {
    const wrapperRect = wrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const overlayWidth = wrapper.offsetWidth;
    const overlayHeight = windowHeight;

    // 1. Calculate scroll progress through the portfolio-wrapper container
    const scrolled = -wrapperRect.top;
    const totalScrollableDistance = wrapperRect.height - windowHeight;

    if (totalScrollableDistance <= 0) return;
    const p = Math.min(1, Math.max(0, scrolled / totalScrollableDistance));

    // Determine the grid start Y position based on screen width to sit below Projects title (adjusted down for top padding)
    let gridStartY = 320;
    if (window.innerWidth <= 768) {
      gridStartY = 220;
    } else if (window.innerWidth <= 992) {
      gridStartY = 260;
    }

    // Determine the fanned showcase start Y position based on screen width to sit below title
    let showcaseStartY = 380;
    if (window.innerWidth <= 768) {
      showcaseStartY = 280;
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

    // Dynamic vertical scroll translation for overflow grid layouts (safeguard bottom crops on short viewports)
    const ctaHeight = ctaOverlay ? (ctaOverlay.offsetHeight || 80) : 80;
    const gridTotalHeight = gridStartY + gridH;
    let scrollOffset = 0;
    if (gridTotalHeight > overlayHeight) {
      const overflowY = gridTotalHeight - overlayHeight + 40 + ctaHeight + 60; // include CTA + 60px padding clearance
      if (p > 0.9) {
        const p_scroll = Math.min(1, Math.max(0, (p - 0.9) / 0.1));
        scrollOffset = overflowY * p_scroll;
      }
    }

    // Position the "more Projects" CTA below the grid during Phase 4
    if (ctaOverlay) {
      if (p >= 0.9) {
        const ctaTop = gridStartY + gridH + 40 - scrollOffset; // 40px gap below grid
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
      if (p < 0.65) {
        // Phase 1 & 2: Showcase Title centered, Projects Title hidden below the viewport
        showcaseTitleBlock.style.opacity = 1;
        showcaseTitleBlock.style.transform = 'translateY(0)';
        projectsTitleBlock.style.opacity = 1;
        projectsTitleBlock.style.transform = `translateY(${windowHeight}px)`;
      } else if (p < 0.9) {
        // Phase 3: Smooth rise-up transition synchronized with Morph progress (Showcase pushed up by -500px to fully clear screen)
        const p_morph_title = (p - 0.65) / 0.25;
        showcaseTitleBlock.style.opacity = 1;
        showcaseTitleBlock.style.transform = `translateY(${-500 * p_morph_title}px)`;
        projectsTitleBlock.style.opacity = 1;
        projectsTitleBlock.style.transform = `translateY(${windowHeight * (1 - p_morph_title) - scrollOffset}px)`;
      } else {
        // Phase 4: Showcase Title completely pushed off-screen, Projects Title settled at header and scroll offset applied
        showcaseTitleBlock.style.opacity = 1;
        showcaseTitleBlock.style.transform = 'translateY(-500px)';
        projectsTitleBlock.style.opacity = 1;
        projectsTitleBlock.style.transform = `translateY(${-scrollOffset}px)`;
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

      // Coordinate calculations for fanned Showcase positions (positioned below showcase title)
      const showcaseLeft = overlayWidth / 2 + tx - cardSize / 2;
      const showcaseTop = showcaseStartY + ty;

      // Coordinate calculations for stacked pile (positioned below showcase title and offset down)
      const centerLeft = overlayWidth / 2 - cardSize / 2;
      const centerTop = showcaseStartY + 80;

      // Coordinate calculations for Projects grid cells (positioned below the Projects title with dynamic scroll translation)
      const projectsLeft = overlayWidth / 2 - gridW / 2 + gridX;
      const projectsTop = gridStartY + gridY - scrollOffset;

      // Multi-phase Scroll Timeline Morph
      if (p < 0.3) {
        // Phase 1: Fan-Out (0 to 0.3 progress)
        const p1 = Math.min(1, Math.max(0, p / 0.3));

        const currentLeft = centerLeft + (showcaseLeft - centerLeft) * p1;
        const currentTop = centerTop + (showcaseTop - centerTop) * p1;
        const currentRot = rot * p1;
        const currentScale = 0.9 + 0.1 * p1;

        card.style.opacity = 1;
        card.style.width = `${cardSize}px`;
        card.style.height = `${cardSize}px`;
        card.style.left = `${currentLeft}px`;
        card.style.top = `${currentTop}px`;
        card.style.transform = `rotate(${currentRot}deg) scale(${currentScale})`;

        // Text labels overlay remains hidden
        const info = card.querySelector('.project-info');
        if (info) info.style.opacity = 0;
        card.style.setProperty('--overlay-op', 0);

      } else if (p < 0.65) {
        // Phase 2: Sticky Pinned Hold (0.3 to 0.65 progress) - cards stay fanned out in viewport center
        card.style.opacity = 1;
        card.style.width = `${cardSize}px`;
        card.style.height = `${cardSize}px`;
        card.style.left = `${showcaseLeft}px`;
        card.style.top = `${showcaseTop}px`;
        card.style.transform = `rotate(${rot}deg) scale(1)`;

        const info = card.querySelector('.project-info');
        if (info) info.style.opacity = 0;
        card.style.setProperty('--overlay-op', 0);

      } else {
        // Phase 3 & 4: Morph to Grid and release (0.65 to 0.9 progress morphing, 0.9 to 1.0 settled)
        const p_morph = Math.min(1, Math.max(0, (p - 0.65) / 0.25));

        const w = cardSize + (gridWidth - cardSize) * p_morph;
        const h = cardSize + (gridHeight - cardSize) * p_morph;

        const currentLeft = showcaseLeft + (projectsLeft - showcaseLeft) * p_morph;
        const currentTop = showcaseTop + (projectsTop - showcaseTop) * p_morph;
        const currentRot = rot * (1 - p_morph);

        card.style.opacity = 1;
        card.style.width = `${w}px`;
        card.style.height = `${h}px`;
        card.style.left = `${currentLeft}px`;
        card.style.top = `${currentTop}px`;
        card.style.transform = `rotate(${currentRot}deg) scale(1)`;

        // Fade in project labels & category info
        const info = card.querySelector('.project-info');
        if (info) {
          const textOp = Math.min(1, Math.max(0, (p_morph - 0.45) / 0.35));
          info.style.opacity = textOp;
          info.style.transform = `translateY(${(1 - textOp) * 15}px)`;
        }

        // Gradient overlay opacity on card
        card.style.setProperty('--overlay-op', p_morph);
      }

      // Dynamic vertical scroll background parallax to image
      const hoverWrapper = card.querySelector('.card-hover-wrapper');
      if (hoverWrapper) {
        hoverWrapper.style.backgroundPositionY = `${15 + 70 * p}%`;
      }
    });
  };

  // Subscribe to Lenis smooth-scroll tick so animation stays in sync with the
  // smoothed position rather than the raw native scroll event.
  subscribeScroll(onScroll);
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}

export function initTrustAnimation() {
  const section = document.getElementById('trust');
  const lines = document.querySelectorAll('.trust-line');
  const image = section ? section.querySelector('.trust-image') : null;

  if (!section || !lines.length) return;

  const onScroll = () => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // 0 when section top enters viewport bottom, 1 when section bottom reaches viewport top
    const entryProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
    const p = Math.min(1, Math.max(0, entryProgress));

    // 1. Staggered reveal & continuous horizontal parallax slide for text lines
    lines.forEach((line, index) => {
      // Entry reveal phase (staggered fade-in + slide-up)
      const startReveal = 0.1 + index * 0.08;
      const endReveal = 0.4 + index * 0.08;
      const reveal_p = Math.min(1, Math.max(0, (p - startReveal) / (endReveal - startReveal)));
      const easedReveal = reveal_p * reveal_p * (3 - 2 * reveal_p);

      const opacity = easedReveal;
      const translateY = (1 - easedReveal) * 40;

      // Continuous horizontal parallax slide across the full viewport pass
      // Line 1 and 3 slide right, Line 2 slides left
      const direction = (index % 2 === 0) ? 1 : -1;
      const shiftX = direction * (-80 + 160 * p); // Slides from -80px to +80px (or opposite)

      line.style.opacity = opacity;
      line.style.transform = `translateY(${translateY}px) translateX(${shiftX}px)`;
    });

    // 2. Parallax and scale animation for the image card
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

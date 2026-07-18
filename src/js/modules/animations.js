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
  const showcaseTitle = showcaseTitleBlock ? showcaseTitleBlock.querySelector('.showcase-title') : null;
  const showcaseSubtitle = showcaseTitleBlock ? showcaseTitleBlock.querySelector('.showcase-subtitle') : null;
  const projectsTitleBlock = document.querySelector('.projects-title-block');
  const ctaOverlay = document.querySelector('.projects-cta-overlay');

  if (!wrapper || !cards.length) return;

  const onScroll = () => {
    const wrapperRect = wrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const overlayWidth = wrapper.offsetWidth;
    const overlayHeight = windowHeight;

    // 1. Calculate scroll progress through the portfolio-wrapper container
    //    PRE_PHASE_DISTANCE shifts p so that Phase 1 (fan-out) begins while the
    //    section is still entering the viewport from below — before it locks sticky.
    const scrolled = -wrapperRect.top;
    const totalScrollableDistance = wrapperRect.height - windowHeight;

    if (totalScrollableDistance <= 0) return;

    const PRE_PHASE_DISTANCE = windowHeight; // entry travel = 1 viewport height
    const combinedScrolled = scrolled + PRE_PHASE_DISTANCE;
    const combinedTotal = totalScrollableDistance + PRE_PHASE_DISTANCE;
    const p = Math.min(1, Math.max(0, combinedScrolled / combinedTotal));

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
      const showcase_title_p = Math.min(1, Math.max(0, (p - 0.05) / 0.20));
      const showcase_subtitle_p = Math.min(1, Math.max(0, (p - 0.12) / 0.20));
      if (showcaseTitle) showcaseTitle.style.setProperty('--reveal-progress', showcase_title_p);
      if (showcaseSubtitle) showcaseSubtitle.style.setProperty('--reveal-progress', showcase_subtitle_p);

      const projectsTitle = projectsTitleBlock.querySelector('.projects-title');
      if (p < 0.45) {
        // Phase 1: Showcase Title centered, Projects Title hidden below the viewport
        showcaseTitleBlock.style.opacity = 1;
        showcaseTitleBlock.style.transform = 'translateY(0)';
        projectsTitleBlock.style.opacity = 1;
        projectsTitleBlock.style.transform = `translateY(${windowHeight}px)`;
        if (projectsTitle) projectsTitle.style.clipPath = 'inset(0 100% 0 0)';
      } else if (p < 0.70) {
        // Phase 2/3: Smooth rise-up transition synchronized with Morph progress (starts earlier and finishes faster)
        const p_morph_title = (p - 0.45) / 0.25;
        showcaseTitleBlock.style.opacity = 1;
        showcaseTitleBlock.style.transform = `translateY(${-500 * p_morph_title}px)`;
        projectsTitleBlock.style.opacity = 1;
        projectsTitleBlock.style.transform = `translateY(${windowHeight * (1 - p_morph_title) - scrollOffset}px)`;
        if (projectsTitle) {
          const maskVal = (1 - Math.min(1, p_morph_title * 1.5)) * 100;
          projectsTitle.style.clipPath = `inset(0 ${maskVal}% 0 0)`;
        }
      } else {
        // Phase 4: Showcase Title completely pushed off-screen, Projects Title settled at header
        showcaseTitleBlock.style.opacity = 1;
        showcaseTitleBlock.style.transform = 'translateY(-500px)';
        projectsTitleBlock.style.opacity = 1;
        projectsTitleBlock.style.transform = `translateY(${-scrollOffset}px)`;
        if (projectsTitle) projectsTitle.style.clipPath = 'inset(0 0% 0 0)';
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

      const showcaseLeft = overlayWidth / 2 + tx - cardSize / 2;
      const showcaseTop = showcaseStartY + ty;

      const centerLeft = overlayWidth / 2 - cardSize / 2;
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
        card.style.width = `${cardSize}px`;
        card.style.height = `${cardSize}px`;
        card.style.left = `${currentLeft}px`;
        card.style.top = `${currentTop}px`;
        card.style.transform = `rotate(${currentRot}deg) scale(${currentScale})`;

        const info = card.querySelector('.project-info');
        if (info) info.style.opacity = 0;
        card.style.setProperty('--overlay-op', 0);
      } else if (p < 0.65) {
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
        const p_morph = Math.min(1, Math.max(0, (p - 0.65) / 0.25));
        const w = cardSize + ((gridWidth * scale) - cardSize) * p_morph;
        const h = cardSize + ((gridHeight * scale) - cardSize) * p_morph;
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
      const shiftX = direction * (-80 + 160 * p);

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
export function initProcessSection() {
  const pinSection = document.getElementById('process');
  const stickyContainer = pinSection ? pinSection.querySelector('.process-sticky-container') : null;
  const zoomWrapper = pinSection ? pinSection.querySelector('.process-zoom-wrapper') : null;
  const zoomPill = pinSection ? pinSection.querySelector('.process-zoom-pill') : null;
  const zoomText = pinSection ? pinSection.querySelector('.process-zoom-text') : null;
  const zoomVideo = pinSection ? pinSection.querySelector('.process-zoom-video') : null;
  const splitContainer = pinSection ? pinSection.querySelector('.process-split-container') : null;
  const splitGrid = pinSection ? pinSection.querySelector('.process-split-grid') : null;
  const cards = pinSection ? pinSection.querySelectorAll('.split-card') : [];
  const cardInners = pinSection ? pinSection.querySelectorAll('.split-card-inner') : [];

  if (!pinSection || !zoomPill || !splitContainer) return;

  // Configure symmetrical book-opening flips: left cards (1 & 3) open left, right cards (2 & 4) open right
  cards.forEach((card, idx) => {
    const isLeftColumn = (idx === 0 || idx === 2);
    const axis = 'Y';
    const dir = isLeftColumn ? -1 : 1;

    card.setAttribute('data-rot-axis', axis);
    card.setAttribute('data-rot-dir', dir);
    
    const frontFace = card.querySelector('.split-card-front');
    if (frontFace) {
      frontFace.style.transform = `rotate${axis}(${dir * 180}deg)`;
    }
  });

  const onScroll = () => {
    const rect = pinSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Calculate scroll progress p of the pinned section (0 to 1)
    const totalDist = rect.height - windowHeight;
    let p = 0;
    if (rect.top <= 0) {
      p = -rect.top / totalDist;
    }
    p = Math.min(1, Math.max(0, p));

    // Phase 1: Zooming Pill (p from 0 to 0.45)
    if (p <= 0.45) {
      // Show zoom wrapper, hide split container
      zoomWrapper.style.opacity = '1';
      zoomWrapper.style.pointerEvents = 'auto';
      
      splitContainer.style.opacity = '0';
      splitContainer.style.pointerEvents = 'none';
      splitContainer.classList.remove('active');

      const z = p / 0.45;
      // Smoother easing
      const easedZ = z * z * (3 - 2 * z);

      // Base element size in the DOM is 80vw x 80vh
      const targetW = windowWidth * 0.8;
      const targetH = windowHeight * 0.8;

      // Starting scale factor to shrink 80vw/80vh down to exactly 320x90
      const startSx = 320 / targetW;
      const startSy = 90 / targetH;

      // Interpolate scales from the start scale up to 1.0
      const sx = startSx + (1 - startSx) * easedZ;
      const sy = startSy + (1 - startSy) * easedZ;

      zoomPill.style.transform = `scale3d(${sx}, ${sy}, 1)`;
      
      // Keep visual border radius constant at exactly 12px throughout the transition
      const borderRadiusVal = 12 / sy;
      zoomPill.style.borderRadius = `${borderRadiusVal}px`;

      // Apply counter-scale to video vertical axis to lock aspect ratio (fit to width)
      if (zoomVideo) {
        const videoScaleY = sx / sy;
        zoomVideo.style.transform = `translate3d(0, -50%, 0) scale3d(1, ${videoScaleY}, 1)`;
      }

      // Scale text directly since it sits on an independent layer (no compression!)
      // Grow it from 1.0 (24px) up to 2.8x (67px) on large screens
      const targetTextScale = 1 + (windowWidth > 768 ? 1.8 : 1.0) * easedZ;
      zoomText.style.transform = `scale3d(${targetTextScale}, ${targetTextScale}, 1)`;

    } else {
      // Phase 2: Split & Flip (p from 0.45 to 0.95)
      // Hide zoom wrapper, show split container
      zoomWrapper.style.opacity = '0';
      zoomWrapper.style.pointerEvents = 'none';
      
      splitContainer.style.opacity = '1';
      splitContainer.style.pointerEvents = 'auto';

      const s = Math.min(1, Math.max(0, (p - 0.45) / 0.5));
      const easedS = s * s * (3 - 2 * s);

      // Split open gap and padding
      const targetGap = Math.min(32, Math.max(16, windowWidth * 0.025)); // clamp(16px, 2.5vw, 32px)
      const targetPadding = Math.min(60, Math.max(20, windowWidth * 0.04)); // clamp(20px, 4vw, 60px)

      const currentGap = targetGap * easedS;
      const currentPadding = targetPadding * easedS;

      splitGrid.style.gap = `${currentGap}px`;
      splitGrid.style.padding = `${currentPadding}px`;

      // Keep card corner radius always 12px
      cards.forEach(card => {
        card.style.borderRadius = '12px';
      });

      // Flip rotation: goes from 0deg (showing back face) to 180deg (showing front face)
      cardInners.forEach((inner, idx) => {
        const card = cards[idx];
        if (card) {
          const rotAxis = card.getAttribute('data-rot-axis') || 'Y';
          const rotDir = parseInt(card.getAttribute('data-rot-dir') || '1', 10);
          const rotationVal = easedS * 180 * rotDir;
          inner.style.transform = `rotate${rotAxis}(${rotationVal}deg)`;
        }
      });

      // Activate hover interaction state if we are fully split
      if (s >= 0.98) {
        splitContainer.classList.add('active');
      } else {
        splitContainer.classList.remove('active');
      }
    }
  };

  subscribeScroll(onScroll);
  onScroll();
}

/**
 * Infinite Autoplay Marquee with Drag-to-Scroll & Touch Support for Clients Section
 */
export function initClientsMarquee() {
  const marquee = document.getElementById('clients-marquee');
  if (!marquee) return;

  // Duplicate elements inside the marquee to create a seamless infinite loop
  const logos = Array.from(marquee.children);
  if (!logos.length) return;
  
  // Clone twice to make sure we always have enough overflow width on all resolutions
  logos.forEach(logo => {
    marquee.appendChild(logo.cloneNode(true));
  });
  logos.forEach(logo => {
    marquee.appendChild(logo.cloneNode(true));
  });

  let isDown = false;
  let startX;
  let scrollLeft;
  let isInteracting = false;
  let lastInteractionTime = 0;
  const speed = 0.65; // Pixels per frame (very slow, smooth and premium!)

  // Drag and drop event listeners for desktop
  marquee.addEventListener('pointerdown', (e) => {
    isDown = true;
    marquee.classList.add('grabbing');
    startX = e.pageX - marquee.offsetLeft;
    scrollLeft = marquee.scrollLeft;
    isInteracting = true;
    lastInteractionTime = Date.now();
  });

  marquee.addEventListener('pointerleave', () => {
    isDown = false;
    marquee.classList.remove('grabbing');
    isInteracting = false;
  });

  marquee.addEventListener('pointerup', () => {
    isDown = false;
    marquee.classList.remove('grabbing');
    isInteracting = false;
    lastInteractionTime = Date.now();
  });

  marquee.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - marquee.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    marquee.scrollLeft = scrollLeft - walk;
    lastInteractionTime = Date.now();
  });

  // Track scroll and touch interaction state
  marquee.addEventListener('touchstart', () => {
    isInteracting = true;
    lastInteractionTime = Date.now();
  }, { passive: true });

  marquee.addEventListener('touchend', () => {
    isInteracting = false;
    lastInteractionTime = Date.now();
  }, { passive: true });

  marquee.addEventListener('wheel', () => {
    lastInteractionTime = Date.now();
  }, { passive: true });

  // Autoplay requestAnimationFrame loop
  const step = () => {
    const now = Date.now();
    
    // Auto scroll only if the user is not actively interacting and 1.5s passed since last interaction
    if (!isInteracting && !isDown && (now - lastInteractionTime > 1500)) {
      marquee.scrollLeft += speed;
      
      // Infinite loop wrap calculation:
      // Since we duplicated the logos twice, the true width of the single loop set is scrollWidth / 3.
      // Reset when scrollLeft reaches this boundary.
      const loopWidth = marquee.scrollWidth / 3;
      if (marquee.scrollLeft >= loopWidth) {
        marquee.scrollLeft = 0;
      }
    }
    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/**
 * Scroll-driven progressive feathered sweep reveal for the Testimonials Section Title
 */
export function initTestimonialsSection() {
  const section = document.getElementById('testimonials');
  const title = section ? section.querySelector('.testimonials-title') : null;
  if (!section || !title) return;

  const onScroll = () => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // 0 when section top enters viewport bottom, 1 when section bottom leaves viewport top
    const entryProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
    const p = Math.min(1, Math.max(0, entryProgress));

    // Staggered progressive feathered mask reveal sweep (starts at p = 0.15, fully colored by p = 0.45)
    const reveal_p = Math.min(1, Math.max(0, (p - 0.15) / 0.3));
    title.style.setProperty('--reveal-progress', reveal_p);
  };

  subscribeScroll(onScroll);
  onScroll();
}

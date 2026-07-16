/**
 * Syntellite – Lenis Smooth Scroll
 *
 * Tune these values to adjust scroll feel:
 *   duration        – how long inertia continues after input stops (seconds)
 *   wheelMultiplier – scroll speed on mouse wheel (lower = slower/heavier)
 *   touchMultiplier – scroll speed on trackpad / touch
 *
 * To adjust, edit the `new Lenis({ … })` config below.
 */

import Lenis from 'lenis';

let lenis = null;

/**
 * Initialise Lenis and hook it into rAF.
 * Call this once from main.js after DOMContentLoaded.
 */
export function initSmoothScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.7,
    touchMultiplier: 2,
    infinite: false,
  });

  // rAF loop – runs every frame to advance Lenis
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Anchor-link interception: route <a href="#id"> through Lenis.scrollTo
  // so the smooth easing applies instead of the browser's native instant jump.
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      }
    });
  });

  return lenis;
}

/**
 * Subscribe a callback to fire on every Lenis smooth-scroll tick.
 * The callback receives the Lenis scroll event object { scroll, progress, … }.
 *
 * Use this instead of window.addEventListener('scroll', …) for any animation
 * that needs to stay in sync with the smoothed scroll position.
 *
 * Returns an unsubscribe function.
 *
 * @param {Function} cb
 * @returns {Function} unsubscribe
 */
export function subscribeScroll(cb) {
  if (!lenis) {
    // Lenis not yet ready – fall back to native scroll so nothing breaks
    window.addEventListener('scroll', cb, { passive: true });
    return () => window.removeEventListener('scroll', cb);
  }
  lenis.on('scroll', cb);
  return () => lenis.off('scroll', cb);
}

/**
 * Expose the raw lenis instance for external use (e.g. pausing during modals).
 */
export function getLenis() {
  return lenis;
}

/**
 * Temporarily stop smooth scroll (e.g. while a modal / overlay is open).
 */
export function pauseSmoothScroll() {
  if (lenis) lenis.stop();
}

/**
 * Resume smooth scroll after pausing.
 */
export function resumeSmoothScroll() {
  if (lenis) lenis.start();
}

/**
 * Syntellite Agency Web App - Main Entrypoint
 */
import {
  initScrollReveal,
  initScrollFallbacks,
  initMobileMenu,
  initContactForm,
  initBottomNavThemeTracker,
  initScrollPill,
  initPortfolioMorph,
  initTrustAnimation,
  initServicesSection,
  initProcessSection,
  initClientsMarquee,
  initTestimonialsSection
} from './modules/animations.js';

import { initSmoothScroll } from './modules/smoothScroll.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Syntellite Agency Site Initialized.');

  // Initialize Lenis smooth scroll (must run first to intercept all scroll events)
  initSmoothScroll();

  // Initialize Scroll Reveals (IntersectionObserver)
  initScrollReveal();

  // Initialize Scroll-driven JS Fallbacks
  initScrollFallbacks();

  // Initialize Portfolio Morph Layout Overlay
  initPortfolioMorph();

  // Initialize Trust Section scroll-driven staggered text reveals
  initTrustAnimation();

  // Initialize Services Horizontal Carousel Section
  initServicesSection();

  // Initialize Our Process Grid Section
  initProcessSection();

  // Initialize Clients Auto-Marquee
  initClientsMarquee();

  // Initialize Testimonials Section Title Scroll Sweep
  initTestimonialsSection();

  // Initialize Hamburger Menu
  initMobileMenu();

  // Initialize Contact Form Validation (if on contact page)
  initContactForm();

  // Initialize Bottom Nav dynamic background theme tracker
  initBottomNavThemeTracker();

  // Initialize Scroll Indicator Pill fading behavior
  initScrollPill();
});

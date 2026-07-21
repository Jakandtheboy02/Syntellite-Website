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
  initTestimonialsSection,
  initFooterAnimation,
  initProjectsHeroAnimation,
  initProjectFilters,
  initAboutHeroAnimation,
  initOurStoryAnimation
} from './modules/animations.js';

import { initSmoothScroll } from './modules/smoothScroll.js';
import { initProjectDetail } from './modules/projectDetail.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Syntellite Agency Site Initialized.');

  // Initialize Lenis smooth scroll (must run first to intercept all scroll events)
  initSmoothScroll();

  // Initialize Project Detail Dynamic Page Data (if on project-detail.html)
  initProjectDetail();

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

  // Initialize Footer Scroll Rise-in Animation
  initFooterAnimation();

  // Initialize Projects Hero Banner Scroll Text Reveal
  initProjectsHeroAnimation();

  // Initialize About Page Hero Banner Entrance & Mask Reveal
  initAboutHeroAnimation();

  // Initialize Our Story Section Timeline Animation
  initOurStoryAnimation();

  // Initialize Projects Filter Tabs (ALL, B2B, B2C)
  initProjectFilters();

  // Initialize Hamburger Menu
  initMobileMenu();

  // Initialize Contact Form Validation (if on contact page)
  initContactForm();

  // Initialize Bottom Nav dynamic background theme tracker
  initBottomNavThemeTracker();

  // Initialize Scroll Indicator Pill fading behavior
  initScrollPill();
});

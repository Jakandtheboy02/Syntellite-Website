/**
 * CustomCursor
 * Handles smooth mouse-following and expansion on hover states.
 */
export default class CustomCursor {
  constructor() {
    this.cursorEl = document.getElementById('custom-cursor');
    if (!this.cursorEl) return;

    this.mouse = { x: 0, y: 0 }; // Current mouse coordinates
    this.pos = { x: 0, y: 0 };   // Interpolated cursor coordinates
    this.speed = 0.15;           // Lerp speed (0.1 = slow/smooth, 1 = instant)
    this.isHovering = false;
    this.isVisible = false;

    this.init();
  }

  init() {
    // Only bind desktop mouse controls if hover is supported
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    // Hide native cursor setup (handled by CSS, but good to ensure visibility is clean)
    this.cursorEl.style.opacity = '0';

    // Event listeners
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseleave', () => this.onMouseLeave());
    document.addEventListener('mouseenter', () => this.onMouseEnter());

    this.bindHoverElements();

    // Start render loop
    requestAnimationFrame(() => this.render());
  }

  onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    
    if (!this.isVisible) {
      this.isVisible = true;
      this.cursorEl.style.opacity = '1';
    }
  }

  onMouseLeave() {
    this.isVisible = false;
    this.cursorEl.style.opacity = '0';
  }

  onMouseEnter() {
    this.isVisible = true;
    this.cursorEl.style.opacity = '1';
  }

  bindHoverElements() {
    // Listen for events on body to dynamically catch elements injected into DOM later
    document.body.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, select, textarea, input, [data-hover-expand]');
      if (target) {
        this.isHovering = true;
        this.cursorEl.classList.add('cursor-hover');
      }
    });

    document.body.addEventListener('mouseout', (e) => {
      const target = e.target.closest('a, button, select, textarea, input, [data-hover-expand]');
      if (target) {
        this.isHovering = false;
        this.cursorEl.classList.remove('cursor-hover');
      }
    });
  }

  // Linear Interpolation (lerp)
  lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  render() {
    if (this.isVisible) {
      // Lerp positions
      this.pos.x = this.lerp(this.pos.x, this.mouse.x, this.speed);
      this.pos.y = this.lerp(this.pos.y, this.mouse.y, this.speed);

      // Translate element using GPU accelerated translate3d
      this.cursorEl.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) translate3d(-50%, -50%, 0)`;
    }

    requestAnimationFrame(() => this.render());
  }
}

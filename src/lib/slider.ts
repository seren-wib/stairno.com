// Auto-advancing slider. Pure DOM, no dependencies. SDD 4.6.
//
// Markup contract (see Projects.astro):
//   [data-slider][data-interval]  root
//     [data-slides] > [data-slide]*  one slide per project
//     button[data-slider-dot][data-index]*
//     button[data-slider-prev], button[data-slider-next]

export function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

export function createSlider(root: HTMLElement): { go(index: number): void; stop(): void } {
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-slide]'));
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-slider-dot]'));
  const prev = root.querySelector<HTMLButtonElement>('[data-slider-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-slider-next]');
  const track = root.querySelector<HTMLElement>('[data-slides]');
  const interval = Number(root.dataset.interval) || 5000;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current = 0;
  let timer: number | undefined;

  function render(): void {
    if (track) track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index === current ? 'false' : 'true');
      slide.classList.toggle('is-active', index === current);
    });
    dots.forEach((dot, index) => {
      dot.setAttribute('aria-selected', index === current ? 'true' : 'false');
      dot.classList.toggle('is-active', index === current);
    });
  }

  function go(index: number): void {
    current = wrapIndex(index, slides.length);
    render();
  }

  function stop(): void {
    if (timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  }

  function play(): void {
    if (reduceMotion || slides.length < 2 || timer !== undefined) return;
    timer = window.setInterval(() => go(current + 1), interval);
  }

  function restart(): void {
    stop();
    play();
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      go(Number(dot.dataset.index));
      restart();
    });
  });
  prev?.addEventListener('click', () => {
    go(current - 1);
    restart();
  });
  next?.addEventListener('click', () => {
    go(current + 1);
    restart();
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', play);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', play);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else play();
  });

  render();
  play();

  return { go, stop };
}

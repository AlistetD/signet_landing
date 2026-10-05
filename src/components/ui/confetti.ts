import confetti from 'canvas-confetti'

export function fireSignetConfetti(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  void confetti({
    particleCount: 140,
    spread: 76,
    origin: { y: 0.65 },
    colors: ['#ed1c24', '#ffffff'],
  })
}

import { Plasma } from '@/components/ui/plasma'
import { PLASMA_TINT } from '@/lib/theme'
import { useTheme } from '@/stores/theme'

/** Dark: React Bits Plasma red. Light: the same field as cool gray steam. */
export function PlasmaBackground() {
  const { theme } = useTheme()
  const light = theme === 'light'

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-page" aria-hidden="true">
      <Plasma
        key={theme}
        className="h-full w-full"
        color={PLASMA_TINT[theme]}
        scale={1.8}
        speed={0.5}
        renderScale={0.7}
        maxDpr={2}
        targetFps={60}
        mouseInteractive
        lightMode={light}
      />
    </div>
  )
}

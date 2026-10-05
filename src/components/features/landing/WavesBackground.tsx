import { GradientWaves } from '@/components/ui/gradient-waves'

/** Full-page Gradient Waves with the tuned React Bits params. */
export function WavesBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black" aria-hidden="true">
      <GradientWaves
        key="react-bits-original-shader"
        className="h-full w-full"
        horizonColor="#ff0036"
        waveColor="#fcfcfc"
        crestColor="#FFFFFF"
        speed={0.4}
        amplitude={2.3}
        waveScale={0.6}
        waveRatio={1.95}
        swell={35}
        turbulence={20}
        tilt={1.11}
        zoom={1}
        height={4.8}
        fogDepth={15}
        detail="medium"
        brightness={1.05}
        opacity={1}
        mouseInteraction
        parallaxStrength={0.5}
        grain
        grainIntensity={0}
      />
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'

export type PlasmaDirection = 'forward' | 'reverse' | 'pingpong'

export type PlasmaProps = {
  color?: string
  speed?: number
  direction?: PlasmaDirection
  scale?: number
  opacity?: number
  mouseInteractive?: boolean
  renderScale?: number
  maxDpr?: number
  targetFps?: number
  iterations?: number
  lightMode?: boolean
  className?: string
}

const ORIGINAL_QUALITY = 60

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result?.[1] || !result[2] || !result[3]) {
    return [1, 0.5, 0.2]
  }
  return [Number.parseInt(result[1], 16) / 255, Number.parseInt(result[2], 16) / 255, Number.parseInt(result[3], 16) / 255]
}

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

function buildFragment(): string {
  return `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
uniform float uQuality;
uniform float uStepScale;
uniform float uLightMode;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;

  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);

  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.0; O += o.w / d * o.xyz) {
    p = z * normalize(vec3(C - 0.5 * r, r.y));
    p.z -= 4.0;
    S = p;
    d = p.y - T;

    p.x += 0.4 * (1.0 + p.y) * sin(d + p.x * 0.1) * cos(0.34 * d + p.x * 0.05);
    Q = p.xz *= mat2(cos(p.y + vec4(0, 11, 33, 0) - T));
    z += d = (abs(sqrt(length(Q * Q)) - 0.25 * (5.0 + S.y)) / 3.0 + 8e-4) * uStepScale;
    o = 1.0 + sin(S.y + p.z * 0.5 + S.z - length(S - p) + vec4(2, 1, 0, 8));
    if (i >= uQuality) break;
  }

  o.xyz = tanh(O / 1e4);
}

bool finite1(float x) {
  return !(isnan(x) || isinf(x));
}

vec3 sanitize(vec3 c) {
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);

  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));

  float alpha = length(rgb) * uOpacity;
  if (uLightMode > 0.5) {
    vec3 source = clamp(finalColor, 0.0, 1.0);
    vec3 page = vec3(0.9490196);
    float energy = clamp(length(rgb) / 1.7320508, 0.0, 1.0);
    float coverage = pow(smoothstep(0.02, 0.62, energy), 0.7) * min(uOpacity, 1.0);
    vec3 smoke = mix(page, source, 0.58);
    fragColor = vec4(mix(page, smoke, coverage), 1.0);
  } else {
    fragColor = vec4(finalColor, alpha);
  }
}
`
}

type PlasmaUniforms = {
  iTime: { value: number }
  iResolution: { value: Float32Array }
  uCustomColor: { value: Float32Array }
  uUseCustomColor: { value: number }
  uSpeed: { value: number }
  uDirection: { value: number }
  uScale: { value: number }
  uOpacity: { value: number }
  uMouse: { value: Float32Array }
  uMouseInteractive: { value: number }
  uQuality: { value: number }
  uStepScale: { value: number }
  uLightMode: { value: number }
}

/**
 * React Bits Plasma (ogl + WebGL2). Copied for Vite; paints one still frame when reduced-motion is on.
 */
export function Plasma({
  color = '#ffffff',
  speed = 1,
  direction = 'forward',
  scale = 1,
  opacity = 1,
  mouseInteractive = true,
  renderScale = 0.55,
  maxDpr = 1.5,
  targetFps = 60,
  iterations = 60,
  lightMode = false,
  className = '',
}: PlasmaProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer: Renderer
    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, maxDpr),
      })
    } catch {
      return
    }

    const gl = renderer.gl
    const canvas = gl.canvas
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    container.appendChild(canvas)

    const uniforms: PlasmaUniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Float32Array([1, 1]) },
      uCustomColor: { value: new Float32Array(hexToRgb(color)) },
      uUseCustomColor: { value: color ? 1 : 0 },
      uSpeed: { value: speed * 0.4 },
      uDirection: { value: direction === 'reverse' ? -1 : 1 },
      uScale: { value: scale },
      uOpacity: { value: opacity },
      uMouse: { value: new Float32Array([0, 0]) },
      uMouseInteractive: { value: mouseInteractive ? 1 : 0 },
      uQuality: { value: iterations },
      uStepScale: { value: ORIGINAL_QUALITY / iterations },
      uLightMode: { value: lightMode ? 1 : 0 },
    }

    const geometry = new Triangle(gl)
    const program = new Program(gl, { vertex, fragment: buildFragment(), uniforms })
    const mesh = new Mesh(gl, { geometry, program })

    let pendingMouse: { x: number; y: number } | null = null
    const onPointerMove = (event: PointerEvent) => {
      if (!mouseInteractive) {
        return
      }
      const rect = container.getBoundingClientRect()
      pendingMouse = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    let resizePending = false
    const setSize = () => {
      const rect = container.getBoundingClientRect()
      const width = Math.max(1, Math.floor(rect.width * renderScale))
      const height = Math.max(1, Math.floor(rect.height * renderScale))
      renderer.setSize(width, height)
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      uniforms.iResolution.value[0] = gl.drawingBufferWidth
      uniforms.iResolution.value[1] = gl.drawingBufferHeight
    }
    const resizeObserver = new ResizeObserver(() => {
      if (resizePending) {
        return
      }
      resizePending = true
      requestAnimationFrame(() => {
        resizePending = false
        setSize()
      })
    })
    resizeObserver.observe(container)
    setSize()

    let raf = 0
    let contextLost = false
    let isVisible = true
    let tabVisible = document.visibilityState !== 'hidden'
    const t0 = performance.now()
    const frameInterval = 1000 / targetFps
    let lastFrameTime = 0

    const renderStaticFrame = () => {
      uniforms.iTime.value = 0
      renderer.render({ scene: mesh })
    }

    const loop = (t: number) => {
      if (contextLost || !isVisible || !tabVisible) {
        return
      }
      if (t - lastFrameTime < frameInterval) {
        raf = requestAnimationFrame(loop)
        return
      }
      lastFrameTime = t

      if (pendingMouse) {
        uniforms.uMouse.value[0] = pendingMouse.x
        uniforms.uMouse.value[1] = pendingMouse.y
        pendingMouse = null
      }

      const timeValue = (t - t0) * 0.001
      if (direction === 'pingpong') {
        const pingpongDuration = 10
        const segmentTime = timeValue % pingpongDuration
        const isForward = Math.floor(timeValue / pingpongDuration) % 2 === 0
        const u = segmentTime / pingpongDuration
        const smooth = u * u * (3 - 2 * u)
        uniforms.uDirection.value = 1
        uniforms.iTime.value = isForward ? smooth * pingpongDuration : (1 - smooth) * pingpongDuration
      } else {
        uniforms.iTime.value = timeValue
      }

      renderer.render({ scene: mesh })
      raf = requestAnimationFrame(loop)
    }

    const tryStart = () => {
      if (prefersReducedMotion || contextLost || !isVisible || !tabVisible || raf !== 0) {
        return
      }
      raf = requestAnimationFrame(loop)
    }
    const tryStop = () => {
      if (raf === 0) {
        return
      }
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onContextLost = (event: Event) => {
      event.preventDefault()
      contextLost = true
      tryStop()
    }
    const onContextRestored = () => {
      contextLost = false
      tryStart()
    }
    canvas.addEventListener('webglcontextlost', onContextLost)
    canvas.addEventListener('webglcontextrestored', onContextRestored)

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? false
        if (isVisible) {
          tryStart()
        } else {
          tryStop()
        }
      },
      { threshold: 0 },
    )
    io.observe(container)

    const onVisibility = () => {
      tabVisible = document.visibilityState !== 'hidden'
      if (tabVisible) {
        lastFrameTime = 0
        tryStart()
      } else {
        tryStop()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    if (prefersReducedMotion) {
      renderStaticFrame()
    } else {
      tryStart()
    }

    return () => {
      tryStop()
      resizeObserver.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      if (canvas.parentElement === container) {
        container.removeChild(canvas)
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [
    color,
    speed,
    direction,
    scale,
    opacity,
    mouseInteractive,
    renderScale,
    maxDpr,
    targetFps,
    iterations,
    lightMode,
  ])

  return <div ref={containerRef} className={className} aria-hidden="true" />
}

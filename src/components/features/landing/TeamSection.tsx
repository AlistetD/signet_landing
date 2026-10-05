import { useEffect, useRef } from 'react'
import { GlassPanel } from '@/components/ui/glass-panel'
import { landingContent } from '@/content/landing'

export function TeamSection() {
  const team = landingContent.team
  const visible = team.photos.filter((photo) => !photo.hidden)

  return (
    <section id={team.id} className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16">
      <GlassPanel className="max-w-3xl rounded-[1.25rem] px-5 py-5">
        <h2 className="text-3xl uppercase md:text-4xl">{team.title}</h2>
        <p className="mt-4 text-muted">{team.body}</p>
      </GlassPanel>
      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {visible.map((photo) => (
          <li key={photo.caption}>
            <figure className="glass overflow-hidden rounded-[1.25rem]">
              <div className="aspect-[3/4] bg-field">
                {photo.video ? (
                  <TeamClip src={photo.video} caption={photo.caption} />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <img src={photo.src} alt="" className="h-[38%] w-auto object-contain" />
                  </div>
                )}
              </div>
              <figcaption className="px-3 py-3 text-sm text-muted">{photo.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}

const FINE_HOVER = '(hover: hover) and (pointer: fine)'

function TeamClip({ src, caption }: { src: string; caption: string }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const frame = frameRef.current
    const video = videoRef.current
    if (!frame || !video) {
      return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fineHover = window.matchMedia(FINE_HOVER)
    let inView = false
    let hovered = false

    const wantsPlayback = () => {
      if (reduceMotion.matches) {
        return false
      }
      return fineHover.matches ? hovered : inView
    }

    const syncPlayback = () => {
      if (!wantsPlayback()) {
        video.pause()
        return
      }
      void video.play().catch(() => undefined)
    }

    const onEnter = () => {
      if (!fineHover.matches) {
        return
      }
      hovered = true
      syncPlayback()
    }

    const onLeave = () => {
      hovered = false
      if (!fineHover.matches) {
        return
      }
      video.pause()
      video.currentTime = 0
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting === true
        if (!fineHover.matches) {
          syncPlayback()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(video)

    frame.addEventListener('pointerenter', onEnter)
    frame.addEventListener('pointerleave', onLeave)
    reduceMotion.addEventListener('change', syncPlayback)
    fineHover.addEventListener('change', syncPlayback)

    return () => {
      io.disconnect()
      frame.removeEventListener('pointerenter', onEnter)
      frame.removeEventListener('pointerleave', onLeave)
      reduceMotion.removeEventListener('change', syncPlayback)
      fineHover.removeEventListener('change', syncPlayback)
    }
  }, [])

  return (
    <div ref={frameRef} className="size-full">
      <video
        ref={videoRef}
        className="size-full object-cover"
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-label={caption}
      />
    </div>
  )
}

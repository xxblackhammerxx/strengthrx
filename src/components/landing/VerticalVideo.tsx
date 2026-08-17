'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import type { LandingVideo } from '@/content/landing-pages'

/**
 * Contained 9:16 player for the vertical ad creative.
 *
 * WHY CLICK-TO-PLAY AND NOT AUTOPLAY. The source is a 5MB file. Muted autoplay
 * would pull it on every page view, on mobile data, competing with the form
 * that is the actual conversion. `preload="none"` plus a 72KB poster means the
 * video costs nothing until somebody asks for it — and someone who taps play
 * has already told you they are interested.
 *
 * Because the visitor opted in, it plays WITH SOUND. Muted-by-default is for
 * autoplay; on a deliberate tap it just reads as broken.
 *
 * The creative is 1080x1920. Rendered inside the left column it is never wider
 * than ~300px, so the file ships at 720x1280 — enough for a 2x display at that
 * size and nothing more.
 */
export function VerticalVideo({ video }: { video: LandingVideo }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  const play = () => {
    setStarted(true)
    // The element only mounts with a src after `started`, so defer until React
    // has committed it.
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {
        // Autoplay policy or a decode failure — controls are visible either
        // way, so the visitor can still start it themselves.
      })
    })
  }

  return (
    <figure className="mt-9">
      <div className="mx-auto w-full max-w-[300px]">
        <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-neutral-700/40 bg-neutral-950 shadow-2xl shadow-black/30">
          {started ? (
            <video
              ref={videoRef}
              src={video.src}
              poster={video.poster}
              controls
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
            />
          ) : (
            <button
              type="button"
              onClick={play}
              aria-label={`Play video: ${video.title}`}
              className="group absolute inset-0 h-full w-full cursor-pointer"
            >
              <Image
                src={video.poster}
                alt=""
                fill
                sizes="300px"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 shadow-lg transition-transform duration-200 group-hover:scale-105">
                  <Play className="ml-0.5 h-6 w-6 fill-white text-white" />
                </span>
              </span>
              <span className="absolute inset-x-0 bottom-0 p-4 text-left">
                <span className="block text-sm font-semibold text-white">{video.title}</span>
                <span className="mt-0.5 block text-xs text-neutral-300">{video.duration}</span>
              </span>
            </button>
          )}
        </div>
      </div>

      <figcaption className="mt-2.5 text-center text-[11px] text-neutral-600">
        {video.caption}
      </figcaption>
    </figure>
  )
}

import { useCallback, useEffect, useRef } from 'react'

type PhoneFrameProps = {
  src: string
  alt: string
  className?: string
  caption?: string
  priority?: boolean
  interactive?: boolean
}

export function PhoneFrame({
  src,
  alt,
  className = '',
  caption,
  priority = false,
  interactive = false,
}: PhoneFrameProps) {
  const frameRef = useRef<HTMLElement>(null)
  const deviceRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const motionRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const sensorBaselineRef = useRef<{ beta: number; gamma: number } | null>(null)

  useEffect(() => () => {
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
  }, [])

  const runMotionFrame = useCallback(function animatePhone() {
    const device = deviceRef.current
    if (!device) {
      animationFrameRef.current = null
      return
    }

    const motion = motionRef.current
    motion.x += (motion.targetX - motion.x) * 0.24
    motion.y += (motion.targetY - motion.y) * 0.24

    device.style.transform = [
      'perspective(850px)',
      `translate3d(${(motion.x * 4).toFixed(2)}px, ${(motion.y * 3).toFixed(2)}px, 0)`,
      `rotateX(${(-motion.y * 5).toFixed(2)}deg)`,
      `rotateY(${(motion.x * 7).toFixed(2)}deg)`,
    ].join(' ')

    const settled = Math.abs(motion.targetX - motion.x) < 0.002 &&
      Math.abs(motion.targetY - motion.y) < 0.002
    if (settled) {
      motion.x = motion.targetX
      motion.y = motion.targetY
      animationFrameRef.current = null
      return
    }
    animationFrameRef.current = requestAnimationFrame(animatePhone)
  }, [])

  const startMotion = useCallback(() => {
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(runMotionFrame)
    }
  }, [runMotionFrame])

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (!interactive) return
    const frame = frameRef.current
    if (!frame) return

    const bounds = frame.getBoundingClientRect()
    motionRef.current.targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2))
    motionRef.current.targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2))
    startMotion()
  }

  const resetPosition = useCallback(() => {
    motionRef.current.targetX = 0
    motionRef.current.targetY = 0
    startMotion()
  }, [startMotion])

  useEffect(() => {
    if (!interactive || typeof window === 'undefined' || !window.matchMedia('(pointer: coarse)').matches) return

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return
      const baseline = sensorBaselineRef.current
      if (!baseline) {
        sensorBaselineRef.current = { beta: event.beta, gamma: event.gamma }
        return
      }

      motionRef.current.targetX = Math.max(-1, Math.min(1, (event.gamma - baseline.gamma) / 16))
      motionRef.current.targetY = Math.max(-1, Math.min(1, (event.beta - baseline.beta) / 16))
      startMotion()
    }

    const recalibrate = () => {
      sensorBaselineRef.current = null
      resetPosition()
    }

    window.addEventListener('deviceorientation', handleOrientation)
    window.addEventListener('orientationchange', recalibrate)
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      window.removeEventListener('orientationchange', recalibrate)
    }
  }, [interactive, resetPosition, startMotion])

  const requestSensorPermission = async (event: React.PointerEvent<HTMLElement>) => {
    if (!interactive || event.pointerType !== 'touch') return
    if (typeof DeviceOrientationEvent === 'undefined') return
    const orientationEvent = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }
    if (typeof orientationEvent.requestPermission !== 'function') return
    try {
      const permission = await orientationEvent.requestPermission()
      if (permission === 'granted') sensorBaselineRef.current = null
    } catch {
      // The static preview remains usable if sensor access is unavailable or denied.
    }
  }

  return (
    <figure
      ref={frameRef}
      className={`phone-mockup ${interactive ? 'phone-interactive' : ''} ${className}`.trim()}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPosition}
      onPointerDown={requestSensorPermission}
    >
      <div className="device-frame" ref={deviceRef}>
        <div className="camera-hole" aria-hidden="true" />
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

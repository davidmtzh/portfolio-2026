import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Match the folders' response, slightly quicker for later destinations.
const TRAVEL_TIME = 0.36
const ARRIVAL_SPEED_STEP = 1.1

export function FeaturedLighting({ section, reduced }) {
  const svg = useRef(null)
  const [geometry, setGeometry] = useState(null)

  /*
   * These are deliberately separate.
   *
   * Previously activeIndex was effectively responsible for:
   * - hover
   * - focus
   * - scrolling
   * - travelling electricity
   * - illuminated state
   *
   * Keeping the input states separate makes the system deterministic.
   */
  const hoveredIndex = useRef(-1)
  const focusedIndex = useRef(-1)
  const scrollIndex = useRef(-1)
  const activeIndex = useRef(-1)

  /*
   * --------------------------------------------------------
   * MEASURE THE CIRCUIT
   * --------------------------------------------------------
   */
  useEffect(() => {
    const root = section.current

    if (!root) return

    let frame
    let disposed = false

    const measure = () => {
      cancelAnimationFrame(frame)

      frame = requestAnimationFrame(() => {
        if (disposed) return

        const origin = root.getBoundingClientRect()

        const nodes = [...root.querySelectorAll('.case-index')].map(el => {
          const rect = el.getBoundingClientRect()

          return {
            x: rect.left - origin.left,
            y: rect.top - origin.top + rect.height / 2,
          }
        })

        if (!nodes.length) {
          setGeometry(null)
          return
        }

        /*
         * Vertical rail sits 24px before the numbered lamp.
         */
        const rail = Math.max(8, nodes[0].x - 24)

        /*
         * Electricity enters the section from the middle/top.
         */
        const sectionNodeX = origin.width / 2

        const nextGeometry = {
          width: origin.width,
          height: origin.height,

          /*
           * Visible horizontal branches.
           */
          branches: nodes.map(
            node => `M${rail} ${node.y}H${node.x}`
          ),

          /*
           * IMPORTANT:
           *
           * Every card now starts from the SAME power source.
           *
           * Before:
           *
           * Card 0:
           * source -> card 0
           *
           * Card 1:
           * card 0 Y -> card 1
           *
           * Card 2:
           * card 1 Y -> card 2
           *
           * That was why reverse/random hovering could make
           * electricity appear halfway through the circuit.
           *
           * Now:
           *
           * source -> rail -> requested card
           */
          routes: nodes.map(
            node =>
              `M${sectionNodeX} -30V22H${rail}V${node.y}H${node.x}`
          ),
        }

        /*
         * Avoid rebuilding all GSAP timelines if ResizeObserver fires
         * but the actual geometry hasn't changed.
         */
        setGeometry(previous => {
          if (
            previous &&
            previous.width === nextGeometry.width &&
            previous.height === nextGeometry.height &&
            previous.routes.length === nextGeometry.routes.length &&
            previous.routes.every(
              (route, index) => route === nextGeometry.routes[index]
            ) &&
            previous.branches.every(
              (branch, index) => branch === nextGeometry.branches[index]
            )
          ) {
            return previous
          }

          return nextGeometry
        })
      })
    }

    const observer = new ResizeObserver(measure)

    observer.observe(root)

    root.querySelectorAll('.case-study').forEach(article => {
      observer.observe(article)
    })

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!disposed) measure()
      })
    }

    measure()

    return () => {
      disposed = true

      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [section])

  /*
   * --------------------------------------------------------
   * BUILD / CONTROL THE ELECTRICAL ANIMATIONS
   * --------------------------------------------------------
   */
  useEffect(() => {
    if (!geometry) return
    if (!section.current) return
    if (!svg.current) return

    const articles = [
      ...section.current.querySelectorAll('.case-study'),
    ]

    if (!articles.length) return

    const packetGroups = [
      ...svg.current.querySelectorAll('.featured-packet'),
    ]

    const timelines = []
    const triggers = []
    const heads = []
    const states = []
    const listeners = []

    /*
     * Used to prevent the circuit from briefly shutting off
     * when pointerleave(A) happens immediately before
     * pointerenter(B).
     */
    let pointerLeaveFrame
    let focusLeaveFrame
    let scrollSyncFrame

    const hoverCapable = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches

    /*
     * --------------------------------------------------------
     * RESET ONE CARD
     * --------------------------------------------------------
     */
    const resetArticle = index => {
      const article = articles[index]
      const timeline = timelines[index]
      const state = states[index]
      const head = heads[index]

      if (!article) return

      /*
       * Completely return the animation to the start.
       */
      if (timeline) {
        timeline.pause(0)
      }

      if (state) {
        state.progress = 0

        /*
         * Put the electricity particle physically back at
         * the beginning of its path as well.
         */
        if (state.place) {
          state.place()
        }
      }

      if (head) {
        gsap.set(head, {
          opacity: 0,
        })
      }

      article.classList.remove('lamp-on')
      article.dataset.light = 'off'
    }

    /*
     * --------------------------------------------------------
     * SET THE ACTIVE DESTINATION
     * --------------------------------------------------------
     */
    const setActive = index => {
      const nextIndex =
        Number.isInteger(index) &&
        index >= 0 &&
        index < articles.length
          ? index
          : -1

      /*
       * Don't restart an animation that's already travelling
       * or relight something that's already on.
       */
      if (activeIndex.current === nextIndex) {
        if (nextIndex < 0) return

        const currentState =
          articles[nextIndex]?.dataset.light

        if (
          currentState === 'travelling' ||
          currentState === 'on'
        ) {
          return
        }
      }

      activeIndex.current = nextIndex

      /*
       * Any card that isn't the new destination goes dark.
       */
      articles.forEach((_, articleIndex) => {
        if (articleIndex !== nextIndex) {
          resetArticle(articleIndex)
        }
      })

      if (nextIndex < 0) return

      const article = articles[nextIndex]
      const timeline = timelines[nextIndex]

      /*
       * Always begin a new activation with the destination dark.
       */
      resetArticle(nextIndex)

      /*
       * Reduced motion:
       * skip travelling electricity and turn the lamp on directly.
       */
      if (reduced) {
        article.dataset.light = 'on'
        article.classList.add('lamp-on')
        return
      }

      article.dataset.light = 'travelling'

      timeline?.restart()
    }

    /*
     * --------------------------------------------------------
     * DECIDE WHICH INPUT CURRENTLY HAS PRIORITY
     * --------------------------------------------------------
     *
     * Priority:
     *
     * 1. Hover
     * 2. Keyboard focus
     * 3. Scroll position
     */
    const resolveActive = () => {
      let nextIndex = -1

      if (hoveredIndex.current >= 0) {
        nextIndex = hoveredIndex.current
      } else if (focusedIndex.current >= 0) {
        nextIndex = focusedIndex.current
      } else if (scrollIndex.current >= 0) {
        nextIndex = scrollIndex.current
      }

      setActive(nextIndex)
    }

    /*
     * --------------------------------------------------------
     * CREATE EACH ELECTRICAL PULSE
     * --------------------------------------------------------
     */
    articles.forEach((article, index) => {
      const group = packetGroups[index]

      if (!group) return

      const path = group.querySelector('path')
      const head = group.querySelector('g')

      if (!path || !head) return

      const length = path.getTotalLength()

      const state = {
        progress: 0,
        place: null,
      }

      /*
       * Position the glowing particle along its SVG path.
       */
      const place = () => {
        const point = path.getPointAtLength(
          state.progress * length
        )

        head.setAttribute(
          'transform',
          `translate(${point.x} ${point.y})`
        )
      }

      state.place = place

      states[index] = state
      heads[index] = head

      /*
       * Constant visual velocity.
       *
       * Longer paths automatically take longer rather than
       * card 3 arbitrarily travelling faster than card 1.
       */
      const speedMultiplier = ARRIVAL_SPEED_STEP ** index
      const duration = TRAVEL_TIME / speedMultiplier

      const arrival = () => {
        /*
         * The animation may have completed after the user
         * already moved to another card.
         *
         * Never allow an old pulse to illuminate a stale card.
         */
        if (activeIndex.current !== index) return

        if (article.dataset.light !== 'travelling') return

        article.classList.add('lamp-on')
        article.dataset.light = 'on'
      }

      /*
       * One energizing pulse per activation.
       *
       * This is intentionally NOT repeat: -1.
       *
       * Repeating indefinitely made the same strong pulse keep
       * travelling after the lamp was already powered.
       */
      const timeline = gsap
        .timeline({
          paused: true,
        })
        .set(head, {
          opacity: 1,
        })
        .to(state, {
          progress: 1,
          duration,
          ease: 'none',
          onUpdate: place,
          onComplete: arrival,
        })
        .to(head, {
          opacity: 0,
          duration: 0.16,
          ease: 'power1.out',
        })

      timelines[index] = timeline

      /*
       * Make sure it physically begins at the source.
       */
      place()

      /*
       * --------------------------------------------------------
       * POINTER
       * --------------------------------------------------------
       */
      const pointerEnter = () => {
        /*
         * Touch devices should use the scroll behavior instead.
         */
        if (!hoverCapable) return

        cancelAnimationFrame(pointerLeaveFrame)

        hoveredIndex.current = index

        resolveActive()
      }

      const pointerLeave = () => {
        if (!hoverCapable) return
        if (index === 2) window.dispatchEvent(new Event('featured:exit'))

        /*
         * Delay by one animation frame.
         *
         * If the user goes directly:
         *
         * Card A -> Card B
         *
         * Card B's pointerenter occurs before this callback,
         * so the circuit goes directly A -> B rather than:
         *
         * A -> OFF -> B
         */
        cancelAnimationFrame(pointerLeaveFrame)

        pointerLeaveFrame = requestAnimationFrame(() => {
          if (hoveredIndex.current === index) {
            hoveredIndex.current = -1
          }

          resolveActive()
        })
      }

      /*
       * --------------------------------------------------------
       * KEYBOARD FOCUS
       * --------------------------------------------------------
       */
      const focusIn = () => {
        cancelAnimationFrame(focusLeaveFrame)

        focusedIndex.current = index

        resolveActive()
      }

      const focusOut = event => {
        /*
         * If focus simply moved from one child element to
         * another child inside this same case-study,
         * do absolutely nothing.
         */
        if (
          event.relatedTarget &&
          article.contains(event.relatedTarget)
        ) {
          return
        }

        cancelAnimationFrame(focusLeaveFrame)

        /*
         * Like pointerleave, defer the actual clearing slightly.
         * This avoids an unnecessary OFF state when keyboard
         * focus goes directly from one case study to another.
         */
        focusLeaveFrame = requestAnimationFrame(() => {
          if (focusedIndex.current === index) {
            focusedIndex.current = -1
          }

          resolveActive()
        })
      }

      article.addEventListener(
        'pointerenter',
        pointerEnter
      )

      article.addEventListener(
        'pointerleave',
        pointerLeave
      )

      article.addEventListener(
        'focusin',
        focusIn
      )

      article.addEventListener(
        'focusout',
        focusOut
      )

      listeners.push({
        article,
        pointerEnter,
        pointerLeave,
        focusIn,
        focusOut,
      })
    })

    /*
     * --------------------------------------------------------
     * MOBILE / TOUCH SCROLL BEHAVIOR
     * --------------------------------------------------------
     *
     * Multiple ScrollTriggers can technically overlap.
     *
     * Instead of blindly trusting whichever callback fired last,
     * choose the active card nearest the center of the viewport.
     */
    const syncScrollIndex = () => {
      if (hoverCapable) {
        scrollIndex.current = -1
        return
      }

      let bestIndex = -1
      let bestDistance = Infinity

      triggers.forEach((trigger, index) => {
        if (!trigger.isActive) return

        const article = articles[index]

        if (!article) return

        const rect = article.getBoundingClientRect()
        const center = rect.top + rect.height / 2

        const distance = Math.abs(
          center - window.innerHeight / 2
        )

        if (distance < bestDistance) {
          bestDistance = distance
          bestIndex = index
        }
      })

      scrollIndex.current = bestIndex

      resolveActive()
    }

    const scheduleScrollSync = () => {
      cancelAnimationFrame(scrollSyncFrame)

      scrollSyncFrame = requestAnimationFrame(
        syncScrollIndex
      )
    }

    articles.forEach(article => {
      const trigger = ScrollTrigger.create({
        trigger: article,

        start: 'top 78%',
        end: 'bottom 22%',

        /*
         * onToggle covers:
         * onEnter
         * onEnterBack
         * onLeave
         * onLeaveBack
         */
        onToggle: scheduleScrollSync,
      })

      triggers.push(trigger)
    })

    /*
     * Recalculate after all triggers exist.
     */
    ScrollTrigger.refresh()
    scheduleScrollSync()

    /*
     * --------------------------------------------------------
     * TAB VISIBILITY
     * --------------------------------------------------------
     */
    const visibility = () => {
      timelines.forEach((timeline, index) => {
        if (!timeline) return

        if (document.hidden) {
          timeline.pause()
          return
        }

        /*
         * Resume only if this exact card is still waiting
         * for its pulse to arrive.
         */
        if (
          activeIndex.current === index &&
          articles[index]?.dataset.light ===
            'travelling' &&
          !reduced
        ) {
          timeline.resume()
        }
      })
    }

    document.addEventListener(
      'visibilitychange',
      visibility
    )

    /*
     * Restore the current interaction after a geometry rebuild.
     *
     * For example:
     * - window resize
     * - font loading
     * - card changing dimensions
     *
     * If the mouse is still over card 2, we don't want the
     * ResizeObserver to permanently turn card 2 off.
     */
    resolveActive()

    /*
     * --------------------------------------------------------
     * CLEANUP
     * --------------------------------------------------------
     */
    return () => {
      cancelAnimationFrame(pointerLeaveFrame)
      cancelAnimationFrame(focusLeaveFrame)
      cancelAnimationFrame(scrollSyncFrame)

      timelines.forEach(timeline => {
        timeline?.kill()
      })

      triggers.forEach(trigger => {
        trigger.kill()
      })

      articles.forEach(article => {
        article.classList.remove('lamp-on')
        delete article.dataset.light
      })

      listeners.forEach(
        ({
          article,
          pointerEnter,
          pointerLeave,
          focusIn,
          focusOut,
        }) => {
          article.removeEventListener(
            'pointerenter',
            pointerEnter
          )

          article.removeEventListener(
            'pointerleave',
            pointerLeave
          )

          article.removeEventListener(
            'focusin',
            focusIn
          )

          article.removeEventListener(
            'focusout',
            focusOut
          )
        }
      )

      activeIndex.current = -1

      document.removeEventListener(
        'visibilitychange',
        visibility
      )
    }
  }, [geometry, reduced, section])

  if (!geometry) return null

  return (
    <svg
      ref={svg}
      className="featured-circuit"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      aria-hidden="true"
    >
      {geometry.branches.map((d, index) => (
        <path
          key={`branch-${index}`}
          d={d}
          className="circuit-wire"
        />
      ))}

      {geometry.routes.map((d, index) => (
        <g
          key={`packet-${index}`}
          className="featured-packet"
        >
          {/*
            Invisible route used only to calculate the
            electricity particle's position.
          */}
          <path
            d={d}
            fill="none"
            stroke="none"
          />

          {/*
            Electricity particle / glow.
          */}
          <g style={{ opacity: 0 }}>
            <circle
              r="8"
              fill="#ffda86"
              opacity=".1"
            />

            <circle
              r="4"
              fill="#ffda86"
              opacity=".3"
            />

            <circle
              r="1.8"
              fill="#fff4ce"
            />
          </g>
        </g>
      ))}
    </svg>
  )
}

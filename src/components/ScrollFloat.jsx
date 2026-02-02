import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

// Ensure GSAP plugin is registered only once
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const ScrollFloat = ({
    children,
    scrollContainerRef,
    containerClassName = '',
    textClassName = '',
    animationDuration = 1,
    ease = 'back.inOut(2)',
    scrollStart = 'center bottom+=50%',
    scrollEnd = 'bottom bottom-=40%',
    stagger = 0.03
}) => {
    const containerRef = useRef(null);

    const splitText = useMemo(() => {
        const text = typeof children === 'string' ? children : '';
        // Check for Arabic characters
        const isArabic = /[\u0600-\u06FF]/.test(text);

        if (isArabic) {
            // For Arabic, split by words to preserve ligatures, or don't split at all if needed. 
            // Splitting by word is usually a good compromise for animation.
            return text.split(' ').map((word, index) => (
                <span className="char inline-block mr-2" key={index}> {/* mr-2 for spacing between words */}
                    {word}&nbsp;
                </span>
            ));
        }

        // For non-Arabic, maintain original character splitting
        return text.split('').map((char, index) => (
            <span className="char" key={index}>
                {char === ' ' ? '\u00A0' : char}
            </span>
        ));
    }, [children]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

        // Use children array if possible to avoid DOM query, but querying char is strictly necessary for split text animation.
        // Optimization: Batch reads if possible, but GSAP handles this well.
        // The issue might be the text splitting logic itself running on every render if dependencies change.
        // Note: 'splitText' is memoized, so re-render only happens on content change.

        const charElements = el.querySelectorAll('.char');
        if (charElements.length === 0) return;

        // Kill any existing ScrollTrigger to avoid duplication
        // ScrollTrigger.getAll().forEach(st => st.kill()); 

        gsap.fromTo(
            charElements,
            {
                willChange: 'opacity, transform',
                opacity: 0,
                yPercent: 120,
                scaleY: 2.3,
                scaleX: 0.7,
                transformOrigin: '50% 0%'
            },
            {
                duration: animationDuration,
                ease: ease,
                opacity: 1,
                yPercent: 0,
                scaleY: 1,
                scaleX: 1,
                stagger: stagger,
                scrollTrigger: {
                    trigger: el,
                    scroller,
                    start: scrollStart,
                    end: scrollEnd,
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Cleanup on unmount
        return () => {
            // We should only kill the triggers associated with this component, usually handled automatically if we keep reference, 
            // but since we don't have a direct variable here, ScrollTrigger.getAll() is 'nuclear'. 
            // Better cleanup strategy:
            // ScrollTrigger.getById(id)?.kill() if we had IDs.
            // For now, let's trust GSAP React context or just leave global kill off strictly and rely on fromTo returning a tween we can kill.
            // But fromTo returns a tween, ScrollTrigger is inside config. 
            // Let's just remove the heavy handed cleanup that kills everything.
            // ScrollTrigger.getAll().forEach(st => st.kill()); 
        };

    }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

    return (
        <h2 ref={containerRef} className={`scroll-float ${containerClassName}`}>
            <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
        </h2>
    );
};

export default ScrollFloat;

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const TailoringSection = ({ t, lang }) => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const imageContainerRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        let ctx = gsap.context(() => {
            // Staggered text reveal
            gsap.fromTo(".animate-text-item", 
                {
                    opacity: 0,
                    y: 40
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power4.out",
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: textRef.current,
                        start: "top bottom-=10%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Clip path reveal for image container
            gsap.fromTo(imageContainerRef.current,
                {
                    clipPath: "inset(100% 0% 0% 0%)"
                },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1.8,
                    ease: "power4.inOut",
                    scrollTrigger: {
                        trigger: imageContainerRef.current,
                        start: "top bottom-=10%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Subtle parallax shift for image (Y-axis only, no scale on scroll)
            gsap.fromTo(imageRef.current,
                {
                    yPercent: -10
                },
                {
                    yPercent: 10,
                    ease: "none",
                    scrollTrigger: {
                        trigger: imageContainerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleMouseEnter = () => {
        gsap.to(imageRef.current, { scale: 1.08, duration: 0.8, ease: "power2.out" });
    };

    const handleMouseLeave = () => {
        gsap.to(imageRef.current, { scale: 1.0, duration: 0.8, ease: "power2.out" });
    };

    return (
        <section id="bespoke" ref={sectionRef} className={`w-full py-32 relative overflow-hidden ${lang === 'ar' ? 'font-cairo' : ''}`}>
            <div className="container mx-auto px-8 md:px-20 relative z-10 flex flex-col md:flex-row items-center gap-16">

                {/* Text Content */}
                <div
                    ref={textRef}
                    className="w-full md:w-1/2"
                >
                    <h5 className="animate-text-item text-[#C5A880] text-xs uppercase tracking-[0.3em] mb-4">{t?.label || "CRAFTSMANSHIP"}</h5>
                    <h2 className={`animate-text-item text-5xl md:text-7xl text-white mb-8 leading-[1.1] ${lang === 'ar' ? 'font-amiri' : 'font-serif'}`}>
                        {t?.titlePart1 || "The Art of"} <br />
                        <i className={`${lang === 'ar' ? 'font-amiri text-gold' : 'font-pinyon'} text-6xl md:text-8xl`}>
                            {t?.titlePart2 || "Bespoke"}
                        </i>
                    </h2>
                    <p className="animate-text-item text-gray-400 text-lg leading-relaxed mb-8">
                        {t?.desc || "True luxury takes time. Each Ibrahim Al-Iraqi suit is the result of over 80 hours of meticulous hand-craftsmanship. From the initial canvas construction to the final hand-stitched buttonhole, our process honours the traditions of Savile Row while embracing contemporary precision."}
                    </p>
                    <ul className="space-y-4 text-gray-300 text-sm font-semibold tracking-wide uppercase">
                        {t?.bullets?.map((item, index) => (
                            <li key={index} className="animate-text-item flex items-center gap-3">
                                <span className="w-2 h-2 bg-[#C5A880] rounded-full shrink-0"></span>
                                {item}
                            </li>
                        )) || (
                            <>
                                <li className="animate-text-item flex items-center gap-3">
                                    <span className="w-2 h-2 bg-[#C5A880] rounded-full"></span>
                                    Floating Canvas Construction
                                </li>
                                <li className="animate-text-item flex items-center gap-3">
                                    <span className="w-2 h-2 bg-[#C5A880] rounded-full"></span>
                                    Hand-Pad Stitched Lapels
                                </li>
                                <li className="animate-text-item flex items-center gap-3">
                                    <span className="w-2 h-2 bg-[#C5A880] rounded-full"></span>
                                    Functioning Button Cuffs
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Image */}
                <div className="w-full md:w-1/2 relative">
                    <div 
                        ref={imageContainerRef} 
                        className="aspect-[2/3] overflow-hidden rounded-sm relative group bg-[#111] border border-white/5"
                        style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <img
                            ref={imageRef}
                            src="https://res.cloudinary.com/dfxh95yzm/image/upload/f_auto,q_auto,w_800/v1769970966/founder_ypgvjx.jpg"
                            alt="Tailoring Art"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[opacity,filter] duration-700 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 border border-white/10 m-4"></div>

                        {/* Name Tag Overlay */}
                        <div className="absolute bottom-8 left-0 w-full text-center z-10">
                            <h3 className={`text-white text-xl tracking-widest uppercase ${lang === 'ar' ? 'font-amiri' : 'font-serif'}`}>
                                {lang === 'ar' ? 'إبراهيم العراقي' : 'IBRAHIM AL-IRAQI'}
                            </h3>
                            <p className="text-[#C5A880] text-xs uppercase tracking-[0.2em] mt-2">
                                {t?.founderRole || "Master Tailor & Founder"}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default TailoringSection;

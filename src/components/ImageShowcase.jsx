import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const ImageShowcase = ({ t, lang }) => {
    const sectionRef = useRef(null);
    const introRef = useRef(null);
    const img1ContainerRef = useRef(null);
    const img1Ref = useRef(null);
    const img2ContainerRef = useRef(null);
    const img2Ref = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        let ctx = gsap.context(() => {
            // Intro text animation
            gsap.fromTo(".animate-showcase-text", 
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.0,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: introRef.current,
                        start: "top bottom-=10%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Item 1 Parallax Image Scroll
            gsap.fromTo(img1Ref.current,
                { yPercent: -15, scale: 1.15 },
                {
                    yPercent: 10,
                    scale: 1.0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: img1ContainerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );

            // Item 2 Parallax Image Scroll
            gsap.fromTo(img2Ref.current,
                { yPercent: -15, scale: 1.15 },
                {
                    yPercent: 10,
                    scale: 1.0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: img2ContainerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );

            // Item details fade-in
            gsap.fromTo(".animate-details-1",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: img1ContainerRef.current,
                        start: "bottom bottom-=5%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            gsap.fromTo(".animate-details-2",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: img2ContainerRef.current,
                        start: "bottom bottom-=5%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className={`w-full py-24 px-8 md:px-20 ${lang === 'ar' ? 'font-cairo' : ''}`}>
            {/* Intro Text */}
            <div
                ref={introRef}
                className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-gray-800 pb-10"
            >
                <div className="max-w-md animate-showcase-text">
                    <h3 className="text-4xl font-serif mb-4 text-[#f5f5f0]">
                        {t?.title || "Uncompromising Detail"}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                        {t?.desc || "Every stitch is a statement. Our fabrics are sourced from the finest mills in Biella, Italy, ensuring a drape that is both commanding and comfortable."}
                    </p>
                </div>
                <div className="mt-8 md:mt-0 animate-showcase-text">
                    <span className="block text-xs uppercase tracking-widest text-[#D4AF37]">
                        {t?.est || "Est. 2024"}
                    </span>
                </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">

                {/* Item 1: Texture */}
                <div className="group cursor-pointer">
                    <div ref={img1ContainerRef} className="overflow-hidden mb-6 relative h-[600px] rounded-sm bg-[#111]">
                        <img
                            ref={img1Ref}
                            src="/images/luxury_fabric.png"
                            alt="Fabric Detail"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    <div className="flex justify-between items-center animate-details-1">
                        <div>
                            <h4 className="text-xl font-bold mb-1 text-[#f5f5f0]">
                                {t?.item1Title || "Super 150s Wool"}
                            </h4>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">
                                {t?.item1Desc || "Texture / Close-up"}
                            </p>
                        </div>
                        <span className="text-2xl font-serif text-gray-600 group-hover:text-[#f5f5f0] transition-colors">01</span>
                    </div>
                </div>

                {/* Item 2: Lifestyle */}
                <div className="group cursor-pointer md:mt-32">
                    <div ref={img2ContainerRef} className="overflow-hidden mb-6 relative h-[600px] rounded-sm bg-[#111]">
                        <img
                            ref={img2Ref}
                            src="/images/tailor_craft.png"
                            alt="Man Posing"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    <div className="flex justify-between items-center animate-details-2">
                        <div>
                            <h4 className="text-xl font-bold mb-1 text-[#f5f5f0]">
                                {t?.item2Title || "Modern Silhouette"}
                            </h4>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">
                                {t?.item2Desc || "Fit / Style"}
                            </p>
                        </div>
                        <span className="text-2xl font-serif text-gray-600 group-hover:text-[#f5f5f0] transition-colors">02</span>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ImageShowcase;

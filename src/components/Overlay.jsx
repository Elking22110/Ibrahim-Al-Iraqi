import React from 'react';
import { Scroll } from '@react-three/drei';

export const Overlay = () => {
    return (
        <Scroll html style={{ width: '100vw' }}>
            {/* 
        DESIGN PHILOSOPHY: "Bright Modern Luxury"
        - Crisp Dark Typography on Light Background
        - High-fashion magazine layout
        - Clean lines, minimalist aesthetic
      */}

            {/* --- PAGE 1: HERO --- */}
            <section className="h-screen w-full relative pointer-events-none">
                {/* Header / Nav */}
                <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-50 pointer-events-auto">
                    <div className="text-2xl font-bold tracking-widest text-black">
                        SUTTON
                    </div>
                    <div className="flex space-x-8 text-sm text-gray-600 font-sans tracking-wide uppercase">
                        <a href="#" className="hover:text-black transition-colors font-semibold">Collection</a>
                        <a href="#" className="hover:text-black transition-colors font-semibold">Concept</a>
                        <a href="#" className="hover:text-black transition-colors font-semibold">Bespoke</a>
                    </div>
                    <button className="border border-black/20 px-8 py-2 rounded-full text-xs uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all">
                        Pre-Order
                    </button>
                </div>

                {/* Background Big Typo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-5 select-none text-black">
                    <h1 className="text-[12rem] leading-[0.8] font-bold whitespace-nowrap">
                        MODERN
                    </h1>
                    <h1 className="text-[12rem] leading-[0.8] font-bold whitespace-nowrap">
                        TAILOR
                    </h1>
                </div>

                {/* Foreground Handwritten Accent */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <span className="font-script text-gold text-8xl -rotate-12 translate-y-20 block drop-shadow-sm">
                        Timeless
                    </span>
                </div>

                {/* Bottom Card */}
                <div className="absolute bottom-10 right-10 w-80 bg-white/60 backdrop-blur-md border border-black/5 rounded-3xl p-8 pointer-events-auto hover:bg-white transition-all cursor-pointer shadow-lg group">
                    <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-2 font-bold">New Season</h3>
                    <p className="text-gray-800 font-sans text-sm leading-relaxed mb-4">
                        The <span className="text-black font-bold">Ivory Collection</span>. Light, breathable, and unmistakably distinct.
                    </p>
                    <div className="flex items-center space-x-2 text-black text-xs font-bold uppercase tracking-wider group-hover:text-gold transition-colors">
                        <span>View Lookbook</span>
                        <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PAGE 2: DETAILS --- */}
            <section className="h-screen w-full relative flex items-center justify-end px-20 pointer-events-none">
                <div className="w-96 pointer-events-auto">
                    <h2 className="text-6xl font-bold text-black mb-6 leading-tight drop-shadow-sm">
                        ITALIAN <br /> <span className="text-gold">LINEN</span>
                    </h2>
                    <div className="w-24 h-1.5 bg-black mb-8 rounded-full"></div>

                    <div className="space-y-6">
                        <div className="bg-white/80 p-6 rounded-2xl border-l-4 border-gold shadow-lg transform hover:-translate-x-2 transition-transform duration-300">
                            <h3 className="text-black text-lg font-serif mb-1">Summer Weight</h3>
                            <p className="text-gray-600 text-sm">Engineered for the sun. Cool to the touch, effortless to wear.</p>
                        </div>
                        <div className="bg-white/80 p-6 rounded-2xl border-l-4 border-black shadow-lg transform hover:-translate-x-2 transition-transform duration-300">
                            <h3 className="text-black text-lg font-serif mb-1">Crisp Structure</h3>
                            <p className="text-gray-600 text-sm">Maintains its silhouette from morning espresso to evening aperitivo.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PAGE 3: BUY --- */}
            <section className="h-screen w-full flex flex-col items-center justify-center pointer-events-none relative">
                <h1 className="text-[12rem] font-bold text-gray-200 absolute z-0 select-none opacity-50">
                    SUTTON
                </h1>
                <div className="z-10 bg-white/90 backdrop-blur-xl p-12 rounded-[2rem] border border-white text-center pointer-events-auto max-w-xl shadow-2xl">
                    <h2 className="text-5xl font-serif text-black mb-4">Your Custom Fit</h2>
                    <p className="text-gray-600 mb-8 font-sans">
                        Experience the luxury of bespoke tailoring, digitized.
                    </p>
                    <button className="w-full py-5 text-lg bg-black text-white font-bold tracking-[0.25em] rounded-xl hover:bg-gold hover:text-black transition-all duration-300 shadow-xl">
                        START FITTING
                    </button>
                </div>
            </section>
        </Scroll>
    );
};

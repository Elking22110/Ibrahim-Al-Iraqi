import React from 'react';
import { motion } from 'framer-motion';
import ScrollFloat from './ScrollFloat';

const CollectionGrid = ({ t, lang }) => {
    const products = t?.products || [
        { id: 1, name: "The Midnight Tuxedo", price: "$2,800", img: "/hero-suit.png" },
        { id: 2, name: "Royal Navy Pinstripe", price: "$2,400", img: "/collection-group.png" },
        { id: 3, name: "Charcoal Cashmere", price: "$3,100", img: "/man-posing.png" },
    ];

    return (
        <section id="collection" className={`w-full py-32 bg-[#050505] ${lang === 'ar' ? 'font-cairo' : ''}`}>
            <div className="container mx-auto px-8 md:px-20">

                {/* Header */}
                <div className="text-center mb-24">
                    <motion.h3
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#D4AF37] uppercase tracking-[0.4em] mb-4 text-xs font-bold"
                    >
                        JOURNAL
                    </motion.h3>
                    <ScrollFloat
                        animationDuration={2.5}
                        ease='back.out(1.5)'
                        scrollStart='top bottom-=20%'
                        scrollEnd='bottom bottom-=20%'
                        stagger={0.1}
                        containerClassName={`mb-6 ${lang === 'ar' ? 'font-amiri' : 'font-serif'}`}
                        textClassName="text-5xl md:text-7xl text-white"
                    >
                        {t?.title}
                    </ScrollFloat>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed italic">
                        "{t?.subtitle}"
                    </p>
                </div>

                {/* Dynamic Masonry Layout */}
                <div className="flex flex-col lg:flex-row gap-4 h-[100vh] lg:h-[600px] w-full">

                    {/* Item 1 */}
                    <motion.div
                        className="relative flex-1 group overflow-hidden rounded-sm cursor-pointer border border-white/5"
                        whileHover={{ flex: 3 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                        <img src="/collection-group.png" alt="Gallery 1" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-transparent transition-colors duration-500"></div>
                        <div className="absolute bottom-0 left-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                            <span className="text-[#D4AF37] text-xs tracking-[0.3em] font-bold uppercase">Signature</span>
                            <h4 className="text-white text-3xl font-serif mt-2 whitespace-nowrap">Absolute Perfection</h4>
                        </div>
                    </motion.div>

                    {/* Item 2 */}
                    <motion.div
                        className="relative flex-1 group overflow-hidden rounded-sm cursor-pointer border border-white/5"
                        whileHover={{ flex: 3 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                        <img src="/man-posing.png" alt="Gallery 2" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 object-top" />
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-transparent transition-colors duration-500"></div>
                        <div className="absolute bottom-0 left-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                            <span className="text-[#D4AF37] text-xs tracking-[0.3em] font-bold uppercase">Persona</span>
                            <h4 className="text-white text-3xl font-serif mt-2 whitespace-nowrap">Modern Gentleman</h4>
                        </div>
                    </motion.div>

                    {/* Item 3 */}
                    <motion.div
                        className="relative flex-1 group overflow-hidden rounded-sm cursor-pointer border border-white/5"
                        whileHover={{ flex: 3 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                        <img src="/fabric-detail.png" alt="Gallery 3" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-transparent transition-colors duration-500"></div>
                        <div className="absolute bottom-0 left-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                            <span className="text-[#D4AF37] text-xs tracking-[0.3em] font-bold uppercase">Details</span>
                            <h4 className="text-white text-3xl font-serif mt-2 whitespace-nowrap">Intricate Weaves</h4>
                        </div>
                    </motion.div>

                    {/* Item 4 */}
                    <motion.div
                        className="relative flex-1 group overflow-hidden rounded-sm cursor-pointer border border-white/5"
                        whileHover={{ flex: 3 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                        <img src="https://res.cloudinary.com/dfxh95yzm/image/upload/v1769970982/tailor_uk6jyl.jpg" alt="Gallery 4" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-transparent transition-colors duration-500"></div>
                        <div className="absolute bottom-0 left-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                            <span className="text-[#D4AF37] text-xs tracking-[0.3em] font-bold uppercase">Craft</span>
                            <h4 className="text-white text-3xl font-serif mt-2 whitespace-nowrap">Heritage Stitch</h4>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default CollectionGrid;

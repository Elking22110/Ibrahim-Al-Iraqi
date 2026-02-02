import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollFloat from './ScrollFloat';

const allImages = [
    // Featured (User Selected)
    "IMG_0339.JPG.jpeg", "IMG_0233.JPG.jpeg", "IMG_0207.JPG.jpeg", "IMG_0394.JPG.jpeg",
    // Expanded Grid
    "IMG_0199.JPG.jpeg", "IMG_0201.JPG.jpeg", "IMG_0205.JPG.jpeg",
    "IMG_0261.JPG.jpeg", "IMG_0262.JPG.jpeg", "IMG_0274.JPG.jpeg", "IMG_0324.JPG.jpeg",
    "IMG_0338.JPG.jpeg", "IMG_0347.JPG.jpeg", "IMG_0360.JPG.jpeg", "IMG_0362.JPG.jpeg",
    "IMG_0368.JPG.jpeg", "IMG_0369.JPG.jpeg", "IMG_0382.JPG.jpeg", "IMG_0384.JPG.jpeg",
    "IMG_0395.JPG.jpeg", "IMG_0397.JPG.jpeg", "IMG_0399.JPG.jpeg"
];

// Split images: Top 4 for initial view, rest for expandable grid
const featuredImages = allImages.slice(0, 4);
const hiddenImages = allImages.slice(4);

const CollectionGrid = ({ t, lang }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section id="collection" className={`w-full py-32 ${lang === 'ar' ? 'font-cairo' : ''}`}>
            <div className="container mx-auto px-8 md:px-20">

                {/* Header */}
                <div className="text-center mb-20">
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
                        containerClassName={`mb-6 py-4 ${lang === 'ar' ? 'font-amiri' : 'font-serif'}`}
                        textClassName="text-5xl md:text-7xl text-white"
                    >
                        {t?.title || "The Collection"}
                    </ScrollFloat>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed italic">
                        "{t?.subtitle || "Defining the essence of modern luxury."}"
                    </p>
                </div>

                {/* Initial Featured View (Top 4) */}
                <div className="flex flex-col lg:flex-row gap-4 h-[100vh] lg:h-[600px] w-full mb-12">
                    {featuredImages.map((img, index) => (
                        <motion.div
                            key={index}
                            className="relative flex-1 group overflow-hidden rounded-sm cursor-pointer border border-white/5"
                            whileHover={{ flex: 3 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            <img
                                src={`/The Gallery/${img}`}
                                alt={`Featured ${index + 1}`}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-transparent transition-colors duration-500"></div>

                            {/* Optional Label Overlay */}
                            <div className="absolute bottom-0 left-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                <span className="text-[#D4AF37] text-xs tracking-[0.3em] font-bold uppercase">View</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View More Button */}
                <div className="flex justify-center mb-12">
                    <motion.button
                        layout
                        onClick={() => setIsExpanded(!isExpanded)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 border border-[#D4AF37] text-[#D4AF37] uppercase tracking-widest text-sm hover:bg-[#D4AF37] hover:text-black transition-colors duration-300"
                    >
                        {isExpanded
                            ? (lang === 'ar' ? 'إخفاء الصور' : 'View Less')
                            : (lang === 'ar' ? 'رؤية المعرض كامل' : 'View Full Collection')
                        }
                    </motion.button>
                </div>

                {/* Expandable Grid */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="columns-1 md:columns-3 gap-4 space-y-4 pb-20">
                                {hiddenImages.map((img, index) => (
                                    <motion.div
                                        key={`hidden-${index}`}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                        viewport={{ once: true }}
                                        className="break-inside-avoid relative group overflow-hidden rounded-sm"
                                    >
                                        <img
                                            src={`/The Gallery/${img}`}
                                            alt={`Gallery ${index + 5}`}
                                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
};

export default CollectionGrid;

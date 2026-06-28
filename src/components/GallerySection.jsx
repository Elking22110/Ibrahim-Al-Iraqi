import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollFloat from './ScrollFloat';

const GallerySection = ({ t, lang, albums = [] }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    const allLabel = lang === 'ar' ? 'الكل' : 'All';

    const filteredImages = selectedCategory === 'All'
        ? albums.flatMap(album => album.images.map(img => ({ albumName: album.name, img })))
        : (albums.find(album => album.name === selectedCategory)?.images.map(img => ({ albumName: selectedCategory, img })) || []);

    // Support both Cloudinary objects {url, filename} and local string paths
    const getImgSrc = (albumName, img) => {
        if (typeof img === 'object' && img.url) return img.url;
        return `/The Gallery/${encodeURIComponent(albumName)}/${encodeURIComponent(img)}`;
    };
    const getImgKey = (albumName, img) => {
        const name = typeof img === 'object' ? img.filename : img;
        return `${albumName}-${name}`;
    };

    return (
        <section id="gallery" className={`w-full py-24 bg-[#0a0a0a] relative overflow-hidden ${lang === 'ar' ? 'font-cairo' : ''}`}>
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h3
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#D4AF37] uppercase tracking-[0.3em] mb-4 text-xs font-bold"
                    >
                        {lang === 'ar' ? 'المعرض' : 'THE GALLERY'}
                    </motion.h3>
                    <ScrollFloat
                        animationDuration={2.5}
                        ease='back.out(1.5)'
                        scrollStart='top bottom-=20%'
                        scrollEnd='bottom bottom-=20%'
                        stagger={0.1}
                        containerClassName={`mb-6 ${lang === 'ar' ? 'font-amiri' : 'font-serif'}`}
                        textClassName="text-4xl md:text-6xl text-[#f5f5f0]"
                    >
                        {lang === 'ar' ? 'إبداع بلا حدود' : 'Timeless Elegance'}
                    </ScrollFloat>
                </div>

                {/* Category Selector Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-10">
                    <button
                        onClick={() => setSelectedCategory('All')}
                        className={`px-6 py-2 rounded-full border text-xs uppercase tracking-widest font-bold transition-all duration-300 ${
                            selectedCategory === 'All'
                                ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                                : 'border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                        }`}
                    >
                        {allLabel}
                    </button>
                    {albums.map((album, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedCategory(album.name)}
                            className={`px-6 py-2 rounded-full border text-xs uppercase tracking-widest font-bold transition-all duration-300 ${
                                selectedCategory === album.name
                                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                                    : 'border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                            }`}
                        >
                            {album.name}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid */}
                <motion.div 
                    layout
                    className="columns-1 md:columns-3 gap-4 space-y-4"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredImages.map(({ albumName, img }, index) => (
                            <motion.div
                                key={getImgKey(albumName, img)}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                                className="break-inside-avoid relative group overflow-hidden rounded-sm cursor-pointer"
                            >
                                <div className="relative overflow-hidden w-full">
                                    <img
                                        src={getImgSrc(albumName, img)}
                                        alt={`Gallery Image ${index + 1}`}
                                        className="w-full h-auto object-cover transform transition-all duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>

                                    {/* Border Glow on Hover */}
                                    <div className="absolute inset-0 border border-transparent group-hover:border-[#D4AF37]/30 transition-colors duration-500 pointer-events-none"></div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default GallerySection;

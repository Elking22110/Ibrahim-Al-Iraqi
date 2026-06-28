import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollFloat from './ScrollFloat';

// Helper: get image src supporting both Cloudinary objects and local paths
const getImgSrc = (img) => {
    if (!img) return '';
    if (typeof img === 'object' && img.url) return img.url;
    // img is a string like "Collection/IMG_0199.jpeg"
    return `/The Gallery/${img}`;
};

const CollectionGrid = ({ t, lang, albums = [] }) => {
    const allLabel = lang === 'ar' ? 'الكل' : 'All';
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isExpanded, setIsExpanded] = useState(false);

    // Reset expansion when category changes
    useEffect(() => {
        setIsExpanded(false);
    }, [selectedCategory]);

    // Format all images with their folder prefix
    // e.g. { url, filename, path: "Collection/filename" }
    const getFormattedImages = () => {
        return albums.flatMap(album =>
            album.images.map(img => {
                if (typeof img === 'object') {
                    return {
                        ...img,
                        albumName: album.name,
                        path: img.url // Use full Cloudinary URL directly
                    };
                }
                return {
                    filename: img,
                    albumName: album.name,
                    path: `${encodeURIComponent(album.name)}/${encodeURIComponent(img)}`
                };
            })
        );
    };

    const allImages = getFormattedImages();

    // Filter images based on selected category
    const filteredImages = selectedCategory === 'All'
        ? allImages
        : allImages.filter(img => img.albumName === selectedCategory);

    const featuredImages = filteredImages.slice(0, 4);
    const hiddenImages = filteredImages.slice(4);

    return (
        <section id="collection" className={`w-full py-32 bg-[#0A0A0A] relative overflow-hidden ${lang === 'ar' ? 'font-cairo' : ''}`}>
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/2 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container mx-auto px-8 md:px-20 relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h3
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#D4AF37] uppercase tracking-[0.4em] mb-4 text-xs font-bold"
                    >
                        {lang === 'ar' ? 'مختارات العراقي' : 'AL-IRAQI JOURNAL'}
                    </motion.h3>
                    <ScrollFloat
                        animationDuration={2.5}
                        ease='back.out(1.5)'
                        scrollStart='top bottom-=20%'
                        scrollEnd='bottom bottom-=20%'
                        stagger={0.1}
                        containerClassName={`mb-6 py-2 ${lang === 'ar' ? 'font-amiri' : 'font-serif'}`}
                        textClassName="text-5xl md:text-7xl text-[#f5f5f0]"
                    >
                        {t?.title || (lang === 'ar' ? 'مجموعات الفخامة' : 'Bespoke Collections')}
                    </ScrollFloat>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed italic">
                        "{t?.subtitle || (lang === 'ar' ? 'أناقة وتصميم صُنعا خصيصاً ليناسبا هويتك الفاخرة.' : 'Bespoke tailoring, defining the essence of modern luxury.')}"
                    </p>
                </div>

                {/* Category Selection Tabs */}
                {albums.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-3 mb-12 relative z-10">
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
                )}

                {/* 4 Accordion Images Grid (Restored Shape and Animation) */}
                {featuredImages.length > 0 && (
                    <div className="flex flex-col lg:flex-row gap-4 h-auto min-h-screen lg:min-h-0 lg:h-[600px] w-full mb-12">
                        {featuredImages.map((img, index) => (
                            <motion.div
                                key={index}
                                className="relative flex-1 group overflow-hidden rounded-sm cursor-pointer border border-white/5"
                                layout
                                whileHover={featuredImages.length > 1 ? { flex: 3 } : {}}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                            >
                                <img
                                    src={getImgSrc(img.path)}
                                    alt={`Featured ${index + 1}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover grayscale-0 md:grayscale md:group-hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-transparent md:bg-black/60 md:group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>

                                {/* View Label Overlay */}
                                <div className="absolute bottom-0 left-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                    <span className="text-[#D4AF37] text-xs tracking-[0.3em] font-bold uppercase">
                                        {lang === 'ar' ? 'عرض' : 'View'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Expand Grid Button */}
                {hiddenImages.length > 0 && (
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
                )}

                {/* Expanded Grid */}
                <AnimatePresence>
                    {isExpanded && hiddenImages.length > 0 && (
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
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
                                        viewport={{ once: true }}
                                        className="break-inside-avoid relative group overflow-hidden rounded-sm"
                                    >
                                        <img
                                            src={getImgSrc(img.path)}
                                            alt={`Gallery ${index + 5}`}
                                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
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

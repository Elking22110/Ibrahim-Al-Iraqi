import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollFloat from './ScrollFloat';

// Helper: get image src supporting both Cloudinary objects and local paths
const getImgSrc = (albumName, img) => {
    if (!img) return '';
    if (typeof img === 'object' && img.url) return img.url;
    return `/The Gallery/${encodeURIComponent(albumName)}/${encodeURIComponent(img)}`;
};

// Helper: get album cover image object
const getAlbumCover = (album) => {
    if (!album?.images?.length) return null;
    const cover = album.images.find(img => {
        const name = typeof img === 'object' ? img.filename : img;
        return name && name.toLowerCase().startsWith('cover');
    });
    return cover || album.images[0];
};

const CollectionGrid = ({ t, lang, albums = [] }) => {
    const [activeAlbumName, setActiveAlbumName] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Initialize active album
    useEffect(() => {
        if (albums.length > 0 && !activeAlbumName) {
            setActiveAlbumName(albums[0].name);
        }
    }, [albums, activeAlbumName]);

    // Active album data
    const activeAlbum = albums.find(a => a.name === activeAlbumName) || albums[0];
    const displayAlbums = albums.slice(0, 4);

    return (
        <section id="collection" className={`w-full py-32 bg-[#0A0A0A] relative overflow-hidden ${lang === 'ar' ? 'font-cairo' : ''}`}>
            
            {/* Soft decorative background glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/2 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container mx-auto px-8 md:px-20 relative z-10">

                {/* Header */}
                <div className="text-center mb-20">
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

                {/* Album Category Boxes (Top 4 Albums) */}
                {displayAlbums.length > 0 && (
                    <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[500px] w-full mb-16">
                        {displayAlbums.map((album, index) => {
                            const coverImg = getAlbumCover(album);
                            const isActive = activeAlbumName === album.name;

                            return (
                                <motion.div
                                    key={index}
                                    onClick={() => {
                                        setActiveAlbumName(album.name);
                                        setIsExpanded(true); // Auto-expand to show photos when clicked
                                    }}
                                    className={`relative flex-1 group overflow-hidden rounded-2xl cursor-pointer border transition-all duration-700 ${
                                        isActive 
                                            ? 'border-[#D4AF37] lg:flex-[2.5]' 
                                            : 'border-white/10 hover:border-[#D4AF37]/50'
                                    }`}
                                    layout
                                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                                >
                                    {/* Album Cover Background */}
                                    {coverImg && (
                                        <img
                                            src={getImgSrc(album.name, coverImg)}
                                            alt={album.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                                        />
                                    )}

                                    {/* Dark Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${
                                        isActive ? 'opacity-80' : 'opacity-60 group-hover:opacity-80'
                                    }`}></div>

                                    {/* Album Title Text */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                                        <span className="text-[#D4AF37] text-[10px] tracking-[0.3em] font-bold uppercase mb-2">
                                            {album.images.length} {lang === 'ar' ? 'صورة' : 'PHOTOS'}
                                        </span>
                                        <h4 className="text-white text-2xl tracking-[0.1em] font-serif uppercase mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
                                            {album.name}
                                        </h4>
                                        <div className={`h-[1px] bg-[#D4AF37] transition-all duration-500 origin-left ${
                                            isActive ? 'w-24' : 'w-0 group-hover:w-16'
                                        }`}></div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* View/Explore Selected Album Button */}
                {activeAlbum && (
                    <div className="flex justify-center mb-12">
                        <motion.button
                            layout
                            onClick={() => setIsExpanded(!isExpanded)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3.5 border border-[#D4AF37] text-[#D4AF37] uppercase tracking-widest text-xs font-bold hover:bg-[#D4AF37] hover:text-black transition-colors duration-300 rounded-full"
                        >
                            {isExpanded
                                ? (lang === 'ar' ? `إخفاء صور ${activeAlbumName}` : `Hide ${activeAlbumName} Photos`)
                                : (lang === 'ar' ? `استعراض صور قسم ${activeAlbumName}` : `Explore ${activeAlbumName} Photos`)
                            }
                        </motion.button>
                    </div>
                )}

                {/* Selected Album Images Grid */}
                <AnimatePresence>
                    {isExpanded && activeAlbum && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="columns-1 md:columns-3 gap-6 space-y-6 pb-20">
                                {activeAlbum.images.map((img, index) => {
                                    // Don't show the cover in the sub-gallery to prevent repetition, unless it's the only image
                                    const name = typeof img === 'object' ? img.filename : img;
                                    const isCover = name && name.toLowerCase().startsWith('cover');
                                    if (isCover && activeAlbum.images.length > 1) return null;

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3) }}
                                            viewport={{ once: true }}
                                            className="break-inside-avoid relative group overflow-hidden rounded-xl border border-white/5 bg-zinc-900/20"
                                        >
                                            <img
                                                src={getImgSrc(activeAlbum.name, img)}
                                                alt={`${activeAlbum.name} ${index + 1}`}
                                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
};

export default CollectionGrid;

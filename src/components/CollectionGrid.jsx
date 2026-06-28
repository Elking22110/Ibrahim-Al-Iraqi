import React, { useState, useEffect, useRef } from 'react';
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
    const photosAnchorRef = useRef(null);

    const scrollToPhotos = () => {
        setTimeout(() => {
            photosAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 350); // 350ms delay accommodates the expand transition beautifully
    };

    // Default placeholders for the 4 vertical accordion columns
    const defaultCovers = [
        '/The Gallery/Classic/IMG_0199.JPG.jpeg',
        '/The Gallery/Classic/IMG_0201.JPG.jpeg',
        '/The Gallery/Classic/IMG_0205.JPG.jpeg',
        '/The Gallery/Classic/IMG_0207.JPG.jpeg'
    ];

    const defaultNames = [
        lang === 'ar' ? 'كلاسيكي' : 'Classic',
        lang === 'ar' ? 'بدل زفاف' : 'Wedding Suits',
        lang === 'ar' ? 'كاجوال' : 'Casual',
        lang === 'ar' ? 'بدل فاخرة' : 'Luxury Suits'
    ];

    // Find custom albums that map to the 4 categories
    const getAlbumForColumn = (index) => {
        if (index === 0) {
            return albums.find(a => {
                const n = a.name.toLowerCase();
                return n.includes('classic') || n.includes('collection') || n.includes('كلاسيك');
            });
        }
        if (index === 1) {
            return albums.find(a => {
                const n = a.name.toLowerCase();
                return n.includes('wedding') || n.includes('زفاف');
            });
        }
        if (index === 2) {
            return albums.find(a => {
                const n = a.name.toLowerCase();
                return n.includes('casual') || n.includes('كاجوال');
            });
        }
        if (index === 3) {
            return albums.find(a => {
                const n = a.name.toLowerCase();
                return n.includes('luxury') || n.includes('فاخر');
            });
        }
        return null;
    };

    // Build exactly 4 columns
    const columnsData = Array.from({ length: 4 }).map((_, index) => {
        const album = getAlbumForColumn(index);
        const colName = defaultNames[index];

        if (album) {
            const cover = getAlbumCover(album);
            return {
                id: album.name,
                name: colName,
                coverUrl: cover ? getImgSrc(album.name, cover) : defaultCovers[index],
                images: album.images,
                isPlaceholder: false
            };
        } else {
            return {
                id: `placeholder-${index}`,
                name: colName,
                coverUrl: defaultCovers[index],
                images: [],
                isPlaceholder: true
            };
        }
    });

    // Initialize active album name
    useEffect(() => {
        if (columnsData.length > 0 && !activeAlbumName) {
            setActiveAlbumName(columnsData[0].name);
        }
    }, [albums, activeAlbumName]);

    // Active column data
    const activeColumn = columnsData.find(c => c.name === activeAlbumName) || columnsData[0];

    return (
        <section id="collection" className={`w-full py-32 bg-[#0A0A0A] relative overflow-hidden ${lang === 'ar' ? 'font-cairo' : ''}`}>
            
            {/* Background decorative glow */}
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

                {/* Exactly 4 Accordion Columns (Albums) */}
                <div className="flex flex-col lg:flex-row gap-4 h-auto min-h-screen lg:min-h-0 lg:h-[600px] w-full mb-16">
                    {columnsData.map((col, index) => {
                        const isActive = activeAlbumName === col.name;

                        return (
                            <motion.div
                                key={col.id}
                                onClick={() => {
                                    setActiveAlbumName(col.name);
                                    setIsExpanded(true); // Auto expand to show photos
                                    scrollToPhotos();
                                }}
                                className="relative flex-1 group overflow-hidden rounded-sm cursor-pointer border border-white/5"
                                layout
                                whileHover={{ flex: 3 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                            >
                                <img
                                    src={col.coverUrl}
                                    alt={col.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover grayscale-0 md:grayscale md:group-hover:grayscale-0 transition-all duration-700"
                                />
                                
                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-500"></div>

                                {/* Text info overlay */}
                                <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                                    <span className="text-[#D4AF37] text-[10px] tracking-[0.3em] font-bold uppercase mb-2">
                                        {col.isPlaceholder 
                                            ? (lang === 'ar' ? 'قريباً' : 'COMING SOON') 
                                            : `${col.images.length} ${lang === 'ar' ? 'صورة' : 'PHOTOS'}`}
                                    </span>
                                    <h4 className="text-white text-2xl tracking-[0.15em] font-serif uppercase mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
                                        {col.name}
                                    </h4>
                                    <div className={`h-[1px] bg-[#D4AF37] transition-all duration-500 origin-left ${
                                        isActive ? 'w-24' : 'w-0 group-hover:w-16'
                                    }`}></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* View/Explore Selected Album Button */}
                {activeColumn && (
                    <div className="flex justify-center mb-12">
                        <motion.button
                            layout
                            onClick={() => {
                                const nextVal = !isExpanded;
                                setIsExpanded(nextVal);
                                if (nextVal) {
                                    scrollToPhotos();
                                }
                            }}
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

                {/* Scroll Anchor */}
                <div ref={photosAnchorRef} className="scroll-mt-24" />

                {/* Selected Album Images Grid */}
                <AnimatePresence>
                    {isExpanded && activeColumn && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                            className="overflow-hidden"
                        >
                            {activeColumn.images.length === 0 ? (
                                <div className="text-center py-20 text-gray-500 text-sm border border-dashed border-white/10 rounded-2xl">
                                    {lang === 'ar' 
                                        ? 'هذا القسم فارغ حالياً. يمكنك إضافة صور وتعيين غلاف له من لوحة التحكم.' 
                                        : 'This category is empty. You can add photos and set its cover from the admin dashboard.'}
                                </div>
                            ) : (
                                <div className="columns-1 md:columns-3 gap-6 space-y-6 pb-20">
                                    {activeColumn.images.map((img, index) => {
                                        // Hide cover file to prevent duplicate if there are other files
                                        const name = typeof img === 'object' ? img.filename : img;
                                        const isCover = name && name.toLowerCase().startsWith('cover');
                                        if (isCover && activeColumn.images.length > 1) return null;

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
                                                    src={getImgSrc(activeColumn.id, img)}
                                                    alt={`${activeColumn.name} ${index + 1}`}
                                                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
};

export default CollectionGrid;

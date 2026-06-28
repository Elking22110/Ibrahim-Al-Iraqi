import React from 'react';
import { motion } from 'framer-motion';
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

const CollectionGrid = ({ t, lang, albums = [], onNavigate }) => {
    // Default placeholders for the 4 vertical accordion columns
    const getAlbumDisplayName = (albumName, currentLang) => {
        if (!albumName) return '';
        const n = albumName.toLowerCase();
        if (n.includes('classic') || n.includes('collection') || n.includes('كلاسيك')) {
            return currentLang === 'ar' ? 'كلاسيكي' : 'Classic';
        }
        if (n.includes('wedding') || n.includes('زفاف')) {
            return currentLang === 'ar' ? 'بدل زفاف' : 'Wedding Suits';
        }
        if (n.includes('casual') || n.includes('كاجوال')) {
            return currentLang === 'ar' ? 'كاجوال' : 'Casual';
        }
        if (n.includes('luxury') || n.includes('فاخر')) {
            return currentLang === 'ar' ? 'بدل فاخرة' : 'Luxury Suits';
        }
        return albumName;
    };

    // 1. Gather all core albums (which might map to Cloudinary folders or show placeholders)
    const coreColumnAlbums = [
        { id: 'Classic', defaultName: lang === 'ar' ? 'كلاسيكي' : 'Classic' },
        { id: 'Wedding', defaultName: lang === 'ar' ? 'بدل زفاف' : 'Wedding Suits' },
        { id: 'Casual', defaultName: lang === 'ar' ? 'كاجوال' : 'Casual' },
        { id: 'Luxury', defaultName: lang === 'ar' ? 'بدل فاخرة' : 'Luxury Suits' }
    ].map(cat => {
        const realAlbum = albums.find(a => {
            const n = a.name.toLowerCase();
            const target = cat.id.toLowerCase();
            if (target === 'classic') return n.includes('classic') || n.includes('collection') || n.includes('كلاسيك');
            if (target === 'wedding') return n.includes('wedding') || n.includes('زفاف');
            if (target === 'casual') return n.includes('casual') || n.includes('كاجوال');
            if (target === 'luxury') return n.includes('luxury') || n.includes('فاخر');
            return false;
        });

        const cover = realAlbum ? getAlbumCover(realAlbum) : null;
        const defaultCovers = {
            Classic: '/The Gallery/Classic/IMG_0199.JPG.jpeg',
            Wedding: '/The Gallery/Classic/IMG_0201.JPG.jpeg',
            Casual: '/The Gallery/Classic/IMG_0205.JPG.jpeg',
            Luxury: '/The Gallery/Classic/IMG_0207.JPG.jpeg'
        };

        return {
            id: realAlbum ? realAlbum.name : cat.id,
            name: cat.defaultName,
            coverUrl: cover ? getImgSrc(realAlbum.name, cover) : defaultCovers[cat.id],
            images: realAlbum ? realAlbum.images : [],
            isPlaceholder: !realAlbum
        };
    });

    // 2. Gather custom albums that don't match the core 4
    const customColumnAlbums = albums.filter(a => {
        const n = a.name.toLowerCase();
        const isClassic = n.includes('classic') || n.includes('collection') || n.includes('كلاسيك');
        const isWedding = n.includes('wedding') || n.includes('زفاف');
        const isCasual = n.includes('casual') || n.includes('كاجوال');
        const isLuxury = n.includes('luxury') || n.includes('فاخر');
        return !isClassic && !isWedding && !isCasual && !isLuxury;
    }).map(a => {
        const cover = getAlbumCover(a);
        return {
            id: a.name,
            name: getAlbumDisplayName(a.name, lang),
            coverUrl: cover ? getImgSrc(a.name, cover) : '/The Gallery/Classic/IMG_0199.JPG.jpeg',
            images: a.images,
            isPlaceholder: false
        };
    });

    // Combine them to form the accordion layout (dynamic!)
    const columnsData = [...coreColumnAlbums, ...customColumnAlbums];

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
                        return (
                            <motion.div
                                key={col.id}
                                onClick={() => {
                                    const pathMap = ['Classic', 'Wedding', 'Casual', 'Luxury'];
                                    onNavigate(`/album/${pathMap[index]}`);
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
                                    <div className="h-[1px] bg-[#D4AF37] transition-all duration-500 origin-left w-0 group-hover:w-16"></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default CollectionGrid;

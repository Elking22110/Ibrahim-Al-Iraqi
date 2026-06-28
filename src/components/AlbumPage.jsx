import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { getProductMetadata } from '../productMetadata';

// Helper: get image src supporting both Cloudinary objects and local paths
const getImgSrc = (category, coverImage) => {
    if (!coverImage) return '';
    if (typeof coverImage === 'object' && coverImage.url) return coverImage.url;
    // Check if coverImage is inside a suit folder for local fallback paths
    return `/The Gallery/${encodeURIComponent(category)}/${encodeURIComponent(coverImage)}`;
};

const AlbumPage = ({ albumName, albums, lang, onNavigate, productCatalog = {} }) => {
    // Find active album in albums data
    const activeAlbum = albums.find(a => {
        const n = a.name.toLowerCase();
        const target = albumName.toLowerCase();
        if (target === 'classic') return n.includes('classic') || n.includes('collection') || n.includes('كلاسيك');
        if (target === 'wedding') return n.includes('wedding') || n.includes('زفاف');
        if (target === 'casual') return n.includes('casual') || n.includes('كاجوال');
        if (target === 'luxury') return n.includes('luxury') || n.includes('فاخر');
        return n === target;
    });

    const getAlbumDisplayName = () => {
        const target = albumName.toLowerCase();
        if (target === 'classic') return lang === 'ar' ? 'كلاسيكي' : 'Classic Collection';
        if (target === 'wedding') return lang === 'ar' ? 'بدل زفاف' : 'Wedding Suits';
        if (target === 'casual') return lang === 'ar' ? 'كاجوال' : 'Casual Suits';
        if (target === 'luxury') return lang === 'ar' ? 'بدل فاخرة' : 'Luxury Suits';
        return albumName;
    };

    const handleGoBack = () => {
        onNavigate('/');
    };

    const handleProductClick = (suitId) => {
        onNavigate(`/product/${albumName}/${suitId}`);
    };

    const suitsToDisplay = activeAlbum?.suits || [];

    return (
        <div className={`w-full min-h-screen bg-[#0A0A0A] text-[#f5f5f0] py-24 px-6 md:px-20 ${lang === 'ar' ? 'font-cairo' : 'font-sans'}`}>
            {/* Header / Nav */}
            <div className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-white/5 pb-8">
                <button
                    onClick={handleGoBack}
                    className="flex items-center gap-3 py-2 px-5 bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-full transition-all duration-300 text-sm font-bold"
                >
                    <FaArrowLeft className={`${lang === 'ar' ? 'rotate-180' : ''}`} />
                    {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </button>

                <div className="text-right">
                    <span className="text-[#D4AF37] text-[10px] tracking-[0.3em] font-bold uppercase mb-1 block">
                        {lang === 'ar' ? 'مختارات خاصة' : 'PRIVATE ARCHIVE'}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-white uppercase">
                        {getAlbumDisplayName()}
                    </h1>
                </div>
            </div>

            {/* Grid Container */}
            <div className="max-w-7xl mx-auto">
                {suitsToDisplay.length === 0 ? (
                    <div className="text-center py-32 border border-dashed border-white/10 rounded-2xl flex flex-col justify-center items-center gap-4">
                        <p className="text-gray-500 text-lg">
                            {lang === 'ar' 
                                ? 'هذا القسم فارغ حالياً. سيقوم المسؤول بإضافة صور قريباً!' 
                                : 'This section is currently empty. Premium designs coming soon!'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {suitsToDisplay.map((suit, index) => {
                            // Find suitable cover image URL
                            let coverSrc = '';
                            if (suit.coverImage) {
                                if (suit.coverImage.url) {
                                    coverSrc = suit.coverImage.url;
                                } else {
                                    // Local fallback
                                    coverSrc = `/The Gallery/${encodeURIComponent(activeAlbum.name)}/${suit.isLegacy ? '' : encodeURIComponent(suit.id) + '/'}${encodeURIComponent(suit.coverImage.filename || suit.coverImage)}`;
                                }
                            }

                            // Retrieve suit texts from database, or fallback to metadata generator
                            const name = lang === 'ar' ? suit.nameAr : suit.nameEn;
                            const desc = lang === 'ar' ? suit.descAr : suit.descEn;
                            const price = lang === 'ar' ? suit.priceAr : suit.priceEn;

                            const fallbackMeta = (!name && !price) 
                                ? getProductMetadata(activeAlbum.name, suit.id, lang, productCatalog) 
                                : null;

                            const displayName = name || fallbackMeta?.name || suit.id;
                            const displayPrice = price || fallbackMeta?.price || '';
                            const displayDesc = desc || fallbackMeta?.desc || '';

                            return (
                                <motion.div
                                    key={suit.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                                    onClick={() => handleProductClick(suit.id)}
                                    className="group cursor-pointer flex flex-col justify-between"
                                >
                                    {/* Image Card Container */}
                                    <div className="overflow-hidden mb-6 relative aspect-[3/4] rounded-sm bg-[#111] border border-white/5 group-hover:border-[#D4AF37]/30 transition-all duration-500">
                                        <img
                                            src={coverSrc}
                                            alt={displayName}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        {/* Hover Overlay with Glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                            <span className="px-5 py-2.5 bg-[#D4AF37] text-black text-xs font-black uppercase tracking-widest rounded-sm shadow-xl">
                                                {lang === 'ar' ? 'عرض التفاصيل والطلب' : 'View Details & Order'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Suit Info */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors duration-300 font-serif">
                                                {displayName}
                                            </h3>
                                            <span className="text-[#D4AF37] text-lg font-bold font-serif whitespace-nowrap">
                                                {displayPrice}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                                            {displayDesc}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlbumPage;

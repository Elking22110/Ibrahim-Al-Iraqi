import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaWhatsapp, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getProductMetadata } from '../productMetadata';

// Helper: get image src supporting both Cloudinary objects and local paths
const getImgSrc = (category, suitId, img, isLegacy) => {
    if (!img) return '';
    if (typeof img === 'object' && img.url) return img.url;
    
    // For local dev paths
    const filename = typeof img === 'object' ? img.filename : img;
    return `/The Gallery/${encodeURIComponent(category)}/${isLegacy ? '' : encodeURIComponent(suitId) + '/'}${encodeURIComponent(filename)}`;
};

const getImgName = (img) => {
    if (!img) return '';
    return typeof img === 'object' ? img.filename : img;
};

const ProductDetailPage = ({ albumName, imgName, albums, lang, onNavigate, productCatalog = {} }) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [activeImageIdx, setActiveImageIdx] = useState(0);

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

    // Find specific Suit inside active Category (imgName parameter here behaves as suitId)
    const currentSuit = activeAlbum?.suits?.find(s => s.id === imgName);
    const suitImages = currentSuit?.images || [];

    // Find next and previous suits in category for navigation
    const suitIndex = activeAlbum?.suits ? activeAlbum.suits.findIndex(s => s.id === imgName) : -1;
    const prevSuit = suitIndex > 0 ? activeAlbum.suits[suitIndex - 1] : null;
    const nextSuit = activeAlbum?.suits && suitIndex < activeAlbum.suits.length - 1 ? activeAlbum.suits[suitIndex + 1] : null;

    // Get metadata details
    const name = lang === 'ar' ? currentSuit?.nameAr : currentSuit?.nameEn;
    const desc = lang === 'ar' ? currentSuit?.descAr : currentSuit?.descEn;
    const price = lang === 'ar' ? currentSuit?.priceAr : currentSuit?.priceEn;

    const fallbackMeta = (!name && !price) 
        ? getProductMetadata(activeAlbum?.name || albumName, imgName, lang, productCatalog) 
        : null;

    const displayName = name || fallbackMeta?.name || imgName;
    const displayPrice = price || fallbackMeta?.price || '';
    const displayDesc = desc || fallbackMeta?.desc || '';

    const handleGoBack = () => {
        onNavigate(`/album/${albumName}`);
    };

    const handleNavigateToSuit = (targetSuit) => {
        if (!targetSuit) return;
        setActiveImageIdx(0);
        onNavigate(`/product/${albumName}/${targetSuit.id}`);
    };

    // Pre-composed WhatsApp message template
    const getWhatsAppUrl = () => {
        const phone = "201099307775"; // Ibrahim Al-Iraqi Contact Phone Number
        const text = lang === 'ar'
            ? `مرحباً، أود الاستفسار وطلب تفصيل بدلة "${displayName}" المعروضة على موقعكم الإلكتروني.`
            : `Hello, I am interested in inquiring and ordering the custom suit "${displayName}" from your website.`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    };

    const handleBookAppt = () => {
        onNavigate('/');
        // Wait for homepage render then scroll to contact section
        setTimeout(() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }, 400);
    };

    // Premium specification list for a luxury bespoke suit
    const specs = [
        {
            label: lang === 'ar' ? 'نوع القماش' : 'Fabric Class',
            val: lang === 'ar' ? 'صوف كشمير ميرينو إيطالي فاخر' : 'Superfine Italian Merino Wool / Cashmere Blend'
        },
        {
            label: lang === 'ar' ? 'الحشوة الداخلية' : 'Canvas Construction',
            val: lang === 'ar' ? 'حشوة عائمة بالكامل مخيطة يدوياً (Full Canvas)' : 'Bespoke Full Floating Canvas (100% Hand-stitched)'
        },
        {
            label: lang === 'ar' ? 'خياطة التفاصيل' : 'Lapel Finish',
            val: lang === 'ar' ? 'خياطة بيك (Pick stitching) وعروات ميلانيز يدوية' : 'Hand-rolled silk Milanese buttonhole'
        },
        {
            label: lang === 'ar' ? 'أزرار البدلة' : 'Buttons',
            val: lang === 'ar' ? 'أزرار صدف بوق طبيعي فاخر' : 'Premium Genuine Horn Buttons'
        },
        {
            label: lang === 'ar' ? 'ساعات التفصيل' : 'Tailoring Hours',
            val: lang === 'ar' ? 'تستغرق من ٦٠ إلى ٨٠ ساعة عمل يدوية' : '60 to 80 hours of meticulous handcrafting'
        }
    ];

    if (!currentSuit || suitImages.length === 0) {
        return (
            <div className="w-full min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center gap-4 text-[#f5f5f0]">
                <p>{lang === 'ar' ? 'عذراً، لم يتم العثور على البدلة المطلوبة.' : 'Sorry, the requested suit was not found.'}</p>
                <button onClick={handleGoBack} className="px-6 py-2.5 bg-[#D4AF37] text-black rounded-full font-bold">
                    {lang === 'ar' ? 'العودة للقسم' : 'Back to Category'}
                </button>
            </div>
        );
    }

    const currentImg = suitImages[activeImageIdx] || suitImages[0];

    return (
        <div className={`w-full min-h-screen bg-[#0A0A0A] text-[#f5f5f0] py-24 px-6 md:px-20 ${lang === 'ar' ? 'font-cairo' : 'font-sans'}`}>
            <div className="max-w-7xl mx-auto">
                
                {/* Back Link */}
                <div className="mb-12">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-3 py-2 px-5 bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-full transition-all duration-300 text-sm font-bold"
                    >
                        <FaArrowLeft className={`${lang === 'ar' ? 'rotate-180' : ''}`} />
                        {lang === 'ar' ? 'العودة لمعرض القسم' : 'Back to Category'}
                    </button>
                </div>

                {/* Main Split Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    {/* Left Column: Image Gallery with thumbnails */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="relative group overflow-hidden rounded-sm border border-white/5 bg-[#111] aspect-[3/4]">
                            <motion.img
                                key={activeImageIdx}
                                src={getImgSrc(activeAlbum.name, currentSuit.id, currentImg, currentSuit.isLegacy)}
                                alt={displayName}
                                animate={{ scale: isZoomed ? 1.3 : 1.0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full h-full object-cover cursor-zoom-in"
                                onClick={() => setIsZoomed(!isZoomed)}
                            />
                            
                            {/* Decorative gold frame on hover */}
                            <div className="absolute inset-4 border border-[#D4AF37]/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Zoom Instructions Overlay */}
                            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md py-2 text-center rounded text-[10px] tracking-widest text-[#D4AF37] pointer-events-none">
                                {lang === 'ar' ? 'انقر على الصورة للتكبير واستعراض النسيج' : 'CLICK TO ZOOM & INSPECT TEXTURE'}
                            </div>

                            {/* Next/Prev Floating Arrows for Suits */}
                            {prevSuit && (
                                <button
                                    onClick={() => handleNavigateToSuit(prevSuit)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-[#D4AF37] hover:text-black border border-white/10 rounded-full transition-all duration-300 text-sm z-20"
                                    title={lang === 'ar' ? 'البدلة السابقة' : 'Previous Suit'}
                                >
                                    <FaChevronLeft />
                                </button>
                            )}
                            {nextSuit && (
                                <button
                                    onClick={() => handleNavigateToSuit(nextSuit)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-[#D4AF37] hover:text-black border border-white/10 rounded-full transition-all duration-300 text-sm z-20"
                                    title={lang === 'ar' ? 'البدلة التالية' : 'Next Suit'}
                                >
                                    <FaChevronRight />
                                </button>
                            )}
                        </div>

                        {/* Suit Thumbnails Gallery */}
                        {suitImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto py-2">
                                {suitImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setActiveImageIdx(idx);
                                            setIsZoomed(false);
                                        }}
                                        className={`w-20 h-24 rounded overflow-hidden border transition-all duration-300 flex-shrink-0 ${activeImageIdx === idx ? 'border-[#D4AF37] scale-105' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                                    >
                                        <img
                                            src={getImgSrc(activeAlbum.name, currentSuit.id, img, currentSuit.isLegacy)}
                                            alt={`${displayName} thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Suit Details */}
                    <div className="lg:col-span-6 space-y-10">
                        {/* Title and Price */}
                        <div>
                            <span className="text-[#D4AF37] text-[10px] tracking-[0.3em] font-bold uppercase mb-2 block">
                                {lang === 'ar' ? 'تفصيل فاخر حسب الطلب' : 'BESPOKE TAILORED'}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-serif font-black tracking-wider text-white mb-4">
                                {displayName}
                            </h2>
                            <p className="text-2xl font-serif text-[#D4AF37] font-bold">
                                {displayPrice}
                            </p>
                        </div>

                        {/* Description */}
                        <div className="border-t border-white/5 pt-8">
                            <h4 className="text-sm uppercase tracking-wider text-white mb-3 font-semibold">
                                {lang === 'ar' ? 'فلسفة التصميم' : 'Design Philosophy'}
                            </h4>
                            <p className="text-gray-400 text-base leading-relaxed">
                                {displayDesc}
                            </p>
                        </div>

                        {/* Specs Table */}
                        <div className="space-y-4 border-t border-white/5 pt-8">
                            <h4 className="text-sm uppercase tracking-wider text-white mb-4 font-semibold">
                                {lang === 'ar' ? 'المواصفات الفنية للبدلة' : 'Tailoring Specifications'}
                            </h4>
                            <div className="divide-y divide-white/5">
                                {specs.map((spec, i) => (
                                    <div key={i} className="py-3 flex flex-col md:flex-row md:justify-between gap-1 text-sm">
                                        <span className="text-gray-500 font-medium md:w-1/3">{spec.label}</span>
                                        <span className="text-gray-200 md:w-2/3">{spec.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 border-t border-white/5 pt-10">
                            <a
                                href={getWhatsAppUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full flex items-center justify-center gap-2.5 text-sm font-black transition-all duration-300 shadow-lg shadow-[#25D366]/10"
                            >
                                <FaWhatsapp className="text-lg" />
                                {lang === 'ar' ? 'طلب البدلة عبر واتساب' : 'Order via WhatsApp'}
                            </a>
                            <button
                                onClick={handleBookAppt}
                                className="flex-1 py-4 bg-[#D4AF37] hover:bg-[#F2E8C9] text-black rounded-full flex items-center justify-center gap-2.5 text-sm font-black transition-all duration-300 shadow-lg"
                            >
                                <FaCalendarAlt className="text-base" />
                                {lang === 'ar' ? 'حجز موعد استشارة قياس' : 'Book Fitting Session'}
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ProductDetailPage;

import React from 'react';
import { motion } from 'framer-motion';
import ScrollFloat from './ScrollFloat';

const images = [
    "IMG_0199.JPG.jpeg", "IMG_0201.JPG.jpeg", "IMG_0205.JPG.jpeg", "IMG_0207.JPG.jpeg",
    "IMG_0233.JPG.jpeg", "IMG_0261.JPG.jpeg", "IMG_0274.JPG.jpeg", "IMG_0324.JPG.jpeg",
    "IMG_0339.JPG.jpeg", "IMG_0347.JPG.jpeg", "IMG_0360.JPG.jpeg", "IMG_0362.JPG.jpeg",
    "IMG_0368.JPG.jpeg", "IMG_0369.JPG.jpeg", "IMG_0382.JPG.jpeg", "IMG_0384.JPG.jpeg",
    "IMG_0394.JPG.jpeg", "IMG_0395.JPG.jpeg", "IMG_0397.JPG.jpeg", "IMG_0399.JPG.jpeg"
];

const GallerySection = ({ t, lang }) => {
    return (
        <section id="gallery" className={`w-full py-24 bg-[#050505] relative overflow-hidden ${lang === 'ar' ? 'font-cairo' : ''}`}>
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
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
                        textClassName="text-4xl md:text-6xl text-white"
                    >
                        {lang === 'ar' ? 'إبداع بلا حدود' : 'Timeless Elegance'}
                    </ScrollFloat>
                </div>

                {/* Masonry Grid */}
                <div className="columns-1 md:columns-3 gap-4 space-y-4">
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index % 3 * 0.1 }} // Stagger based on column
                            viewport={{ once: true, margin: "-50px" }}
                            className="break-inside-avoid relative group overflow-hidden rounded-sm cursor-pointer"
                        >
                            <div className="relative overflow-hidden w-full">
                                <img
                                    src={`/The Gallery/${img}`}
                                    alt={`Gallery Image ${index + 1}`}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>

                                {/* Border Glow on Hover */}
                                <div className="absolute inset-0 border border-transparent group-hover:border-[#D4AF37]/30 transition-colors duration-500 pointer-events-none"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GallerySection;

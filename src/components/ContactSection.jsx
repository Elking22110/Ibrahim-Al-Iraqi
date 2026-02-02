import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ScrollFloat from './ScrollFloat';
import Prism from './Prism';

const ContactSection = ({ t, lang }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // WhatsApp Integration:
        const phone = "201009970416";
        const text = `Name: ${formData.name}%0APhone: ${formData.phone}%0AMessage: ${formData.message}`;
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    };

    return (
        <section id="contact" className={`relative w-full py-24 bg-[#050505] text-white overflow-hidden ${lang === 'ar' ? 'font-cairo' : 'font-sans'}`}>
            {/* Background Image with HEAVY Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#050505]/60"></div>
            </div>

            {/* Dynamic Background Effects - Spotlight Blended */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]">
                {/* Prism Effect */}
                <div className="absolute inset-0 opacity-100">
                    <Prism
                        animationType="rotate"
                        timeScale={0.5}
                        height={3.5}
                        baseWidth={5.5}
                        scale={3.6}
                        hueShift={0}
                        colorFrequency={1}
                        noise={0}
                        glow={1}
                    />
                </div>
                {/* Moving Gold Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, -20, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px]"
                />
                {/* Twinkle Effect */}
                <div className="absolute inset-0 z-0">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-[#D4AF37] rounded-full blur-[1px]"
                            initial={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: Math.random() * 2 + 1 + 'px',
                                height: Math.random() * 2 + 1 + 'px',
                                opacity: 0
                            }}
                            animate={{
                                opacity: [0, 0.8, 0],
                                scale: [0.5, 1.2, 0.5]
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                repeat: Infinity,
                                delay: Math.random() * 5,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                {/* Content Wrapper */}

                {/* Header */}
                <div className="text-center mb-20 relative z-10">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#D4AF37] uppercase tracking-[0.3em] mb-4 text-sm md:text-base font-bold"
                    >
                        {t?.subtitle}
                    </motion.h3>
                    <ScrollFloat
                        animationDuration={2.5}
                        ease='back.out(1.5)'
                        scrollStart='top bottom-=20%'
                        scrollEnd='bottom bottom-=20%'
                        stagger={0.1}
                        containerClassName={`mb-8 ${lang === 'ar' ? 'font-amiri' : 'font-serif'}`}
                        textClassName="text-5xl md:text-7xl font-bold"
                    >
                        {t?.title}
                    </ScrollFloat>
                    <div className="w-32 h-1 bg-[#D4AF37] mx-auto"></div>
                </div>

                {/* Electric Border Container */}
                <div className="max-w-3xl mx-auto relative rounded-2xl p-[3px] overflow-hidden z-10">
                    {/* Electric Border Container - Gradient Removed */}


                    {/* Inner Content Card */}
                    <div className="relative h-full w-full bg-black/60 backdrop-blur-xl rounded-2xl p-10 md:p-16 border border-[#D4AF37]/20">
                        {/* Decorative Corner Glow (Moved inside) */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#D4AF37]/10 blur-[100px] rounded-full pointer-events-none"></div>

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Name */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#D4AF37] text-sm uppercase tracking-widest font-bold ml-1">{t?.namePlaceholder}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder={t?.namePlaceholder}
                                        required
                                        className="w-full bg-white/10 border-2 border-[#D4AF37] rounded-lg px-6 py-5 text-xl text-white focus:outline-none focus:bg-white/20 transition-all duration-300 placeholder-white/50"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#D4AF37] text-sm uppercase tracking-widest font-bold ml-1">{t?.phonePlaceholder}</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder={t?.phonePlaceholder}
                                        required
                                        className={`w-full bg-white/10 border-2 border-[#D4AF37] rounded-lg px-6 py-5 text-xl text-white focus:outline-none focus:bg-white/20 transition-all duration-300 placeholder-white/50 text-${lang === 'ar' ? 'right' : 'left'}`}
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[#D4AF37] text-sm uppercase tracking-widest font-bold ml-1">{t?.messagePlaceholder}</label>
                                <textarea
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={t?.messagePlaceholder}
                                    required
                                    className="w-full bg-white/10 border-2 border-[#D4AF37] rounded-lg px-6 py-5 text-xl text-white focus:outline-none focus:bg-white/20 transition-all duration-300 resize-none placeholder-white/50"
                                ></textarea>
                            </div>

                            {/* Submit Btn */}
                            <div className="flex justify-center pt-6">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="bg-[#D4AF37] text-black px-16 py-5 uppercase tracking-[0.2em] font-black text-sm hover:bg-[#F2E8C9] transition-all duration-300 rounded-full shadow-lg"
                                >
                                    {t?.submit}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default ContactSection;

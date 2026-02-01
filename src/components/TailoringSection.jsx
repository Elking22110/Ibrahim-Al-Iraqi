import React from 'react';
import { motion } from 'framer-motion';

const TailoringSection = ({ t, lang }) => {
    return (
        <section id="bespoke" className={`w-full py-32 relative overflow-hidden ${lang === 'ar' ? 'font-cairo' : ''}`}>
            <div className="container mx-auto px-8 md:px-20 relative z-10 flex flex-col md:flex-row items-center gap-16">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="w-full md:w-1/2"
                >
                    <h5 className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] mb-4">{t?.label || "CRAFTSMANSHIP"}</h5>
                    <h2 className={`text-5xl md:text-7xl text-white mb-8 leading-[1.1] ${lang === 'ar' ? 'font-amiri' : 'font-serif'}`}>
                        {t?.titlePart1 || "The Art of"} <br />
                        <i className={`${lang === 'ar' ? 'font-amiri text-gold' : 'font-pinyon'} text-6xl md:text-8xl`}>
                            {t?.titlePart2 || "Bespoke"}
                        </i>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                        {t?.desc || "True luxury takes time. Each Ibrahim Al-Iraqi suit is the result of over 80 hours of meticulous hand-craftsmanship. From the initial canvas construction to the final hand-stitched buttonhole, our process honours the traditions of Savile Row while embracing contemporary precision."}
                    </p>
                    <ul className="space-y-4 text-gray-300 text-sm font-semibold tracking-wide uppercase">
                        {t?.bullets?.map((item, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-[#D4AF37] rounded-full shrink-0"></span>
                                {item}
                            </li>
                        )) || (
                                <>
                                    <li className="flex items-center gap-3">
                                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                                        Floating Canvas Construction
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                                        Hand-Pad Stitched Lapels
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                                        Functioning Button Cuffs
                                    </li>
                                </>
                            )}
                    </ul>
                </motion.div>

                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="w-full md:w-1/2 relative"
                >
                    <div className="aspect-[3/4] overflow-hidden rounded-sm relative group bg-[#111]">
                        <img
                            src="https://res.cloudinary.com/dfxh95yzm/image/upload/f_auto,q_auto,w_800/v1769970966/founder_ypgvjx.jpg"
                            alt="Tailoring Art"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 border border-white/10 m-4"></div>

                        {/* Name Tag Overlay */}
                        <div className="absolute bottom-8 left-0 w-full text-center z-10">
                            <h3 className={`text-white text-xl tracking-widest uppercase ${lang === 'ar' ? 'font-amiri' : 'font-serif'}`}>
                                {lang === 'ar' ? 'إبراهيم العراقي' : 'IBRAHIM AL-IRAQI'}
                            </h3>
                            <p className="text-[#D4AF37] text-xs uppercase tracking-[0.2em] mt-2">
                                {t?.founderRole || "Master Tailor & Founder"}
                            </p>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default TailoringSection;

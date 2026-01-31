import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';

const SocialDock = ({ lang }) => {
    const socialLinks = [
        {
            id: 1,
            icon: <FaInstagram />,
            href: "https://www.instagram.com/ibrahimal3raqi?igsh=em45emlzcmVyZnFs",
            label: lang === 'ar' ? "إنستغرام" : "Instagram",
            color: "from-purple-500 to-pink-500" // Brand color for hover gradient
        },
        {
            id: 2,
            icon: <FaFacebookF />,
            href: "https://www.facebook.com/share/17y9z8kF57/",
            label: lang === 'ar' ? "فيسبوك" : "Facebook",
            color: "from-blue-600 to-blue-400"
        },
        {
            id: 3,
            icon: <FaWhatsapp />,
            href: "https://wa.me/201009970416",
            label: lang === 'ar' ? "واتساب" : "WhatsApp",
            color: "from-green-500 to-emerald-400"
        }
    ];

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-8 pointer-events-none">
            {socialLinks.map((social, index) => (
                <motion.a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto relative group perspective-1000"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        y: [0, -10, 0] // Floating animation
                    }}
                    transition={{
                        x: { delay: 1.8 + index * 0.2, duration: 0.8 },
                        y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }
                    }}
                    whileHover={{ scale: 1.1 }}
                >
                    {/* Glass Container */}
                    <motion.div
                        className="w-14 h-14 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center relative overflow-hidden transform-style-3d transition-all duration-500 group-hover:border-[#D4AF37]"
                        style={{ transformStyle: 'preserve-3d' }}
                        whileHover={{ rotateY: 360, rotateX: 15 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Inner Gradient Orb (Visible on Hover) */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

                        {/* Icon */}
                        <span className="text-2xl text-white group-hover:text-[#D4AF37] transition-colors duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            {social.icon}
                        </span>

                        {/* Reflections/Shine */}
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                    </motion.div>

                    {/* Tooltip Label */}
                    <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 text-xs font-bold tracking-widest text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                        {social.label}
                    </span>

                    {/* Shadow Floor */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/50 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.a>
            ))}
        </div>
    );
};

export default SocialDock;

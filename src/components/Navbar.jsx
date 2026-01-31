import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const Navbar = ({ lang, setLang, t }) => {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        if (latest > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    });

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Offset for navbar height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" }
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`fixed top-0 left-0 w-full z-40 px-8 py-6 flex justify-between items-center transition-colors duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}
        >
            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`text-sm md:text-lg font-bold tracking-[0.2em] cursor-pointer text-white whitespace-nowrap ${lang === 'ar' ? 'font-amiri tracking-normal text-xl' : 'font-serif'}`}
            >
                {t.brand}
            </motion.div>

            {/* Links */}
            <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className={`hidden md:flex space-x-12 text-xs uppercase tracking-widest font-medium text-gray-300 ${lang === 'ar' ? 'font-bold space-x-reverse' : ''}`}
            >
                {t.links.map((link, index) => (
                    <li
                        key={index}
                        onClick={() => scrollToSection(link.id)}
                        className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                    >
                        {link.name}
                    </li>
                ))}
            </motion.ul>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                className="flex items-center gap-6"
            >
                {/* Language Toggle */}
                <button
                    onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                    className="text-xs font-bold text-white/70 hover:text-[#D4AF37] transition-colors uppercase tracking-widest"
                >
                    {lang === 'en' ? 'AR' : 'EN'}
                </button>

                {/* CTA */}
                <a
                    href="https://wa.me/201009970416"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-6 py-2 border text-[10px] uppercase tracking-widest font-bold transition-all no-underline ${scrolled ? 'border-white/20 hover:bg-white hover:text-black' : 'border-white text-white hover:bg-white hover:text-black'}`}
                >
                    {t.cta}
                </a>
            </motion.div>
        </motion.nav>
    );
};

export default Navbar;

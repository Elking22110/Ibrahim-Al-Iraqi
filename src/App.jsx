import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernHero from './components/ModernHero';
import ImageShowcase from './components/ImageShowcase';
import TailoringSection from './components/TailoringSection';
import CollectionGrid from './components/CollectionGrid';
import Footer from './components/Footer';
import LuxuryCursor from './components/LuxuryCursor';
import Navbar from './components/Navbar';
import SocialDock from './components/SocialDock';
import Loader from './components/Loader';
import ContactSection from './components/ContactSection';
import { content } from './content';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [lang, setLang] = useState('en');
    const t = content[lang];

    useEffect(() => {
        // Handle Direction and Fonts
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
            document.body.classList.remove('font-sans');
            document.body.classList.add('font-cairo');
        } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = 'en';
            document.body.classList.remove('font-cairo');
            document.body.classList.add('font-sans');
        }
    }, [lang]);

    useEffect(() => {
        // Simulate asset loading interaction
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`w-full min-h-screen bg-[#050505] overflow-x-hidden relative ${lang === 'ar' ? 'font-cairo' : 'font-sans'}`}>
            <LuxuryCursor />

            {/* Global 3D Background - Removed for Cinematic Video/Code Intro */}

            {/* Intro Loader */}
            <AnimatePresence>
                {isLoading && <Loader onComplete={() => setIsLoading(false)} t={t.loader} lang={lang} />}
            </AnimatePresence>

            {/* Scrollable Content */}
            <div className="relative z-10 pointer-events-auto text-[#f5f5f0]">
                <AnimatePresence>
                    {!isLoading && (
                        <>
                            <Navbar lang={lang} setLang={setLang} t={t.navbar} />
                            <SocialDock lang={lang} />
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} // Custom bezier for smooth luxury feel
                                className="relative z-10"
                            >
                                <Suspense fallback={null}>
                                    <ModernHero t={t.hero} lang={lang} />
                                    <TailoringSection t={t.tailoring} lang={lang} />
                                    <ImageShowcase />
                                    <CollectionGrid t={t.collection} lang={lang} />
                                    <ContactSection t={t.contact} lang={lang} />
                                    <Footer t={t.footer} lang={lang} />
                                </Suspense>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default App;

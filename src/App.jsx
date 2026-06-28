import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence, LazyMotion, domMax } from 'framer-motion';
import ModernHero from './components/ModernHero';
import LuxuryCursor from './components/LuxuryCursor';
import Navbar from './components/Navbar';
import SocialDock from './components/SocialDock';
import Loader from './components/Loader';
import LuxuryBackground from './components/LuxuryBackground';
import AdminDashboard from './components/AdminDashboard';
import { content } from './content';
// Static fallback for when the API is unavailable
import { galleryAlbums as staticAlbums } from './galleryConfig';

// Lazy Load Section Components for Performance
const ImageShowcase = React.lazy(() => import('./components/ImageShowcase'));
const TailoringSection = React.lazy(() => import('./components/TailoringSection'));
const CollectionGrid = React.lazy(() => import('./components/CollectionGrid'));
const Footer = React.lazy(() => import('./components/Footer'));
const ContactSection = React.lazy(() => import('./components/ContactSection'));
const AlbumPage = React.lazy(() => import('./components/AlbumPage'));
const ProductDetailPage = React.lazy(() => import('./components/ProductDetailPage'));


function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [lang, setLang] = useState('ar');
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [galleryAlbums, setGalleryAlbums] = useState(staticAlbums);
    const t = content[lang];

    const handleNavigate = (path) => {
        window.history.pushState({}, '', path);
        setCurrentPath(path);
        // Scroll to top smoothly on page transition
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    useEffect(() => {
        const handleLocationChange = () => {
            setCurrentPath(window.location.pathname);
        };
        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    }, []);

    // Fetch gallery albums from API (works both locally via Vite middleware and on Vercel)
    useEffect(() => {
        fetch(`/api/gallery?t=${Date.now()}`)
            .then(r => r.json())
            .then(data => {
                if (data.albums && data.albums.length > 0) {
                    setGalleryAlbums(data.albums);
                }
            })
            .catch(() => {
                // Silently fall back to static config if API is unavailable
            });
    }, []);

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
        // Guarantee a minimum loading time of 3.2 seconds to allow the luxury animations 
        // (golden progress thread, logo, and brand texts) to fully complete.
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3200);
        return () => clearTimeout(timer);
    }, []);

    // Route Rendering Helper
    const renderRoute = () => {
        if (currentPath.startsWith('/album/')) {
            const albumName = decodeURIComponent(currentPath.split('/album/')[1]);
            return (
                <motion.div
                    key={`album-${albumName}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <AlbumPage albumName={albumName} albums={galleryAlbums} lang={lang} onNavigate={handleNavigate} />
                </motion.div>
            );
        }

        if (currentPath.startsWith('/product/')) {
            const pathParts = currentPath.split('/product/')[1].split('/');
            const albumName = decodeURIComponent(pathParts[0]);
            const imgName = decodeURIComponent(pathParts[1]);
            return (
                <motion.div
                    key={`product-${albumName}-${imgName}`}
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <ProductDetailPage albumName={albumName} imgName={imgName} albums={galleryAlbums} lang={lang} onNavigate={handleNavigate} />
                </motion.div>
            );
        }

        // Default Homepage
        return (
            <motion.div
                key="homepage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
            >
                <ModernHero t={t.hero} lang={lang} />
                <TailoringSection t={t.tailoring} lang={lang} />
                <ImageShowcase t={t.imageShowcase} lang={lang} />
                <CollectionGrid t={t.collection} lang={lang} albums={galleryAlbums} onNavigate={handleNavigate} />
                <ContactSection t={t.contact} lang={lang} />
                <Footer t={t.footer} lang={lang} />
            </motion.div>
        );
    };

    if (currentPath === '/admin') {
        return <AdminDashboard lang={lang} setLang={setLang} />;
    }

    return (
        <LazyMotion features={domMax}>
            <div className={`w-full min-h-screen bg-[#0a0a0a] overflow-x-hidden relative ${lang === 'ar' ? 'font-cairo' : 'font-sans'}`}>
                <LuxuryBackground />
                <LuxuryCursor />

                {/* Intro Loader */}
                <AnimatePresence>
                    {isLoading && <Loader onComplete={() => setIsLoading(false)} t={t.loader} lang={lang} />}
                </AnimatePresence>

                {/* Scrollable Content */}
                <div className="relative z-10 pointer-events-auto text-[#f5f5f0]">
                    <AnimatePresence mode="wait">
                        {!isLoading && (
                            <motion.div
                                key="app-shell"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            >
                                <Navbar lang={lang} setLang={setLang} t={t.navbar} onNavigate={handleNavigate} />
                                <SocialDock lang={lang} />
                                <Suspense fallback={
                                    <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-gold-500 font-serif">
                                        Loading Atelier...
                                    </div>
                                }>
                                    {renderRoute()}
                                </Suspense>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </LazyMotion>
    );
}

export default App;

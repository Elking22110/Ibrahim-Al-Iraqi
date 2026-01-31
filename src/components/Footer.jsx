import React from 'react';

const Footer = ({ t, lang }) => {
    return (
        <footer className={`bg-[#111] text-white py-20 border-t border-white/10 ${lang === 'ar' ? 'font-cairo' : ''}`}>
            <div className="container mx-auto px-8 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand */}
                <div className="col-span-1 md:col-span-1">
                    <h2 className={`text-2xl font-bold tracking-widest mb-6 ${lang === 'ar' ? 'font-amiri text-3xl tracking-normal' : ''}`}>
                        {lang === 'ar' ? 'إبراهيم العراقي' : 'IBRAHIM AL-IRAQI'}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {t?.brandQuote || "Redefining modern luxury through precision tailoring and timeless design."}
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-[#D4AF37]">{t?.explore || "Explore"}</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Collection</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Bespoke</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
                    </ul>
                </div>

                {/* Visit Us */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-[#D4AF37]">{t?.visit || "Visit Us"}</h4>
                    <div className="text-sm text-gray-400 space-y-4">
                        {lang === 'ar' ? (
                            <p>
                                القناطر الخيرية<br />
                                نزلة باسوس<br />
                                مصر
                            </p>
                        ) : (
                            <p>
                                Al-Qanater Al-Khayriya<br />
                                Nazlet Basous<br />
                                Egypt
                            </p>
                        )}
                        <a href="https://wa.me/201009970416" dir="ltr" className="block hover:text-white transition-colors text-left">
                            +20 100 997 0416
                        </a>
                        <p className="text-xs text-gray-600 pt-2">{t?.apptOnly || "By Appointment Only"}</p>
                    </div>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-[#D4AF37]">{t?.newsletter || "Newsletter"}</h4>
                    <p className="text-gray-400 text-xs mb-4">{t?.newsletterDesc || "Join our list for exclusive releases."}</p>
                    <div className="flex border-b border-white/20 pb-2">
                        <input type="email" placeholder={t?.emailPlaceholder || "Email Address"} className="bg-transparent w-full outline-none text-white text-sm placeholder-gray-600" />
                        <button className="text-xs uppercase font-bold hover:text-[#D4AF37] transition-colors whitespace-nowrap px-2">
                            {t?.join || "Join"}
                        </button>
                    </div>
                </div>

            </div>

            <div className="container mx-auto px-8 md:px-20 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                <p>{t?.rights || "© 2025 IBRAHIM AL-IRAQI. All rights reserved."}</p>
                <p className="hidden md:block opacity-50 hover:opacity-100 transition-opacity cursor-default">
                    Developed by <span className="text-[#D4AF37]">Hassan</span>
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="https://www.facebook.com/share/17y9z8kF57/" className="hover:text-white transition-colors">Facebook</a>
                    <a href="https://www.instagram.com/ibrahimal3raqi?igsh=em45emlzcmVyZnFs" className="hover:text-white transition-colors">Instagram</a>
                    <a href="https://wa.me/201009970416" className="hover:text-white transition-colors">WhatsApp</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

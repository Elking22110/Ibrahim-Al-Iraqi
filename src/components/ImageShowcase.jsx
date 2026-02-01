import React from 'react';
import { motion } from 'framer-motion';

const ImageShowcase = ({ lang }) => {
    return (
        <section className="w-full py-24 px-8 md:px-20">
            {/* Intro Text */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-gray-800 pb-10"
            >
                <div className="max-w-md">
                    <h3 className="text-4xl font-serif mb-4 text-white">Uncompromising Detail</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Every stitch is a statement. Our fabrics are sourced from the finest mills in Biella, Italy, ensuring a drape that is both commanding and comfortable.
                    </p>
                </div>
                <div className="mt-8 md:mt-0">
                    <span className="block text-xs uppercase tracking-widest text-[#D4AF37]">Est. 2024</span>
                </div>
            </motion.div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">

                {/* Item 1: Texture */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer"
                >
                    <div className="overflow-hidden mb-6 relative h-[600px]">
                        <img
                            src="https://res.cloudinary.com/dfxh95yzm/image/upload/f_auto,q_auto,w_800/v1769970967/fabric-detail_suwutq.jpg"
                            alt="Fabric Detail"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="text-xl font-bold mb-1 text-white">Super 150s Wool</h4>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Texture / Close-up</p>
                        </div>
                        <span className="text-2xl font-serif text-gray-600 group-hover:text-white transition-colors">01</span>
                    </div>
                </motion.div>

                {/* Item 2: Lifestyle */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer md:mt-32"
                >
                    <div className="overflow-hidden mb-6 relative h-[600px]">
                        <img
                            src="https://res.cloudinary.com/dfxh95yzm/image/upload/f_auto,q_auto,w_800/v1769970978/man-posing_mdlflr.jpg"
                            alt="Man Posing"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="text-xl font-bold mb-1 text-white">Modern Silhouette</h4>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Fit / Style</p>
                        </div>
                        <span className="text-2xl font-serif text-gray-600 group-hover:text-white transition-colors">02</span>
                    </div>
                </motion.div>

            </div>


        </section>
    );
};
export default ImageShowcase;

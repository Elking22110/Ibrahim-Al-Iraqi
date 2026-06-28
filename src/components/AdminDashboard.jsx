import React, { useState, useEffect } from 'react';
import { FaTrash, FaUpload, FaArrowLeft, FaSpinner, FaFolderPlus, FaEdit, FaFolder, FaImages } from 'react-icons/fa';

const AdminDashboard = ({ lang, setLang }) => {
    const [albums, setAlbums] = useState([]);
    const [activeAlbumName, setActiveAlbumName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [dragActive, setDragActive] = useState(false);

    // Fetch structured albums list from Vite middleware API
    const fetchGallery = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/gallery');
            const data = await res.json();
            if (data.albums) {
                setAlbums(data.albums);
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
            setStatusMessage(lang === 'ar' ? 'فشل تحميل الأقسام من الخادم' : 'Failed to fetch categories from server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    // Get current active album details
    const activeAlbum = albums.find(a => a.name === activeAlbumName);

    // Handle folder/album creation
    const handleCreateAlbum = async () => {
        const promptMsg = lang === 'ar' 
            ? 'أدخل اسم القسم الجديد باللغة العربية أو الإنجليزية:'
            : 'Enter name for the new category/album:';
        const albumName = window.prompt(promptMsg);
        if (!albumName || albumName.trim() === '') return;

        try {
            setLoading(true);
            const response = await fetch('/api/create-album', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: albumName.trim() })
            });
            const result = await response.json();
            if (result.success) {
                setStatusMessage(lang === 'ar' ? `تم إنشاء القسم "${albumName}" بنجاح!` : `Category "${albumName}" created successfully!`);
                await fetchGallery();
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            console.error(err);
            setStatusMessage(lang === 'ar' ? 'فشل إنشاء القسم' : 'Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    // Handle folder/album deletion
    const handleDeleteAlbum = async (albumName) => {
        const confirmMsg = lang === 'ar'
            ? `تحذير: هل أنت متأكد من رغبتك في حذف القسم "${albumName}" بالكامل؟ سيتم مسح جميع الصور بداخل هذا القسم نهائياً!`
            : `WARNING: Are you sure you want to delete the category "${albumName}"? This will permanently delete all images inside it!`;
        
        if (!window.confirm(confirmMsg)) return;

        try {
            setLoading(true);
            const response = await fetch('/api/delete-album', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: albumName })
            });
            const result = await response.json();
            if (result.success) {
                setStatusMessage(lang === 'ar' ? 'تم حذف القسم بنجاح' : 'Category deleted successfully');
                if (activeAlbumName === albumName) {
                    setActiveAlbumName(null);
                }
                await fetchGallery();
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            console.error(err);
            setStatusMessage(lang === 'ar' ? 'فشل حذف القسم' : 'Failed to delete category');
        } finally {
            setLoading(false);
        }
    };

    // Handle folder/album renaming
    const handleRenameAlbum = async (oldName) => {
        const promptMsg = lang === 'ar'
            ? `أدخل الاسم الجديد للقسم عوضاً عن "${oldName}":`
            : `Enter new name for the category "${oldName}":`;
        const newName = window.prompt(promptMsg, oldName);
        if (!newName || newName.trim() === '' || newName.trim() === oldName) return;

        try {
            setLoading(true);
            const response = await fetch('/api/rename-album', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldName, newName: newName.trim() })
            });
            const result = await response.json();
            if (result.success) {
                setStatusMessage(lang === 'ar' ? 'تم تعديل اسم القسم بنجاح' : 'Category renamed successfully');
                if (activeAlbumName === oldName) {
                    setActiveAlbumName(newName.trim());
                }
                await fetchGallery();
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            console.error(err);
            setStatusMessage(lang === 'ar' ? 'فشل تعديل اسم القسم' : 'Failed to rename category');
        } finally {
            setLoading(false);
        }
    };

    // Handle file selection and conversion to base64 inside active album
    const handleFileUpload = async (files) => {
        if (!files || files.length === 0 || !activeAlbumName) return;
        setUploading(true);
        setStatusMessage('');

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            if (!file.type.startsWith('image/')) {
                setStatusMessage(lang === 'ar' ? `الملف ${file.name} ليس صورة صالحة` : `${file.name} is not a valid image`);
                continue;
            }

            try {
                const base64Data = await convertToBase64(file);
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        album: activeAlbumName,
                        name: file.name,
                        data: base64Data
                    })
                });

                const result = await response.json();
                if (result.success) {
                    const savedPct = result.originalKB && result.compressedKB
                        ? Math.round((1 - result.compressedKB / result.originalKB) * 100)
                        : null;

                    const msg = lang === 'ar'
                        ? savedPct !== null
                            ? `✅ تم رفع "${result.name}" — الحجم الأصلي: ${result.originalKB}KB → بعد الضغط: ${result.compressedKB}KB WebP (وفّرنا ${savedPct}%)`
                            : `✅ تم رفع الصورة بنجاح`
                        : savedPct !== null
                            ? `✅ Uploaded "${result.name}" — ${result.originalKB}KB → ${result.compressedKB}KB WebP (saved ${savedPct}%)`
                            : `✅ Image uploaded successfully`;

                    setStatusMessage(msg);
                } else {
                    throw new Error(result.error || 'Upload failed');
                }
            } catch (err) {
                console.error(err);
                setStatusMessage(lang === 'ar' ? `فشل رفع ${file.name}` : `Failed to upload ${file.name}`);
            }
        }

        setUploading(false);
        await fetchGallery(); // Refresh lists
    };

    // Helper to read file as base64 data URL
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Delete image handler from specific album
    const handleDeleteImage = async (filename) => {
        const confirmMsg = lang === 'ar' 
            ? `هل أنت متأكد من رغبتك في حذف الصورة "${filename}" من القسم "${activeAlbumName}"؟`
            : `Are you sure you want to delete "${filename}" from "${activeAlbumName}"?`;
        
        if (!window.confirm(confirmMsg)) return;

        try {
            const response = await fetch('/api/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ album: activeAlbumName, name: filename })
            });
            const result = await response.json();
            if (result.success) {
                setStatusMessage(lang === 'ar' ? 'تم حذف الصورة بنجاح' : 'Image deleted successfully');
                await fetchGallery(); // Refresh
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error(error);
            setStatusMessage(lang === 'ar' ? 'فشل حذف الصورة' : 'Failed to delete image');
        }
    };

    // Drag & Drop handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files);
        }
    };

    // Navigation helper to go back home
    const goHome = () => {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new Event('popstate'));
    };

    return (
        <div className={`min-h-screen bg-[#0A0A0A] text-[#f5f5f0] py-12 px-6 md:px-16 ${lang === 'ar' ? 'font-cairo' : 'font-sans'}`}>
            
            {/* Header Area */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-white/10 pb-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={activeAlbumName ? () => setActiveAlbumName(null) : goHome}
                        className="p-3 bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-full transition-all duration-300 flex items-center justify-center text-sm"
                        title={activeAlbumName ? (lang === 'ar' ? "العودة للأقسام" : "Back to Categories") : (lang === 'ar' ? "العودة للرئيسية" : "Back to Home")}
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-wider text-[#D4AF37]">
                            {activeAlbumName 
                                ? (lang === 'ar' ? `إدارة قسم: ${activeAlbumName}` : `Category: ${activeAlbumName}`) 
                                : (lang === 'ar' ? 'أقسام معرض الصور' : 'Gallery Categories')}
                        </h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                            {activeAlbumName 
                                ? (lang === 'ar' ? `إدارة وصيانة صور ألبوم ${activeAlbumName}` : `Manage active photos in ${activeAlbumName}`)
                                : (lang === 'ar' ? 'لوحة التحكم وإدارة ألبومات الملابس والبدل' : 'Organize and curate suits catalogs and collections')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                        className="text-xs font-bold text-[#f5f5f0]/70 hover:text-[#D4AF37] transition-colors uppercase tracking-widest px-4 py-2 bg-white/5 rounded border border-white/5 hover:border-[#D4AF37]"
                    >
                        {lang === 'en' ? 'AR' : 'EN'}
                    </button>
                </div>
            </div>

            {/* Status Message Panel */}
            {statusMessage && (
                <div className="max-w-7xl mx-auto mb-8 p-4 bg-white/5 border border-white/10 rounded-lg text-center text-sm font-semibold text-[#D4AF37] animate-fade-in-up">
                    {statusMessage}
                </div>
            )}

            {/* Dashboard Workspace */}
            <div className="max-w-7xl mx-auto">
                {loading && albums.length === 0 ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-3 text-gray-500">
                        <FaSpinner className="animate-spin text-[#D4AF37] text-3xl" />
                        <p>{lang === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading dashboard data...'}</p>
                    </div>
                ) : !activeAlbumName ? (
                    
                    /* ----------------------------------------------------
                       1. ALBUM LIST VIEW
                       ---------------------------------------------------- */
                    <div className="space-y-8">
                        {/* Top Action Bar */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <FaImages className="text-[#D4AF37]" />
                                {lang === 'ar' ? 'الأقسام الحالية' : 'Available Categories'}
                            </h2>
                            <button
                                onClick={handleCreateAlbum}
                                className="px-6 py-3 bg-[#D4AF37] text-black hover:bg-[#F2E8C9] rounded-full flex items-center gap-2 text-sm font-black transition-all duration-300 shadow-lg"
                            >
                                <FaFolderPlus />
                                {lang === 'ar' ? 'إنشاء قسم جديد' : 'Create New Category'}
                            </button>
                        </div>

                        {/* Albums Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {albums.map((album, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group">
                                    <div className="space-y-4">
                                        {/* Icon & Details */}
                                        <div className="flex justify-between items-start">
                                            <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl text-[#D4AF37] text-3xl">
                                                <FaFolder />
                                            </div>
                                            <span className="px-3 py-1 bg-white/5 border border-white/10 text-xs rounded-full font-bold">
                                                {album.images.length} {lang === 'ar' ? 'صورة' : 'photos'}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors duration-300 truncate">
                                                {album.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 mt-8 border-t border-white/5 pt-4">
                                        <button
                                            onClick={() => setActiveAlbumName(album.name)}
                                            className="flex-1 py-2 bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 hover:border-[#D4AF37] rounded-lg text-xs font-bold transition-all duration-300 text-center"
                                        >
                                            {lang === 'ar' ? 'دخول وإدارة الصور' : 'Manage Images'}
                                        </button>
                                        
                                        <button
                                            onClick={() => handleRenameAlbum(album.name)}
                                            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                            title={lang === 'ar' ? 'تعديل الاسم' : 'Rename Category'}
                                        >
                                            <FaEdit />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteAlbum(album.name)}
                                            className="p-2.5 bg-red-950/20 hover:bg-red-600 border border-red-500/20 rounded-lg text-red-500 hover:text-white transition-colors"
                                            title={lang === 'ar' ? 'حذف القسم' : 'Delete Category'}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                ) : (

                    /* ----------------------------------------------------
                       2. ALBUM DETAIL VIEW (Upload & Edit images inside)
                       ---------------------------------------------------- */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Column: Upload */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <FaUpload className="text-[#D4AF37]" />
                                        {lang === 'ar' ? 'رفع صور للقسم' : 'Upload Images'}
                                    </h2>
                                    <button 
                                        onClick={() => handleRenameAlbum(activeAlbumName)}
                                        className="text-xs text-gray-400 hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors"
                                    >
                                        <FaEdit /> {lang === 'ar' ? 'تغيير الاسم' : 'Rename'}
                                    </button>
                                </div>

                                {/* Drag and Drop Zone */}
                                <form 
                                    onDragEnter={handleDrag} 
                                    onDragOver={handleDrag} 
                                    onDragLeave={handleDrag} 
                                    onDrop={handleDrop} 
                                    onSubmit={(e) => e.preventDefault()}
                                    className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
                                        dragActive 
                                            ? 'border-[#D4AF37] bg-[#D4AF37]/5' 
                                            : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                                    }`}
                                    onClick={() => document.getElementById('file-upload-input').click()}
                                >
                                    <input 
                                        id="file-upload-input"
                                        type="file" 
                                        multiple 
                                        accept="image/*"
                                        className="hidden" 
                                        onChange={(e) => handleFileUpload(e.target.files)}
                                    />
                                    
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-full mb-4 text-[#D4AF37]">
                                        <FaUpload className="text-2xl" />
                                    </div>
                                    
                                    <p className="text-sm font-semibold text-white mb-1">
                                        {lang === 'ar' ? 'اسحب الصور وأفلتها هنا' : 'Drag & Drop images here'}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-3">
                                        {lang === 'ar' ? 'أو انقر لتصفح الملفات' : 'or click to browse from device'}
                                    </p>
                                    <span className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded-full">
                                        {lang === 'ar' ? '⚡ ضغط تلقائي WebP · جودة عالية' : '⚡ Auto WebP Compression · High Quality'}
                                    </span>
                                </form>

                                {/* Progress Indicator */}
                                {uploading && (
                                    <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center gap-3 text-sm text-[#D4AF37]">
                                        <FaSpinner className="animate-spin" />
                                        {lang === 'ar' ? 'جاري رفع الصور ومزامنتها...' : 'Uploading and syncing images...'}
                                    </div>
                                )}
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-950/10 border border-red-500/20 rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-red-500 mb-3">
                                    {lang === 'ar' ? 'منطقة الخطورة' : 'Danger Zone'}
                                </h3>
                                <button
                                    onClick={() => handleDeleteAlbum(activeAlbumName)}
                                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors duration-300 flex items-center justify-center gap-2"
                                >
                                    <FaTrash />
                                    {lang === 'ar' ? 'حذف هذا الألبوم بالكامل' : 'Delete Entire Category'}
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Album Images */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        {lang === 'ar' ? 'الصور الحالية بالقسم' : 'Current Category Images'}
                                        <span className="px-2.5 py-0.5 text-xs bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] rounded-full">
                                            {activeAlbum ? activeAlbum.images.length : 0}
                                        </span>
                                    </h2>
                                </div>

                                {!activeAlbum || activeAlbum.images.length === 0 ? (
                                    <div className="h-64 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-500">
                                        <p>{lang === 'ar' ? 'هذا القسم فارغ حالياً، قم برفع صور لتظهر هنا.' : 'This category is empty. Upload photos to start.'}</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
                                        {activeAlbum.images.map((img, idx) => (
                                            <div key={idx} className="relative group rounded-xl border border-white/10 overflow-hidden bg-black/40">
                                                
                                                {/* Image Container */}
                                                <div className="aspect-[3/4] overflow-hidden bg-zinc-900 flex items-center justify-center">
                                                    <img 
                                                        src={`/The Gallery/${encodeURIComponent(activeAlbumName)}/${encodeURIComponent(img)}`} 
                                                        alt={`Category preview ${idx}`} 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                </div>

                                                {/* Hover Overlay Delete */}
                                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
                                                    <p className="text-[10px] text-gray-400 break-all line-clamp-2 uppercase tracking-wide">
                                                        {img}
                                                    </p>
                                                    
                                                    <button 
                                                        onClick={() => handleDeleteImage(img)}
                                                        className="w-full py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors duration-300"
                                                    >
                                                        <FaTrash />
                                                        {lang === 'ar' ? 'حذف الصورة' : 'Delete'}
                                                    </button>
                                                </div>

                                                {/* Text Overlay */}
                                                <div className="absolute bottom-0 left-0 w-full p-2 bg-black/65 backdrop-blur-sm text-[9px] text-gray-400 truncate text-center border-t border-white/5 pointer-events-none group-hover:opacity-0 transition-opacity duration-200">
                                                    {img}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

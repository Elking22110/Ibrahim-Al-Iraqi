import React, { useState, useEffect } from 'react';
import { FaTrash, FaUpload, FaArrowLeft, FaSpinner, FaFolderPlus, FaEdit, FaFolder, FaImages, FaLock, FaEye, FaEyeSlash, FaCloudUploadAlt, FaStar, FaRegStar } from 'react-icons/fa';
import { galleryAlbums as staticAlbums } from '../galleryConfig';

const STORAGE_KEY = 'admin_auth_pw';

const AdminDashboard = ({ lang, setLang }) => {
    // ─── Auth State ────────────────────────────────────────────────
    const [authPw, setAuthPw] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '');
    const [pwInput, setPwInput] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const isAuthed = Boolean(authPw);

    // ─── Gallery State ────────────────────────────────────────────
    const [albums, setAlbums] = useState([]);
    const [activeAlbumName, setActiveAlbumName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [dragActive, setDragActive] = useState(false);

    // ─── Migration State ──────────────────────────────────────────
    const [migrationLoading, setMigrationLoading] = useState(false);
    const [migrationProgress, setMigrationProgress] = useState('');

    const authHeaders = {
        'Content-Type': 'application/json',
        'x-admin-password': authPw,
    };

    const isCoverImage = (img) => {
        const name = getImgName(img);
        return name && name.toLowerCase().startsWith('cover');
    };

    const handleSetCover = async (img) => {
        const filename = getImgName(img);
        try {
            setLoading(true);
            const res = await fetch('/api/set-cover', {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({ album: activeAlbumName, filename })
            });
            const result = await res.json();
            if (result.success) {
                setStatusMessage(lang === 'ar' ? '⭐ تم تعيين الصورة كغلاف للقسم بنجاح!' : '⭐ Album cover set successfully!');
                await fetchGallery();
            } else throw new Error(result.error);
        } catch (err) {
            console.error(err);
            setStatusMessage(lang === 'ar' ? '❌ فشل تعيين الغلاف' : '❌ Failed to set cover');
        } finally {
            setLoading(false);
        }
    };

    const handleMigrateLocalImages = async () => {
        const confirmMsg = lang === 'ar'
            ? 'هل تريد استيراد الـ 23 صورة الافتراضية للموقع ورفعهم إلى Cloudinary تلقائياً؟'
            : 'Do you want to import the 23 default website images and upload them to Cloudinary automatically?';
        if (!window.confirm(confirmMsg)) return;

        setMigrationLoading(true);
        setStatusMessage('');
        try {
            let totalImages = 0;
            staticAlbums.forEach(a => totalImages += a.images.length);
            let uploadedCount = 0;

            for (const album of staticAlbums) {
                // 1. Create the album
                setMigrationProgress(lang === 'ar' ? `جاري إنشاء قسم ${album.name}...` : `Creating category ${album.name}...`);
                await fetch('/api/create-album', {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({ name: album.name })
                });

                // 2. Upload images one by one
                for (const imgName of album.images) {
                    uploadedCount++;
                    setMigrationProgress(
                        lang === 'ar'
                            ? `جاري رفع صورة ${uploadedCount} من ${totalImages}...`
                            : `Uploading image ${uploadedCount} of ${totalImages}...`
                    );

                    const localUrl = `/The Gallery/${encodeURIComponent(album.name)}/${encodeURIComponent(imgName)}`;
                    const localRes = await fetch(localUrl);
                    if (!localRes.ok) continue;

                    const blob = await localRes.blob();
                    const base64Data = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onloadend = () => resolve(reader.result);
                    });

                    await fetch('/api/upload', {
                        method: 'POST',
                        headers: authHeaders,
                        body: JSON.stringify({
                            album: album.name,
                            name: imgName,
                            data: base64Data
                        })
                    });
                }
            }

            setStatusMessage(lang === 'ar' ? '✅ تم استيراد ورفع جميع الصور بنجاح!' : '✅ All default images imported successfully!');
            await fetchGallery();
        } catch (err) {
            console.error(err);
            setStatusMessage(lang === 'ar' ? '❌ فشل استيراد الصور' : '❌ Failed to import images');
        } finally {
            setMigrationLoading(false);
            setMigrationProgress('');
        }
    };

    // ─── Auth Login ────────────────────────────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError('');
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pwInput }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                sessionStorage.setItem(STORAGE_KEY, pwInput);
                setAuthPw(pwInput);
            } else {
                // Show the actual server error message
                setAuthError(data.error || (lang === 'ar' ? 'كلمة المرور غير صحيحة' : 'Incorrect password'));
            }
        } catch {
            setAuthError(lang === 'ar' ? 'تعذّر الاتصال بالخادم' : 'Could not connect to server');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem(STORAGE_KEY);
        setAuthPw('');
        setPwInput('');
    };

    // ─── Gallery Fetch ─────────────────────────────────────────────
    const fetchGallery = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/gallery');
            const data = await res.json();
            if (data.albums) setAlbums(data.albums);
        } catch (error) {
            console.error('Error fetching gallery:', error);
            setStatusMessage(lang === 'ar' ? 'فشل تحميل الأقسام من الخادم' : 'Failed to fetch categories from server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthed) fetchGallery();
    }, [isAuthed]);

    const activeAlbum = albums.find(a => a.name === activeAlbumName);

    // ─── Album CRUD ────────────────────────────────────────────────
    const handleCreateAlbum = async () => {
        const albumName = window.prompt(lang === 'ar' ? 'أدخل اسم القسم الجديد:' : 'Enter new category name:');
        if (!albumName?.trim()) return;
        try {
            setLoading(true);
            const res = await fetch('/api/create-album', {
                method: 'POST', headers: authHeaders,
                body: JSON.stringify({ name: albumName.trim() })
            });
            const result = await res.json();
            if (result.success) {
                setStatusMessage(lang === 'ar' ? `✅ تم إنشاء القسم "${albumName}"` : `✅ Category "${albumName}" created`);
                await fetchGallery();
            } else throw new Error(result.error);
        } catch (err) {
            setStatusMessage(lang === 'ar' ? '❌ فشل إنشاء القسم' : '❌ Failed to create category');
        } finally { setLoading(false); }
    };

    const handleDeleteAlbum = async (albumName) => {
        const msg = lang === 'ar'
            ? `تحذير: هل أنت متأكد من حذف القسم "${albumName}" بالكامل؟ سيُحذف كل محتواه نهائياً!`
            : `WARNING: Delete category "${albumName}"? All images inside will be permanently deleted!`;
        if (!window.confirm(msg)) return;
        try {
            setLoading(true);
            const res = await fetch('/api/delete-album', {
                method: 'POST', headers: authHeaders,
                body: JSON.stringify({ name: albumName })
            });
            const result = await res.json();
            if (result.success) {
                setStatusMessage(lang === 'ar' ? '✅ تم حذف القسم' : '✅ Category deleted');
                if (activeAlbumName === albumName) setActiveAlbumName(null);
                await fetchGallery();
            } else throw new Error(result.error);
        } catch {
            setStatusMessage(lang === 'ar' ? '❌ فشل حذف القسم' : '❌ Failed to delete category');
        } finally { setLoading(false); }
    };

    const handleRenameAlbum = async (oldName) => {
        const newName = window.prompt(lang === 'ar' ? `الاسم الجديد للقسم "${oldName}":` : `New name for "${oldName}":`, oldName);
        if (!newName?.trim() || newName.trim() === oldName) return;
        try {
            setLoading(true);
            const res = await fetch('/api/rename-album', {
                method: 'POST', headers: authHeaders,
                body: JSON.stringify({ oldName, newName: newName.trim() })
            });
            const result = await res.json();
            if (result.success) {
                setStatusMessage(lang === 'ar' ? '✅ تم تعديل اسم القسم' : '✅ Category renamed');
                if (activeAlbumName === oldName) setActiveAlbumName(newName.trim());
                await fetchGallery();
            } else throw new Error(result.error);
        } catch {
            setStatusMessage(lang === 'ar' ? '❌ فشل تعديل الاسم' : '❌ Failed to rename');
        } finally { setLoading(false); }
    };

    // ─── Image Upload ──────────────────────────────────────────────
    const convertToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

    const handleFileUpload = async (files) => {
        if (!files?.length || !activeAlbumName) return;
        setUploading(true);
        setStatusMessage('');
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setStatusMessage(lang === 'ar' ? `❌ ${file.name} ليست صورة` : `❌ ${file.name} is not an image`);
                continue;
            }
            try {
                const base64Data = await convertToBase64(file);
                const res = await fetch('/api/upload', {
                    method: 'POST', headers: authHeaders,
                    body: JSON.stringify({ album: activeAlbumName, name: file.name, data: base64Data })
                });
                const result = await res.json();
                if (result.success) {
                    const saved = result.originalKB && result.compressedKB
                        ? Math.round((1 - result.compressedKB / result.originalKB) * 100)
                        : null;
                    setStatusMessage(lang === 'ar'
                        ? `✅ تم رفع "${result.name}" — ${result.originalKB}KB → ${result.compressedKB}KB WebP${saved ? ` (وفّرنا ${saved}%)` : ''}`
                        : `✅ Uploaded "${result.name}" — ${result.originalKB}KB → ${result.compressedKB}KB WebP${saved ? ` (saved ${saved}%)` : ''}`
                    );
                } else throw new Error(result.error);
            } catch (err) {
                setStatusMessage(lang === 'ar' ? `❌ فشل رفع ${file.name}` : `❌ Failed to upload ${file.name}`);
            }
        }
        setUploading(false);
        await fetchGallery();
    };

    // ─── Image Delete ──────────────────────────────────────────────
    const handleDeleteImage = async (img) => {
        const filename = img.filename || img;
        const confirmMsg = lang === 'ar'
            ? `هل أنت متأكد من حذف الصورة "${filename}"؟`
            : `Delete image "${filename}"?`;
        if (!window.confirm(confirmMsg)) return;
        try {
            const res = await fetch('/api/delete', {
                method: 'POST', headers: authHeaders,
                body: JSON.stringify({ album: activeAlbumName, name: filename })
            });
            const result = await res.json();
            if (result.success) {
                setStatusMessage(lang === 'ar' ? '✅ تم حذف الصورة' : '✅ Image deleted');
                await fetchGallery();
            } else throw new Error(result.error);
        } catch {
            setStatusMessage(lang === 'ar' ? '❌ فشل حذف الصورة' : '❌ Failed to delete image');
        }
    };

    // ─── Drag & Drop ───────────────────────────────────────────────
    const handleDrag = (e) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files);
    };

    const goHome = () => {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new Event('popstate'));
    };

    // ─── Get image src — works for both Cloudinary URLs and local paths ─
    const getImgSrc = (img) => {
        if (typeof img === 'object' && img.url) return img.url;
        return `/The Gallery/${encodeURIComponent(activeAlbumName)}/${encodeURIComponent(img)}`;
    };
    const getImgName = (img) => typeof img === 'object' ? img.filename : img;

    // ════════════════════════════════════════════════════════════════
    // LOGIN SCREEN
    // ════════════════════════════════════════════════════════════════
    if (!isAuthed) {
        return (
            <div className={`min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 ${lang === 'ar' ? 'font-cairo' : 'font-sans'}`}>
                <div className="w-full max-w-sm">
                    {/* Logo area */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 mx-auto mb-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl flex items-center justify-center">
                            <FaLock className="text-[#D4AF37] text-2xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#D4AF37] tracking-wider">
                            {lang === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
                        </h1>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
                            Ibrahim Al-Iraqi — Gallery Manager
                        </p>
                    </div>

                    {/* Login form */}
                    <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl space-y-5">
                        <div className="relative">
                            <label className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
                                {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={pwInput}
                                    onChange={e => setPwInput(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white text-sm outline-none focus:border-[#D4AF37] transition-colors"
                                    dir="ltr"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPw ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {authError && (
                            <p className="text-red-400 text-xs text-center">{authError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={authLoading || !pwInput}
                            className="w-full py-3 bg-[#D4AF37] hover:bg-[#F2E8C9] disabled:opacity-50 text-black font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                        >
                            {authLoading ? <FaSpinner className="animate-spin" /> : <FaLock />}
                            {authLoading
                                ? (lang === 'ar' ? 'جاري التحقق...' : 'Verifying...')
                                : (lang === 'ar' ? 'دخول' : 'Login')}
                        </button>

                        <button type="button" onClick={goHome} className="w-full text-center text-xs text-gray-500 hover:text-gray-300 transition-colors mt-2">
                            ← {lang === 'ar' ? 'العودة للموقع' : 'Back to website'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════════════════════════
    // MAIN DASHBOARD
    // ════════════════════════════════════════════════════════════════
    return (
        <div className={`min-h-screen bg-[#0A0A0A] text-[#f5f5f0] py-12 px-6 md:px-16 ${lang === 'ar' ? 'font-cairo' : 'font-sans'}`}>

            {/* Header */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-white/10 pb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={activeAlbumName ? () => setActiveAlbumName(null) : goHome}
                        className="p-3 bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-full transition-all duration-300 text-sm"
                        title={activeAlbumName ? (lang === 'ar' ? 'رجوع للأقسام' : 'Back to Categories') : (lang === 'ar' ? 'رجوع للموقع' : 'Back to Site')}
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-wider text-[#D4AF37]">
                            {activeAlbumName
                                ? (lang === 'ar' ? `قسم: ${activeAlbumName}` : `Category: ${activeAlbumName}`)
                                : (lang === 'ar' ? 'أقسام معرض الصور' : 'Gallery Categories')}
                        </h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                            {lang === 'ar' ? 'إدارة الألبومات والصور' : 'Manage albums & images'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                        className="text-xs font-bold text-[#f5f5f0]/70 hover:text-[#D4AF37] transition-colors uppercase tracking-widest px-4 py-2 bg-white/5 rounded border border-white/5 hover:border-[#D4AF37]">
                        {lang === 'en' ? 'AR' : 'EN'}
                    </button>
                    <button onClick={handleLogout}
                        className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest px-4 py-2 bg-red-500/5 rounded border border-red-500/20 hover:border-red-500/50">
                        {lang === 'ar' ? 'خروج' : 'Logout'}
                    </button>
                </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
                <div className="max-w-7xl mx-auto mb-8 p-4 bg-white/5 border border-white/10 rounded-lg text-center text-sm font-semibold text-[#D4AF37]">
                    {statusMessage}
                </div>
            )}

            {/* Workspace */}
            <div className="max-w-7xl mx-auto">
                {loading && albums.length === 0 ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-3 text-gray-500">
                        <FaSpinner className="animate-spin text-[#D4AF37] text-3xl" />
                        <p>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
                    </div>
                ) : !activeAlbumName ? (

                    /* ── Album List View ── */
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <FaImages className="text-[#D4AF37]" />
                                {lang === 'ar' ? 'الأقسام الحالية' : 'Available Categories'}
                            </h2>
                            <button onClick={handleCreateAlbum}
                                className="px-6 py-3 bg-[#D4AF37] text-black hover:bg-[#F2E8C9] rounded-full flex items-center gap-2 text-sm font-black transition-all duration-300 shadow-lg">
                                <FaFolderPlus />
                                {lang === 'ar' ? 'إنشاء قسم جديد' : 'New Category'}
                            </button>
                        </div>

                        {albums.length === 0 ? (
                            <div className="h-72 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-5 text-gray-500 text-sm">
                                <p>{lang === 'ar' ? 'لا توجد أقسام في التخزين السحابي بعد.' : 'No categories found in cloud storage yet.'}</p>
                                <button
                                    onClick={handleMigrateLocalImages}
                                    disabled={migrationLoading}
                                    className="px-6 py-3.5 bg-[#D4AF37] hover:bg-[#F2E8C9] disabled:opacity-50 text-black font-black rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg text-xs tracking-wider"
                                >
                                    {migrationLoading ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <FaCloudUploadAlt className="text-base" />
                                    )}
                                    {migrationLoading 
                                        ? migrationProgress 
                                        : (lang === 'ar' ? 'استيراد صور الموقع الحالية إلى السحابة' : 'Import current website images to Cloud')}
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {albums.map((album, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl text-[#D4AF37] text-3xl">
                                                    <FaFolder />
                                                </div>
                                                <span className="px-3 py-1 bg-white/5 border border-white/10 text-xs rounded-full font-bold">
                                                    {album.images.length} {lang === 'ar' ? 'صورة' : 'photos'}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate">
                                                {album.name}
                                            </h3>
                                        </div>
                                        <div className="flex gap-3 mt-8 border-t border-white/5 pt-4">
                                            <button onClick={() => setActiveAlbumName(album.name)}
                                                className="flex-1 py-2 bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 hover:border-[#D4AF37] rounded-lg text-xs font-bold transition-all duration-300">
                                                {lang === 'ar' ? 'دخول وإدارة الصور' : 'Manage Images'}
                                            </button>
                                            <button onClick={() => handleRenameAlbum(album.name)}
                                                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                                title={lang === 'ar' ? 'تعديل الاسم' : 'Rename'}>
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDeleteAlbum(album.name)}
                                                className="p-2.5 bg-red-950/20 hover:bg-red-600 border border-red-500/20 rounded-lg text-red-500 hover:text-white transition-colors"
                                                title={lang === 'ar' ? 'حذف القسم' : 'Delete'}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                ) : (

                    /* ── Album Detail View ── */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Upload Column */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <FaUpload className="text-[#D4AF37]" />
                                        {lang === 'ar' ? 'رفع صور' : 'Upload Images'}
                                    </h2>
                                    <button onClick={() => handleRenameAlbum(activeAlbumName)}
                                        className="text-xs text-gray-400 hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors">
                                        <FaEdit /> {lang === 'ar' ? 'تغيير الاسم' : 'Rename'}
                                    </button>
                                </div>

                                <form
                                    onDragEnter={handleDrag} onDragOver={handleDrag}
                                    onDragLeave={handleDrag} onDrop={handleDrop}
                                    onSubmit={e => e.preventDefault()}
                                    className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${dragActive ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/20 hover:border-white/40 hover:bg-white/5'}`}
                                    onClick={() => document.getElementById('file-upload-input').click()}
                                >
                                    <input id="file-upload-input" type="file" multiple accept="image/*" className="hidden"
                                        onChange={e => handleFileUpload(e.target.files)} />
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-full mb-4 text-[#D4AF37]">
                                        <FaUpload className="text-2xl" />
                                    </div>
                                    <p className="text-sm font-semibold text-white mb-1">
                                        {lang === 'ar' ? 'اسحب الصور وأفلتها هنا' : 'Drag & Drop images here'}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-3">
                                        {lang === 'ar' ? 'أو انقر لتصفح الملفات' : 'or click to browse'}
                                    </p>
                                    <span className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded-full">
                                        ⚡ {lang === 'ar' ? 'ضغط تلقائي WebP · جودة عالية' : 'Auto WebP Compression · High Quality'}
                                    </span>
                                </form>

                                {uploading && (
                                    <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center gap-3 text-sm text-[#D4AF37]">
                                        <FaSpinner className="animate-spin" />
                                        {lang === 'ar' ? 'جاري الرفع والضغط...' : 'Uploading & compressing...'}
                                    </div>
                                )}
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-950/10 border border-red-500/20 rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-red-500 mb-3">
                                    {lang === 'ar' ? 'منطقة الخطورة' : 'Danger Zone'}
                                </h3>
                                <button onClick={() => handleDeleteAlbum(activeAlbumName)}
                                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                                    <FaTrash />
                                    {lang === 'ar' ? 'حذف هذا الألبوم بالكامل' : 'Delete Entire Category'}
                                </button>
                            </div>
                        </div>

                        {/* Images Grid Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        {lang === 'ar' ? 'الصور الحالية' : 'Current Images'}
                                        <span className="px-2.5 py-0.5 text-xs bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] rounded-full">
                                            {activeAlbum?.images?.length || 0}
                                        </span>
                                    </h2>
                                </div>

                                {!activeAlbum?.images?.length ? (
                                    <div className="h-64 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-gray-500 text-sm">
                                        {lang === 'ar' ? 'القسم فارغ. ارفع صوراً لتظهر هنا.' : 'Category is empty. Upload images to start.'}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-h-[650px] overflow-y-auto pr-2">
                                        {activeAlbum.images.map((img, idx) => (
                                            <div key={idx} className="relative group rounded-xl border border-white/10 overflow-hidden bg-black/40">
                                                {/* Cover Badge */}
                                                {isCoverImage(img) && (
                                                    <div className="absolute top-2.5 right-2.5 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-lg z-20 flex items-center gap-1">
                                                        <FaStar className="text-[9px]" />
                                                        {lang === 'ar' ? 'الغلاف' : 'Cover'}
                                                    </div>
                                                )}

                                                <div className="aspect-[3/4] overflow-hidden bg-zinc-900 flex items-center justify-center">
                                                    <img
                                                        src={getImgSrc(img)}
                                                        alt={`Image ${idx}`}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
                                                    <p className="text-[10px] text-gray-400 break-all line-clamp-2 uppercase tracking-wide">
                                                        {getImgName(img)}
                                                    </p>
                                                    
                                                    <div className="space-y-2 w-full">
                                                        {!isCoverImage(img) && (
                                                            <button onClick={() => handleSetCover(img)}
                                                                className="w-full py-2 bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 hover:border-[#D4AF37] rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all duration-300">
                                                                <FaRegStar />
                                                                {lang === 'ar' ? 'تعيين كغلاف' : 'Set as Cover'}
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleDeleteImage(img)}
                                                            className="w-full py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                                                            <FaTrash />
                                                            {lang === 'ar' ? 'حذف الصورة' : 'Delete'}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-0 left-0 w-full p-2 bg-black/65 backdrop-blur-sm text-[9px] text-gray-400 truncate text-center border-t border-white/5 pointer-events-none group-hover:opacity-0 transition-opacity">
                                                    {getImgName(img)}
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

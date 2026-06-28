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
    const [catalog, setCatalog] = useState({});
    const [activeAlbumName, setActiveAlbumName] = useState(null);
    const [activeSuitId, setActiveSuitId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [editingImage, setEditingImage] = useState(null);

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

    const getAlbumDisplayName = (albumName, currentLang) => {
        if (!albumName) return '';
        const n = albumName.toLowerCase();
        if (n.includes('classic') || n.includes('collection') || n.includes('كلاسيك')) {
            return currentLang === 'ar' ? 'كلاسيكي' : 'Classic';
        }
        if (n.includes('wedding') || n.includes('زفاف')) {
            return currentLang === 'ar' ? 'بدل زفاف' : 'Wedding Suits';
        }
        if (n.includes('casual') || n.includes('كاجوال')) {
            return currentLang === 'ar' ? 'كاجوال' : 'Casual';
        }
        if (n.includes('luxury') || n.includes('فاخر')) {
            return currentLang === 'ar' ? 'بدل فاخرة' : 'Luxury Suits';
        }
        return albumName;
    };

    const handleSetCover = async (img) => {
        const filename = getImgName(img);
        try {
            setLoading(true);
            const body = { album: activeAlbumName, filename };
            if (activeSuitId) body.suitId = activeSuitId;
            const res = await fetch('/api/set-cover', {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify(body)
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

    const handleMoveImage = async (img, targetAlbumId) => {
        const filename = getImgName(img);
        try {
            setLoading(true);
            const res = await fetch('/api/move-image', {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({ fromAlbum: activeAlbumName, toAlbum: targetAlbumId, filename })
            });
            const result = await res.json();
            if (result.success) {
                setStatusMessage(lang === 'ar' ? '📦 تم نقل الصورة بنجاح!' : '📦 Image moved successfully!');
                await fetchGallery();
            } else throw new Error(result.error);
        } catch (err) {
            console.error(err);
            setStatusMessage(lang === 'ar' ? '❌ فشل نقل الصورة' : '❌ Failed to move image');
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
            const res = await fetch(`/api/gallery?t=${Date.now()}`);
            const data = await res.json();
            if (data.albums) setAlbums(data.albums);
            if (data.catalog) setCatalog(data.catalog);
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

    const getAlbumDataForCategory = (id) => {
        return albums.find(a => {
            const n = a.name.toLowerCase();
            if (id === 'Classic') return n.includes('classic') || n.includes('collection') || n.includes('كلاسيك');
            if (id === 'Wedding') return n.includes('wedding') || n.includes('زفاف');
            if (id === 'Casual') return n.includes('casual') || n.includes('كاجوال');
            if (id === 'Luxury') return n.includes('luxury') || n.includes('faher') || n.includes('فاخر');
            return false;
        });
    };

    // 1. Gather all core albums (which might map to Cloudinary folders or show placeholders)
    const coreAlbums = [
        { id: 'Classic', defaultName: lang === 'ar' ? 'كلاسيكي' : 'Classic' },
        { id: 'Wedding', defaultName: lang === 'ar' ? 'بدل زفاف' : 'Wedding Suits' },
        { id: 'Casual', defaultName: lang === 'ar' ? 'كاجوال' : 'Casual' },
        { id: 'Luxury', defaultName: lang === 'ar' ? 'بدل فاخرة' : 'Luxury Suits' }
    ].map(cat => {
        const realAlbum = getAlbumDataForCategory(cat.id);
        return {
            id: realAlbum ? realAlbum.name : cat.id,
            displayName: cat.defaultName,
            suits: realAlbum ? realAlbum.suits : [],
            isCore: true
        };
    });

    // 2. Identify any custom albums that do NOT match the core 4
    const customAlbums = albums.filter(a => {
        const n = a.name.toLowerCase();
        const isClassic = n.includes('classic') || n.includes('collection') || n.includes('كلاسيك');
        const isWedding = n.includes('wedding') || n.includes('زفاف');
        const isCasual = n.includes('casual') || n.includes('كاجوال');
        const isLuxury = n.includes('luxury') || n.includes('faher') || n.includes('فاخر');
        return !isClassic && !isWedding && !isCasual && !isLuxury;
    }).map(a => ({
        id: a.name,
        displayName: getAlbumDisplayName(a.name, lang),
        suits: a.suits || [],
        isCore: false
    }));

    // Combine them to display in the dashboard
    const dashboardAlbums = [...coreAlbums, ...customAlbums];

    const activeAlbum = dashboardAlbums.find(a => a.id === activeAlbumName);

    // ─── Album CRUD ────────────────────────────────────────────────
    const handleCreateAlbum = async () => {
        const albumName = window.prompt(
            lang === 'ar' 
                ? 'أدخل اسم القسم الجديد بالإنجليزية (مثال: Winter):' 
                : 'Enter new category name in English (e.g. Winter):'
        );
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
                setStatusMessage(lang === 'ar' ? '✅ تم حذف القسم بنجاح' : '✅ Category deleted successfully');
                if (activeAlbumName === albumName) setActiveAlbumName(null);
                await fetchGallery();
            } else throw new Error(result.error);
        } catch {
            setStatusMessage(lang === 'ar' ? '❌ فشل حذف القسم' : '❌ Failed to delete category');
        } finally { setLoading(false); }
    };

    // ─── Album Clear ──────────────────────────────────────────────
    const handleClearAlbum = async (albumId) => {
        const msg = lang === 'ar'
            ? 'هل أنت متأكد من حذف جميع الصور في هذا القسم؟ لا يمكن التراجع عن هذا الإجراء!'
            : 'Are you sure you want to delete all images in this category? This action cannot be undone!';
        if (!window.confirm(msg)) return;
        try {
            setLoading(true);
            const res = await fetch('/api/delete-album', {
                method: 'POST', headers: authHeaders,
                body: JSON.stringify({ name: albumId })
            });
            const result = await res.json();
            if (result.success) {
                setStatusMessage(lang === 'ar' ? '✅ تم إفراغ القسم بنجاح' : '✅ Category cleared successfully');
                if (activeAlbumName === albumId) setActiveAlbumName(null);
                await fetchGallery();
            } else throw new Error(result.error);
        } catch {
            setStatusMessage(lang === 'ar' ? '❌ فشل إفراغ القسم' : '❌ Failed to clear category');
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

    // ─── Suit Metadata Updates ──────────────────────────────────────
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        if (!editingImage) return;
        try {
            setLoading(true);
            const res = await fetch('/api/update-product', {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({
                    filename: editingImage.filename,
                    metadata: {
                        nameAr: editingImage.nameAr,
                        nameEn: editingImage.nameEn,
                        descAr: editingImage.descAr,
                        descEn: editingImage.descEn,
                        priceAr: editingImage.priceAr,
                        priceEn: editingImage.priceEn
                    }
                })
            });
            const result = await res.json();
            if (result.success) {
                setStatusMessage(lang === 'ar' ? '✅ تم تحديث تفاصيل البدلة بنجاح!' : '✅ Suit details updated successfully!');
                setEditingImage(null);
                await fetchGallery();
            } else throw new Error(result.error);
        } catch (err) {
            console.error(err);
            setStatusMessage(lang === 'ar' ? '❌ فشل تحديث التفاصيل' : '❌ Failed to update suit details');
        } finally {
            setLoading(false);
        }
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
                const body = { album: activeAlbumName, name: file.name, data: base64Data };
                // If inside a suit, upload to that suit's subfolder
                if (activeSuitId) body.suitId = activeSuitId;
                const res = await fetch('/api/upload', {
                    method: 'POST', headers: authHeaders,
                    body: JSON.stringify(body)
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
            // If in a suit subfolder, include the suitId so the server resolves the correct path
            const body = { album: activeAlbumName, name: filename };
            if (activeSuitId) body.suitId = activeSuitId;
            const res = await fetch('/api/delete', {
                method: 'POST', headers: authHeaders,
                body: JSON.stringify(body)
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

    // ─── Suit Create / Delete ──────────────────────────────────────
    const handleCreateSuit = async () => {
        const suitNameAr = window.prompt(
            lang === 'ar' ? 'أدخل اسم البدلة الجديدة بالعربية:' : 'Enter new suit name in Arabic:'
        );
        if (!suitNameAr?.trim()) return;
        const suitNameEn = window.prompt(
            lang === 'ar' ? 'أدخل اسم البدلة بالإنجليزية:' : 'Enter suit name in English:'
        );
        if (!suitNameEn?.trim()) return;
        const suitId = `suit_${Date.now()}`;
        try {
            setLoading(true);
            // Save metadata immediately via update-product
            const res = await fetch('/api/update-product', {
                method: 'POST', headers: authHeaders,
                body: JSON.stringify({
                    filename: suitId,
                    metadata: { nameAr: suitNameAr.trim(), nameEn: suitNameEn.trim(), descAr: '', descEn: '', priceAr: '', priceEn: '' }
                })
            });
            const result = await res.json();
            if (result.success) {
                setStatusMessage(lang === 'ar' ? `✅ تم إنشاء البدلة "${suitNameAr}"` : `✅ Suit "${suitNameEn}" created`);
                // Automatically open that suit's management page
                setActiveSuitId(suitId);
                await fetchGallery();
            } else throw new Error(result.error);
        } catch (err) {
            setStatusMessage(lang === 'ar' ? '❌ فشل إنشاء البدلة' : '❌ Failed to create suit');
        } finally { setLoading(false); }
    };

    const handleDeleteSuit = async (suit) => {
        const displayName = lang === 'ar' ? (suit.nameAr || suit.id) : (suit.nameEn || suit.id);
        const msg = lang === 'ar'
            ? `تحذير: هل أنت متأكد من حذف البدلة "${displayName}" بالكامل مع جميع صورها؟`
            : `WARNING: Delete suit "${displayName}" and all its images?`;
        if (!window.confirm(msg)) return;
        try {
            setLoading(true);
            // Delete the suit's folder on Cloudinary (which is a subfolder of the category)
            const subfolderPath = `${activeAlbumName}/${suit.id}`;
            const res = await fetch('/api/delete-album', {
                method: 'POST', headers: authHeaders,
                body: JSON.stringify({ name: subfolderPath })
            });
            const result = await res.json();
            if (result.success || result.error?.includes('not found')) {
                setStatusMessage(lang === 'ar' ? '✅ تم حذف البدلة بنجاح' : '✅ Suit deleted successfully');
                if (activeSuitId === suit.id) setActiveSuitId(null);
                await fetchGallery();
            } else throw new Error(result.error);
        } catch {
            setStatusMessage(lang === 'ar' ? '❌ فشل حذف البدلة' : '❌ Failed to delete suit');
        } finally { setLoading(false); }
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
                        onClick={() => {
                            if (activeSuitId) { setActiveSuitId(null); }
                            else if (activeAlbumName) { setActiveAlbumName(null); }
                            else { goHome(); }
                        }}
                        className="p-3 bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-full transition-all duration-300 text-sm"
                        title={activeSuitId ? (lang === 'ar' ? 'رجوع لقائمة البدلات' : 'Back to Suits') : activeAlbumName ? (lang === 'ar' ? 'رجوع للأقسام' : 'Back to Categories') : (lang === 'ar' ? 'رجوع للموقع' : 'Back to Site')}
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-wider text-[#D4AF37]">
                            {activeSuitId
                                ? (() => { const s = activeAlbum?.suits?.find(s => s.id === activeSuitId); return lang === 'ar' ? `بدلة: ${s?.nameAr || activeSuitId}` : `Suit: ${s?.nameEn || activeSuitId}`; })()
                                : activeAlbumName
                                    ? (lang === 'ar' ? `قسم: ${getAlbumDisplayName(activeAlbumName, lang)}` : `Category: ${getAlbumDisplayName(activeAlbumName, lang)}`)
                                    : (lang === 'ar' ? 'أقسام معرض الصور' : 'Gallery Categories')}
                        </h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                            {activeSuitId
                                ? (lang === 'ar' ? 'إدارة صور وتفاصيل البدلة' : 'Manage suit images & details')
                                : activeAlbumName
                                    ? (lang === 'ar' ? 'إدارة البدلات في هذا القسم' : 'Manage suits in this category')
                                    : (lang === 'ar' ? 'إدارة أقسام المعرض' : 'Manage gallery categories')}
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
                {loading && dashboardAlbums.length === 0 ? (
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {dashboardAlbums.map((album, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl text-[#D4AF37] text-3xl">
                                                <FaFolder />
                                            </div>
                                            <span className="px-3 py-1 bg-white/5 border border-white/10 text-xs rounded-full font-bold">
                                                {album.suits.length} {lang === 'ar' ? 'بدلة' : 'suits'}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate">
                                            {album.displayName}
                                        </h3>
                                    </div>
                                    <div className="flex gap-3 mt-8 border-t border-white/5 pt-4">
                                        <button onClick={() => { setActiveAlbumName(album.id); setActiveSuitId(null); }}
                                            className="flex-1 py-2.5 bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 hover:border-[#D4AF37] rounded-lg text-xs font-bold transition-all duration-300">
                                            {lang === 'ar' ? 'دخول وإدارة البدلات' : 'Manage Suits'}
                                        </button>
                                        {!album.isCore && (
                                            <button onClick={() => handleDeleteAlbum(album.id)}
                                                className="p-2.5 bg-red-950/20 hover:bg-red-600 border border-red-500/20 rounded-lg text-red-500 hover:text-white transition-colors"
                                                title={lang === 'ar' ? 'حذف القسم بالكامل' : 'Delete Category'}>
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                ) : !activeSuitId ? (

                    /* ── Level 1: Suits List View ── */
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <FaImages className="text-[#D4AF37]" />
                                {lang === 'ar' ? `البدلات في قسم ${getAlbumDisplayName(activeAlbumName, lang)}` : `Suits in ${getAlbumDisplayName(activeAlbumName, lang)}`}
                                <span className="px-2.5 py-0.5 text-xs bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] rounded-full">
                                    {activeAlbum?.suits?.length || 0}
                                </span>
                            </h2>
                            <button onClick={handleCreateSuit}
                                className="px-6 py-3 bg-[#D4AF37] text-black hover:bg-[#F2E8C9] rounded-full flex items-center gap-2 text-sm font-black transition-all duration-300 shadow-lg">
                                <FaFolderPlus />
                                {lang === 'ar' ? 'إضافة بدلة جديدة' : 'New Suit'}
                            </button>
                        </div>

                        {!activeAlbum?.suits?.length ? (
                            <div className="h-64 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 text-gray-500">
                                <FaImages className="text-4xl text-gray-700" />
                                <p className="text-sm">{lang === 'ar' ? 'لا توجد بدلات في هذا القسم بعد. أضف بدلة جديدة للبدء!' : 'No suits yet. Add a new suit to get started!'}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {activeAlbum.suits.map((suit, idx) => {
                                    const displayName = lang === 'ar' ? (suit.nameAr || suit.id) : (suit.nameEn || suit.id);
                                    const displayPrice = lang === 'ar' ? suit.priceAr : suit.priceEn;
                                    const coverSrc = suit.coverImage?.url || '';
                                    return (
                                        <div key={suit.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 group">
                                            {/* Cover Thumbnail */}
                                            <div className="aspect-[3/2] bg-black/40 overflow-hidden">
                                                {coverSrc ? (
                                                    <img src={coverSrc} alt={displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                        <FaImages className="text-4xl" />
                                                    </div>
                                                )}
                                            </div>
                                            {/* Suit Info */}
                                            <div className="p-5 space-y-3">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="text-base font-bold text-white truncate flex-1">{displayName}</h3>
                                                    {displayPrice && <span className="text-[#D4AF37] text-sm font-bold whitespace-nowrap">{displayPrice}</span>}
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {suit.images.length} {lang === 'ar' ? 'صورة' : 'images'}
                                                    {suit.isLegacy && <span className="ml-2 px-1.5 py-0.5 bg-yellow-900/30 text-yellow-500 rounded text-[9px]">Legacy</span>}
                                                </p>
                                                <div className="flex gap-2 pt-2 border-t border-white/5">
                                                    <button
                                                        onClick={() => {
                                                            setActiveSuitId(suit.id);
                                                            // Pre-fill editing form with current metadata
                                                            setEditingImage({
                                                                filename: suit.id,
                                                                nameAr: suit.nameAr || '',
                                                                nameEn: suit.nameEn || '',
                                                                descAr: suit.descAr || '',
                                                                descEn: suit.descEn || '',
                                                                priceAr: suit.priceAr || '',
                                                                priceEn: suit.priceEn || ''
                                                            });
                                                        }}
                                                        className="flex-1 py-2 bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 hover:border-[#D4AF37] rounded-lg text-xs font-bold transition-all duration-300">
                                                        {lang === 'ar' ? 'إدارة الصور والتفاصيل' : 'Manage'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSuit(suit)}
                                                        className="p-2 bg-red-950/20 hover:bg-red-600 border border-red-500/20 rounded-lg text-red-500 hover:text-white transition-colors"
                                                        title={lang === 'ar' ? 'حذف البدلة' : 'Delete Suit'}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                ) : (() => {
                    // ── Level 2: Suit Detail / Image Manager ──
                    const currentSuit = activeAlbum?.suits?.find(s => s.id === activeSuitId);
                    const suitImages = currentSuit?.images || [];

                    return (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Left Column: Upload + Metadata Edit */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Metadata Edit Form */}
                                {editingImage && editingImage.filename === activeSuitId && (
                                    <div className="bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-6 space-y-5">
                                        <h3 className="text-base font-bold text-[#D4AF37] flex items-center gap-2">
                                            <FaEdit />
                                            {lang === 'ar' ? 'تعديل تفاصيل البدلة' : 'Edit Suit Details'}
                                        </h3>
                                        <form onSubmit={handleUpdateProduct} className="space-y-4">
                                            <div dir="rtl" className="space-y-3">
                                                <h4 className="text-xs text-gray-400 uppercase tracking-widest">العربية</h4>
                                                <input type="text" value={editingImage.nameAr}
                                                    onChange={e => setEditingImage({ ...editingImage, nameAr: e.target.value })}
                                                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none text-right"
                                                    placeholder="اسم البدلة" />
                                                <input type="text" value={editingImage.priceAr}
                                                    onChange={e => setEditingImage({ ...editingImage, priceAr: e.target.value })}
                                                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none text-right"
                                                    placeholder="السعر" />
                                                <textarea rows={3} value={editingImage.descAr}
                                                    onChange={e => setEditingImage({ ...editingImage, descAr: e.target.value })}
                                                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none resize-none text-right"
                                                    placeholder="الوصف" />
                                            </div>
                                            <div dir="ltr" className="space-y-3">
                                                <h4 className="text-xs text-gray-400 uppercase tracking-widest">English</h4>
                                                <input type="text" value={editingImage.nameEn}
                                                    onChange={e => setEditingImage({ ...editingImage, nameEn: e.target.value })}
                                                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                                                    placeholder="Suit Name" />
                                                <input type="text" value={editingImage.priceEn}
                                                    onChange={e => setEditingImage({ ...editingImage, priceEn: e.target.value })}
                                                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                                                    placeholder="Price" />
                                                <textarea rows={3} value={editingImage.descEn}
                                                    onChange={e => setEditingImage({ ...editingImage, descEn: e.target.value })}
                                                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none resize-none"
                                                    placeholder="Description" />
                                            </div>
                                            <button type="submit"
                                                className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#F2E8C9] text-black rounded-lg text-sm font-black transition-all">
                                                {lang === 'ar' ? 'حفظ التفاصيل' : 'Save Details'}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Upload Dropzone */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                                        <FaUpload className="text-[#D4AF37]" />
                                        {lang === 'ar' ? 'رفع صور للبدلة' : 'Upload Suit Images'}
                                    </h2>
                                    <form
                                        onDragEnter={handleDrag} onDragOver={handleDrag}
                                        onDragLeave={handleDrag} onDrop={handleDrop}
                                        onSubmit={e => e.preventDefault()}
                                        className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-300 ${dragActive ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/20 hover:border-white/40 hover:bg-white/5'}`}
                                        onClick={() => document.getElementById('file-upload-input').click()}
                                    >
                                        <input id="file-upload-input" type="file" multiple accept="image/*" className="hidden"
                                            onChange={e => handleFileUpload(e.target.files)} />
                                        <FaUpload className="text-[#D4AF37] text-2xl mb-3" />
                                        <p className="text-xs font-semibold text-white">
                                            {lang === 'ar' ? 'اسحب الصور هنا أو انقر' : 'Drag & drop or click'}
                                        </p>
                                        <p className="text-[10px] text-gray-500 mt-1">WebP Auto-Compression</p>
                                    </form>
                                    {uploading && (
                                        <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center gap-3 text-sm text-[#D4AF37]">
                                            <FaSpinner className="animate-spin" />
                                            {lang === 'ar' ? 'جاري الرفع...' : 'Uploading...'}
                                        </div>
                                    )}
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-red-950/10 border border-red-500/20 rounded-2xl p-5">
                                    <h3 className="text-sm font-bold text-red-500 mb-3">{lang === 'ar' ? 'منطقة الخطورة' : 'Danger Zone'}</h3>
                                    <button onClick={() => handleDeleteSuit(currentSuit)}
                                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                                        <FaTrash />
                                        {lang === 'ar' ? 'حذف هذه البدلة بالكامل' : 'Delete This Suit'}
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: Suit Images Grid */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
                                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                            {lang === 'ar' ? 'صور البدلة' : 'Suit Images'}
                                            <span className="px-2.5 py-0.5 text-xs bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] rounded-full">
                                                {suitImages.length}
                                            </span>
                                        </h2>
                                    </div>

                                    {suitImages.length === 0 ? (
                                        <div className="h-64 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-gray-500 text-sm">
                                            {lang === 'ar' ? 'لا توجد صور بعد. ارفع صوراً لهذه البدلة.' : 'No images yet. Upload images for this suit.'}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-h-[650px] overflow-y-auto pr-2">
                                            {suitImages.map((img, idx) => (
                                                <div key={idx} className="relative group rounded-xl border border-white/10 overflow-hidden bg-black/40">
                                                    {/* Cover Badge */}
                                                    {img.filename?.toLowerCase().startsWith('cover') && (
                                                        <div className="absolute top-2.5 right-2.5 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-lg z-20 flex items-center gap-1">
                                                            <FaStar className="text-[9px]" />
                                                            {lang === 'ar' ? 'الغلاف' : 'Cover'}
                                                        </div>
                                                    )}
                                                    <div className="aspect-[3/4] overflow-hidden bg-zinc-900">
                                                        <img
                                                            src={img.url || `/The Gallery/${encodeURIComponent(activeAlbumName)}/${encodeURIComponent(activeSuitId)}/${encodeURIComponent(img.filename || img)}`}
                                                            alt={img.filename}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 z-10">
                                                        <p className="text-[9px] text-gray-400 break-all line-clamp-2 uppercase tracking-wide">{img.filename}</p>
                                                        <div className="space-y-2 w-full">
                                                            {!img.filename?.toLowerCase().startsWith('cover') && (
                                                                <button onClick={() => handleSetCover(img)}
                                                                    className="w-full py-1.5 bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all">
                                                                    <FaRegStar />
                                                                    {lang === 'ar' ? 'تعيين كغلاف' : 'Set as Cover'}
                                                                </button>
                                                            )}
                                                            <button onClick={() => handleDeleteImage(img)}
                                                                className="w-full py-1.5 bg-red-600/95 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors">
                                                                <FaTrash />
                                                                {lang === 'ar' ? 'حذف' : 'Delete'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 w-full p-1.5 bg-black/65 text-[9px] text-gray-400 truncate text-center border-t border-white/5 pointer-events-none group-hover:opacity-0 transition-opacity">
                                                        {img.filename}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Edit Metadata Modal */}
            {editingImage && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <FaEdit className="text-[#D4AF37]" />
                                {lang === 'ar' ? 'تعديل تفاصيل وأسعار البدلة' : 'Edit Suit Details & Price'}
                            </h3>
                            <button
                                onClick={() => setEditingImage(null)}
                                className="text-gray-400 hover:text-white transition-colors text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProduct} className="space-y-6">
                            {/* Sub-header with filename */}
                            <div className="text-xs text-gray-500 uppercase tracking-widest">
                                {lang === 'ar' ? 'الملف:' : 'File:'} {editingImage.filename}
                            </div>

                            {/* Two Column Grid for Arabic & English Translation Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
                                
                                {/* Arabic Inputs */}
                                <div className="space-y-4 border-r border-white/5 pr-6" dir="rtl">
                                    <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-black mb-2">
                                        التفاصيل باللغة العربية
                                    </h4>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1 text-right">اسم البدلة</label>
                                        <input
                                            type="text"
                                            value={editingImage.nameAr}
                                            onChange={e => setEditingImage({ ...editingImage, nameAr: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none text-right"
                                            placeholder="مثال: تكسيدو الكحلي الملكي"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1 text-right">السعر</label>
                                        <input
                                            type="text"
                                            value={editingImage.priceAr}
                                            onChange={e => setEditingImage({ ...editingImage, priceAr: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none text-right"
                                            placeholder="مثال: ٢,٨٥٠ دولار"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1 text-right">فلسفة التصميم والوصف</label>
                                        <textarea
                                            rows={4}
                                            value={editingImage.descAr}
                                            onChange={e => setEditingImage({ ...editingImage, descAr: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none resize-none text-right"
                                            placeholder="وصف فخم يعبر عن جودة البدلة والنسيج..."
                                        />
                                    </div>
                                </div>

                                {/* English Inputs */}
                                <div className="space-y-4 text-left" dir="ltr">
                                    <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-black mb-2">
                                        English Specifications
                                    </h4>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1 text-left">Suit Name</label>
                                        <input
                                            type="text"
                                            value={editingImage.nameEn}
                                            onChange={e => setEditingImage({ ...editingImage, nameEn: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none text-left"
                                            placeholder="e.g. Royal Navy Tuxedo"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1 text-left">Price</label>
                                        <input
                                            type="text"
                                            value={editingImage.priceEn}
                                            onChange={e => setEditingImage({ ...editingImage, priceEn: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none text-left"
                                            placeholder="e.g. $2,850"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1 text-left">Design Philosophy / Desc</label>
                                        <textarea
                                            rows={4}
                                            value={editingImage.descEn}
                                            onChange={e => setEditingImage({ ...editingImage, descEn: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#D4AF37] focus:outline-none resize-none text-left"
                                            placeholder="Luxury description outlining quality weave and canvas..."
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-4 border-t border-white/10 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditingImage(null)}
                                    className="flex-1 py-3 border border-white/10 hover:bg-white/5 text-white rounded-lg text-sm font-bold transition-all"
                                >
                                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#F2E8C9] text-black rounded-lg text-sm font-black transition-all shadow-lg shadow-[#D4AF37]/5"
                                >
                                    {lang === 'ar' ? 'حفظ التعديلات' : 'Save Details'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

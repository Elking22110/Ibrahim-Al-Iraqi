// src/productMetadata.js — Premium product catalog mapping and generator
// Maps specific Cloudinary filenames to luxury Arabic/English descriptions and prices.
// Provides a fallback generator for newly uploaded/unknown images.

const PRESET_CATALOG = {
    // Classic/Collection Album Suits
    "1u9a8987 copy": {
        en: {
            name: "The Royal Navy Tuxedo",
            desc: "Woven from 100% fine Italian Super 150s merino wool. Features satin peak lapels and a classic structured silhouette.",
            price: "$2,850"
        },
        ar: {
            name: "تكسيدو الكحلي الملكي",
            desc: "منسوجة من صوف الميرينو الإيطالي الفاخر سوبر ١٥٠. تتميز بياقة شال من الساتان وقصة كلاسيكية مهيبة.",
            price: "٢,٨٥٠ دولار"
        }
    },
    "1u9a9000 copy": {
        en: {
            name: "Charcoal Herringbone Suit",
            desc: "Double-breasted signature drape made of British wool cashmere blend. Exquisite pick-stitch detailing.",
            price: "$3,200"
        },
        ar: {
            name: "بدلة هيرينجبون الفحمية",
            desc: "بدلة صدر مزدوجة (Double-breasted) من مزيج الصوف الكشمير الإنجليزي الفاخر بتفاصيل خياطة يدوية دقيقة.",
            price: "٣,٢٠٠ دولار"
        }
    },
    "img_0199": {
        en: {
            name: "Classic Jet Black Suit",
            desc: "The ultimate formal statement. Crafted from high-twist French wool with hand-finished Milanese buttonholes.",
            price: "$2,600"
        },
        ar: {
            name: "البدلة السوداء الكلاسيكية",
            desc: "بدلة سوداء كلاسيكية للمناسبات الرسمية الفاخرة. مصنوعة من الصوف الفرنسي الفاخر وعروات ميلانيز مشطبة يدوياً.",
            price: "٢,٦٠٠ دولار"
        }
    },
    "img_0201": {
        en: {
            name: "Presidential Pinstripe",
            desc: "Navy blue pinstripe tailoring representing authority and timeless elegance. Full floating canvas design.",
            price: "$2,950"
        },
        ar: {
            name: "بدلة الخطوط الرئاسية مقلمة",
            desc: "بدلة مقلمة بلون كحلي ملكي تعكس الجاذبية والهيبة. حشوة داخلية عائمة بالكامل لراحة قصوى وانسيابية تامة.",
            price: "٢,٩٥٠ دولار"
        }
    },
    "img_0207": {
        en: {
            name: "The Imperial Grey Suit",
            desc: "Medium charcoal wool suit, perfect for corporate leadership or high-end evening receptions.",
            price: "$2,550"
        },
        ar: {
            name: "البدلة الرمادية الإمبراطورية",
            desc: "بدلة صوف رمادي متوسط، مثالية لقادة الأعمال والمناسبات المسائية الفاخرة بقصة مريحة وأكتاف إيطالية ناعمة.",
            price: "٢,٥٥٠ دولار"
        }
    },
    "img_0261": {
        en: {
            name: "Emerald Green Velvet Dinner Jacket",
            desc: "Rich velvet texture with silk shawl lapels. A masterpiece of evening luxury.",
            price: "$3,400"
        },
        ar: {
            name: "سترة السهرة المخملية الزمردية",
            desc: "جاكيت قطيفة باللون الأخضر الزمردي بياقة شال من الحرير الخالص. تحفة فنية تلائم السهرات المرموقة.",
            price: "٣,٤٠٠ دولار"
        }
    },
    "img_0262": {
        en: {
            name: "Sandy Beige Summer Linen",
            desc: "Lightweight blend of Italian linen and silk. Unstructured shoulders for a relaxed luxury look.",
            price: "$2,300"
        },
        ar: {
            name: "بدلة الكتان الصيفية الرملية",
            desc: "مزيج خفيف من الكتان والحرير الإيطالي الفاخر. أكتاف غير مبطنة لأسلوب صيفي يجمع بين العملية والتميز.",
            price: "٢,٣٠٠ دولار"
        }
    },
    "img_0263": {
        en: {
            name: "The Crimson Silk Tuxedo",
            desc: "Bold deep red silk wool blend with satin lapels. Made for the red carpet.",
            price: "$3,650"
        },
        ar: {
            name: "تكسيدو الحرير القرمزي الفاخر",
            desc: "بدلة تكسيدو باللون الأحمر الداكن الجريء بمزيج من الصوف والحرير وساتان ناعم يزين الياقة والجيوب.",
            price: "٣,٦٥٠ دولار"
        }
    }
};

// Generates luxury product properties dynamically if not predefined
export const getProductMetadata = (albumName, imgFilename, lang = 'ar') => {
    if (!imgFilename) return { name: '', desc: '', price: '' };

    // Normalize filename key
    const key = imgFilename.toLowerCase().replace(/\.[^/.]+$/, '').trim();

    // 1. Check presets
    if (PRESET_CATALOG[key]) {
        return PRESET_CATALOG[key][lang];
    }

    // 2. Dynamic generation based on category/album name
    const n = (albumName || '').toLowerCase();
    
    // Generate deterministic values based on image filename hash so they are static for the same image
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) - hash + key.charCodeAt(i);
        hash |= 0;
    }
    const idx = Math.abs(hash);

    if (n.includes('wedding') || n.includes('زفاف')) {
        const arNames = ["بدلة الزفاف الملكية البيضاء", "بدلة تكسيدو الزواج الكلاسيكية", "بدلة زفاف كحلي ساتان"];
        const enNames = ["Royal White Wedding Suit", "Classic Groom Tuxedo", "Satin Navy Wedding Suit"];
        const arDescs = [
            "بدلة زفاف ملكية مصنوعة من أرقى أقمشة الكشمير الأبيض بياقة حريرية وتفاصيل مطرزة يدوياً بالكامل.",
            "بدلة تكسيدو سوداء فاخرة مصممة خصيصاً ليوم العمر بحشوة عائمة بالكامل تمنحك الأناقة والراحة المطلقة.",
            "مزيج رائع من الصوف الكحلي الخالص مع لمسات من ساتان الدوق الفاخر على الجيوب والياقة."
        ];
        const enDescs = [
            "A royal wedding suit crafted from the finest white cashmere wool with silk lapels and hand-stitched detailing.",
            "Classic black tuxedo tailored to perfection for the groom, featuring full canvas construction and natural drape.",
            "Elegant blend of navy virgin wool accented with premium duchess satin on the shawl collar and pockets."
        ];
        const prices = ["$3,100", "$2,900", "$3,250"];

        return {
            name: lang === 'ar' ? arNames[idx % arNames.length] : enNames[idx % enNames.length],
            desc: lang === 'ar' ? arDescs[idx % arDescs.length] : enDescs[idx % enDescs.length],
            price: prices[idx % prices.length]
        };
    }

    if (n.includes('casual') || n.includes('كاجوال')) {
        const arNames = ["بليزر صوف ناعم كاجوال", "بدلة كتان غير رسمية خفيفة", "جاكيت سفاري الأناقة اليومية"];
        const enNames = ["Soft Wool Casual Blazer", "Lightweight Unstructured Suit", "Avenue Safari Tailored Jacket"];
        const arDescs = [
            "جاكيت بليزر من الصوف الإيطالي غير المبطن، يمنحك إطلالة جذابة وراحة مثالية طوال اليوم.",
            "بدلة كتان فاخرة خفيفة الوزن ومقاومة للتجعد، ملائمة للاجتماعات النهارية وحفلات الحديقة الصيفية.",
            "جاكيت سفاري بقصة محددة وأحزمة خصر يدوية، مزيج فريد بين الحياكة التقليدية والمظهر العصري الرياضي."
        ];
        const enDescs = [
            "Unstructured Italian wool blazer offering the perfect balance between smart aesthetics and all-day comfort.",
            "Luxury lightweight linen suit tailored for crease resistance, ideal for beach events or smart-casual lunch.",
            "Modern safari jacket featuring patch pockets and adjusters, merging classic utility with bespoke refinement."
        ];
        const prices = ["$1,750", "$1,900", "$1,600"];

        return {
            name: lang === 'ar' ? arNames[idx % arNames.length] : enNames[idx % enNames.length],
            desc: lang === 'ar' ? arDescs[idx % arDescs.length] : enDescs[idx % enDescs.length],
            price: prices[idx % prices.length]
        };
    }

    if (n.includes('luxury') || n.includes('فاخر')) {
        const arNames = ["بدلة صوف فلانيل فحمي فاخرة", "بدلة حرير دمشقي نادرة", "تكسيدو المخمل الأسود الملكي"];
        const enNames = ["Imperial Charcoal Flannel Suit", "Rare Damascus Silk Suit", "Royal Black Velvet Tuxedo"];
        const arDescs = [
            "بدلة من صوف الفلانيل الإيطالي الثقيل، مقاومة للمطر ومثالية لفصول الشتاء الباردة بهيبة ملوكية.",
            "بدلة مصنوعة من خيوط الحرير الدمشقي النادر بنقوش جاكار بارزة وخياطة يدوية استغرقت ١٠٠ ساعة كاملة.",
            "سترة مخملية سوداء غنية الملمس بياقة مدببة من الحرير الإيطالي، تجسد المعنى الحقيقي للفخامة الأرستقراطية."
        ];
        const enDescs = [
            "Tailored from heavy Italian flannel wool, featuring structured shoulders and wind resistance for premium winter style.",
            "Exclusive suit woven with rare Damascus silk jacquard patterns, taking over 100 hours of handcrafted mastery.",
            "Black velvet evening tuxedo jacket with silk Peak lapels, defining absolute aristocratic sophistication."
        ];
        const prices = ["$3,800", "$4,500", "$4,200"];

        return {
            name: lang === 'ar' ? arNames[idx % arNames.length] : enNames[idx % enNames.length],
            desc: lang === 'ar' ? arDescs[idx % arDescs.length] : enDescs[idx % enDescs.length],
            price: prices[idx % prices.length]
        };
    }

    // Default Fallbacks (Classic/Collection style)
    const arNames = ["بدلة العراقي الكلاسيكية", "بدلة التويد الرمادية", "بدلة صوف ميرينو الفحمية"];
    const enNames = ["Al-Iraqi Heritage Suit", "Grey Tweed Premium Suit", "Charcoal Merino Wool Suit"];
    const arDescs = [
        "بدلة كلاسيكية متناسقة للغاية مصنوعة يدوياً من خامات فاخرة وخيوط حريرية متينة تلائم حضورك المتميز.",
        "بدلة تويد بنقشة متعرجة أنيقة تعيد إحياء الأناقة الكلاسيكية البريطانية بلمسات إيطالية ناعمة.",
        "بدلة صوف ميرينو ناعم بلون فحمي وتفاصيل خياطة ياقة كلاسيكية مشدودة بعناية فائقة لقصة مثالية."
    ];
    const enDescs = [
        "Classic bespoke suit handcrafted with gold-standard thread quality and full canvas drape structure.",
        "Premium grey tweed herringbone suit reviving British heritage styling with Italian soft shoulder drape.",
        "Superfine merino wool business suit in charcoal grey, hand-sewn buttonholes and custom horn buttons."
    ];
    const prices = ["$2,400", "$2,650", "$2,800"];

    return {
        name: lang === 'ar' ? arNames[idx % arNames.length] : enNames[idx % enNames.length],
        desc: lang === 'ar' ? arDescs[idx % arDescs.length] : enDescs[idx % enDescs.length],
        price: prices[idx % prices.length]
    };
};

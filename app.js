/**
 * ॐ हरि Blogging (Hari Om Blogging) — Main Frontend & Admin Application (app.js)
 * - Connects to Netlify Serverless NeonDB API (/api/bootstrap, /api/posts, /api/quick-reads, /api/config, /api/contact, /api/audit-logs, /api/admin/login)
 * - Authenticates Admin strictly against Netlify ADMIN_USERNAME and ADMIN_PASSWORD environment variables
 * - Persists all blog posts, quick-reads, festive banners, themes, language, contact info, and audit logs in NeonDB
 */

function hmbResolveImg(path) {
  if (typeof HMB_HD_ASSET_MAP !== 'undefined' && HMB_HD_ASSET_MAP[path]) {
    return HMB_HD_ASSET_MAP[path];
  }
  return path;
}

// 1. PERSISTENT CACHE KEYS (Prefix: hmb_)
const HMB_STORAGE_KEYS = {
  CONFIG: 'hmb_site_config_v2',
  POSTS: 'hmb_blog_posts_v2',
  QUICK_READS: 'hmb_quick_reads_v2',
  CONTACT: 'hmb_contact_details_v2',
  AUDIT_LOGS: 'hmb_admin_audit_logs_v2',
  BOOKMARKS: 'hmb_reader_bookmarks_v2',
  ADMIN_AUTH: 'hmb_admin_credentials_v2'
};

function hmbLoadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function hmbSaveLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

// 2. SEED DATA & MULTILINGUAL DICTIONARIES
const HMB_SEED_BUNDLE = {"festivalPresets": {"sattvic_default": {"key": "sattvic_default", "name": "Sattvic Swarna (Default)", "icon": "🕉️", "theme": "sattvic_gold", "badge": "🕉️ सनातन वाङ्मय • Nitya Dharma Satsang", "headline": "असतो मा सद्गमय — Contemplate Eternal Vedic & Upanishadic Wisdom", "subtext": "Immerse yourself in long-form discourses on Vedanta, Puranic fables, sacred temple architecture, and Sattvic living.", "ctaLabel": "Explore Sacred Feed", "ctaCategory": "all", "mantraSa": "ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥", "mantraMeaning": "May all sentient beings be at peace; may no one suffer from illness; may all see what is auspicious; may no one suffer."}, "diwali": {"key": "diwali", "name": "Diwali (Deepavali Parva)", "icon": "🪔", "theme": "diwali", "badge": "🪔 शुभ दीपावली • Festival of Sacred Diyas", "headline": "तमसो मा ज्योतिर्गमय — May the Lamps of Knowledge Illumine Every Heart", "subtext": "Celebrate Sri Rama’s auspicious return to Ayodhya and Goddess Mahalakshmi’s grace with special Deepavali reflections.", "ctaLabel": "Read Deepavali Discourses", "ctaCategory": "Dharmic Living & Festivals", "mantraSa": "ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद श्रीं ह्रीं श्रीं ॐ महालक्ष्म्यै नमः॥", "mantraMeaning": "Salutations to Goddess Mahalakshmi, who abides in the sacred lotus and bestows inner and outer radiance."}, "durga_puja": {"key": "durga_puja", "name": "Durga Puja (Sharadotsav)", "icon": "🔱", "theme": "durga_puja", "badge": "🔱 शुभ शारदीय दुर्गा पूजा • Jai Maa Jagadamba", "headline": "या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता — Reverence to the Divine Mother", "subtext": "Explore Devi Mahatmyam commentaries, Navadurga symbolism, and the triumph of Dharma over Mahishasura.", "ctaLabel": "Read Shakti Discourses", "ctaCategory": "Itihasa & Puranas", "mantraSa": "सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥", "mantraMeaning": "O Narayani, auspiciousness of all that is auspicious, fulfiller of all noble aspirations, refuge of the তিন worlds, salutations to Thee."}, "holi": {"key": "holi", "name": "Holi (Vasantotsava)", "icon": "🌸", "theme": "holi", "badge": "🌸 शुभ होली एवं वसन्तोत्सव • Festival of Sacred Colors & Bhakti", "headline": "रंगोत्सव एवं भक्त प्रह्लाद स्मरण — Celebrating Devotion, Spring & Harmony", "subtext": "Discover the Puranic legend of Bhakta Prahlada, Vrindavan Raas-Leela philosophy, and herbal Ayurvedic Vasant traditions.", "ctaLabel": "Explore Bhakti & Festival Posts", "ctaCategory": "Dharmic Living & Festivals", "mantraSa": "हरेर्नाम हरेर्नाम हरेर्नामैव केवलम्। कलौ नास्त्येव नास्त्येव नास्त्येव गतिरन्यथा॥", "mantraMeaning": "In this age of Kali, chanting the sacred name of Hari is the supreme path to joyful liberation and inner purity."}, "ganesh_chaturthi": {"key": "ganesh_chaturthi", "name": "Ganesh Chaturthi (Vinayaka Utsav)", "icon": "🐘", "theme": "ganesh_chaturthi", "badge": "🌺 श्री गणेश चतुर्थी • गणपति बप्पा मोरया", "headline": "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ — Invoking the Lord of Wisdom & New Beginnings", "subtext": "Read our special series on the Ganapati Atharvashirsha, Mudgala Purana fables, and the philosophical symbolism of Lord Ganesha.", "ctaLabel": "Read Ganapati Granthas", "ctaCategory": "Sanskrit & Mantras", "mantraSa": "ॐ एकदन्ताय विद्महे वक्रतुण्डाय धीमहि। तन्नो दन्ती प्रचोदयात्॥", "mantraMeaning": "We meditate upon the Single-Tusked Lord of Wisdom; may the Curved-Trunked Vinayaka illuminate our intellect."}, "chhath_puja": {"key": "chhath_puja", "name": "Chhath Puja (Surya Shashti)", "icon": "☀️", "theme": "chhath_puja", "badge": "☀️ लोकआस्था का महापर्व छठ पूजा • जय छठी मैया एवं सूर्य देव", "headline": "ॐ घृणिः सूर्याय नमः — Offering Sacred Arghya to Pratyaksha Devata Surya", "subtext": "Contemplate the Vedic roots of Surya Upasana, Rigvedic Saura Suktas, ecological purity, and the discipline of Chhath Vrata.", "ctaLabel": "Read Surya & Vedic Posts", "ctaCategory": "Dharmic Living & Festivals", "mantraSa": "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥", "mantraMeaning": "We meditate on the adorable effulgence of the Divine Sun Savitur; may That awaken and inspire our highest intelligence."}, "bhai_dooj": {"key": "bhai_dooj", "name": "Bhai Dooj (Yama Dwitiya)", "icon": "🏵️", "theme": "bhai_dooj", "badge": "🏵️ शुभ भाई दूज एवं यम द्वितीया • Sacred Bond of Dharma & Protection", "headline": "भ्रातृ-भगिनी स्नेह पर्व — The Puranic Dialogue of Yamuna and Yamaraja", "subtext": "Explore the sacred Grihastha traditions of Bhai Dooj, family dharma in the Smritis, and auspicious festive blessings.", "ctaLabel": "Read Grihastha Dharma Posts", "ctaCategory": "Dharmic Living & Festivals", "mantraSa": "भ्रातृस्नेहः सदा रक्षेत् धर्ममार्गे प्रतिष्ठितः। आयुष्यं वर्धतां नित्यं मङ्गलं भवतु सर्वदा॥", "mantraMeaning": "May the sacred bond of sibling affection grounded in Dharma ever protect, nourish longevity, and bring auspiciousness."}}, "uiTranslations": {"en": {"nav_feed": "Vangmaya Feed", "nav_quick": "Nitya Subhashita", "nav_murals": "Sacred Murals", "nav_saved": "My Granthagar", "nav_contact": "Samparka", "btn_naada": "Naada", "btn_sevak": "Sevak Portal", "hero_pill": "Sanatana Dharma Vangmaya • Eternal Wisdom Sanctuary", "hero_desc": "Contemplate timeless discourses on Upanishadic philosophy, Puranic fables, sacred temple architecture, Sanskrit mantras, and Sattvic living — crafted for seekers of truth and inner harmony.", "daily_mantra_label": "🕉️ Nitya Prarthana • Daily Vedic Invocation", "hero_cta_explore": "Explore Sacred Feed", "hero_cta_featured": "Read Featured Grantha", "hero_cta_quick": "90-Sec Subhashitas", "feed_eyebrow": "📜 Sarvajanika Dharma Vangmaya • Common Reader Feed", "feed_heading": "Sacred Discourses & Long-Form Granthas", "btn_reset_filters": "Reset Filters", "sort_latest": "⏳ Sort: Latest Published", "sort_popular": "🔥 Sort: Most Contemplated", "sort_appreciated": "🙏 Sort: Most Revered (Vandanam)", "sort_longest": "📚 Sort: Longest Grantha First", "sort_shortest": "⚡ Sort: Shortest Read First", "sort_oldest": "🏛️ Sort: Earliest Classics", "sort_alpha": "🔤 Sort: Alphabetical (A–Z)", "dur_all": "⏱️ All Reading Lengths", "dur_short": "🌱 Brief (< 8 mins)", "dur_medium": "🪷 Medium (8–14 mins)", "dur_long": "📜 Long Grantha (15+ mins)", "filter_featured_only": "Featured Only", "filter_saved_only": "Saved Bookmarks", "quick_eyebrow": "✨ Nitya Subhashita & Sutra Snapshots", "quick_heading": "Quick Dharmic Reads, Fables & Subhashitas", "quick_desc": "Concise 60–90 second reflections drawn from the Upanishads, Panchatantra, Hitopadesha, and Bhakti Sutras.", "mural_eyebrow": "🏛️ Chitra & Shilpa Darshan", "mural_heading": "Enchanting Dharmic Murals, Deities, Apsaras & Sacred Spaces", "mural_desc": "High-definition visual meditations celebrating classical temple reliefs, Samudra Manthan cosmology, Himalayan sadhana ashrams, and sacred geometry.", "btn_back_feed": "Back to Feed", "footer_mission": "Dedicated to preserving and sharing the timeless wisdom of the Vedas, Upanishads, Puranas, Agamas, and Sattvic living in a serene, distraction-free contemplative space.", "footer_prasthana": "Vangmaya Prasthanas", "footer_samparka": "Samparka • Sanctuary Contact", "search_placeholder": "Search by title, Sanskrit shloka, deity, sage, or topic...", "read_discourse_btn": "Read Full Grantha →", "min_read_suffix": "min read", "words_suffix": "words", "all_categories": "All Discourses"}, "hi": {"nav_feed": "वाङ्मय प्रवाह", "nav_quick": "नित्य सुभाषित", "nav_murals": "दिव्य भित्तिचित्र", "nav_saved": "मेरा ग्रन्थागार", "nav_contact": "सम्पर्क", "btn_naada": "नाद ध्वनि", "btn_sevak": "सेवक द्वार", "hero_pill": "सनातन धर्म वाङ्मय • शाश्वत ज्ञान एवं अध्यात्म पीठम्", "hero_desc": "उपनिषद् दर्शन, पौराणिक आख्यान, प्राचीन मन्दिर स्थापत्य, संस्कृत मन्त्र एवं सात्त्विक जीवनचर्या पर विस्तृत और प्रामाणिक धर्म-लेखों का मनन करें।", "daily_mantra_label": "🕉️ नित्य प्रार्थना • दैनिक वैदिक मङ्गलाचरण", "hero_cta_explore": "धर्म-लेख प्रवाह देखें", "hero_cta_featured": "प्रमुख ग्रन्थ पढ़ें", "hero_cta_quick": "९०-सेकंड सुभाषित", "feed_eyebrow": "📜 सार्वजनिक धर्म वाङ्मय • पाठक प्रवाह", "feed_heading": "गहन धार्मिक विमर्श एवं दीर्घ ग्रन्थ-लेख", "btn_reset_filters": "फ़िल्टर रीसेट करें", "sort_latest": "⏳ क्रम: नवीनतम प्रकाशित", "sort_popular": "🔥 क्रम: सर्वाधिक पठित", "sort_appreciated": "🙏 क्रम: सर्वाधिक वन्दित", "sort_longest": "📚 क्रम: सबसे विस्तृत ग्रन्थ", "sort_shortest": "⚡ क्रम: संक्षिप्त लेख प्रथम", "sort_oldest": "🏛️ क्रम: प्राचीनतम लेख", "sort_alpha": "🔤 क्रम: वर्णानुक्रम (क–ज्ञ)", "dur_all": "⏱️ सभी पठन अवधियाँ", "dur_short": "🌱 संक्षिप्त (< ८ मिनट)", "dur_medium": "🪷 मध्यम (८–१४ मिनट)", "dur_long": "📜 विस्तृत ग्रन्थ (१५+ मिनट)", "filter_featured_only": "केवल प्रमुख लेख", "filter_saved_only": "सहेजे गए लेख", "quick_eyebrow": "✨ नित्य सुभाषित एवं सूत्र झलकियाँ", "quick_heading": "त्वरित धार्मिक बोध, कथाएँ एवं सुभाषित रत्न", "quick_desc": "उपनिषद्, पञ्चतन्त्र, हितोपदेश और भक्ति सूत्रों से संकलित ६०–९० सेकंड के प्रेरणादायी विचार।", "mural_eyebrow": "🏛️ चित्र एवं शिल्प दर्शन", "mural_heading": "मनोहारी धार्मिक भित्तिचित्र, देवता, अप्सराएँ एवं तपोवन", "mural_desc": "शास्त्रीय मन्दिर शिल्प, समुद्र मन्थन अमृत कलश, हिमालय के आश्रम एवं श्री यन्त्र का उच्च-स्तरीय (HD) दृश्य दर्शन।", "btn_back_feed": "वापस प्रवाह पर जाएँ", "footer_mission": "वेद, उपनिषद्, पुराण, आगम और सात्त्विक जीवन के शाश्वत ज्ञान को शांत एवं निर्मल वातावरण में प्रस्तुत करने हेतु समर्पित।", "footer_prasthana": "वाङ्मय प्रस्थान", "footer_samparka": "सम्पर्क • आश्रम विवरण", "search_placeholder": "शीर्षक, संस्कृत श्लोक, देवता, ऋषि या विषय द्वारा खोजें...", "read_discourse_btn": "सम्पूर्ण ग्रन्थ पढ़ें →", "min_read_suffix": "मिनट पठन", "words_suffix": "शब्द", "all_categories": "सभी धर्म-लेख"}, "bn": {"nav_feed": "বাঙ্ময় প্রবাহ", "nav_quick": "নিত্য সুভাষিত", "nav_murals": "দিব্য ম্যুরাল ও শিল্প", "nav_saved": "আমার গ্রন্থাগার", "nav_contact": "সম্পর্ক", "btn_naada": "নাদ ধ্বনি", "btn_sevak": "সেবক পোর্টাল", "hero_pill": "সনাতন ধর্ম বাঙ্ময় • শাশ্বত জ্ঞান ও আধ্যাত্মিক তীর্থ", "hero_desc": "উপনিষদ দর্শন, পৌরাণিক উপাখ্যান, প্রাচীন মন্দির স্থাপত্য, সংস্কৃত মন্ত্র এবং সাত্ত্বিক জীবনচর্যার ওপর সুগভীর প্রবন্ধ পাঠ ও মনন করুন।", "daily_mantra_label": "🕉️ নিত্য প্রার্থনা • দৈনিক বৈদিক মঙ্গলাচরণ", "hero_cta_explore": "প্রবন্ধ প্রবাহ দেখুন", "hero_cta_featured": "প্রধান গ্রন্থ পাঠ করুন", "hero_cta_quick": "৯০-সেকেন্ড সুভাষিত", "feed_eyebrow": "📜 সর্বজনীন ধর্ম বাঙ্ময় • পাঠক প্রবাহ", "feed_heading": "শাশ্বত ধর্মীয় প্রবন্ধ ও দীর্ঘ গ্রন্থসমূহ", "btn_reset_filters": "ফিল্টার রিসেট করুন", "sort_latest": "⏳ ক্রম: নবীনতম প্রকাশিত", "sort_popular": "🔥 ক্রম: সর্বাধিক পঠিত", "sort_appreciated": "🙏 ক্রম: সর্বাধিক বন্দিত", "sort_longest": "📚 ক্রম: দীর্ঘতম গ্রন্থ প্রথম", "sort_shortest": "⚡ ক্রম: সংক্ষিপ্ত পাঠ প্রথম", "sort_oldest": "🏛️ ক্রম: প্রাচীনতম প্রবন্ধ", "sort_alpha": "🔤 ক্রম: বর্ণানুক্রমিক", "dur_all": "⏱️ সকল পঠন সময়", "dur_short": "🌱 সংক্ষিপ্ত (< ৮ মিনিট)", "dur_medium": "🪷 মধ্যম (৮–১৪ মিনিট)", "dur_long": "📜 দীর্ঘ গ্রন্থ (১৫+ মিনিট)", "filter_featured_only": "কেবল নির্বাচিত প্রবন্ধ", "filter_saved_only": "সংরক্ষিত প্রবন্ধ", "quick_eyebrow": "✨ নিত্য সুভাষিত ও সূত্র ঝলক", "quick_heading": "দ্রুত ধর্মীয় পাঠ, উপাখ্যান ও সুভাষিত রত্ন", "quick_desc": "উপনিষদ, পঞ্চতন্ত্র, হিতোপদেশ এবং ভক্তি সূত্র থেকে সংকলিত ৬০–৯০ সেকেন্ডের অমৃত বাণী।", "mural_eyebrow": "🏛️ চিত্র ও শিল্প দর্শন", "mural_heading": "মনোমুগ্ধকর ধার্মিক ম্যুরাল, দেবতা, অপ্সরা ও তপোবন", "mural_desc": "ধ্রুপদী মন্দির ভাস্কর্য, সমুদ্র মন্থন অমৃত কলশ, হিমালয় আশ্রম এবং শ্রীযন্ত্রের এইচডি (HD) দৃশ্য দর্শন।", "btn_back_feed": "প্রবাহে ফিরে যান", "footer_mission": "বেদ, উপনিষদ, পুরাণ, আগম এবং সাত্ত্বিক জীবনাদর্শের শাশ্বত প্রজ্ঞা শান্ত ও পবিত্র পরিবেশে পাঠকদের কাছে পৌঁছে দিতে নিবেদিত।", "footer_prasthana": "বাঙ্ময় প্রস্থান", "footer_samparka": "সম্পর্ক • আশ্রম ঠিকানা", "search_placeholder": "শিরোনাম, সংস্কৃত শ্লোক, দেবতা, ঋষি বা বিষয় দিয়ে খুঁজুন...", "read_discourse_btn": "সম্পূর্ণ প্রবন্ধ পড়ুন →", "min_read_suffix": "মিনিট পাঠ", "words_suffix": "শব্দ", "all_categories": "সকল প্রবন্ধ"}, "sa": {"nav_feed": "वाङ्मयप्रवाहः", "nav_quick": "नित्यसुभाषितम्", "nav_murals": "दिव्यशिल्पदर्शनम्", "nav_saved": "मम ग्रन्थागारः", "nav_contact": "सम्पर्कः", "btn_naada": "नादध्वनिः", "btn_sevak": "सेवकद्वारम्", "hero_pill": "सनातनधर्मवाङ्मयम् • शाश्वतज्ञानपीठम्", "hero_desc": "उपनिषद्दर्शनम्, पुराणकथाः, देवालयस्थापत्यम्, संस्कृतमन्त्राः, सात्त्विकजीवनचर्या च — एतेषां गभीराणां धर्मनिबन्धानां स्वाध्यायं कुरुत।", "daily_mantra_label": "🕉️ नित्यप्रार्थना • वैदिकमङ्गलाचरणम्", "hero_cta_explore": "वाङ्मयप्रवाहं पश्यत", "hero_cta_featured": "प्रमुखग्रन्थं पठत", "hero_cta_quick": "सुभाषितरत्नानि", "feed_eyebrow": "📜 सार्वजनिकधर्मवाङ्मयम् • स्वाध्यायप्रवाहः", "feed_heading": "शाश्वतधर्मविमर्शाः दीर्घग्रन्थाश्च", "btn_reset_filters": "पुनःस्थापनम्", "sort_latest": "⏳ क्रमः — नूतनतमाः निबन्धाः", "sort_popular": "🔥 क्रमः — बहुपठिताः निबन्धाः", "sort_appreciated": "🙏 क्रमः — बहुवन्दिताः निबन्धाः", "sort_longest": "📚 क्रमः — दीर्घतमाः ग्रन्थाः", "sort_shortest": "⚡ क्रमः — संक्षिप्ताः निबन्धाः", "sort_oldest": "🏛️ क्रमः — प्राचीनतमाः निबन्धाः", "sort_alpha": "🔤 क्रमः — वर्णानुक्रमः", "dur_all": "⏱️ सर्वे पठनकालाः", "dur_short": "🌱 संक्षिप्तः (< ८ निमेषाः)", "dur_medium": "🪷 मध्यमः (८–१४ निमेषाः)", "dur_long": "📜 दीर्घग्रन्थः (१५+ निमेषाः)", "filter_featured_only": "प्रमुखग्रन्थाः एव", "filter_saved_only": "रक्षितग्रन्थाः", "quick_eyebrow": "✨ नित्यसुभाषितानि सूत्ररत्नानि च", "quick_heading": "त्वरितधर्मबोधः, आख्यानानि सुभाषितानि च", "quick_desc": "उपनिषद्-पञ्चतन्त्र-हितोपदेश-भक्तिसूत्रादिभ्यः सङ्गृहीतानि अमृतमयानि सुभाषितानि।", "mural_eyebrow": "🏛️ चित्रशिल्पदर्शनम्", "mural_heading": "मनोहराणि धर्मचित्राणि, देवताः, अप्सरसः तपोवनानि च", "mural_desc": "प्राचीनदेवालयशिल्पानाम्, समुद्रमन्थनकलशस्य, हिमालय-आश्रमस्य च दिव्यं दर्शनम्।", "btn_back_feed": "प्रवाहं प्रति गच्छत", "footer_mission": "वेदोपनिषत्पुराणागमानां शाश्वतज्ञानस्य संरक्षणाय प्रसारणाय च समर्पितं पावनं पीठम्।", "footer_prasthana": "वाङ्मयप्रस्थानानि", "footer_samparka": "सम्पर्कः • आश्रमविवरणम्", "search_placeholder": "शीर्षकेण, श्लोकेन, देवतानाम्ना वा अन्विष्यताम्...", "read_discourse_btn": "सम्पूर्णं ग्रन्थं पठत →", "min_read_suffix": "निमेषपठनम्", "words_suffix": "पदानि", "all_categories": "सर्वे निबन्धाः"}}, "categoryTranslations": {"Vedanta & Upanishads": {"en": "Vedanta & Upanishads", "hi": "वेदान्त एवं उपनिषद्", "bn": "বেদান্ত ও উপনিষদ", "sa": "वेदान्तोपनिषदः"}, "Itihasa & Puranas": {"en": "Itihasa & Puranas", "hi": "इतिहास एवं पुराण कथा", "bn": "ইতিহাস ও পুরাণ কথা", "sa": "इतिहासपुराणानि"}, "Temple Architecture": {"en": "Temple Architecture", "hi": "मन्दिर स्थापत्य एवं शिल्प", "bn": "মন্দির স্থাপত্য ও শিল্প", "sa": "देवालयस्थापत्यम्"}, "Yoga & Ayurveda": {"en": "Yoga & Ayurveda", "hi": "योग, प्राणायाम एवं आयुर्वेद", "bn": "যোগ, প্রাণায়াম ও আয়ুর্বেদ", "sa": "योगायुर्वेदौ"}, "Sanskrit & Mantras": {"en": "Sanskrit & Mantras", "hi": "संस्कृत मन्त्र एवं छन्द", "bn": "সংস্কৃত মন্ত্র ও ছন্দ", "sa": "संस्कृतमन्त्रछन्दांसि"}, "Dharmic Living & Festivals": {"en": "Dharmic Living & Festivals", "hi": "धार्मिक जीवन एवं पर्व-त्योहार", "bn": "ধার্মিক জীবন ও উৎসব", "sa": "धर्मजीवनं पर्वाणि च"}}, "initialPosts": [{"hmb_post_id": 101, "hmb_post_slug": "mahavakyas-of-advaita-vedanta-and-inner-witness", "hmb_post_title": "The Four Mahavakyas of the Upanishads: Awakening the Inner Witness (Sakshi Chaitanya)", "hmb_post_subtitle": "A comprehensive contemplation on Prajnanam Brahma, Aham Brahmasmi, Tat Tvam Asi, and Ayam Atma Brahma across the four Vedas.", "hmb_post_category": "Vedanta & Upanishads", "hmb_post_tags": ["Upanishads", "Advaita Vedanta", "Mahavakya", "Atman", "Adi Shankaracharya"], "hmb_post_author_name": "Acharya Vishwanath Shastri", "hmb_post_author_role": "Vedanta & Upanishadic Scholar, Kashi", "hmb_post_cover_image": "assets/images/vedanta-ashram.jpg", "hmb_post_shloka_sanskrit": "प्रज्ञानं ब्रह्म । अहं ब्रह्मास्मि । तत्त्वमसि । अयमात्मा ब्रह्म ॥", "hmb_post_shloka_transliteration": "Prajñānaṁ Brahma | Ahaṁ Brahmāsmi | Tat Tvam Asi | Ayam Ātmā Brahma ||", "hmb_post_shloka_meaning": "Pure Consciousness is Brahman (Rigveda); I am Brahman (Yajurveda); That Thou Art (Samaveda); This Self is Brahman (Atharvaveda).", "hmb_post_excerpt": "Explore how the four sovereign declarations of the Upanishads dissolve the veil of duality and reveal the luminous, unchanging witness consciousness abiding within every living being.", "hmb_post_word_count": 1840, "hmb_post_char_count": 11420, "hmb_post_reading_minutes": 16, "hmb_post_views_count": 1420, "hmb_post_likes_count": 324, "hmb_post_is_featured": true, "hmb_post_published_date": "2026-10-28", "hmb_post_content_html": "\n          <h2>१. उपक्रमणिका • The Himalayan Dawn of Self-Inquiry (Atma-Vichara)</h2>\n          <p>In the quietude of Brahma Muhurta, when the first golden rays touch the snow-clad peaks of Devbhumi and illuminate the sacred palm-leaf manuscripts of the Rishis, a single perennial question echoes across millennia: <em>\"Kas tvam? Ko'ham?\"</em> — Who art thou, and what is the substratum of this experiencing consciousness? Unlike speculative systems that treat philosophy merely as intellectual gymnastics, the <strong>Upanishads</strong> (literally <em>sitting down near</em> the Guru in reverent receptivity) offer direct experiential realization — <strong>Aparoksha Anubhuti</strong>.</p>\n          <p>Across the vast expanse of the four Vedas — Rig, Yajur, Sama, and Atharva — the ancient seers distilled the pinnacle of non-dual wisdom into four succinct, sovereign aphorisms known as the <strong>Chatur-Mahavakyas</strong> (The Four Great Contemplative Declarations). Adi Shankaracharya later established four cardinal Peethams across Bharatvarsha — Sringeri, Dwaraka, Govardhana (Puri), and Jyotirmath — dedicating each sanctuary to one of these four Mahavakyas.</p>\n\n          <blockquote class=\"hmb-shloka-box\">\n            <strong>ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः ।<br/>अनेन वेद्यं सच्छास्त्रमिति वेदान्तडिण्डिमः ॥</strong><br/>\n            <em>\"Brahman alone is the unchanging Reality; the phenomenal world of names and forms is an apparent projection; the individual Self (Jiva) is none other than Brahman. This is theclarion proclamation of the Vedanta Shastras.\"</em>\n          </blockquote>\n\n          <h2>२. प्रज्ञानं ब्रह्म • Prajnanam Brahma (Aitareya Upanishad, Rigveda)</h2>\n          <p>The first Mahavakya, <strong>Prajnanam Brahma</strong> (प्रज्ञानं ब्रह्म), appears in the third chapter of the <em>Aitareya Upanishad</em> belonging to the Rigveda. Here, the sage Aitareya investigates the nature of the inner controller behind the senses: by whom do we see form, hear nada, inhale fragrance, articulate speech, and discern the sweet from the bitter?</p>\n          <p>The Upanishad points out that the mind (Manas), intellect (Buddhi), memory (Smriti), and sensory faculties are all instruments illuminated by a deeper, self-effulgent awareness called <strong>Prajnanam</strong>. Just as a clay lamp illuminates a temple sanctum without needing another lamp to reveal its own flame, <em>Prajnanam</em> is the unconditioned consciousness that renders every thought and perception possible. Therefore, this first Mahavakya serves as the <strong>Lakshana Vakya</strong> — the definitional statement establishing the essential nature of Ultimate Reality as pure, self-luminous Consciousness.</p>\n\n          <h2>३. तत्त्वमसि • Tat Tvam Asi (Chandogya Upanishad, Samaveda)</h2>\n          <p>In the sixth Prapathaka of the <em>Chandogya Upanishad</em>, young Svetaketu returns home after twelve years of formal Vedic study, brimming with scholarly pride. His father, Rishi Uddalaka Aruni, gently asks him: <em>\"O Svetaketu, hast thou inquired into that instruction (Adesha) by hearing which the unheard becomes heard, the unthought becomes thought, and the unknown becomes known?\"</em></p>\n          <p>Through nine unforgettable illustrations — clay and pots, gold and ornaments, rivers merging into the ocean, and the subtle essence within the microscopic seed of a mighty Nyagrodha (banyan) tree — Uddalaka Aruni reveals the <strong>Upadesha Vakya</strong> (Instructional Declaration): <strong>Tat Tvam Asi</strong> — <em>\"That Subtle Essence which is the root of the entire cosmos, That is Truth, That is the Self, and That Thou Art, O Svetaketu!\"</em></p>\n          <ul>\n            <li><strong>Vachyartha (Literal Meaning):</strong> On the surface, <em>Tat</em> (the omniscient Cosmic Lord, Ishvara) and <em>Tvam</em> (the finite individual Jiva endowed with limited knowledge) appear distinct because of their limiting adjuncts (Upadhis) — Maya and Avidya.</li>\n            <li><strong>Lakshyartha (Implied Non-Dual Meaning via Jahad-Ajahad Lakshana):</strong> When we set aside the contradictory adjuncts of cosmic omniscience and individual finitude, what remains in both is pure, indivisible Sat-Chit-Ananda (Existence-Consciousness-Bliss).</li>\n          </ul>\n\n          <h2>४. अयमात्मा ब्रह्म • Ayam Atma Brahma (Mandukya Upanishad, Atharvaveda)</h2>\n          <p>The <em>Mandukya Upanishad</em> — lauded in the Muktikopanishad as sufficient by itself for liberation — analyzes the totality of human experience through the sacred syllable <strong>Om (प्रणवः)</strong> and the four states of consciousness (Chatushpada):</p>\n          <ol>\n            <li><strong>Jagrat (Waking State — Vaishvanara / \"A\"-kara):</strong> Consciousness turned outward through nineteen channels, experiencing the gross physical cosmos.</li>\n            <li><strong>Svapna (Dream State — Taijasa / \"U\"-kara):</strong> Consciousness turned inward, projecting a luminous subtle world woven from mental impressions (Vasanas).</li>\n            <li><strong>Sushupti (Deep Dreamless Sleep — Prajna / \"M\"-kara):</strong> Unified, undifferentiated consciousness where all desires and mental modifications subside into causal peace.</li>\n            <li><strong>Turiya (The Fourth — The Audible Silence following Om):</strong> Not a fourth chronological state alongside the other three, but the substratum (Adhishthana) witnessing waking, dream, and deep sleep alike.</li>\n          </ol>\n\n          <h2>५. अहं ब्रह्मास्मि • Aham Brahmasmi (Brihadaranyaka Upanishad, Yajurveda)</h2>\n          <p>When the seeker assimilates the definition (<em>Prajnanam Brahma</em>), receives the Guru's compassionate pointer (<em>Tat Tvam Asi</em>), and verifies through fourfold inquiry that the inner witness is universal (<em>Ayam Atma Brahma</em>), there blossoms the culminating <strong>Anubhava Vakya</strong> (Declaration of Direct Realization): <strong>Aham Brahmasmi</strong>.</p>\n          <p>Far from egoic inflation (Ahamkara), <em>Aham Brahmasmi</em> is the complete dissolution of the small, separate ego into boundless compassion and equanimity. One who beholds the same Atman shining inside the scholar, the cow, the elephant, the dog, and the outcaste (<em>Panditah समदर्शिनः</em> — Bhagavad Gita 5.18) walks the earth as a living blessing — serene in adversity, humble in prosperity, and anchored in eternal Dharma.</p>\n        ", "hmb_post_translations_json": {"hi": {"title": "उपनिषदों के चार महावाक्य: साक्षी चैतन्य और आत्म-साक्षात्कार का जागरण", "subtitle": "प्रज्ञानं ब्रह्म, अहं ब्रह्मास्मि, तत्त्वमसि और अयमात्मा ब्रह्म — चारों वेदों के सर्वोच्च अद्वैत उद्घोषों का तात्त्विक विवेचन।", "excerpt": "जानिए किस प्रकार चारों वेदों के चार महावाक्य द्वैत के आवरण को हटाकर प्रत्येक प्राणी के भीतर प्रकाशित होने वाले नित्य, शुद्ध और अद्वैत साक्षी चैतन्य का बोध कराते हैं।", "content_html": "\n              <h2>१. उपक्रमणिका • आत्म-विचार का हिमालयी अरुणोदय</h2>\n              <p>ब्रह्ममुहूर्त की पावन निस्तब्धता में, जब सूर्य की प्रथम स्वर्णिम किरणें हिमालय के शिखरों और ऋषियों के ताड़पत्र ग्रन्थों को आलोकित करती हैं, तब सहस्राब्दियों से गूँजता एक ही शाश्वत प्रश्न साधक के हृदय में उदित होता है— <em>\"कोऽहम्? कस्त्वम्?\"</em> — मैं कौन हूँ और इस समस्त अनुभव जगत का मूल अधिष्ठान क्या है? उपनिषद् केवल बौद्धिक तर्क-वितर्क नहीं हैं, अपितु गुरु के समीप श्रद्धापूर्वक बैठकर प्राप्त किया जाने वाला <strong>अपरोक्ष अनुभूति</strong> का विज्ञान हैं।</p>\n              <blockquote class=\"hmb-shloka-box\">\n                <strong>ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः ।<br/>अनेन वेद्यं सच्छास्त्रमिति वेदान्तडिण्डिमः ॥</strong><br/>\n                <em>\"ब्रह्म ही एकमात्र अबाधित सत्य है, नाम-रूपात्मक जगत परिवर्तनशील प्रतीति है, और जीव वास्तव में ब्रह्म से अभिन्न है—यही वेदान्त शास्त्रों की उद्घोषणा है।\"</em>\n              </blockquote>\n              <h2>२. प्रज्ञानं ब्रह्म (ऐतरेय उपनिषद् — ऋग्वेद)</h2>\n              <p>ऋग्वेद के ऐतरेय उपनिषद् में प्रथम महावाक्य <strong>प्रज्ञानं ब्रह्म</strong> आता है। जिस प्रकार दीपक को स्वयं को प्रकाशित करने के लिए किसी अन्य दीपक की आवश्यकता नहीं होती, उसी प्रकार मन, बुद्धि और इन्द्रियों को प्रकाशित करने वाला शुद्ध बोध-स्वरूप चैतन्य ही 'प्रज्ञान' है और वही परब्रह्म का लक्षण है।</p>\n              <h2>३. तत्त्वमसि (छान्दोग्य उपनिषद् — सामवेद)</h2>\n              <p>महर्षि उद्दालक आरुणि अपने पुत्र श्वेतकेतु को विशाल वटवृक्ष के सूक्ष्म बीज और लवण-जल के दृष्टान्तों से उपदेश देते हैं— <strong>तत्त्वमसि</strong> (हे श्वेतकेतु! वह सूक्ष्म सत् तत्त्व, जो समस्त ब्रह्माण्ड का मूल कारण है, वही आत्मा है और वही तू है)।</p>\n              <h2>४. अयमात्मा ब्रह्म (माण्डूक्य उपनिषद् — अथर्ववेद) एवं ५. अहं ब्रह्मास्मि (बृहदारण्यक उपनिषद् — यजुर्वेद)</h2>\n              <p>जाग्रत, स्वप्न और सुषुप्ति—इन तीनों अवस्थाओं का साक्षी चतुर्थ 'तुरीय' आत्मा ही ब्रह्म है (<em>अयमात्मा ब्रह्म</em>)। जब साधक श्रवण, मनन और निदिध्यासन के माध्यम से अहंकार की संकीर्ण सीमाओं को पार कर लेता है, तब उसके हृदय में <strong>अहं ब्रह्मास्मि</strong> की समदर्शी और करुणामयी अनुभूति जागृत होती है।</p>\n            "}, "bn": {"title": "উপনিষদের চার মহাবাক্য: সাক্ষী চৈতন্য ও আত্ম-সাক্ষাৎকারের জাগরণ", "subtitle": "প্রজ্ঞানং ব্রহ্ম, অহং ব্রহ্মাস্মি, তত্ত্বমসি এবং অয়মাত্মা ব্রহ্ম — চার বেদের সর্বোচ্চ অদ্বৈত বাণীর দার্শনিক বিশ্লেষণ।", "excerpt": "জানুন কীভাবে চার বেদের চারটি মহাবাক্য দ্বৈতভাবের আবরণ দূর করে প্রতিটি জীবের অন্তরে বিরাজমান নিত্য, শুদ্ধ ও অবিনশ্বর সাক্ষী চৈতন্যকে প্রকাশিত করে।", "content_html": "\n              <h2>১. উপক্রমণিকা • আত্ম-বিচারের হিমালয় অরুণোদয়</h2>\n              <p>ব্রহ্মমুহূর্তের পবিত্র নীরবতায় যখন সূর্যের প্রথম স্বর্ণাভ কিরণ হিমালয়ের তুষারশৃঙ্গ ও ঋষিদের তালপাতার পুঁথিকে আলোকিত করে, তখন একটি শাশ্বত প্রশ্নই সাধকের হৃদয়ে ধ্বনিত হয়— <em>\"কোऽহম্?\"</em> — আমি কে এবং এই বিশ্বজগতের মূল অধিষ্ঠান কী? উপনিषद কেবল তাত্ত্বিক বিচার নয়, বরং গুরুর চরণে বসে লাভ করা <strong>অপরোক্ষ অনুভূতির</strong> বিজ্ঞান।</p>\n              <blockquote class=\"hmb-shloka-box\">\n                <strong>ব্রহ্ম সত্যং জগন্মিথ্যা জীবো ব্রহ্মৈব নাপরঃ ।<br/>অনেন বেদ্যং সচ্ছাস্ত্রমিতি বেদান্তডিণ্ডিমঃ ॥</strong><br/>\n                <em>\"ব্রহ্মই একমাত্র অবিনশ্বর সত্য, নাম-রূপময় জগৎ আপেক্ষিক প্রতীতি মাত্র, এবং জীব স্বরূপত ব্রহ্ম হতে অভিন্ন—ইহাই বেদান্ত শাস্ত্রের ঘোষণা।\"</em>\n              </blockquote>\n              <h2>২. প্রজ্ঞানং ব্রহ্ম (ঐতরেয় উপনিষদ — ঋগ্বেদ) ও ৩. তত্ত্বমসি (ছান্দোগ্য উপনিষদ — সামবেদ)</h2>\n              <p>মন, বুদ্ধি ও ইন্দ্রিয়সমূহকে যাঁর জ্যোতিতে আলোকিত দেখা যায়, সেই স্বয়ংপ্রকাশ চৈতন্যই <strong>প্রজ্ঞানং ব্রহ্ম</strong>। মহর্ষি উদ্দালক আরুণি পুত্র শ্বেতকেতুকে ন্যগ্রোধ বৃক্ষের বীজের দৃষ্টান্ত দিয়ে উপদেশ দেন— <strong>তত্ত্বমসি</strong> (সেই সূক্ষ্ম পরম তত্ত্বই তুমি)।</p>\n              <h2>৪. অয়মাত্মা ব্রহ্ম (মাণ্ডূক্য উপনিষদ) ও ৫. অহং ব্রহ্মাস্মি (বৃহদারণ্যক উপনিষদ)</h2>\n              <p>জাগ্রত, স্বপ্ন ও সুষুপ্তির অতীত তুরীয় সাক্ষীই <strong>অয়মাত্মা ব্রহ্ম</strong>। শ্রবণ, মনন ও নিদিধ্যাসনের দ্বারা যখন অহংকার বিগলিত হয়, তখন সাধক সর্বভূতে এক আত্মাকে দর্শন করে <strong>অহং ব্রহ্মাস্মি</strong>-র পরম শান্তিতে প্রতিষ্ঠিত হন।</p>\n            "}, "sa": {"title": "उपनिषदां चत्वारि महावाक्यानि — साक्षिचैतन्यस्य आत्मसाक्षात्कारस्य च प्रबोधनम्", "subtitle": "प्रज्ञानं ब्रह्म, अहं ब्रह्मास्मि, तत्त्वमसि, अयमात्मा ब्रह्म चेति चतुर्वेदानां परमाद्वैतसिद्धान्तविमर्शः।", "excerpt": "चतुर्वेदेषु प्रतिपादितानि चत्वारि महावाक्यानि कथं मायावरणं निरस्य सर्वभूतान्तर्यामिणं कूटस्थं साक्षिचैतन्यं प्रकाशयन्तीति अत्र विमृश्यते।", "content_html": "\n              <h2>१. उपक्रमणिका • आत्मविचारस्य ब्राह्ममुहूर्तः</h2>\n              <p>ब्राह्ममुहूर्तस्य पावने प्रशान्तवातावरणे यदा भास्करस्य स्वर्णरश्मयः हिमगिरिशिखराणि महर्षीणां तालपत्रग्रन्थांश्च भासयन्ति, तदा मुमुक्षोः हृदये शाश्वतः प्रश्नः उदेति— <em>\"कोऽहम्? किमिदं जगत्?\"</em> इति। उपनिषदः नाम सद्गुरोः समीपे श्रद्धापूर्वकमुपविश्य प्राप्यमाणं ब्रह्मविद्याविज्ञानम्।</p>\n              <blockquote class=\"hmb-shloka-box\">\n                <strong>ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः ।<br/>अनेन वेद्यं सच्छास्त्रमिति वेदान्तडिण्डिमः ॥</strong>\n              </blockquote>\n              <h2>२. प्रज्ञानं ब्रह्म (ऐतरेयोपनिषद्) तथा ३. तत्त्वमसि (छान्दोग्योपनिषद्)</h2>\n              <p>येन मनः बुद्धिश्चेन्द्रियाणि च प्रकाश्यन्ते तत् स्वयंज्योतिः स्वरूपं <strong>प्रज्ञानं ब्रह्म</strong> इति लक्षणवाक्यम्। छान्दोग्योपनिषदि महर्षिः उद्दालकः श्वेतकेतुं वटबीजदृष्टान्तेन उपदिशति— <em>\"स य एषोऽणिमा ऐतदात्म्यमिदं सर्वं तत्सत्यं स आत्मा तत्त्वमसि श्वेतकेतो\"</em> इति।</p>\n              <h2>४. अयमात्मा ब्रह्म (माण्डूक्योपनिषद्) तथा ५. अहं ब्रह्मास्मि (बृहदारण्यकोपनिषद्)</h2>\n              <p>जाग्रत्-स्वप्न-सुषुप्ति-अवस्थात्रयसाक्षी तुरीयः आत्मा एव ब्रह्म। श्रवण-मनन-निदिध्यासनैः अविद्यायां निवृत्तायां मुमुक्षुः <strong>अहं ब्रह्मास्मि</strong> इति समदर्शनेन जीवन्मुक्तो भवति।</p>\n            "}}}, {"hmb_post_id": 102, "hmb_post_slug": "sacred-geometry-of-hindu-temple-architecture-agama-shilpa", "hmb_post_title": "Devalaya Vastu & Shilpa Shastra: Why the Hindu Temple is a Living Cosmic Mandala", "hmb_post_subtitle": "Decoding the Garbhagriha, Shikhara, Mandapa pillars, Apsara reliefs, and Vastu Purusha Mandala in Agamic architecture.", "hmb_post_category": "Temple Architecture", "hmb_post_tags": ["Temple Architecture", "Shilpa Shastra", "Agama", "Garbhagriha", "Sacred Geometry"], "hmb_post_author_name": "Sthapati Dr. Raghavendra Somayaji", "hmb_post_author_role": "Agama & Shilpa Shastra Historian", "hmb_post_cover_image": "assets/images/temple-mandapa.jpg", "hmb_post_shloka_sanskrit": "देहो देवालयः प्रोक्तो जीवो देवः सनातनः । त्यजेदज्ञाननिर्माल्यं सोऽहंभावेन पूजयेत् ॥", "hmb_post_shloka_transliteration": "Deho devālayaḥ prokto jīvo devaḥ sanātanaḥ | Tyajed ajñāna-nirmālyaṁ so’haṁ-bhāvena pūjayet ||", "hmb_post_shloka_meaning": "The human body itself is declared to be the temple, and the indwelling Jiva is the eternal Deity. Casting off the wilted flowers of ignorance, worship the Divine with the awareness \"I am That.\"", "hmb_post_excerpt": "From the subterranean foundation of the Vastu Purusha Mandala to the golden Kalasha crowning the Shikhara, discover how ancient temple builders mapped the human subtle body in carved stone.", "hmb_post_word_count": 1620, "hmb_post_char_count": 10280, "hmb_post_reading_minutes": 14, "hmb_post_views_count": 1185, "hmb_post_likes_count": 289, "hmb_post_is_featured": true, "hmb_post_published_date": "2026-10-25", "hmb_post_content_html": "\n          <h2>१. प्रासादः पुरुषः • The Temple as the Cosmic Person (Prasada Purusha)</h2>\n          <p>When a pilgrim crosses the threshold of a classical Hindu Devalaya — whether the soaring Nagara Shikharas of Kashi and Khajuraho, the monumental Dravida Vimanas of Thanjavur and Madurai, or the star-shaped Vesara sanctums of Belur — they are not merely entering a congregation hall. According to the <em>Mayamata</em>, <em>Manasara</em>, and <em>Kamikagama</em>, the Hindu temple is <strong>Prasada Purusha</strong>: the cosmos and the human subtle anatomy crystallized into stone through sacred proportion (Tala-Mana).</p>\n\n          <blockquote class=\"hmb-shloka-box\">\n            <strong>वास्तुपुरुषमण्डलम् — The 64-Square (Manduka) &amp; 81-Square (Paramashayika) Grids:</strong><br/>\n            <em>Before a single granite block is laid, the Sthapati (master architect) consecrates the earth with a geometric yantra aligning the four cardinal directions with solar and stellar equinoxes, placing Brahma at the central Brahmasthana.</em>\n          </blockquote>\n\n          <h2>२. गर्भगृहम् • Garbhagriha: The Womb of Unmanifest Stillness</h2>\n          <p>Why is the innermost sanctum of a temple intentionally kept unadorned, windowless, and illuminated only by the gentle golden flicker of ghee deepas? Its very name — <strong>Garbhagriha</strong> (<em>Womb-Chamber</em>) — holds the secret. While the outer prakara walls and Sahasra-Stambha mandapas teem with exuberant carvings of dancing apsaras, celestial gandharvas, floral torans, and scenes from the Ramayana and Mahabharata, the pilgrim's journey inward represents a progressive withdrawal of the senses (<strong>Pratyahara</strong>) from outer multiplicity to the singular stillness of the Heart Cave (<em>Hridaya-Guha</em>).</p>\n\n          <h2>३. शिखर एवं आमलक • The Vertical Axis Mundi (Meru &amp; Sushumna)</h2>\n          <p>Directly above the Garbhagriha rises the <strong>Shikhara</strong> or <strong>Vimana</strong>, representing Mount Meru — the cosmic axis connecting Bhurloka (earth) to Svarloka (the celestial realms). In yogic correspondence:</p>\n          <ul>\n            <li><strong>Paduka / Adhishthana (Base Plinth):</strong> Corresponds to the feet and Muladhara grounding stability.</li>\n            <li><strong>Jangha &amp; Mandapa Pillars:</strong> Represent the vital torso and pranic channels, adorned with depictions of the four Purusharthas — Dharma, Artha, Kama, and Moksha.</li>\n            <li><strong>Shikhara Spire:</strong> Mirrors the ascending <em>Sushumna Nadi</em> piercing the chakras.</li>\n            <li><strong>Amalaka &amp; Golden Kalasha:</strong> The ribbed stone disc (Amalaka) and the nectar-pot finial (Kalasha) crown the temple just as the <em>Sahasrara Padma</em> (thousand-petalled lotus) crowns the awakened yogi, culminating in the point of Bindu invading the infinite sky (Akasha).</li>\n          </ul>\n\n          <h2>४. प्रदक्षिणा एवं दर्शन • The Science of Acoustic Resonance &amp; Pradakshina</h2>\n          <p>Granite and sandstone mandapas were engineered with precise acoustic geometry. When the temple bell (Ghanta) — cast from Panchaloha (five sacred metals) — is rung alongside the blowing of the Panchajanya Shankha and the chanting of Vedic Mantras, the stone pillars sustain a harmonic resonance around 110 Hz, inducing alpha-theta meditative tranquility in the listener.</p>\n        ", "hmb_post_translations_json": {"hi": {"title": "देवालय वास्तु एवं शिल्प शास्त्र: हिन्दू मन्दिर एक जीवन्त ब्रह्माण्डीय मण्डल क्यों है?", "subtitle": "गर्भगृह, शिखर, मण्डप स्तम्भ, अप्सरा शिल्प और वास्तुपुरुष मण्डल के आध्यात्मिक एवं वैज्ञानिक रहस्यों का उद्घाटन।", "excerpt": "वास्तुपुरुष मण्डल की नींव से लेकर शिखर के स्वर्ण कलश तक, जानिए किस प्रकार प्राचीन स्थपतियों ने मानव के सूक्ष्म शरीर और ब्रह्माण्ड को पाषाण में उकेरा।", "content_html": "\n              <h2>१. प्रासादः पुरुषः • मन्दिर ही विराट पुरुष और सूक्ष्म शरीर का प्रतिरूप है</h2>\n              <p>जब कोई श्रद्धालु किसी प्राचीन देवालय के सिंहद्वार में प्रवेश करता है, तो वह केवल एक भवन में नहीं, अपितु पाषाण में निर्मित एक जीवन्त <strong>श्री यन्त्र</strong> और मानव देह के चक्रों में प्रवेश करता है। मयमतम्, मानसार और आगम शास्त्रों के अनुसार देवालय के बाह्य मण्डप में उत्कीर्ण नृत्य करती अप्सराएँ, गन्धर्व और पौराणिक कथाएँ संसार के विविध रूपों को दर्शाती हैं, जबकि भीतर का शांत <strong>गर्भगृह</strong> हमारे हृदय-गुहा में स्थित कूटस्थ आत्मा का प्रतीक है।</p>\n              <blockquote class=\"hmb-shloka-box\">\n                <strong>देहो देवालयः प्रोक्तो जीवो देवः सनातनः । त्यजेदज्ञाननिर्माल्यं सोऽहंभावेन पूजयेत् ॥</strong>\n              </blockquote>\n              <h2>२. गर्भगृह, शिखर एवं स्वर्ण कलश का योगिक रहस्य</h2>\n              <p>गर्भगृह के ठीक ऊपर उठता हुआ <strong>शिखर</strong> मेरु पर्वत और योगियों की सुषुम्ना नाड़ी का प्रतीक है, जिसके शीर्ष पर स्थित आमलक और अमृत कलश सहस्रार चक्र के जागरण को दर्शाते हैं।</p>\n            "}, "bn": {"title": "দেবালয় বাস্তু ও শিল্প শাস্ত্র: হিন্দু মন্দির কেন এক জীবন্ত মহাজাগতিক মণ্ডল?", "subtitle": "গর্ভগৃহ, শিখর, মণ্ডপ স্তম্ভ, অপ্সরা ভাস্কর্য এবং বাস্তুপুরুষ মণ্ডলের আধ্যাত্মিক ও বিজ্ঞানসম্মত তাৎপর্য।", "excerpt": "বাস্তুপুরুষ মণ্ডলের ভিত্তি থেকে শিখরের স্বর্ণ কলশ পর্যন্ত—জানুন কীভাবে প্রাচীন স্থপতিগণ মানব সূক্ষ্ম দেহ ও বিশ্বব্রহ্মাণ্ডকে পাথরে খোদাই করেছিলেন।", "content_html": "\n              <h2>১. প্রাসাদঃ পুরুষঃ • মন্দিরই বিরাট পুরুষ ও মানব দেহের প্রতিরূপ</h2>\n              <p>আগম ও শিল্প শাস্ত্র অনুসারে হিন্দু দেবালয় কেবল ইঁট-পাথরের ইমারত নয়, এটি <strong>প্রাসাদ পুরুষ</strong>। বাইরের মণ্ডপে খোদাই করা অপ্সরা, গন্ধর্ব ও পৌরাণিক আখ্যান জগতের বৈচিত্র্য প্রকাশ করে, আর প্রদীপের মৃদু আলোয় উদ্ভাসিত শান্ত <strong>গর্ভগৃহ</strong> আমাদের হৃদয়-গুহায় বিরাজমান আত্মার প্রতীক।</p>\n            "}, "sa": {"title": "देवालयवास्तुशिल्पशास्त्रम् — देवालयः कथं जीवन्तः ब्रह्माण्डमण्डलः वर्तते?", "subtitle": "गर्भगृह-शिखर-मण्डपस्तम्भ-अप्सरःशिल्प-वास्तुपुरुषमण्डलानां तात्त्विकं रहस्यम्।", "excerpt": "वास्तुपुरुषमण्डलादारभ्य शिखरस्थस्वर्णकलशं यावत् प्राचीनस्थपतिभिः कथं सूक्ष्मशरीरं पाषाणे स्थापत्यरूपेण निर्मितमिति विमृश्यते।", "content_html": "\n              <h2>१. प्रासादः पुरुषः • देहो देवालयः प्रोक्तः</h2>\n              <p>मयमत-मानसार-कामिकगमादिशास्त्रेषु देवालयः <strong>प्रासादपुरुषः</strong> इति अभिधीयते। बाह्यमण्डपेषु उत्कीर्णाः अप्सरसः गन्धर्वाश्च प्रपञ्चवैचित्र्यं दर्शयन्ति, अन्तःस्थं प्रशान्तं <strong>गर्भगृहं</strong> तु हृदयाकाशे स्थितं परमात्मानं सूचयति।</p>\n            "}}}, {"hmb_post_id": 103, "hmb_post_slug": "samudra-manthan-fable-churning-the-cosmic-ocean-of-mind", "hmb_post_title": "Samudra Manthan: The Puranic Allegory of Churning the Ocean of Consciousness", "hmb_post_subtitle": "Why Halahala poison precedes the Amrita Kalasha, and how Devas and Asuras mirror the dual forces within every seeker.", "hmb_post_category": "Itihasa & Puranas", "hmb_post_tags": ["Samudra Manthan", "Bhagavata Purana", "Amrita Kalasha", "Shiva Neelakantha", "Dhanvantari"], "hmb_post_author_name": "Vidushi Maitreyi Devi", "hmb_post_author_role": "Puranic Literature & Bhakti Scholar", "hmb_post_cover_image": "assets/images/puranic-kalasha.jpg", "hmb_post_shloka_sanskrit": "मथ्यमानेऽर्णवे सोऽथ विषं हालाहलं महत् । उदतिष्ठदप्रतर्क्यं सर्वलोकभयङ्करम् ॥", "hmb_post_shloka_transliteration": "Mathyamāne’rṇave so’tha viṣaṁ hālāhalaṁ mahat | Udatiṣṭhad apratarkyaṁ sarva-loka-bhayaṅkaram ||", "hmb_post_shloka_meaning": "When the cosmic ocean of milk was churned in earnest, before any treasure arose, there surfaced the fierce Halahala poison—teaching that deep spiritual sadhana first brings latent impurities to the surface for purification.", "hmb_post_excerpt": "Unveil the timeless psychological and spiritual meaning behind the churning of Kshira Sagara: Mount Mandara as concentration, Kurma Avatara as unshakable faith, Neelakantha Shiva’s compassion, and the golden Kalasha of immortality.", "hmb_post_word_count": 1510, "hmb_post_char_count": 9640, "hmb_post_reading_minutes": 13, "hmb_post_views_count": 980, "hmb_post_likes_count": 245, "hmb_post_is_featured": false, "hmb_post_published_date": "2026-10-21", "hmb_post_content_html": "\n          <h2>१. क्षीरसागर मन्थन • More Than Myth: The Inner Alchemy of Sadhana</h2>\n          <p>In the eighth Skandha of the <em>Srimad Bhagavata Purana</em>, the <em>Vishnu Purana</em>, and the <em>Adi Parva of the Mahabharata</em>, we encounter one of the most magnificent narratives in all of world literature: <strong>Samudra Manthan</strong>, the churning of the Cosmic Ocean of Milk (Kshira Sagara). While depicted in breathtaking temple murals across India and Southeast Asia, our Acharyas remind us that Puranic Itihasa operates simultaneously on the cosmic (Adhidaivika) and psychological (Adhyatmika) planes.</p>\n\n          <blockquote class=\"hmb-shloka-box\">\n            <strong>प्रतीक दर्शन • The Four Symbols of Inner Churning:</strong><br/>\n            • <strong>Kshira Sagara (Ocean of Milk):</strong> The vast, undulating field of human consciousness (Chitta).<br/>\n            • <strong>Devas &amp; Asuras:</strong> Our luminous Sattvic aspirations and our restless Rajasic/Tamasic impulses.<br/>\n            • <strong>Mandara Parvata (Churning Rod):</strong> One-pointed meditative concentration (Dharana &amp; Dhyana).<br/>\n            • <strong>Kurma Avatara (Tortoise Pivot):</strong> The divine grace of Lord Hari supporting the heavy mountain of sadhana so it does not sink into despondency.\n          </blockquote>\n\n          <h2>२. हालाहल एवं नीलकण्ठ • Why Halahala Poison Emerges First</h2>\n          <p>Every sincere meditator discovers a startling truth: when you sit down in silence to churn the mind, you do not immediately taste bliss. Instead, long-buried grievances, anxieties, restlessness, and unresolved samskaras rise to the surface. This is <strong>Halahala</strong>. And how does Mahadeva Shiva respond? He neither swallows the poison into his heart (which would corrupt the inner being) nor spits it out onto the world (which would harm others). Holding it in his throat through <em>Vishuddhi Chakra</em> mastery, he becomes <strong>Neelakantha</strong> — transmuting toxicity into blue-throated compassion.</p>\n\n          <h2>३. चतुर्दश रत्न एवं अमृत कलश • The Fourteen Treasures &amp; Lord Dhanvantari</h2>\n          <p>Only after enduring the purification of Halahala with patience and devotion do the luminous treasures (Chaturdasha Ratna) blossom from the depths: Kamadhenu (contentment), Airavata (majestic wisdom), Kaustubha Mani (unblemished love), Goddess Mahalakshmi (auspicious abundance), and finally Lord Dhanvantari bearing the golden <strong>Amrita Kalasha</strong> — the nectar of self-realization and immortal peace.</p>\n        ", "hmb_post_translations_json": {"hi": {"title": "समुद्र मन्थन: चित्त के क्षीरसागर से अमृत कलश की प्राप्ति का पौराणिक दर्शन", "subtitle": "अमृत से पूर्व हालाहल विष क्यों निकलता है, और देवासुर संग्राम प्रत्येक साधक के अन्तर्मन की यात्रा कैसे है?", "excerpt": "श्रीमद्भागवत पुराण के समुद्र मन्थन आख्यान का आध्यात्मिक रहस्य—मन्दराचल पर्वत के रूप में एकाग्रता, कूर्म अवतार के रूप में ईश्वरीय कृपा, नीलकण्ठ महादेव का विषपान और धन्वन्तरि का अमृत कलश।", "content_html": "\n              <h2>१. क्षीरसागर मन्थन • साधना का आन्तरिक रसायन शास्त्र</h2>\n              <p>श्रीमद्भागवत महापुराण के अष्टम स्कन्ध में वर्णित <strong>समुद्र मन्थन</strong> केवल एक प्राचीन घटना नहीं, अपितु प्रत्येक साधक के चित्त में घटित होने वाली ध्यान-प्रक्रिया का सजीव रूपक है। क्षीरसागर हमारा चित्त है, मन्दराचल पर्वत एकाग्र ध्यान है, वासुकि नाग श्वास-प्रश्वास (प्राणायाम) की डोरी है और भगवान कूर्म की पीठ वह अटूट श्रद्धा है जिस पर साधना टिकी रहती है।</p>\n              <h2>२. हालाहल विष एवं नीलकण्ठ महादेव का संदेश</h2>\n              <p>जब साधक ध्यान में बैठता है तो सर्वप्रथम चित्त के संचित विकार 'हालाहल' के रूप में बाहर आते हैं। भगवान शिव की भाँति उन्हें न तो हृदय में उतरने देना है और न ही संसार पर उगलना है, अपितु विवेक के कण्ठ में धारण कर 'नीलकण्ठ' बनना है। तभी अन्ततः भगवान धन्वन्तरि <strong>अमृत कलश</strong> लेकर प्रकट होते हैं।</p>\n            "}, "bn": {"title": "সমুদ্র মন্থন: চিত্তের ক্ষীরসাগর থেকে অমৃত কলশ লাভের পৌরাণিক দর্শন", "subtitle": "অমৃতের পূর্বে কেন হলাহল বিষ উত্থিত হয় এবং দেবাসুর সংগ্রাম কীভাবে প্রতিটি সাধকের অন্তর্যাত্রা?", "excerpt": "শ্রীমদ্ভাগবত পুরাণের সমুদ্র মন্থন উপাখ্যানের আধ্যাত্মিক তাৎপর্য—মন্দর পর্বত রূপে একাগ্রতা, কূর্ম অবতার রূপে ঈশ্বরকৃপা, নীলকণ্ঠ মহাদেবের করুণা এবং ধন্বন্তরির অমৃত কলশ।", "content_html": "\n              <h2>১. ক্ষীরসাগর মন্থন • সাধনার আন্তর রসায়ন</h2>\n              <p>শ্রীমদ্ভাগবত পুরাণে বর্ণিত <strong>সমুদ্র মন্থন</strong> প্রতিটি সাধকের চিত্তশুদ্ধির প্রতীক। ক্ষীরসাগর হলো আমাদের মন, মন্দর পর্বত হলো একাগ্র ধ্যান, আর ভগবান কূর্ম হলেন অটুট শ্রদ্ধা। হলাহল বিষের সংযম ও শুদ্ধির পরেই আত্মজ্ঞানের স্বর্ণময় <strong>অमृत কলশ</strong> প্রকটিত হয়।</p>\n            "}, "sa": {"title": "समुद्रमन्थनम् — चित्तक्षीरसागरात् अमृतकलशप्राप्तेः पौराणिकं रहस्यम्", "subtitle": "अमृतात् पूर्वं हालाहलविषं किमर्थमुत्तिष्ठति? देवासुरमन्थनस्य आध्यात्मिकं तात्पर्यम्।", "excerpt": "श्रीमद्भागवतपुराणोक्तस्य समुद्रमन्थनस्य आध्यात्मिकः विमर्शः — मन्दरपर्वतरूपेण ध्यानम्, कूर्मावताररूपेण भगवत्कृपा, नीलकण्ठस्य करुणा, धन्वन्तरेः अमृतकलशश्च।", "content_html": "\n              <h2>१. क्षीरसागरमन्थनम् • अन्तःकरणशोधनस्य रूपकम्</h2>\n              <p>श्रीमद्भागवतमहापुराणे अष्टमस्कन्धे वर्णितं <strong>समुद्रमन्थनं</strong> साधकस्य चित्तमन्थनस्यैव रूपकम्। नीलकण्ठमहादेवस्य प्रसादेन हालाहलविषं तीर्त्वा एव साधकः आत्मज्ञानामृतकलशं लभते।</p>\n            "}}}, {"hmb_post_id": 104, "hmb_post_slug": "sattvic-dinacharya-tulsi-deepa-and-ayurvedic-rhythm", "hmb_post_title": "Sattvic Dinacharya: Aligning Daily Life with Cosmic Rta, Tulsi Aradhana & Sandhya Deepa", "hmb_post_subtitle": "Practical Ayurvedic and Grihastha wisdom from Charaka Samhita and Ashtanga Hridaya for mental clarity, Ojas, and peaceful homes.", "hmb_post_category": "Yoga & Ayurveda", "hmb_post_tags": ["Ayurveda", "Dinacharya", "Tulsi", "Pranayama", "Sattvic Living"], "hmb_post_author_name": "Vaidya Narayanacharya Joshi", "hmb_post_author_role": "Ayurvedacharya & Yoga Darshana Teacher", "hmb_post_cover_image": "assets/images/meditation-tulsi.jpg", "hmb_post_shloka_sanskrit": "ब्राह्मे मुहूर्ते उत्तिष्ठेत् स्वस्थो रक्षार्थमायुषः । शरीरचिन्तां निर्वर्त्य कृतशौचविधिस्ततः ॥", "hmb_post_shloka_transliteration": "Brāhme muhūrte uttiṣṭhet svastho rakṣārtham āyuṣaḥ | Śarīra-cintāṁ nirvartya kṛta-śauca-vidhis tataḥ ||", "hmb_post_shloka_meaning": "One who desires to preserve radiant health and longevity should awaken during Brahma Muhurta, attuning the body and mind to the serene rhythm of nature (Ashtanga Hridaya, Sutrasthana 2.1).", "hmb_post_excerpt": "How awakening in Brahma Muhurta, tending the sacred Vrinda Tulsi, lighting sesame and ghee lamps at twilight, and honoring the three Gunas transforms an ordinary household into a tranquil ashram.", "hmb_post_word_count": 1480, "hmb_post_char_count": 9310, "hmb_post_reading_minutes": 12, "hmb_post_views_count": 1120, "hmb_post_likes_count": 276, "hmb_post_is_featured": false, "hmb_post_published_date": "2026-10-18", "hmb_post_content_html": "\n          <h2>१. ऋत एवं दिनचर्या • Living in Harmony with Cosmic Rhythm (Rta)</h2>\n          <p>The Vedic seers perceived the universe not as a chaotic collision of matter, but as <strong>Rta</strong> — a sacred, intelligent cosmic symphony governing the movement of the sun, the changing of the छह Ritus (seasons), and the subtle biological tides of <em>Vata</em>, <em>Pitta</em>, and <em>Kapha</em> within the human body. In both the <em>Charaka Samhita</em> and Vagbhata's <em>Ashtanga Hridaya</em>, health is called <strong>Svasthya</strong> (स्वस्थ) — literally \"to be established in one's own true Self.\"</p>\n\n          <blockquote class=\"hmb-shloka-box\">\n            <strong>तुलसी मङ्गलाष्टकम् • Reverence to Sacred Vrinda:</strong><br/>\n            <em>\"यन्मूले सर्वतीर्थानि यन्मध्ये सर्वदेवताः। यदग्रे सर्ववेदाश्च तुलसि त्वां नमाम्यहम्॥\"<br/>\n            At whose roots abide all sacred Tirthas, at whose center dwell all Deities, and at whose summit reside the Vedas — O Sacred Tulsi, I bow to thee.</em>\n          </blockquote>\n\n          <h2>२. ब्राह्ममुहूर्त एवं प्राणायाम • The Sattvic Window Before Dawn</h2>\n          <p>Approximately 96 minutes before sunrise (two Muhurtas prior to Usha), the atmosphere is rich in nascent Prana and free from the clatter of worldly Rajas. Awakening during <strong>Brahma Muhurta</strong>, sipping warm water stored in a copper vessel (Tamra-Jala), practicing twelve rounds of <em>Nadi Shodhana Pranayama</em>, and reciting the Gayatri or Mahamrityunjaya Mantra builds <strong>Ojas</strong> — the subtle essence of immunity, patience, and spiritual radiance.</p>\n\n          <h2>३. सन्ध्या दीप एवं सात्त्विक आहार • The Twilight Lamp &amp; Mindful Nourishment</h2>\n          <p>As day transitions into night (Sayam Sandhya), lighting a brass or earthen diya fuelled by pure cow's ghee or til (sesame) oil beside the courtyard Tulsi and home altar marks a sacred pause. As the <em>Chandogya Upanishad</em> (7.26.2) teaches: <strong>\"आहारशुद्धौ सत्त्वशुद्धिः सत्त्वशुद्धौ ध्रुवा स्मृतिः\"</strong> — when nourishment (both physical food and sensory impressions) is pure and Sattvic, the inner mind becomes crystal clear, and in that clarity, remembrance of the Divine becomes unwavering.</p>\n        ", "hmb_post_translations_json": {"hi": {"title": "सात्त्विक दिनचर्या: वैदिक ऋत, तुलसी आराधना एवं सन्ध्या दीप से जीवन का रूपान्तरण", "subtitle": "चरक संहिता और अष्टांग हृदय के आलोक में मानसिक शांति, ओजस और गृहस्थ आश्रम की पवित्रता के व्यावहारिक सूत्र।", "excerpt": "जानिए कैसे ब्रह्ममुहूर्त में जागरण, आँगन की पवित्र तुलसी की सेवा, सन्ध्या दीप प्रज्वलन और सात्त्विक आहार साधारण घर को भी एक शांत तपोवन में बदल देते हैं।", "content_html": "\n              <h2>१. वैदिक 'ऋत' एवं आयुर्वेदिक दिनचर्या</h2>\n              <p>आयुर्वेद में स्वास्थ्य की परिभाषा है— <strong>'स्वस्थ'</strong> अर्थात् अपने आत्म-स्वरूप में स्थित होना। अष्टांग हृदय के अनुसार ब्रह्ममुहूर्त में उठकर ताम्रपात्र का जल ग्रहण करना, नाड़ी-शोधन प्राणायाम करना, पवित्र वृन्दा (तुलसी) के समक्ष घृत का दीपक प्रज्वलित करना और सात्त्विक आहार लेना मनुष्य के भीतर <strong>ओजस</strong> और सात्त्विक मेधा का संचार करता है।</p>\n            "}, "bn": {"title": "সাত্ত্বিক দিনচর্যা: বৈদিক ঋত, তুলসী আরাধনা ও সন্ধ্যা প্রদীপে জীবনের রূপান্তর", "subtitle": "চরক সংহিতা ও অষ্টাঙ্গ হৃদয়ের আলোকে মানসিক প্রশান্তি, ওজস এবং গৃহস্থ আশ্রমের পবিত্রতার ব্যবহারিক সূত্র।", "excerpt": "জানুন কীভাবে ব্রহ্মমুহূর্তে জাগরণ, পবিত্র তুলসী মঞ্চে সন্ধ্যা প্রদীপ প্রজ্বলন এবং সাত্ত্বিক আহার একটি সাধারণ গৃহকে শান্ত তপোবনে পরিণত করে।", "content_html": "\n              <h2>১. বৈদিক ঋত ও আয়ুর্বেদিক দিনচর্যা</h2>\n              <p>আয়ুর্বেদে স্বাস্থ্যের অর্থ হলো <strong>'স্বস্থ'</strong>—অর্থাৎ নিজ আত্মস্বরূপে প্রতিষ্ঠিত থাকা। ব্রহ্মমুহূর্তে জাগরণ, প্রাণায়াম, তুলসী তলায় ঘৃত প্রদীপ প্রজ্বলন ও সাত্ত্বিক আহার চিত্তকে নির্মল ও জ্যোতির্ময় করে তোলে।</p>\n            "}, "sa": {"title": "सात्त्विकदिनचर्या — वैदिकऋत-तुलसीसमर्चन-सन्ध्यादीपैः जीवनस्य पावनीकरणम्", "subtitle": "चरकसंहिता-अष्टाङ्गहृदययोः आलोके मानसिकशान्तेः ओजसः च व्यावहारिकाणि सूत्राणि।", "excerpt": "ब्राह्ममुहूर्ते जागरणम्, वृन्दातुलसीसेवा, सन्ध्यादीपप्रज्वलनं सात्त्विकाहारश्च कथं गृहस्थाश्रमं तपोवनमिव पावनं कुर्वन्तीति विमृश्यते।", "content_html": "\n              <h2>१. ब्राह्मे मुहूर्ते उत्तिष्ठेत् स्वस्थो रक्षार्थमायुषः</h2>\n              <p>आहारशुद्धौ सत्त्वशुद्धिः सत्त्वशुद्धौ ध्रुवा स्मृतिः। ब्राह्ममुहूर्ते उत्थाय प्राणायामेन तुलसीपूजनेन सन्ध्यादीपप्रज्वलनेन च साधकः दीर्घायुष्यं ब्रह्मतेजश्च विन्दति।</p>\n            "}}}, {"hmb_post_id": 105, "hmb_post_slug": "science-of-sanskrit-mantras-chandas-and-nada-brahma", "hmb_post_title": "Nada Brahma & Chandas Shastra: The Phonetic Science of Sanskrit Mantras", "hmb_post_subtitle": "How Paninian articulatory phonetics (Shiksha), Vedic meters (Gayatri, Anushtubh, Trishtubh), and Svara intonation awaken subtle pranic centers.", "hmb_post_category": "Sanskrit & Mantras", "hmb_post_tags": ["Sanskrit", "Nada Brahma", "Chandas", "Gayatri Mantra", "Panini"], "hmb_post_author_name": "Mahamahopadhyaya Dr. Devadatta Tripathi", "hmb_post_author_role": "Vyakarana & Shiksha Shastra Professor", "hmb_post_cover_image": "assets/images/hero-mural.jpg", "hmb_post_shloka_sanskrit": "मननात् त्रायते इति मन्त्रः । नादब्रह्ममयो लोको नादः सर्वमिदं जगत् ॥", "hmb_post_shloka_transliteration": "Mananāt trāyate iti mantraḥ | Nāda-brahmamayo loko nādaḥ sarvam idaṁ jagat ||", "hmb_post_shloka_meaning": "That which protects and liberates the mind through contemplative repetition is called a Mantra. The entire cosmos is woven out of Nada Brahma—primordial vibrational sound.", "hmb_post_excerpt": "Why is Sanskrit called Devavani? Explore thefour levels of speech (Para, Pashyanti, Madhyama, Vaikhari), the five oral resonance points of the Varnamala, and the sacred geometry of Vedic meters.", "hmb_post_word_count": 1710, "hmb_post_char_count": 10890, "hmb_post_reading_minutes": 15, "hmb_post_views_count": 1310, "hmb_post_likes_count": 312, "hmb_post_is_featured": false, "hmb_post_published_date": "2026-10-14", "hmb_post_content_html": "\n          <h2>१. चत्वारि वाक् परिमिता पदानि • The Four Levels of Sacred Speech (Vak)</h2>\n          <p>In the famous riddle hymn of the Rigveda (1.164.45), Rishi Dirghatamas declares: <em>\"चत्वारि वाक् परिमिता पदानि तानि विदुर्ब्राह्मणा ये मनीषिणः। गुहा त्रीणि निहिता नेङ्गयन्ति तुरीयं वाचो मनुष्या वदन्ति॥\"</em> — Speech is measured in four progressive planes; three abide hidden in the cave of consciousness, while humanity ordinarily speaks only the fourth outward fraction:</p>\n          <ol>\n            <li><strong>Para Vak (Transcendental Seed Sound):</strong> Resting motionless at the Muladhara as pure unmanifest intention.</li>\n            <li><strong>Pashyanti Vak (Luminous Visualizing Sound):</strong> Rising to the navel center (Manipura), where sound and meaning are perceived as an indivisible flash of intuition.</li>\n            <li><strong>Madhyama Vak (Subtle Mental Articulation):</strong> Residing in the heart (Anahata), where internal mantra japa takes place without moving the physical tongue.</li>\n            <li><strong>Vaikhari Vak (Audible Spoken Word):</strong> Expressed through the throat, palate, roof, teeth, and lips (Kanthya, Talavya, Murdhanya, Dantya, Oshthya).</li>\n          </ol>\n\n          <blockquote class=\"hmb-shloka-box\">\n            <strong>छन्दः पादौ तु वेदस्य — Chandas as the Rhythmic Feet of the Vedas:</strong><br/>\n            <em>From the 24-syllable Gayatri Chandas (three padas of eight syllables each) to the 32-syllable Anushtubh of the Bhagavad Gita and Valmiki Ramayana, Vedic meters synchronize respiration with heart rate variability.</em>\n          </blockquote>\n\n          <h2>२. पाणिनीय शिक्षा एवं वर्णमाला • The Acoustic Precision of the Varnamala</h2>\n          <p>Unlike arbitrary alphabets, the Sanskrit <strong>Varnamala</strong> (Garland of Matrix Sounds from <em>अ</em> to <em>ह</em>) is mapped scientifically according to the exact anatomical point of articulation in the vocal tract. Chanting with proper <em>Udatta</em>, <em>Anudatta</em>, and <em>Svarita</em> intonations transforms the human cranium into a living resonance chamber.</p>\n        ", "hmb_post_translations_json": {"hi": {"title": "नाद ब्रह्म एवं छन्द शास्त्र: संस्कृत मन्त्रों और देववाणी का ध्वनि-विज्ञान", "subtitle": "पाणिनीय शिक्षा, वैदिक छन्द (गायत्री, अनुष्टुप्, त्रिष्टुप्) और परा-पश्यन्ती-मध्यमा-वैखरी वाणी के माध्यम से प्राण-केन्द्रों का जागरण।", "excerpt": "संस्कृत को देववाणी क्यों कहा जाता है? जानिए वाणी के चार स्तरों, संस्कृत वर्णमाला के वैज्ञानिक उच्चारण स्थानों और वैदिक छन्दों की लयबद्ध ऊर्जा का रहस्य।", "content_html": "\n              <h2>१. चत्वारि वाक् परिमिता पदानि • वाणी के चार सूक्ष्म स्तर</h2>\n              <p>ऋग्वेद (१.१६४.४५) के अनुसार वाणी के चार पद हैं— <strong>परा, पश्यन्ती, मध्यमा और वैखरी</strong>। कण्ठ, तालु, मूर्धा, दन्त और ओष्ठ के वैज्ञानिक क्रम से सजी संस्कृत वर्णमाला का जब शुद्ध स्वरों (उदात्त, अनुदात्त, स्वरित) के साथ जप किया जाता है, तो 'मननात् त्रायते इति मन्त्रः' सार्थक हो उठता है।</p>\n            "}, "bn": {"title": "নাদ ব্রহ্ম ও ছন্দ শাস্ত্র: সংস্কৃত মন্ত্র ও দেববাণীর ধ্বনি-বিজ্ঞান", "subtitle": "পাণিনীয় শিক্ষা, বৈদিক ছন্দ (গায়ত্রী, অনুষ্টুপ) এবং পরা-পশ্যন্তী-মধ্যমা-বৈখরী বাণীর মাধ্যমে প্রাণশক্তির জাগরণ।", "excerpt": "সংস্কৃতকে কেন দেববাণী বলা হয়? জানুন বাণীর চারটি স্তর, সংস্কৃত বর্ণমালার বৈজ্ঞানিক উচ্চারণ স্থান এবং বৈদিক ছন্দের জ্যোতির্ময় স্পন্দন।", "content_html": "\n              <h2>১. চত্বারি বাক্ পরিমিতা পদানি • বাণীর চারটি স্তর</h2>\n              <p>ঋগ্বেদ অনুসারে বাণীর চারটি স্তর— <strong>পরা, পশ্যন্তী, মধ্যমা ও বৈখরী</strong>। কণ্ঠ, তালু, মূর্ধা, দন্ত ও ওষ্ঠের নিখুঁত বৈজ্ঞানিক বিন্যাসে রচিত সংস্কৃত মন্ত্র জপ চিত্তকে পরম প্রশান্তিতে ভরে দেয়।</p>\n            "}, "sa": {"title": "नादब्रह्म छन्दःशास्त्रं च — संस्कृतमन्त्राणां पाणिनीयध्वनिविज्ञानम्", "subtitle": "परा-पश्यन्ती-मध्यमा-वैखरीवाचां गायत्र्यनुष्टुबादिच्छन्दसां च प्राणायामसमन्वितं रहस्यम्।", "excerpt": "संस्कृतभाषा किमर्थं देववाणीत्युच्यते? वर्णमालायाः पञ्चोच्चारणस्थानानां वैदिकस्वराणां च वैज्ञानिकं विश्लेषणम्।", "content_html": "\n              <h2>१. चत्वारि वाक् परिमिता पदानि</h2>\n              <p>ऋग्वेदे दीर्घतमसा महर्षिणा प्रोक्तम् — परा, पश्यन्ती, मध्यमा, वैखरी चेति वाचः चत्वारः पादाः। मननात् त्रायते इति मन्त्रः।</p>\n            "}}}, {"hmb_post_id": 106, "hmb_post_slug": "sacred-festivals-of-bharat-spiritual-significance-uttarayana-chaturmasya", "hmb_post_title": "Panchanga & Parva: The Inner Spiritual Meaning of Bharat’s Sacred Festivals", "hmb_post_subtitle": "From Holi, Ganesh Chaturthi, and Sharadiya Durga Puja to Deepavali, Bhai Dooj, and Chhath Puja — how our festivals align human joy with cosmic Dharma.", "hmb_post_category": "Dharmic Living & Festivals", "hmb_post_tags": ["Festivals", "Diwali", "Durga Puja", "Chhath Puja", "Holi", "Ganesh Chaturthi", "Bhai Dooj"], "hmb_post_author_name": "Acharya Vishwanath Shastri", "hmb_post_author_role": "Vedanta & Agamic Scholar, Kashi", "hmb_post_cover_image": "assets/images/hero-mural.jpg", "hmb_post_shloka_sanskrit": "उत्सवप्रियाः खलु मनुष्याः । धर्मार्थकाममोक्षाणां पर्वकाले विशेषतः ॥", "hmb_post_shloka_transliteration": "Utsava-priyāḥ khalu manuṣyāḥ | Dharmārtha-kāma-mokṣāṇāṁ parva-kāle viśeṣataḥ ||", "hmb_post_shloka_meaning": "Human beings naturally delight in celebration; our sacred Parvas channel that festive joy toward Dharma, noble prosperity, harmony, and spiritual liberation.", "hmb_post_excerpt": "Why does the Hindu calendar follow lunar Tithis and solar Sankrantis? Discover the deep spiritual symbolism connecting Vasant Holi, Vinayaka Chaturthi, Sharad Durga Puja, Deepavali, Bhai Dooj, and Surya Shashti Chhath Puja.", "hmb_post_word_count": 1920, "hmb_post_char_count": 12150, "hmb_post_reading_minutes": 17, "hmb_post_views_count": 1640, "hmb_post_likes_count": 418, "hmb_post_is_featured": true, "hmb_post_published_date": "2026-10-30", "hmb_post_content_html": "\n          <h2>१. पर्व एवं उत्सव दर्शन • Why Every Festival in Sanatana Dharma is a Sadhana</h2>\n          <p>In the Vedic tradition, time (<strong>Kala</strong>) is not a flat, mechanical ticking of clocks; it is an auspicious spiral of cosmic energy measured by the five limbs of the <strong>Panchanga</strong> — Tithi (lunar phase), Vara (weekday), Nakshatra (stellar constellation), Yoga, and Karana. Each major festival (<strong>Parva</strong>) occurs at an astronomical junction (Sandhikala) when subtle pranic currents are heightened, allowing households and communities to renew their spiritual vitality together.</p>\n\n          <blockquote class=\"hmb-shloka-box\">\n            <strong>षड्-पर्व माला • The Sacred Garland of Seasonal Festivals:</strong><br/>\n            <em>Every Ritu (season) offers a distinct portal to the Divine: Vasant brings the joyful devotion of Holi; Bhadrapada brings the wisdom of Ganesh Chaturthi; Sharad awakens the Shakti of Durga Puja; Kartika radiates the lamps of Deepavali, the affection of Bhai Dooj, and the solar gratitude of Chhath Puja.</em>\n          </blockquote>\n\n          <h2>२. वसन्तोत्सव होली एवं श्री गणेश चतुर्थी • Spring Renewal &amp; Sovereign Wisdom</h2>\n          <p>When winter yields to Vasant Ritu on Phalguna Purnima, <strong>Holi</strong> celebrates the indestructible faith of Bhakta Prahlada, reminding us that egoic arrogance (Hiranyakashipu and Holika) perishes before pure devotion to Lord Narayana. Later, on Bhadrapada Shukla Chaturthi, <strong>Ganesh Chaturthi</strong> invites <em>Buddhi-Pradata</em> Lord Vinayaka into our homes in eco-friendly clay (Parthiva Murti), teaching that even the most beloved form eventually dissolves back into the five elements during Visarजन.</p>\n\n          <h2>३. शारदीय दुर्गा पूजा एवं दीपावली • The Triumph of Shakti and Light</h2>\n          <p>During Sharad Navaratri and <strong>Durga Puja</strong>, the cosmos honors <em>Adi Shakti</em> in her nine forms (Navadurga), culminating in Vijayadashami. Twenty days later, on Kartika Amavasya — the darkest night of the autumn moon — millions of earthen diyas transform the earth into a mirror of the starlit heavens during <strong>Deepavali</strong>. Each diya represents the individual Jiva (earthen clay), filled with the ghee of devotion (Bhakti), holding the wick of steady contemplation (Dhyana), lit by the flame of Atma-Jnana.</p>\n\n          <h2>४. भाई दूज एवं लोकआस्था का महापर्व छठ पूजा • Sacred Relationships &amp; Cosmic Gratitude</h2>\n          <p>Two days after Deepavali, <strong>Bhai Dooj (Yama Dwitiya)</strong> sanctifies the protective bond between brothers and sisters, recalling Yamuna's hospitality to Yamaraja. And on Kartika Shukla Shashti, <strong>Chhath Puja</strong> stands as one of humanity's purest ecological and Vedic observances: standing waist-deep in sacred rivers, devotees offer Arghya first to the setting sun (Aस्ताचलगामी सूर्य) and then to the rising sun (उदयाचलगामी सूर्य) — honoring both completion and new beginnings with austere purity.</p>\n        ", "hmb_post_translations_json": {"hi": {"title": "पञ्चाङ्ग एवं पर्व दर्शन: भारत के पावन त्योहारों का आध्यात्मिक और वैज्ञानिक रहस्य", "subtitle": "होली, गणेश चतुर्थी और शारदीय दुर्गा पूजा से लेकर दीपावली, भाई दूज और छठ महापर्व तक—कैसे हमारे उत्सव लोक-आनन्द को धर्म और मोक्ष से जोड़ते हैं।", "excerpt": "जानिए क्यों सनातन पञ्चाङ्ग की तिथियाँ और ऋतु-सन्धियाँ होली, गणेश उत्सव, दुर्गा पूजा, दीपावली, भाई दूज और सूर्य षष्ठी छठ पूजा के माध्यम से हमारे तन, मन और समाज को आलोकित करती हैं।", "content_html": "\n              <h2>१. पर्व एवं उत्सव दर्शन • सनातन परम्परा में प्रत्येक त्योहार एक साधना है</h2>\n              <p>सनातन धर्म में काल (समय) केवल घड़ी की सुइयों की गति नहीं है, अपितु तिथि, वार, नक्षत्र, योग और करण—इस पञ्चाङ्ग से जुड़ी ब्रह्माण्डीय ऊर्जा का प्रवाह है। फाल्गुन की <strong>होली</strong> भक्त प्रह्लाद की अटूट भक्ति का उत्सव है; भाद्रपद की <strong>गणेश चतुर्थी</strong> विवेक और पार्थिव सृष्टि चक्र का बोध कराती है; <strong>शारदीय दुर्गा पूजा</strong> मातृशक्ति की आराधना है; <strong>दीपावली</strong> अमावस्या के गहन अन्धकार में आत्म-ज्ञान के दीप जलाने का पर्व है; <strong>भाई दूज</strong> पारिवारिक धर्म का प्रतीक है और <strong>छठ महापर्व</strong> प्रत्यक्ष देवता भगवान सूर्य एवं प्रकृति के प्रति कृतज्ञता का सर्वोच्च वैदिक अनुष्ठान है।</p>\n            "}, "bn": {"title": "পঞ্চাঙ্গ ও পর্ব দর্শন: ভারতের পবিত্র উৎসবসমূহের আধ্যাত্মিক ও বৈজ্ঞানিক তাৎপর্য", "subtitle": "দোলযাত্রা, গণেশ চতুর্থী ও শারদীয় দুর্গাপূজা থেকে দীপাবলি, ভাইফোঁটা এবং ছট পূজা—কীভাবে আমাদের উৎসব আনন্দকে ধর্মের সাথে যুক্ত করে।", "excerpt": "জানুন কীভাবে বসন্তোৎসব হোলি, বিনায়ক চতুর্থী, শারদোৎসব দুর্গাপূজা, দীপাবলি, ভ্রাতৃদ্বিতীয়া এবং সূর্য ষষ্ঠী ছট পূজা আমাদের চিত্ত ও সমাজকে পবিত্র ও জ্যোতির্ময় করে তোলে।", "content_html": "\n              <h2>১. পর্ব ও উৎসব দর্শন • প্রতিটি সনাতন উৎসবই এক আনন্দময় সাধনা</h2>\n              <p>সনাতন ঐতিহ্যে প্রতিটি তিথি ও ঋতু-সন্ধি আধ্যাত্মিক চেতনার জাগরণ ঘটায়। বসন্তের দোলযাত্রা ভক্তির উৎসব, গণেশ চতুর্থী প্রজ্ঞার আবাহন, শারদীয় দুর্গাপূজা মাতৃশক্তির বোধন, দীপাবলি তমসা নাশ করে জ্ঞানের প্রदीप প্রজ্বলন, ভাইফোঁটা ভ্রাতৃ-ভগিনীর পবিত্র বন্ধন এবং ছট পূজা প্রত্যক্ষ দেবতা সূর্যদেবের প্রতি প্রকৃতির বিশুদ্ধ অর্ঘ্য নিবেদন।</p>\n            "}, "sa": {"title": "पञ्चाङ्गपर्वदर्शनम् — भारतस्य पावनपर्वणां आध्यात्मिकं वैज्ञानिकं च रहस्यम्", "subtitle": "वासन्तिकहोली-गणेशचतुर्थी-शारदीयदुर्गापूजा-दीपावली-यमद्वितीया-सूर्यषष्ठीपर्वणां तात्त्विकः विमर्शः।", "excerpt": "सनातनपञ्चाङ्गस्य तिथयः ऋतुसन्धयश्च कथं होली-गणेशोत्सव-दुर्गापूजा-दीपावली-भ्रातृद्वितीया-छठपर्वभिः मानवान् धर्ममोक्षमार्गे प्रेरयन्तीति विमृश्यते।", "content_html": "\n              <h2>१. उत्सवप्रियाः खलु मनुष्याः • पर्वणां साधनास्वरूपम्</h2>\n              <p>सनातनधर्मे प्रत्येकं पर्व आत्मशोधनस्य समाजैक्यस्य च पावनः अवसरः वर्तते। दुर्गापूजा शक्तिसाधनायाः, दीपावली ज्ञानज्योतिषः, यमद्वितीया भ्रातृस्नेहस्य, सूर्यषष्ठी च प्रत्यक्षदेवतायाः सवितुः उपासनायाः महोत्सवः अस्ति।</p>\n            "}}}, {"hmb_post_id": 107, "hmb_post_slug": "nishkama-karma-yoga-in-srimad-bhagavad-gita", "hmb_post_title": "Nishkama Karma in the Bhagavad Gita: Acting with Excellence in Complete Inner Freedom", "hmb_post_subtitle": "How Sri Krishna reconciles dynamic worldly engagement with unshakeable meditative equanimity (Samatvam Yoga Uchyate).", "hmb_post_category": "Vedanta & Upanishads", "hmb_post_tags": ["Bhagavad Gita", "Karma Yoga", "Sri Krishna", "Equanimity", "Svadharma"], "hmb_post_author_name": "Acharya Vishwanath Shastri", "hmb_post_author_role": "Vedanta & Upanishadic Scholar, Kashi", "hmb_post_cover_image": "assets/images/vedanta-ashram.jpg", "hmb_post_shloka_sanskrit": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥", "hmb_post_shloka_transliteration": "Karmaṇy evādhikāras te mā phaleṣu kadācana | Mā karma-phala-hetur bhūr mā te saṅgo’stv akarmaṇi ||", "hmb_post_shloka_meaning": "Thy right is to perform thy duty alone, never to claim autonomous ownership over its fruits; let not the fruits of action be thy motive, nor let thy attachment be to inaction (Bhagavad Gita 2.47).", "hmb_post_excerpt": "Why does the Bhagavad Gita begin not in a secluded forest cave, but in the middle of Kurukshetra? Discover the transformative secret of Yajna-Bhava, Prasada-Buddhi, and Yogaḥ Karmasu Kauśalam.", "hmb_post_word_count": 1560, "hmb_post_char_count": 9890, "hmb_post_reading_minutes": 13, "hmb_post_views_count": 1290, "hmb_post_likes_count": 350, "hmb_post_is_featured": false, "hmb_post_published_date": "2026-10-10", "hmb_post_content_html": "\n          <h2>१. कुरुक्षेत्रे धर्मक्षेत्रे • Serenity in the Heart of Action</h2>\n          <p>When Arjuna's Gandiva bow slips from his hands on the battlefield of Kurukshetra, his dilemma is universal: how can a sensitive seeker act in a complex world without accumulating karmic bondage and mental agitation? Bhagavan Sri Krishna's answer in the second and third chapters of the <em>Srimad Bhagavad Gita</em> revolutionized spiritual thought forever: renunciation is not running away from duty (<em>Karma-Sannyasa</em> without inner maturity), but renouncing egoic anxiety over results right in the midst of wholehearted action (<strong>Karma-Phala-Tyaga</strong>).</p>\n\n          <blockquote class=\"hmb-shloka-box\">\n            <strong>योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।<br/>सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥ (गीता २.४८)</strong><br/>\n            <em>\"Established in Yoga, O Dhananjaya, perform actions abandoning clinging, remaining poised alike in success and failure. This very equanimity of mind is called Yoga.\"</em>\n          </blockquote>\n\n          <h2>२. ईश्वरार्पण एवं प्रसाद बुद्धि • The Two Wings of Karma Yoga</h2>\n          <p>How does one practice <em>Karmany evadhikaras te</em> in daily life? Through two complementary attitudes:</p>\n          <ul>\n            <li><strong>Ishvararpana Buddhi (Consecrating the Effort):</strong> Performing every task — whether writing, teaching, caring for family, or serving society — as an offering (Yajna) at the feet of the Divine, giving 100% of one's skill and attention.</li>\n            <li><strong>Prasada Buddhi (Receiving the Outcome as Grace):</strong> Accepting whatever outcome unfolds — praise or criticism, gain or delay — with a cheerful, unagitated mind as <em>Prasada</em> from the Cosmic Order, learning from it without bitterness.</li>\n          </ul>\n        ", "hmb_post_translations_json": {"hi": {"title": "श्रीमद्भगवद्गीता में निष्काम कर्मयोग: पूर्ण आन्तरिक स्वतन्त्रता के साथ श्रेष्ठ कर्म की कला", "subtitle": "भगवान श्रीकृष्ण किस प्रकार गतिशील कर्तव्य-पालन और ध्यानस्थ समत्व (समत्वं योग उच्यते) का अद्भुत समन्वय करते हैं?", "excerpt": "भगवद्गीता का उपदेश किसी एकान्त वन में नहीं अपितु धर्मक्षेत्र कुरुक्षेत्र के मध्य क्यों हुआ? जानिए ईश्वरार्पण बुद्धि, प्रसाद बुद्धि और योगः कर्मसु कौशलम् का जीवन-दर्शन।", "content_html": "\n              <h2>१. समत्वं योग उच्यते • कर्म के मध्य ध्यान की प्रशान्तता</h2>\n              <p>श्रीमद्भगवद्गीता (२.४७-४८) में भगवान श्रीकृष्ण स्पष्ट करते हैं कि कर्म से पलायन संन्यास नहीं है, अपितु कर्तव्य को पूर्ण कुशलता के साथ <strong>ईश्वरार्पण बुद्धि</strong> से करना और उसके फल को <strong>प्रसाद बुद्धि</strong> से स्वीकार करना ही सच्चा निष्काम कर्मयोग है।</p>\n            "}, "bn": {"title": "শ্রীমদ্ভগবদ্গীতায় নিষ্কাম কর্মযোগ: পূর্ণ আন্তরিক স্বাধীনতায় শ্রেষ্ঠ কর্মের শিল্প", "subtitle": "ভগবান শ্রীকৃষ্ণ কীভাবে গতিশীল কর্তব্য পালন এবং ধ্যানস্থ সমত্বের (সমত্বং যোগ উচ্যতে) অপূর্ব সমন্বয় ঘটিয়েছেন?", "excerpt": "জানুন ঈশ্বরার্পণ বুদ্ধি, প্রসাদ বুদ্ধি এবং যোগঃ কর্মসু কৌশলম্-এর মাধ্যমে কীভাবে কর্মের মাঝেও চিত্তকে অবিচল ও প্রশান্ত রাখা যায়।", "content_html": "\n              <h2>১. সমত্বং যোগ উচ্যতে • কর্মের মাঝে ধ্যানের প্রশান্তি</h2>\n              <p>শ্রীমদ্ভগবদ্গীতায় ভগবান শ্রীকৃষ্ণ উপদেশ দিয়েছেন—ফলের আসক্তি ত্যাগ করে পূর্ণ দক্ষতার সাথে স্বধর্ম পালন করাই নিষ্কাম কর্মযোগ।</p>\n            "}, "sa": {"title": "श्रीमद्भगवद्गीतायां निष्कामकर्मयोगः — समत्वबुद्ध्या स्वधर्मपालनस्य कौशलम्", "subtitle": "ईश्वरार्पणबुद्ध्या प्रसादबुद्ध्या च कथं कर्मबन्धनात् मुक्तिः लभ्यते?", "excerpt": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन — भगवतः श्रीकृष्णस्य कर्मयोगोपदेशस्य तात्त्विकं व्यावहारिकं च विवेचनम्।", "content_html": "\n              <h2>१. योगः कर्मसु कौशलम्</h2>\n              <p>सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते। ईश्वरार्पणभावेन कृतं कर्म अन्तःकरणं शोधयति ज्ञाननिष्ठां च जनयति।</p>\n            "}}}, {"hmb_post_id": 108, "hmb_post_slug": "panchatantra-and-hitopadesha-dharmic-fables-of-niti-shastra", "hmb_post_title": "Panchatantra & Hitopadesha: How Ancient Sanskrit Fables Teach Practical Niti & Viveka", "hmb_post_subtitle": "Exploring Vishnu Sharma’s timeless stories of swans, tortoises, lions, and sages as a mirror of ethical statecraft, friendship, and discernment.", "hmb_post_category": "Itihasa & Puranas", "hmb_post_tags": ["Panchatantra", "Hitopadesha", "Niti Shastra", "Sanskrit Fables", "Viveka"], "hmb_post_author_name": "Vidushi Maitreyi Devi", "hmb_post_author_role": "Puranic Literature & Bhakti Scholar", "hmb_post_cover_image": "assets/images/puranic-kalasha.jpg", "hmb_post_shloka_sanskrit": "अयं निजः परो वेति गणना लघुचेतसाम् । उदारचरितानां तु वसुधैव कुटुम्बकम् ॥", "hmb_post_shloka_transliteration": "Ayaṁ nijaḥ paro veti gaṇanā laghu-cetasām | Udāra-caritānāṁ tu vasudhaiva kuṭumbakam ||", "hmb_post_shloka_meaning": "\"This one is mine, and that one is a stranger\"—such calculation belongs to the narrow-minded. For those of magnanimous character, the entire earth is one family (Panchatantra 5.38 & Maha Upanishad 6.71).", "hmb_post_excerpt": "How Acharya Vishnu Sharma awakened three unmotivated princes in six months using the five treatises (Tantras) of forest fables, weaving ethical Dharma together with worldly wisdom.", "hmb_post_word_count": 1390, "hmb_post_char_count": 8820, "hmb_post_reading_minutes": 11, "hmb_post_views_count": 910, "hmb_post_likes_count": 219, "hmb_post_is_featured": false, "hmb_post_published_date": "2026-10-05", "hmb_post_content_html": "\n          <h2>१. नीतिशास्त्र एवं कथा परम्परा • Wisdom Wearing the Garment of Story</h2>\n          <p>When King Amarashakti of Mahilaropya despaired over educating his three princes, eighty-year-old Acharya <strong>Vishnu Sharma</strong> accepted the challenge—not by forcing them to memorize dry manuals, but by composing the <strong>Panchatantra</strong> (Five Treatises of Wise Conduct): <em>Mitra-Bheda</em> (Loss of Friends), <em>Mitra-Samprapti</em> (Winning of Friends), <em>Kakolukiyam</em> (Of Crows and Owls), <em>Labdhapranasham</em> (Loss of Gains), and <em>Aparikshitakarakam</em> (Rash Deeds).</p>\n          <blockquote class=\"hmb-shloka-box\">\n            <strong>उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः ।<br/>न हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः ॥ (हितोपदेश)</strong><br/>\n            <em>\"Noble endeavors are accomplished through diligent effort, not merely by wishful thinking; deer do not walk by themselves into the mouth of a sleeping lion.\"</em>\n          </blockquote>\n          <h2>२. हंस-कूर्म आख्यान • The Swan, the Tortoise &amp; Mastery Over Speech</h2>\n          <p>In the fable of <em>Kambugriva</em> the tortoise and his two hamsa swan friends, Sankata and Vikata, the swans carry the tortoise across the sky on a wooden staff held in his jaws, with one condition: he must maintain silence (Mauna) when villagers below marvel or mock. Unable to restrain his reactive impulse to retort, Kambugriva opens his mouth and falls. Thus a simple fable imparts a profound lesson in <strong>Vak-Samyama</strong> (mastery of speech and emotional equanimity).</p>\n        ", "hmb_post_translations_json": {"hi": {"title": "पञ्चतन्त्र एवं हितोपदेश: संस्कृत की नीति-कथाएँ हमें व्यावहारिक विवेक और धर्म कैसे सिखाती हैं?", "subtitle": "आचार्य विष्णु शर्मा के पाँच तन्त्रों और सुभाषितों में छिपा मैत्री, पुरुषार्थ, वाक्-संयम और वसुधैव कुटुम्बकम् का अमर संदेश।", "excerpt": "जानिए कैसे आचार्य विष्णु शर्मा ने हंस, कछुए, सिंह और ऋषियों की रोचक कथाओं के माध्यम से नीतिशास्त्र और धर्म के गूढ़ सिद्धांतों को जन-जन तक पहुँचाया।", "content_html": "\n              <h2>१. नीतिशास्त्र एवं कथा परम्परा</h2>\n              <p>आचार्य विष्णु शर्मा द्वारा रचित <strong>पञ्चतन्त्र</strong> और नारायण पण्डित के <strong>हितोपदेश</strong> ने कथाओं के माध्यम से मित्र-सम्प्राप्ति, विवेक, वाक्-संयम और पुरुषार्थ की जो शिक्षा दी, वह विश्व साहित्य की अमूल्य धरोहर है।</p>\n            "}, "bn": {"title": "পঞ্চতন্ত্র ও হিতোপদেশ: সংস্কৃত নীতি-গল্প কীভাবে আমাদের ব্যবহারিক বিবেক ও ধর্ম শেখায়?", "subtitle": "আচার্য বিষ্ণু শর্মার পাঁচটি তন্ত্র ও সুভাষিতে নিহিত মৈত্রী, পুরুষার্থ, বাক্-সংযম এবং বসুধৈব কুটুম্বকম্-এর অমর বার্তা।", "excerpt": "জানুন কীভাবে আচার্য বিষ্ণু শর্মা হংস, কচ্ছপ, সিংহ ও ঋষিদের মনোজ্ঞ উপাখ্যানের মাধ্যমে নীতিশাস্ত্র ও ধর্মের গভীর তত্ত্ব সহজবোধ্য করে তুলেছেন।", "content_html": "\n              <h2>১. নীতিশাস্ত্র ও কথা পরম্পরা</h2>\n              <p>আচার্য বিষ্ণু শর্মার <strong>পঞ্চতন্ত্র</strong> এবং নারায়ণ পণ্ডিতের <strong>হিতোপদেশ</strong> আনন্দময় গল্পের ছলে মানুষকে বিবেক, মৈত্রী ও পুরুষার্থের শিক্ষা দেয়।</p>\n            "}, "sa": {"title": "पञ्चतन्त्रं हितोपदेशश्च — संस्कृतनीतिकथाभिः व्यावहारिकविवेकस्य धर्मस्य च शिक्षणम्", "subtitle": "आचार्यविष्णुशर्मणः पञ्चतन्त्रेषु निहितं मैत्री-पुरुषार्थ-वाक्संयम-वसुधैवकुटुम्बकम् इति तत्त्वज्ञानम्।", "excerpt": "हंस-कूर्म-सिंहादीनां मनोहराभिः कथाभिः कथं नीतिशास्त्रं धर्मविवेकश्च सुगमतया शिक्ष्यते इति विमृश्यते।", "content_html": "\n              <h2>१. नीतिशास्त्रं कथापरम्परा च</h2>\n              <p>उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः। आचार्यविष्णुशर्मणा विरचितं पञ्चतन्त्रं बालकान् प्रौढांश्च समानरूपेण विवेकं शिक्षयति।</p>\n            "}}}], "initialQuickReads": [{"hmb_quick_id": 201, "hmb_quick_title": "Vidya Dadati Vinayam — The Chain of True Education", "hmb_quick_category": "Subhashita", "hmb_quick_sanskrit_verse": "विद्या ददाति विनयं विनयाद्याति पात्रताम् । पात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम् ॥", "hmb_quick_summary": "True knowledge bestows humility; from humility comes worthiness; from worthiness one attains righteous prosperity; from prosperity one performs Dharma, and from Dharma flows enduring happiness.", "hmb_quick_scripture_source": "Hitopadesha, Prastavana 6", "hmb_quick_reading_seconds": 60, "hmb_quick_translations_json": {"hi": {"title": "विद्या ददाति विनयम् — सच्ची शिक्षा की शृंखला", "summary": "सच्ची विद्या विनम्रता प्रदान करती है; विनम्रता से पात्रता आती है; पात्रता से धर्मसम्मत धन की प्राप्ति होती है, जिससे धर्म और अन्ततः शाश्वत सुख मिलता है।"}, "bn": {"title": "বিদ্যা দদাতি বিনয়ম্ — প্রকৃত শিক্ষার শৃঙ্খল", "summary": "প্রকৃত বিদ্যা বিনয় দান করে; বিনয় থেকে যোগ্যতা আসে; যোগ্যতা থেকে সৎ ধন অর্জিত হয়, ধন থেকে ধর্ম এবং ধর্ম থেকে অক্ষয় সুখ লাভ হয়।"}, "sa": {"title": "विद्या ददाति विनयम् — सद्विद्यायाः फलश्रुतिः", "summary": "सद्विद्या विनयं यच्छति, विनयात् पात्रता भवति, पात्रत्वात् धर्म्यं धनम् आप्यते, धनात् धर्मः ततश्च शाश्वतं सुखं लभ्यते।"}}}, {"hmb_quick_id": 202, "hmb_quick_title": "Purnamadah Purnamidam — Wholeness Born of Wholeness", "hmb_quick_category": "Upanishad Sutra", "hmb_quick_sanskrit_verse": "ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते । पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥", "hmb_quick_summary": "That unmanifest Brahman is Infinite Wholeness, and this manifest cosmos is also Whole. From the Infinite arises the Infinite, and even when Wholeness is drawn out, Infinite Wholeness alone remains.", "hmb_quick_scripture_source": "Isha & Brihadaranyaka Upanishad", "hmb_quick_reading_seconds": 75, "hmb_quick_translations_json": {"hi": {"title": "पूर्णमदः पूर्णमिदम् — पूर्ण से पूर्ण का प्राकट्य", "summary": "वह अव्यक्त परब्रह्म भी पूर्ण है और यह व्यक्त जगत् भी पूर्ण है। पूर्ण से ही पूर्ण की उत्पत्ति होती है और पूर्ण में से पूर्ण निकालने पर भी पूर्ण ही शेष रहता है।"}, "bn": {"title": "পূর্ণমদঃ পূর্ণমিদম্ — পূর্ণ হতে পূর্ণের প্রকাশ", "summary": "সেই অব্যক্ত ব্রহ্ম পূর্ণ এবং এই ব্যক্ত জগৎও পূর্ণ। পূর্ণ হতেই পূর্ণের উদ্ভব হয় এবং পূর্ণ থেকে পূর্ণ নিলেও পূর্ণই অবশিষ্ট থাকে।"}, "sa": {"title": "पूर्णमदः पूर्णमिदम् — परब्रह्मणः पूर्णत्वम्", "summary": "तत् परब्रह्म पूर्णमस्ति, इदं जगदपि पूर्णमस्ति। पूर्णात् पूर्णमुदच्यते, पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते।"}}}, {"hmb_quick_id": 203, "hmb_quick_title": "Hamsa Ksheera Nyaya — The Swan’s Discernment", "hmb_quick_category": "Puranic Fable", "hmb_quick_sanskrit_verse": "हंसः श्वेतो बकः श्वेतः को भेदो बकहंसयोः । नीरक्षीरविवेके तु हंसो हंसो बको बकः ॥", "hmb_quick_summary": "Both the swan (Hamsa) and the crane (Baka) are white in appearance; yet when tested with separating pure milk from water, the noble swan reveals its Viveka (discernment) by partaking only of the essence.", "hmb_quick_scripture_source": "Subhashita Ratna Bhandagara", "hmb_quick_reading_seconds": 65, "hmb_quick_translations_json": {"hi": {"title": "हंस-क्षीर न्याय — नीर-क्षीर विवेक की कला", "summary": "हंस भी श्वेत होता है और बगुला भी श्वेत; किन्तु जब जल और दुग्ध को अलग करने की परीक्षा आती है, तब विवेकी हंस सार (दुग्ध) को ग्रहण कर अपनी श्रेष्ठता सिद्ध करता है।"}, "bn": {"title": "হংস-ক্ষীর ন্যায় — নীর-ক্ষীর বিবেকের শিল্প", "summary": "হংস ও বক উভয়ই শ্বেতবর্ণ; কিন্তু জল ও দুগ্ধ পৃথক করার পরীক্ষায় বিবেকী হংস সারটুকু গ্রহণ করে নিজের শ্রেষ্ঠত্ব প্রমাণ করে।"}, "sa": {"title": "हंसक्षीरन्यायः — नीरक्षीरविवेकः", "summary": "हंसो बकश्च उभावपि श्वेतौ, परं नीरक्षीरविवेके तु हंसः सारं गृह्णाति असारं च त्यजति।"}}}, {"hmb_quick_id": 204, "hmb_quick_title": "Hitam Mitam Rutam Bhuktam — The Three Pillars of Ayurvedic Diet", "hmb_quick_category": "Ayurveda & Dinacharya", "hmb_quick_sanskrit_verse": "हितभुक् मितभुक् ऋतभुक् — यो भवेत् स निरामयः ।", "hmb_quick_summary": "When Acharya Vagbhata was asked who remains free from disease, he replied in three words: Hitabhuk (eating what is wholesome), Mitabhuk (eating in moderation), and Rutabhuk (eating in harmony with seasons and honest labor).", "hmb_quick_scripture_source": "Charaka & Vagbhata Tradition", "hmb_quick_reading_seconds": 60, "hmb_quick_translations_json": {"hi": {"title": "हितभुक् मितभुक् ऋतभुक् — आयुर्वेदिक स्वास्थ्य के तीन स्तम्भ", "summary": "महर्षि वाग्भट से पूछा गया कि निरोग कौन रहता है? उन्होंने तीन शब्दों में उत्तर दिया— हितभुक् (सात्त्विक व हितकारी भोजन करने वाला), मितभुक् (संयमित मात्रा में खाने वाला) और ऋतभुक् (ऋतु व ईमानदारी का अन्न खाने वाला)।"}, "bn": {"title": "হিতভুক্ মিতভুক্ ঋতভুক্ — আয়ুর্বেদিক স্বাস্থ্যের তিনটি স্তম্ভ", "summary": "আচার্য বাগ্‌ভট বলেছেন—যিনি হিতভুক্ (কল্যাণকর আহার করেন), মিতভুক্ (পরিমিত আহার করেন) এবং ঋতভুক্ (ঋতু ও সততার অন্ন গ্রহণ করেন), তিনিই প্রকৃত নিরোগ থাকেন।"}, "sa": {"title": "हितभुक् मितभुक् ऋतभुक् — आरोग्याधारत्रयम्", "summary": "यः मानवः हितं मितं ऋतं च अन्नं भुङ्क्ते स एव निरामयः दीर्घायुश्च भवति इति आयुर्वेदसिद्धान्तः।"}}}, {"hmb_quick_id": 205, "hmb_quick_title": "Chhandogya Salt-in-Water Parable — The Invisible Presence", "hmb_quick_category": "Upanishad Sutra", "hmb_quick_sanskrit_verse": "लवणमेवोदकेऽवधाय अथ मा प्रातरुपसीदथा इति... सर्वत्र सदा सत् वर्तते ।", "hmb_quick_summary": "Uddalaka asked Svetaketu to dissolve rock salt in water overnight. Though invisible to the eye the next morning, the water tasted salty from top, middle, and bottom—showing how the invisible Atman pervades every atom.", "hmb_quick_scripture_source": "Chandogya Upanishad 6.13", "hmb_quick_reading_seconds": 80, "hmb_quick_translations_json": {"hi": {"title": "छान्दोग्य लवण-जल दृष्टान्त — सर्वव्यापी आत्मा की उपस्थिति", "summary": "महर्षि उद्दालक ने श्वेतकेतु से जल में नमक घोलने को कहा। दिखायी न देने पर भी जैसे नमक जल के प्रत्येक बूँद में व्याप्त रहता है, वैसे ही परमात्मा चराचर जगत् के कण-कण में व्याप्त है।"}, "bn": {"title": "ছান্দোগ্য লবণ-জল দৃষ্টান্ত — সর্বব্যাপী আত্মার উপস্থিতি", "summary": "জলে লবণ গুলে গেলে তা চোখে দেখা না গেলেও যেমন প্রতিটি বিন্দুতে অনুভূত হয়, তেমনই অদৃশ্য পরমাত্মা সমগ্র চরাচর জগতের কণায় কণায় বিরাজমান।"}, "sa": {"title": "छान्दोग्यलवणोदकदृष्टान्तः — सर्वव्यापकः आत्मा", "summary": "यथा उदके लीनं लवणं चक्षुषा न दृश्यते तथापि सर्वत्र रसेन अनुभूयते, तथैव सर्वभूतान्तर्यामी आत्मा सर्वत्र वर्तते।"}}}, {"hmb_quick_id": 206, "hmb_quick_title": "Paropakaraya Phalanti Vrikshah — Nature’s Selfless Seva", "hmb_quick_category": "Subhashita", "hmb_quick_sanskrit_verse": "परोपकाराय फलन्ति वृक्षाः परोपकाराय वहन्ति नद्यः । परोपकाराय दुहन्ति गावः परोपकारार्थमिदं शरीरम् ॥", "hmb_quick_summary": "Trees bear fruit for the welfare of others; rivers flow for the benefit of others; cows yield nourishing milk for others; indeed, this human body is blessed when dedicated to selfless service (Paropakara).", "hmb_quick_scripture_source": "Subhashita Niti Shastra", "hmb_quick_reading_seconds": 60, "hmb_quick_translations_json": {"hi": {"title": "परोपकाराय फलन्ति वृक्षाः — प्रकृति का निःस्वार्थ सेवा-धर्म", "summary": "वृक्ष परोपकार के लिए फल देते हैं, नदियाँ परोपकार के लिए बहती हैं, गायें परोपकार के लिए दुग्ध देती हैं; वास्तव में यह मानव शरीर भी परोपकार और धर्म-सेवा के लिए ही मिला है।"}, "bn": {"title": "পরোপকারায় ফলন্তি বৃক্ষাঃ — প্রকৃতির নিঃস্বার্থ সেবা-ধর্ম", "summary": "বৃক্ষ পরোপকারের জন্য ফল দেয়, নদী পরোপকারের জন্য প্রবাহিত হয়, গাভী পরোপকারের জন্য দুগ্ধ দেয়; এই মানব দেহও পরোপকার ও সেবার জন্যই ধন্য হয়।"}, "sa": {"title": "परोपकाराय फलन्ति वृक्षाः — परोपकारधर्मः", "summary": "वृक्षाः नद्यः गावश्च निःस्वार्थभावेन लोकहितं कुर्वन्ति; इदं मानुषं शरीरमपि परोपकाराय धर्मसेवायै च वर्तते।"}}}]};
const HMB_FESTIVAL_PRESETS = HMB_SEED_BUNDLE.festivalPresets;
const HMB_UI_TRANSLATIONS = HMB_SEED_BUNDLE.uiTranslations;
const HMB_CATEGORY_TRANSLATIONS = HMB_SEED_BUNDLE.categoryTranslations;
const HMB_INITIAL_POSTS = HMB_SEED_BUNDLE.initialPosts;
const HMB_INITIAL_QUICK_READS = HMB_SEED_BUNDLE.initialQuickReads;

function hmbLocalizeCategory(catKey, lang) {
  if (catKey === 'all') return (HMB_UI_TRANSLATIONS[lang] || HMB_UI_TRANSLATIONS.en).all_categories;
  const entry = HMB_CATEGORY_TRANSLATIONS[catKey];
  return entry ? (entry[lang] || entry.en) : catKey;
}

function hmbFormatDate(d) {
  if (!d) return '2026-10-30';
  return String(d).slice(0, 10);
}

// 3. APPLICATION STATE
const savedAuth = hmbLoadLocal(HMB_STORAGE_KEYS.ADMIN_AUTH, { authenticated: false, username: '', password: '' });

let hmbState = {
  dbConnected: false,
  config: hmbLoadLocal(HMB_STORAGE_KEYS.CONFIG, {
    hmb_site_title: 'ॐ हरि Blogging',
    hmb_site_subtitle: 'Sanatana Vangmaya, Vedic Wisdom & Timeless Dharmic Reflections',
    hmb_active_language: 'en',
    hmb_active_theme: 'sattvic_gold',
    hmb_active_festival_key: 'sattvic_default',
    hmb_banner_enabled: true,
    hmb_banner_badge: '🪔 शुभ उत्सव • Deepavali, Sharadotsav & Chhath Parva',
    hmb_banner_headline: 'तमसो मा ज्योतिर्गमय — Lead Us From Darkness Unto Sacred Light',
    hmb_banner_subtext: 'Explore special festive discourses on Deepavali, Durga Puja, Chhath Puja, Bhai Dooj, Ganesh Chaturthi & Vasant Holi.',
    hmb_banner_cta_label: 'Read Festive Discourses →',
    hmb_banner_cta_category: 'Dharmic Living & Festivals',
    hmb_daily_mantra_sanskrit: 'ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥',
    hmb_daily_mantra_meaning: 'May all sentient beings be at peace; may no one suffer from illness; may all see what is auspicious; may no one suffer.'
  }),
  contact: hmbLoadLocal(HMB_STORAGE_KEYS.CONTACT, {
    hmb_sanctuary_name: 'ॐ हरि Blogging — Sanatana Vangmaya पीठम्',
    hmb_contact_email: 'samparka@hariomblogging.org',
    hmb_contact_phone: '+91 (0542) 250-1088',
    hmb_contact_address: 'Assi Ghat Dharmic Granthagar, Kashi Vishwanath Corridor Marg, Varanasi, Uttar Pradesh 221005, Bharat',
    hmb_contact_hours: 'Brahma Muhurta 04:30 AM – Sandhya 08:30 PM IST (All Days)',
    hmb_social_x_handle: '@HariOmBlogging',
    hmb_social_youtube: 'youtube.com/@HariOmVangmaya',
    hmb_footer_blessing: 'लोकाः समस्ताः सुखिनो भवन्तु • धर्मो रक्षति रक्षितः'
  }),
  posts: hmbLoadLocal(HMB_STORAGE_KEYS.POSTS, HMB_INITIAL_POSTS),
  quickReads: hmbLoadLocal(HMB_STORAGE_KEYS.QUICK_READS, HMB_INITIAL_QUICK_READS),
  auditLogs: hmbLoadLocal(HMB_STORAGE_KEYS.AUDIT_LOGS, [
    {
      hmb_audit_id: 1,
      hmb_audit_action_type: 'INITIAL_DATABASE_SEED',
      hmb_audit_entity_name: 'hmb_blog_posts_tbl',
      hmb_audit_entity_ref: 'seed_v2',
      hmb_audit_summary: 'Initialized ॐ हरि Blogging schema and seeded 8 Dharmic discourses & 6 Quick-Reads.',
      hmb_audit_actor: 'system_seed',
      hmb_audit_created_at: new Date().toISOString()
    }
  ]),
  bookmarks: hmbLoadLocal(HMB_STORAGE_KEYS.BOOKMARKS, []),
  isAdminAuthenticated: Boolean(savedAuth && savedAuth.authenticated && savedAuth.username && savedAuth.password),
  adminCreds: {
    username: (savedAuth && savedAuth.username) || '',
    password: (savedAuth && savedAuth.password) || ''
  },

  // Feed Filter & Pagination State
  feedCategory: 'all',
  feedSearch: '',
  feedSort: 'latest',
  feedDuration: 'all',
  feedTag: '',
  feedFeaturedOnly: false,
  feedSavedOnly: false,
  feedLayout: 'grid',
  feedPage: 1,
  feedPageSize: 6,
  quickCategory: 'all',

  // Reader Modal State
  activePostId: null,
  readerFontScale: 0,

  // Naada Drone Audio State
  naadaPlaying: false,
  naadaCtx: null,
  naadaNodes: []
};

// =========================================================================
// 4. NETLIFY SERVERLESS & NEONDB API CLIENT
// =========================================================================
async function hmbApiRequest(method, resourcePath, bodyPayload = null, customCreds = null) {
  try {
    if (!window.location || !window.location.origin || window.location.protocol === 'file:' || window.location.origin === 'null') {
      return { ok: false, offline: true, status: 0, data: null };
    }

    const endpoint = window.location.origin + '/api' + resourcePath;
    const headers = { 'Content-Type': 'application/json' };

    const activeUser = customCreds ? customCreds.username : hmbState.adminCreds.username;
    const activePass = customCreds ? customCreds.password : hmbState.adminCreds.password;

    if (activeUser && activePass) {
      headers['X-HMB-Admin-User'] = activeUser;
      headers['X-HMB-Admin-Password'] = activePass;
    }

    const fetchOpts = { method, headers };
    if (bodyPayload && method !== 'GET') {
      const enrichedBody = { ...bodyPayload };
      if (activeUser && activePass && !enrichedBody.username) {
        enrichedBody._adminUser = activeUser;
        enrichedBody._adminPassword = activePass;
      }
      fetchOpts.body = JSON.stringify(enrichedBody);
    }

    const res = await fetch(endpoint, fetchOpts);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return { ok: false, offline: true, status: res.status, data: null };
    }
    const data = await res.json();
    return { ok: res.ok, offline: false, status: res.status, data };
  } catch (err) {
    return { ok: false, offline: true, status: 0, error: err.message, data: null };
  }
}

async function hmbLoadBootstrapFromDatabase() {
  const res = await hmbApiRequest('GET', '/bootstrap');
  if (res.ok && res.data && res.data.connected) {
    hmbState.dbConnected = true;
    if (res.data.config) {
      hmbState.config = { ...hmbState.config, ...res.data.config };
      hmbSaveLocal(HMB_STORAGE_KEYS.CONFIG, hmbState.config);
    }
    if (res.data.contact) {
      hmbState.contact = { ...hmbState.contact, ...res.data.contact };
      hmbSaveLocal(HMB_STORAGE_KEYS.CONTACT, hmbState.contact);
    }
    if (Array.isArray(res.data.posts)) {
      hmbState.posts = res.data.posts.map((p) => ({
        ...p,
        hmb_post_published_date: hmbFormatDate(p.hmb_post_published_date)
      }));
      hmbSaveLocal(HMB_STORAGE_KEYS.POSTS, hmbState.posts);
    }
    if (Array.isArray(res.data.quickReads)) {
      hmbState.quickReads = res.data.quickReads;
      hmbSaveLocal(HMB_STORAGE_KEYS.QUICK_READS, hmbState.quickReads);
    }
    hmbApplySiteConfigToDOM();
    hmbApplyGlobalTranslations();
    hmbRenderAdminDashboard();
    return true;
  }
  return false;
}

async function hmbFetchAuditLogsFromDatabase() {
  if (!hmbState.isAdminAuthenticated) return;
  const res = await hmbApiRequest('GET', '/audit-logs');
  if (res.ok && res.data && Array.isArray(res.data.auditLogs)) {
    hmbState.auditLogs = res.data.auditLogs;
    hmbSaveLocal(HMB_STORAGE_KEYS.AUDIT_LOGS, hmbState.auditLogs);
    hmbRenderAuditLogs();
  }
}

function hmbRecordLocalAuditLog(actionType, entityName, entityRef, summary, payload = {}) {
  const entry = {
    hmb_audit_id: Date.now(),
    hmb_audit_action_type: actionType,
    hmb_audit_entity_name: entityName,
    hmb_audit_entity_ref: String(entityRef || ''),
    hmb_audit_summary: summary,
    hmb_audit_payload_json: payload,
    hmb_audit_actor: hmbState.adminCreds.username || 'pradhan_sevak',
    hmb_audit_created_at: new Date().toISOString()
  };
  hmbState.auditLogs.unshift(entry);
  hmbSaveLocal(HMB_STORAGE_KEYS.AUDIT_LOGS, hmbState.auditLogs);
  hmbRenderAuditLogs();
}

function hmbHandleUnauthorizedError() {
  hmbState.isAdminAuthenticated = false;
  hmbState.adminCreds = { username: '', password: '' };
  hmbSaveLocal(HMB_STORAGE_KEYS.ADMIN_AUTH, { authenticated: false, username: '', password: '' });
  hmbUpdateAdminButtonBadge();
  hmbSwitchMainView('feed');
  hmbOpenAdminLoginModal('Your admin session expired or credentials changed. Please log in with your Netlify ADMIN_USERNAME and ADMIN_PASSWORD.');
}

function hmbShowToast(message, icon = '🪷') {
  const container = document.getElementById('hmb-toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-semibold transition-all duration-300';
  toast.style.backgroundColor = 'var(--hmb-bg-card)';
  toast.style.borderColor = 'var(--hmb-accent-primary)';
  toast.style.color = 'var(--hmb-text-primary)';
  toast.innerHTML = `<span class="text-lg">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 300);
  }, 3600);
}

// =========================================================================
// 5. MULTILINGUAL LOCALIZATION ENGINE (EN, HI, BN, SA)
// =========================================================================
function hmbGetPostLocalized(post, lang) {
  if (lang === 'en') {
    return {
      title: post.hmb_post_title,
      subtitle: post.hmb_post_subtitle,
      excerpt: post.hmb_post_excerpt,
      contentHtml: post.hmb_post_content_html
    };
  }
  const trans = (post.hmb_post_translations_json && post.hmb_post_translations_json[lang]) || null;
  if (trans && (trans.title || trans.content_html)) {
    return {
      title: trans.title || post.hmb_post_title,
      subtitle: trans.subtitle || post.hmb_post_subtitle,
      excerpt: trans.excerpt || post.hmb_post_excerpt,
      contentHtml: trans.content_html || post.hmb_post_content_html
    };
  }
  return hmbAutoLocalizeCustomPost(post, lang);
}

function hmbAutoLocalizeCustomPost(post, lang) {
  const prefixes = {
    hi: {
      tag: '【हिन्दी】 ',
      note: '<p class="text-xs italic opacity-80 mb-3">🕉️ सनातन वाङ्मय अनुवाद उपयोगिता द्वारा हिन्दी में प्रस्तुत:</p>'
    },
    bn: {
      tag: '【বাংলা】 ',
      note: '<p class="text-xs italic opacity-80 mb-3">🪷 সনাতন বাঙ্ময় অনুবাদ ইউটিলিটি দ্বারা বাংলায় উপস্থাপিত:</p>'
    },
    sa: {
      tag: '【संस्कृतम्】 ',
      note: '<p class="text-xs italic opacity-80 mb-3">📜 देववाणी-अनुवादोपकरणेन संस्कृतेन प्रस्तुतम्:</p>'
    }
  };
  const p = prefixes[lang] || { tag: '', note: '' };
  return {
    title: p.tag + post.hmb_post_title,
    subtitle: post.hmb_post_subtitle,
    excerpt: post.hmb_post_excerpt,
    contentHtml: p.note + post.hmb_post_content_html
  };
}

function hmbGetQuickReadLocalized(q, lang) {
  if (lang === 'en') {
    return { title: q.hmb_quick_title, summary: q.hmb_quick_summary };
  }
  const trans = (q.hmb_quick_translations_json && q.hmb_quick_translations_json[lang]) || null;
  if (trans) {
    return {
      title: trans.title || q.hmb_quick_title,
      summary: trans.summary || q.hmb_quick_summary
    };
  }
  return { title: q.hmb_quick_title, summary: q.hmb_quick_summary };
}

function hmbApplyGlobalTranslations() {
  const lang = hmbState.config.hmb_active_language || 'en';
  const dict = HMB_UI_TRANSLATIONS[lang] || HMB_UI_TRANSLATIONS.en;

  document.documentElement.lang = lang;
  const langSelect = document.getElementById('hmb-lang-select');
  if (langSelect) langSelect.value = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  const searchInput = document.getElementById('hmb-search-input');
  if (searchInput && dict.search_placeholder) {
    searchInput.placeholder = dict.search_placeholder;
  }

  ['en', 'hi', 'bn', 'sa'].forEach((code) => {
    const btn = document.getElementById('hmb-admin-lang-' + code);
    if (btn) {
      btn.className = `w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${code === lang ? 'hmb-pill-active' : 'hmb-btn-outline'}`;
    }
  });

  hmbRenderHeroSpotlight();
  hmbRenderCategoryPills();
  hmbRenderFeed();
  hmbRenderQuickReads();
}

async function hmbChangeLanguage(langCode, fromAdmin = false) {
  hmbState.config.hmb_active_language = langCode;
  hmbSaveLocal(HMB_STORAGE_KEYS.CONFIG, hmbState.config);
  hmbApplyGlobalTranslations();

  const langNames = {
    en: 'English',
    hi: 'हिन्दी (Hindi)',
    bn: 'বাংলা (Bengali)',
    sa: 'संस्कृतम् (Sanskrit)'
  };

  if (fromAdmin || hmbState.isAdminAuthenticated) {
    const res = await hmbApiRequest('PUT', '/config', hmbState.config);
    if (res.status === 401) {
      hmbHandleUnauthorizedError();
      return;
    }
    if (res.ok && res.data && res.data.config) {
      hmbState.config = { ...hmbState.config, ...res.data.config };
      hmbSaveLocal(HMB_STORAGE_KEYS.CONFIG, hmbState.config);
      await hmbFetchAuditLogsFromDatabase();
    } else if (res.offline) {
      hmbRecordLocalAuditLog('CHANGE_SITE_LANGUAGE', 'hmb_site_config_tbl', langCode, `Changed global website language to ${langNames[langCode] || langCode}`);
    }
  }
  hmbShowToast(`Website language set to ${langNames[langCode] || langCode}`, '🌐');
}

// =========================================================================
// 6. THEME, BANNER & CONTACT DOM BINDING
// =========================================================================
function hmbApplySiteConfigToDOM() {
  const cfg = hmbState.config;
  document.documentElement.setAttribute('data-theme', cfg.hmb_active_theme || 'sattvic_gold');

  const brandTitle = document.getElementById('hmb-brand-title');
  if (brandTitle) brandTitle.textContent = cfg.hmb_site_title || 'ॐ हरि Blogging';

  const heroHeading = document.getElementById('hmb-hero-heading');
  if (heroHeading) heroHeading.textContent = cfg.hmb_site_title || 'ॐ हरि Blogging';

  const brandSub = document.getElementById('hmb-brand-subtitle');
  if (brandSub) brandSub.textContent = cfg.hmb_site_subtitle || '';

  const bannerWrap = document.getElementById('hmb-festive-banner');
  if (bannerWrap) {
    bannerWrap.style.display = cfg.hmb_banner_enabled ? 'block' : 'none';
  }
  const badgeEl = document.getElementById('hmb-banner-badge-el');
  if (badgeEl) badgeEl.textContent = cfg.hmb_banner_badge;
  const headEl = document.getElementById('hmb-banner-headline-el');
  if (headEl) headEl.textContent = cfg.hmb_banner_headline;
  const subEl = document.getElementById('hmb-banner-subtext-el');
  if (subEl) subEl.textContent = '• ' + cfg.hmb_banner_subtext;
  const ctaBtn = document.getElementById('hmb-banner-cta-btn');
  if (ctaBtn) ctaBtn.textContent = cfg.hmb_banner_cta_label || 'Explore →';

  const mantraSa = document.getElementById('hmb-daily-mantra-sanskrit');
  if (mantraSa) mantraSa.textContent = cfg.hmb_daily_mantra_sanskrit;
  const mantraMeaning = document.getElementById('hmb-daily-mantra-meaning');
  if (mantraMeaning) mantraMeaning.textContent = '"' + cfg.hmb_daily_mantra_meaning + '"';

  // Contact Footer
  const ct = hmbState.contact;
  const fName = document.getElementById('hmb-footer-sanctuary-name');
  if (fName) fName.textContent = ct.hmb_sanctuary_name;
  const fAddr = document.getElementById('hmb-footer-address');
  if (fAddr) fAddr.textContent = '📍 ' + ct.hmb_contact_address;
  const fEmail = document.getElementById('hmb-footer-email');
  if (fEmail) fEmail.textContent = '✉️ ' + ct.hmb_contact_email;
  const fPhone = document.getElementById('hmb-footer-phone');
  if (fPhone) fPhone.textContent = '📞 ' + ct.hmb_contact_phone;
  const fHours = document.getElementById('hmb-footer-hours');
  if (fHours) fHours.textContent = '🕰️ ' + ct.hmb_contact_hours;
  const fX = document.getElementById('hmb-footer-social-x');
  if (fX) fX.textContent = '𝕏 ' + ct.hmb_social_x_handle;
  const fYt = document.getElementById('hmb-footer-social-yt');
  if (fYt) fYt.textContent = '▶ ' + ct.hmb_social_youtube;
  const fBless = document.getElementById('hmb-footer-blessing-el');
  if (fBless) fBless.textContent = ct.hmb_footer_blessing;

  // Populate Admin Customizer inputs
  const inTitle = document.getElementById('hmb-cfg-site-title');
  if (inTitle) inTitle.value = cfg.hmb_site_title || 'ॐ हरि Blogging';
  const inTheme = document.getElementById('hmb-cfg-theme-select');
  if (inTheme) inTheme.value = cfg.hmb_active_theme || 'sattvic_gold';
  const inBannerChk = document.getElementById('hmb-cfg-banner-enabled');
  if (inBannerChk) inBannerChk.checked = Boolean(cfg.hmb_banner_enabled);
  const inBadge = document.getElementById('hmb-cfg-banner-badge');
  if (inBadge) inBadge.value = cfg.hmb_banner_badge || '';
  const inCta = document.getElementById('hmb-cfg-banner-cta');
  if (inCta) inCta.value = cfg.hmb_banner_cta_label || '';
  const inHead = document.getElementById('hmb-cfg-banner-headline');
  if (inHead) inHead.value = cfg.hmb_banner_headline || '';
  const inSub = document.getElementById('hmb-cfg-banner-subtext');
  if (inSub) inSub.value = cfg.hmb_banner_subtext || '';
  const inMantraSa = document.getElementById('hmb-cfg-mantra-sa');
  if (inMantraSa) inMantraSa.value = cfg.hmb_daily_mantra_sanskrit || '';
  const inMantraEn = document.getElementById('hmb-cfg-mantra-meaning');
  if (inMantraEn) inMantraEn.value = cfg.hmb_daily_mantra_meaning || '';

  // Populate Admin Contact inputs
  const ctName = document.getElementById('hmb-ct-name');
  if (ctName) ctName.value = ct.hmb_sanctuary_name || '';
  const ctEmail = document.getElementById('hmb-ct-email');
  if (ctEmail) ctEmail.value = ct.hmb_contact_email || '';
  const ctPhone = document.getElementById('hmb-ct-phone');
  if (ctPhone) ctPhone.value = ct.hmb_contact_phone || '';
  const ctAddr = document.getElementById('hmb-ct-address');
  if (ctAddr) ctAddr.value = ct.hmb_contact_address || '';
  const ctHours = document.getElementById('hmb-ct-hours');
  if (ctHours) ctHours.value = ct.hmb_contact_hours || '';
  const ctX = document.getElementById('hmb-ct-social-x');
  if (ctX) ctX.value = ct.hmb_social_x_handle || '';
  const ctYt = document.getElementById('hmb-ct-social-yt');
  if (ctYt) ctYt.value = ct.hmb_social_youtube || '';
  const ctBless = document.getElementById('hmb-ct-blessing');
  if (ctBless) ctBless.value = ct.hmb_footer_blessing || '';
}

function hmbDismissBanner() {
  const bannerWrap = document.getElementById('hmb-festive-banner');
  if (bannerWrap) bannerWrap.style.display = 'none';
}

function hmbTriggerBannerCta() {
  const targetCat = hmbState.config.hmb_banner_cta_category || 'all';
  hmbSwitchMainView('feed');
  hmbSelectCategory(targetCat);
  hmbScrollToSection('hmb-feed-controls');
}

// =========================================================================
// 7. HERO SPOTLIGHT & COMMON FEED RENDERING
// =========================================================================
function hmbRenderHeroSpotlight() {
  const cardEl = document.getElementById('hmb-hero-spotlight-card');
  if (!cardEl || !hmbState.posts.length) return;
  const lang = hmbState.config.hmb_active_language || 'en';
  const dict = HMB_UI_TRANSLATIONS[lang] || HMB_UI_TRANSLATIONS.en;

  const featured = hmbState.posts.find((p) => p.hmb_post_is_featured) || hmbState.posts[0];
  const loc = hmbGetPostLocalized(featured, lang);

  cardEl.innerHTML = `
    <div class="relative h-48 overflow-hidden">
      <img src="${hmbResolveImg(featured.hmb_post_cover_image)}" alt="${loc.title}" class="w-full h-full object-cover" />
      <div class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-950 shadow">
        ⭐ Featured Grantha
      </div>
      <div class="absolute bottom-2 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/70 text-amber-200">
        ⏱️ ${featured.hmb_post_reading_minutes} ${dict.min_read_suffix}
      </div>
    </div>
    <div class="p-5 space-y-3">
      <div class="text-xs font-semibold text-amber-300 uppercase tracking-wider">
        ${hmbLocalizeCategory(featured.hmb_post_category, lang)}
      </div>
      <h3 class="text-lg sm:text-xl font-bold hmb-font-serif leading-snug line-clamp-2">
        ${loc.title}
      </h3>
      <p class="text-xs sm:text-sm text-amber-100/85 line-clamp-2">
        ${loc.excerpt}
      </p>
      <div class="pt-2 border-t border-amber-300/20 flex items-center justify-between text-xs text-amber-200">
        <span>✍️ ${featured.hmb_post_author_name}</span>
        <button type="button" onclick="hmbOpenReaderModal(${featured.hmb_post_id})" class="px-3.5 py-1.5 rounded-lg font-bold bg-amber-300 text-amber-950 hover:bg-amber-200 transition">
          ${dict.read_discourse_btn}
        </button>
      </div>
    </div>
  `;
}

function hmbOpenFeaturedDiscourse() {
  const featured = hmbState.posts.find((p) => p.hmb_post_is_featured) || hmbState.posts[0];
  if (featured) hmbOpenReaderModal(featured.hmb_post_id);
}

function hmbRenderCategoryPills() {
  const container = document.getElementById('hmb-category-pills-container');
  if (!container) return;
  const lang = hmbState.config.hmb_active_language || 'en';

  const categories = [
    'all',
    'Vedanta & Upanishads',
    'Itihasa & Puranas',
    'Temple Architecture',
    'Yoga & Ayurveda',
    'Sanskrit & Mantras',
    'Dharmic Living & Festivals'
  ];

  container.innerHTML = categories.map((cat) => {
    const count = cat === 'all'
      ? hmbState.posts.length
      : hmbState.posts.filter((p) => p.hmb_post_category === cat).length;
    const activeClass = hmbState.feedCategory === cat ? 'hmb-pill-active' : 'hmb-btn-outline';
    const label = hmbLocalizeCategory(cat, lang);
    return `
      <button
        type="button"
        onclick="hmbSelectCategory('${cat.replace(/'/g, "\\'")}')"
        class="${activeClass} px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold shrink-0 flex items-center gap-1.5"
      >
        <span>${label}</span>
        <span class="px-1.5 py-0.2 rounded-full text-xs opacity-80 bg-black/10">${count}</span>
      </button>
    `;
  }).join('');

  const tagContainer = document.getElementById('hmb-tag-cloud-container');
  if (tagContainer) {
    const allTags = new Set();
    hmbState.posts.forEach((p) => (p.hmb_post_tags || []).forEach((t) => allTags.add(t)));
    const tagList = Array.from(allTags).slice(0, 10);
    tagContainer.innerHTML = `<span class="font-bold opacity-75 mr-1">🏷️ Topics:</span>` + tagList.map((tag) => {
      const isAct = hmbState.feedTag === tag;
      return `
        <button
          type="button"
          onclick="hmbSelectTag('${tag.replace(/'/g, "\\'")}')"
          class="${isAct ? 'hmb-pill-active' : 'hmb-btn-outline'} px-2.5 py-0.5 rounded-full text-xs font-medium"
        >
          #${tag}
        </button>
      `;
    }).join('');
  }
}

function hmbGetFilteredAndSortedPosts() {
  const lang = hmbState.config.hmb_active_language || 'en';
  const q = (hmbState.feedSearch || '').trim().toLowerCase();

  let filtered = hmbState.posts.filter((p) => {
    if (hmbState.feedCategory !== 'all' && p.hmb_post_category !== hmbState.feedCategory) return false;
    if (hmbState.feedTag && !(p.hmb_post_tags || []).includes(hmbState.feedTag)) return false;
    if (hmbState.feedFeaturedOnly && !p.hmb_post_is_featured) return false;
    if (hmbState.feedSavedOnly && !hmbState.bookmarks.includes(Number(p.hmb_post_id))) return false;

    if (hmbState.feedDuration === 'short' && p.hmb_post_reading_minutes >= 8) return false;
    if (hmbState.feedDuration === 'medium' && (p.hmb_post_reading_minutes < 8 || p.hmb_post_reading_minutes > 14)) return false;
    if (hmbState.feedDuration === 'long' && p.hmb_post_reading_minutes < 15) return false;

    if (q) {
      const loc = hmbGetPostLocalized(p, lang);
      const haystack = [
        p.hmb_post_title,
        p.hmb_post_subtitle,
        p.hmb_post_excerpt,
        p.hmb_post_author_name,
        p.hmb_post_shloka_sanskrit,
        (p.hmb_post_tags || []).join(' '),
        loc.title,
        loc.excerpt
      ].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (hmbState.feedSort === 'latest') {
      return hmbFormatDate(b.hmb_post_published_date).localeCompare(hmbFormatDate(a.hmb_post_published_date)) || (b.hmb_post_id - a.hmb_post_id);
    }
    if (hmbState.feedSort === 'oldest') {
      return hmbFormatDate(a.hmb_post_published_date).localeCompare(hmbFormatDate(b.hmb_post_published_date)) || (a.hmb_post_id - b.hmb_post_id);
    }
    if (hmbState.feedSort === 'popular') {
      return (b.hmb_post_views_count || 0) - (a.hmb_post_views_count || 0);
    }
    if (hmbState.feedSort === 'appreciated') {
      return (b.hmb_post_likes_count || 0) - (a.hmb_post_likes_count || 0);
    }
    if (hmbState.feedSort === 'longest') {
      return (b.hmb_post_word_count || 0) - (a.hmb_post_word_count || 0);
    }
    if (hmbState.feedSort === 'shortest') {
      return (a.hmb_post_word_count || 0) - (b.hmb_post_word_count || 0);
    }
    if (hmbState.feedSort === 'title_asc') {
      return String(a.hmb_post_title).localeCompare(String(b.hmb_post_title));
    }
    return 0;
  });

  return filtered;
}

function hmbRenderFeed() {
  const gridEl = document.getElementById('hmb-posts-grid');
  if (!gridEl) return;
  const lang = hmbState.config.hmb_active_language || 'en';
  const dict = HMB_UI_TRANSLATIONS[lang] || HMB_UI_TRANSLATIONS.en;

  const filtered = hmbGetFilteredAndSortedPosts();
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / hmbState.feedPageSize));
  if (hmbState.feedPage > totalPages) hmbState.feedPage = totalPages;

  const startIdx = (hmbState.feedPage - 1) * hmbState.feedPageSize;
  const pageItems = filtered.slice(startIdx, startIdx + hmbState.feedPageSize);

  const summaryEl = document.getElementById('hmb-feed-results-summary');
  if (summaryEl) {
    summaryEl.textContent = total === 0
      ? '0 discourses match your current filter'
      : `Showing ${startIdx + 1}–${Math.min(startIdx + pageItems.length, total)} of ${total} Discourses`;
  }

  const hasFilters = hmbState.feedCategory !== 'all' || hmbState.feedSearch !== '' || hmbState.feedDuration !== 'all' || hmbState.feedTag !== '' || hmbState.feedFeaturedOnly || hmbState.feedSavedOnly;
  const resetBtn = document.getElementById('hmb-reset-filters-btn');
  if (resetBtn) resetBtn.classList.toggle('hidden', !hasFilters);

  const featBtn = document.getElementById('hmb-filter-featured-btn');
  if (featBtn) featBtn.className = (hmbState.feedFeaturedOnly ? 'hmb-pill-active' : 'hmb-btn-outline') + ' px-3 py-1 rounded-full text-xs font-medium';
  const savedBtn = document.getElementById('hmb-filter-saved-btn');
  if (savedBtn) savedBtn.className = (hmbState.feedSavedOnly ? 'hmb-pill-active' : 'hmb-btn-outline') + ' px-3 py-1 rounded-full text-xs font-medium';

  const bmBadge = document.getElementById('hmb-bookmark-badge');
  if (bmBadge) bmBadge.textContent = String(hmbState.bookmarks.length);

  gridEl.className = hmbState.feedLayout === 'list'
    ? 'grid grid-cols-1 gap-5'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  if (pageItems.length === 0) {
    gridEl.innerHTML = `
      <div class="col-span-full hmb-card rounded-3xl p-10 text-center space-y-3">
        <div class="text-4xl">🪷</div>
        <h3 class="text-lg font-bold hmb-font-serif">No Dharmic Discourses Found for Current Filter</h3>
        <p class="text-sm max-w-md mx-auto" style="color: var(--hmb-text-secondary);">
          Try clearing your search query or resetting category and reading-time filters to explore all published granthas.
        </p>
        <button type="button" onclick="hmbResetAllFeedFilters()" class="hmb-btn-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold">
          ↺ Show All Discourses
        </button>
      </div>
    `;
  } else {
    gridEl.innerHTML = pageItems.map((post) => {
      const loc = hmbGetPostLocalized(post, lang);
      const isSaved = hmbState.bookmarks.includes(Number(post.hmb_post_id));
      const isList = hmbState.feedLayout === 'list';
      const pubDate = hmbFormatDate(post.hmb_post_published_date);

      return `
        <article class="hmb-card rounded-2xl overflow-hidden flex ${isList ? 'flex-col md:flex-row' : 'flex-col'} justify-between group">
          <div class="${isList ? 'md:w-72 shrink-0' : 'w-full'} relative h-52 overflow-hidden">
            <img src="${hmbResolveImg(post.hmb_post_cover_image)}" alt="${loc.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold shadow backdrop-blur-md" style="background-color: var(--hmb-bg-card); color: var(--hmb-accent-primary);">
                ${hmbLocalizeCategory(post.hmb_post_category, lang)}
              </span>
              ${post.hmb_post_is_featured ? '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-950 shadow">⭐ Featured</span>' : ''}
            </div>
            <button
              type="button"
              onclick="hmbToggleBookmark(${post.hmb_post_id})"
              title="Bookmark Discourse"
              class="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow backdrop-blur-md transition ${isSaved ? 'bg-amber-400 text-amber-950' : 'bg-black/60 text-white hover:bg-black/80'}"
            >
              🔖
            </button>
            <div class="absolute bottom-2.5 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/75 text-amber-100">
              ⏱️ ${post.hmb_post_reading_minutes} ${dict.min_read_suffix} • ${post.hmb_post_word_count} ${dict.words_suffix}
            </div>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div class="space-y-2.5">
              ${post.hmb_post_shloka_sanskrit ? `
                <div class="text-xs font-semibold px-3 py-1.5 rounded-lg border-l-2 hmb-font-sanskrit line-clamp-1" style="background-color: var(--hmb-bg-elevated); border-color: var(--hmb-accent-primary); color: var(--hmb-text-secondary);">
                  🕉️ ${post.hmb_post_shloka_sanskrit}
                </div>
              ` : ''}

              <h3 onclick="hmbOpenReaderModal(${post.hmb_post_id})" class="text-lg sm:text-xl font-bold hmb-font-serif leading-snug cursor-pointer hover:underline line-clamp-2">
                ${loc.title}
              </h3>

              <p class="text-xs sm:text-sm line-clamp-3 leading-relaxed" style="color: var(--hmb-text-secondary);">
                ${loc.excerpt}
              </p>

              <div class="flex flex-wrap gap-1 pt-1">
                ${(post.hmb_post_tags || []).slice(0, 4).map((t) => `
                  <button type="button" onclick="hmbSelectTag('${String(t).replace(/'/g, "\\'")}')" class="text-xs px-2 py-0.5 rounded-md border hover:opacity-80" style="background-color: var(--hmb-bg-primary); border-color: var(--hmb-border); color: var(--hmb-text-muted);">
                    #${t}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="pt-3 border-t flex items-center justify-between gap-2 text-xs" style="border-color: var(--hmb-border);">
              <div>
                <div class="font-bold">${post.hmb_post_author_name}</div>
                <div style="color: var(--hmb-text-muted);">${pubDate} • 🙏 ${post.hmb_post_likes_count}</div>
              </div>
              <button
                type="button"
                onclick="hmbOpenReaderModal(${post.hmb_post_id})"
                class="hmb-btn-primary px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm shrink-0"
              >
                ${dict.read_discourse_btn}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  hmbRenderPagination(total, totalPages);
}

function hmbRenderPagination(totalItems, totalPages) {
  const bar = document.getElementById('hmb-pagination-bar');
  if (!bar) return;

  const cur = hmbState.feedPage;
  let pageButtonsHtml = '';
  for (let i = 1; i <= totalPages; i++) {
    const isCurrent = i === cur;
    pageButtonsHtml += `
      <button
        type="button"
        onclick="hmbGoToFeedPage(${i})"
        class="${isCurrent ? 'hmb-pill-active' : 'hmb-btn-outline'} w-9 h-9 rounded-xl text-xs font-bold"
      >
        ${i}
      </button>
    `;
  }

  bar.innerHTML = `
    <div class="text-xs sm:text-sm font-medium" style="color: var(--hmb-text-secondary);">
      Page <strong>${cur}</strong> of <strong>${totalPages}</strong> (${totalItems} total discourses)
    </div>
    <div class="flex items-center gap-1.5">
      <button
        type="button"
        onclick="hmbGoToFeedPage(${Math.max(1, cur - 1)})"
        ${cur <= 1 ? 'disabled' : ''}
        class="hmb-btn-outline px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40"
      >
        ← Prev
      </button>
      ${pageButtonsHtml}
      <button
        type="button"
        onclick="hmbGoToFeedPage(${Math.min(totalPages, cur + 1)})"
        ${cur >= totalPages ? 'disabled' : ''}
        class="hmb-btn-outline px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40"
      >
        Next →
      </button>
    </div>
  `;
}

// Feed Filter Actions
function hmbSelectCategory(cat) {
  hmbState.feedCategory = cat;
  hmbState.feedPage = 1;
  hmbRenderCategoryPills();
  hmbRenderFeed();
}

function hmbSelectTag(tag) {
  hmbState.feedTag = hmbState.feedTag === tag ? '' : tag;
  hmbState.feedPage = 1;
  hmbRenderCategoryPills();
  hmbRenderFeed();
}

function hmbOnSearchInput(val) {
  hmbState.feedSearch = val;
  const inputEl = document.getElementById('hmb-search-input');
  if (inputEl && inputEl.value !== val) inputEl.value = val;
  const clearBtn = document.getElementById('hmb-clear-search-btn');
  if (clearBtn) clearBtn.classList.toggle('hidden', !val);
  hmbState.feedPage = 1;
  hmbRenderFeed();
}

function hmbOnSortChange(val) {
  hmbState.feedSort = val;
  hmbState.feedPage = 1;
  hmbRenderFeed();
}

function hmbOnDurationChange(val) {
  hmbState.feedDuration = val;
  hmbState.feedPage = 1;
  hmbRenderFeed();
}

function hmbOnPageSizeChange(val) {
  hmbState.feedPageSize = parseInt(val, 10) || 6;
  hmbState.feedPage = 1;
  hmbRenderFeed();
}

function hmbSetFeedLayout(mode) {
  hmbState.feedLayout = mode;
  hmbRenderFeed();
}

function hmbToggleFeaturedOnly() {
  hmbState.feedFeaturedOnly = !hmbState.feedFeaturedOnly;
  hmbState.feedPage = 1;
  hmbRenderFeed();
}

function hmbFilterByBookmarks() {
  hmbSwitchMainView('feed');
  hmbState.feedSavedOnly = !hmbState.feedSavedOnly;
  hmbState.feedPage = 1;
  hmbRenderFeed();
  if (hmbState.feedSavedOnly) {
    hmbScrollToSection('hmb-feed-controls');
  }
}

function hmbResetAllFeedFilters() {
  hmbState.feedCategory = 'all';
  hmbState.feedSearch = '';
  hmbState.feedSort = 'latest';
  hmbState.feedDuration = 'all';
  hmbState.feedTag = '';
  hmbState.feedFeaturedOnly = false;
  hmbState.feedSavedOnly = false;
  hmbState.feedPage = 1;

  const sIn = document.getElementById('hmb-search-input');
  if (sIn) sIn.value = '';
  const sortSel = document.getElementById('hmb-sort-select');
  if (sortSel) sortSel.value = 'latest';
  const durSel = document.getElementById('hmb-duration-select');
  if (durSel) durSel.value = 'all';

  hmbRenderCategoryPills();
  hmbRenderFeed();
}

function hmbGoToFeedPage(pageNum) {
  hmbState.feedPage = pageNum;
  hmbRenderFeed();
  hmbScrollToSection('hmb-feed-controls');
}

function hmbToggleBookmark(postId) {
  const numId = Number(postId);
  const idx = hmbState.bookmarks.indexOf(numId);
  if (idx === -1) {
    hmbState.bookmarks.push(numId);
    hmbShowToast('Saved discourse to My Granthagar bookmarks', '🔖');
  } else {
    hmbState.bookmarks.splice(idx, 1);
    hmbShowToast('Removed discourse from bookmarks', '🔖');
  }
  hmbSaveLocal(HMB_STORAGE_KEYS.BOOKMARKS, hmbState.bookmarks);
  hmbRenderFeed();
  if (Number(hmbState.activePostId) === numId) {
    hmbUpdateReaderBookmarkButton();
  }
}

// =========================================================================
// 8. QUICK-READS (NITYA SUBHASHITA) RENDERING
// =========================================================================
function hmbRenderQuickReads() {
  const catWrap = document.getElementById('hmb-quick-category-filters');
  const gridEl = document.getElementById('hmb-quick-reads-grid');
  if (!gridEl) return;
  const lang = hmbState.config.hmb_active_language || 'en';

  const cats = ['all', 'Subhashita', 'Upanishad Sutra', 'Puranic Fable', 'Ayurveda & Dinacharya'];
  if (catWrap) {
    catWrap.innerHTML = cats.map((c) => {
      const isAct = hmbState.quickCategory === c;
      return `
        <button
          type="button"
          onclick="hmbSelectQuickCategory('${c.replace(/'/g, "\\'")}')"
          class="${isAct ? 'hmb-pill-active' : 'hmb-btn-outline'} px-3 py-1 rounded-full text-xs font-semibold"
        >
          ${c === 'all' ? 'All Subhashitas' : c}
        </button>
      `;
    }).join('');
  }

  const items = hmbState.quickReads.filter((q) => hmbState.quickCategory === 'all' || q.hmb_quick_category === hmbState.quickCategory);
  gridEl.innerHTML = items.map((q) => {
    const loc = hmbGetQuickReadLocalized(q, lang);
    return `
      <div class="hmb-card rounded-2xl p-5 flex flex-col justify-between space-y-3 relative overflow-hidden">
        <div class="space-y-2.5">
          <div class="flex items-center justify-between text-xs">
            <span class="px-2.5 py-0.5 rounded-full font-bold" style="background-color: var(--hmb-pill-bg); color: var(--hmb-accent-primary);">
              ${q.hmb_quick_category}
            </span>
            <span style="color: var(--hmb-text-muted);">⚡ ${q.hmb_quick_reading_seconds || 60}s read</span>
          </div>
          <h3 class="text-base sm:text-lg font-bold hmb-font-serif">${loc.title}</h3>
          <div class="p-3 rounded-xl border-l-2 hmb-font-sanskrit text-sm font-semibold leading-relaxed" style="background-color: var(--hmb-bg-elevated); border-color: var(--hmb-accent-primary);">
            ${q.hmb_quick_sanskrit_verse}
          </div>
          <p class="text-xs sm:text-sm leading-relaxed" style="color: var(--hmb-text-secondary);">
            ${loc.summary}
          </p>
        </div>
        <div class="pt-2 border-t flex items-center justify-between text-xs" style="border-color: var(--hmb-border); color: var(--hmb-text-muted);">
          <span>📖 ${q.hmb_quick_scripture_source}</span>
          <button type="button" onclick="hmbCopyTextToClipboard('${(q.hmb_quick_sanskrit_verse + ' — ' + loc.summary).replace(/'/g, "\\'")}')" class="hover:underline font-semibold" style="color: var(--hmb-accent-primary);">
            📋 Copy Sutra
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function hmbSelectQuickCategory(cat) {
  hmbState.quickCategory = cat;
  hmbRenderQuickReads();
}

// =========================================================================
// 9. LONG-FORM GRANTHA READER MODAL
// =========================================================================
async function hmbOpenReaderModal(postId) {
  const numId = Number(postId);
  const post = hmbState.posts.find((p) => Number(p.hmb_post_id) === numId);
  if (!post) return;

  hmbState.activePostId = numId;
  post.hmb_post_views_count = (post.hmb_post_views_count || 100) + 1;
  hmbSaveLocal(HMB_STORAGE_KEYS.POSTS, hmbState.posts);

  const lang = hmbState.config.hmb_active_language || 'en';
  const loc = hmbGetPostLocalized(post, lang);

  document.getElementById('hmb-reader-category-pill').textContent = hmbLocalizeCategory(post.hmb_post_category, lang);
  document.getElementById('hmb-reader-cover-img').src = hmbResolveImg(post.hmb_post_cover_image);
  document.getElementById('hmb-reader-title').textContent = loc.title;
  document.getElementById('hmb-reader-subtitle').textContent = loc.subtitle || '';
  document.getElementById('hmb-reader-author').textContent = post.hmb_post_author_name;
  document.getElementById('hmb-reader-author-role').textContent = post.hmb_post_author_role || '';
  document.getElementById('hmb-reader-date').textContent = '📅 ' + hmbFormatDate(post.hmb_post_published_date);
  document.getElementById('hmb-reader-stats').textContent = `⏱️ ${post.hmb_post_reading_minutes} min read (${post.hmb_post_word_count} words)`;
  document.getElementById('hmb-reader-views').textContent = `👁️ ${post.hmb_post_views_count} contemplations`;
  document.getElementById('hmb-reader-likes-count').textContent = String(post.hmb_post_likes_count || 108);

  const tagsWrap = document.getElementById('hmb-reader-tags');
  tagsWrap.innerHTML = (post.hmb_post_tags || []).map((t) => `
    <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/25 text-amber-200 border border-amber-300/30">#${t}</span>
  `).join('');

  const shlokaWrap = document.getElementById('hmb-reader-shloka-wrap');
  if (post.hmb_post_shloka_sanskrit) {
    shlokaWrap.classList.remove('hidden');
    document.getElementById('hmb-reader-shloka-sanskrit').textContent = post.hmb_post_shloka_sanskrit;
    document.getElementById('hmb-reader-shloka-translit').textContent = post.hmb_post_shloka_transliteration || '';
    document.getElementById('hmb-reader-shloka-meaning').textContent = post.hmb_post_shloka_meaning || '';
  } else {
    shlokaWrap.classList.add('hidden');
  }

  const contentEl = document.getElementById('hmb-reader-content');
  contentEl.innerHTML = loc.contentHtml;
  hmbUpdateReaderBookmarkButton();

  const modal = document.getElementById('hmb-reader-modal');
  modal.classList.remove('hidden');
  modal.scrollTop = 0;
  document.body.style.overflow = 'hidden';
  hmbRenderFeed();

  // Persist view count increment to NeonDB in background
  hmbApiRequest('POST', `/posts/${numId}/view`, { action: 'view' });
}

function hmbCloseReaderModal() {
  const modal = document.getElementById('hmb-reader-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
  hmbState.activePostId = null;
}

function hmbUpdateReaderBookmarkButton() {
  const isSaved = hmbState.bookmarks.includes(Number(hmbState.activePostId));
  const label = document.getElementById('hmb-reader-bookmark-label');
  if (label) label.textContent = isSaved ? 'Saved' : 'Save';
}

function hmbToggleReaderBookmark() {
  if (hmbState.activePostId) {
    hmbToggleBookmark(hmbState.activePostId);
  }
}

function hmbAdjustReaderFontSize(delta) {
  if (delta === 0) {
    hmbState.readerFontScale = 0;
  } else {
    hmbState.readerFontScale = Math.max(-2, Math.min(4, hmbState.readerFontScale + delta));
  }
  const contentEl = document.getElementById('hmb-reader-content');
  if (contentEl) {
    const baseRem = 1.08 + hmbState.readerFontScale * 0.12;
    contentEl.style.fontSize = baseRem.toFixed(2) + 'rem';
  }
}

async function hmbOfferVandanam() {
  const post = hmbState.posts.find((p) => Number(p.hmb_post_id) === Number(hmbState.activePostId));
  if (!post) return;
  post.hmb_post_likes_count = (post.hmb_post_likes_count || 108) + 1;
  document.getElementById('hmb-reader-likes-count').textContent = String(post.hmb_post_likes_count);
  hmbSaveLocal(HMB_STORAGE_KEYS.POSTS, hmbState.posts);
  hmbRenderFeed();
  hmbShowToast('Pranam! Your Vandanam appreciation has been offered.', '🙏');

  // Persist like count to NeonDB
  const res = await hmbApiRequest('POST', `/posts/${post.hmb_post_id}/like`, { action: 'like' });
  if (res.ok && res.data && res.data.post) {
    post.hmb_post_likes_count = res.data.post.hmb_post_likes_count;
    document.getElementById('hmb-reader-likes-count').textContent = String(post.hmb_post_likes_count);
    hmbSaveLocal(HMB_STORAGE_KEYS.POSTS, hmbState.posts);
    hmbRenderFeed();
  }
}

function hmbCopyReaderShloka() {
  const post = hmbState.posts.find((p) => Number(p.hmb_post_id) === Number(hmbState.activePostId));
  if (!post) return;
  const text = `${post.hmb_post_shloka_sanskrit}\n"${post.hmb_post_shloka_meaning}" — ॐ हरि Blogging`;
  hmbCopyTextToClipboard(text);
}

function hmbShareCurrentDiscourse() {
  const post = hmbState.posts.find((p) => Number(p.hmb_post_id) === Number(hmbState.activePostId));
  if (!post) return;
  const url = window.location.href.split('#')[0] + '#discourse-' + post.hmb_post_slug;
  hmbCopyTextToClipboard(`${post.hmb_post_title} — ${url}`);
}

function hmbPrintCurrentDiscourse() {
  window.print();
}

function hmbCopyTextToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        hmbShowToast('Copied to clipboard!', '📋');
      }).catch(() => hmbFallbackCopy(text));
    } else {
      hmbFallbackCopy(text);
    }
  } catch (_) {
    hmbFallbackCopy(text);
  }
}

function hmbFallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (_) {}
  ta.remove();
  hmbShowToast('Copied to clipboard!', '📋');
}

// =========================================================================
// 10. SACRED TANPURA / OM NAADA WEB AUDIO SYNTHESIZER
// =========================================================================
function hmbToggleSacredNaada() {
  if (hmbState.naadaPlaying) {
    hmbStopSacredNaada();
  } else {
    hmbStartSacredNaada();
  }
}

function hmbStartSacredNaada() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!hmbState.naadaCtx) {
      hmbState.naadaCtx = new AudioContextClass();
    }
    const ctx = hmbState.naadaCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const freqs = [136.1, 204.15, 272.2];
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const nodes = freqs.map((f) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      osc.connect(masterGain);
      osc.start();
      return osc;
    });

    hmbState.naadaNodes = nodes;
    hmbState.naadaPlaying = true;
    const iconEl = document.getElementById('hmb-naada-icon');
    if (iconEl) iconEl.textContent = '🕉️';
    const btnEl = document.getElementById('hmb-naada-btn');
    if (btnEl) btnEl.classList.add('hmb-pill-active');
    hmbShowToast('Sacred 136.1 Hz Om Tanpura Naada drone activated', '🔔');
  } catch (_) {}
}

function hmbStopSacredNaada() {
  try {
    (hmbState.naadaNodes || []).forEach((n) => {
      try { n.stop(); n.disconnect(); } catch (_) {}
    });
    hmbState.naadaNodes = [];
    hmbState.naadaPlaying = false;
    const iconEl = document.getElementById('hmb-naada-icon');
    if (iconEl) iconEl.textContent = '🔔';
    const btnEl = document.getElementById('hmb-naada-btn');
    if (btnEl) btnEl.classList.remove('hmb-pill-active');
    hmbShowToast('Sacred Naada ambiance paused', '🔕');
  } catch (_) {}
}

// =========================================================================
// 11. NAVIGATION & ADMIN PORTAL AUTHENTICATION (Netlify ENV Credentials)
// =========================================================================
function hmbSwitchMainView(viewName) {
  const pubView = document.getElementById('hmb-public-view');
  const admView = document.getElementById('hmb-admin-view');
  if (viewName === 'admin') {
    if (!hmbState.isAdminAuthenticated) {
      hmbOpenAdminLoginModal();
      return;
    }
    pubView.classList.add('hidden');
    admView.classList.remove('hidden');
    hmbRenderAdminDashboard();
    hmbFetchAuditLogsFromDatabase();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    admView.classList.add('hidden');
    pubView.classList.remove('hidden');
  }
}

function hmbScrollToSection(sectionId) {
  hmbSwitchMainView('feed');
  setTimeout(() => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 50);
}

function hmbToggleMobileMenu() {
  const drawer = document.getElementById('hmb-mobile-drawer');
  if (drawer) drawer.classList.toggle('hidden');
}

function hmbHandleAdminButtonClick() {
  if (hmbState.isAdminAuthenticated) {
    const admView = document.getElementById('hmb-admin-view');
    if (admView && !admView.classList.contains('hidden')) {
      hmbSwitchMainView('feed');
    } else {
      hmbSwitchMainView('admin');
    }
  } else {
    hmbOpenAdminLoginModal();
  }
}

function hmbOpenAdminLoginModal(customErrorMsg = '') {
  const modal = document.getElementById('hmb-admin-login-modal');
  const errEl = document.getElementById('hmb-login-error-msg');
  if (errEl) {
    if (customErrorMsg) {
      errEl.textContent = customErrorMsg;
      errEl.classList.remove('hidden');
    } else {
      errEl.classList.add('hidden');
    }
  }
  if (modal) modal.classList.remove('hidden');
}

function hmbCloseAdminLoginModal() {
  const modal = document.getElementById('hmb-admin-login-modal');
  if (modal) modal.classList.add('hidden');
}

function hmbFillPreviewCredentials() {
  const uEl = document.getElementById('hmb-login-username');
  const pEl = document.getElementById('hmb-login-password');
  if (uEl) uEl.value = 'hariom_admin';
  if (pEl) pEl.value = 'Sanatana@108';
}

async function hmbSubmitAdminLogin(e) {
  e.preventDefault();
  const username = document.getElementById('hmb-login-username').value.trim();
  const password = document.getElementById('hmb-login-password').value;
  const errEl = document.getElementById('hmb-login-error-msg');
  if (errEl) errEl.classList.add('hidden');

  // Call the Netlify serverless function /api/admin/login with explicit customCreds
  const serverRes = await hmbApiRequest('POST', '/admin/login', { username, password }, { username, password });

  if (!serverRes.offline) {
    // Running on live Netlify environment: strictly enforce ADMIN_USERNAME and ADMIN_PASSWORD from Netlify env vars!
    if (serverRes.ok && serverRes.data && serverRes.data.authenticated) {
      hmbState.isAdminAuthenticated = true;
      hmbState.adminCreds = { username, password };
      hmbSaveLocal(HMB_STORAGE_KEYS.ADMIN_AUTH, { authenticated: true, username, password });
      hmbCloseAdminLoginModal();
      hmbUpdateAdminButtonBadge();
      await hmbLoadBootstrapFromDatabase();
      await hmbFetchAuditLogsFromDatabase();
      hmbSwitchMainView('admin');
      hmbShowToast('Pranam! Authenticated via Netlify Admin Credentials.', '🗝️');
    } else {
      if (errEl) {
        errEl.textContent = (serverRes.data && serverRes.data.error) || 'Invalid ADMIN_USERNAME or ADMIN_PASSWORD. Please enter the exact credentials set in your Netlify environment variables.';
        errEl.classList.remove('hidden');
      }
    }
    return;
  }

  // Offline / Canvas Preview fallback (only when serverless endpoint is not reachable)
  const previewMatch = (username === 'hariom_admin' && password === 'Sanatana@108') || (username === 'admin' && password === 'admin108');
  if (previewMatch) {
    hmbState.isAdminAuthenticated = true;
    hmbState.adminCreds = { username, password };
    hmbSaveLocal(HMB_STORAGE_KEYS.ADMIN_AUTH, { authenticated: true, username, password });
    hmbCloseAdminLoginModal();
    hmbUpdateAdminButtonBadge();
    hmbRecordLocalAuditLog('ADMIN_LOGIN', 'hmb_admin_session', username, `Pradhan Sevak '${username}' unlocked the administration sanctuary.`);
    hmbSwitchMainView('admin');
    hmbShowToast('Pranam! Admin Sanctuary Unlocked (Preview Mode).', '🗝️');
  } else {
    if (errEl) {
      errEl.textContent = 'Invalid credentials. In preview mode, click "Fill Preview Credentials" below.';
      errEl.classList.remove('hidden');
    }
  }
}

function hmbLogoutAdmin() {
  hmbState.isAdminAuthenticated = false;
  hmbState.adminCreds = { username: '', password: '' };
  hmbSaveLocal(HMB_STORAGE_KEYS.ADMIN_AUTH, { authenticated: false, username: '', password: '' });
  hmbUpdateAdminButtonBadge();
  hmbSwitchMainView('feed');
  hmbShowToast('Admin session locked safely.', '🔒');
}

function hmbUpdateAdminButtonBadge() {
  const iconEl = document.getElementById('hmb-admin-btn-icon');
  const textEl = document.getElementById('hmb-admin-btn-text');
  if (hmbState.isAdminAuthenticated) {
    if (iconEl) iconEl.textContent = '🛡️';
    if (textEl) textEl.textContent = 'Admin Studio';
  } else {
    if (iconEl) iconEl.textContent = '🗝️';
    if (textEl) textEl.textContent = 'Sevak Portal';
  }
}

function hmbSwitchAdminTab(tabName) {
  const tabs = ['editor', 'quickreads', 'customizer', 'contact', 'audit', 'docs'];
  tabs.forEach((t) => {
    const panel = document.getElementById('hmb-admin-panel-' + t);
    if (panel) panel.classList.toggle('hidden', t !== tabName);
  });
  document.querySelectorAll('.hmb-admin-tab-btn').forEach((btn) => {
    const isCurrent = btn.getAttribute('data-admintab') === tabName;
    btn.className = `hmb-admin-tab-btn ${isCurrent ? 'hmb-pill-active' : 'hmb-btn-outline'} px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0`;
  });
  if (tabName === 'audit') {
    hmbFetchAuditLogsFromDatabase();
  }
}

async function hmbTriggerDatabaseReseed() {
  hmbShowToast('Syncing & seeding default Dharmic data into NeonDB...', '🔄');
  const res = await hmbApiRequest('POST', '/seed', {});
  if (res.status === 401) {
    hmbHandleUnauthorizedError();
    return;
  }
  if (res.ok && res.data) {
    await hmbLoadBootstrapFromDatabase();
    await hmbFetchAuditLogsFromDatabase();
    hmbShowToast('All pre-existing discourses, quick-reads & festival presets seeded in NeonDB!', '✅');
  } else if (res.offline) {
    hmbState.posts = HMB_INITIAL_POSTS;
    hmbState.quickReads = HMB_INITIAL_QUICK_READS;
    hmbSaveLocal(HMB_STORAGE_KEYS.POSTS, hmbState.posts);
    hmbSaveLocal(HMB_STORAGE_KEYS.QUICK_READS, hmbState.quickReads);
    hmbRenderAdminDashboard();
    hmbRenderFeed();
    hmbRenderQuickReads();
    hmbShowToast('Restored default discourses in preview storage!', '✅');
  } else {
    hmbShowToast((res.data && res.data.error) || 'Failed to seed database', '⚠️');
  }
}

// =========================================================================
// 12. RICH TEXT BLOG EDITOR & DATABASE-BACKED CRUD OPERATIONS
// =========================================================================
function hmbExecFormat(command, value = null) {
  const canvas = document.getElementById('hmb-editor-canvas');
  if (canvas) canvas.focus();
  try {
    document.execCommand(command, false, value);
  } catch (_) {}
  hmbUpdateEditorMetrics();
}

function hmbInsertEditorBlock(tag) {
  hmbExecFormat('formatBlock', '<' + tag + '>');
}

function hmbInsertShlokaBlockquote() {
  const canvas = document.getElementById('hmb-editor-canvas');
  if (!canvas) return;
  canvas.focus();
  const html = `
    <blockquote class="hmb-shloka-box">
      <strong>ॐ सह नाववतु। सह नौ भुनक्तु। सह वीर्यं करवावहै। तेजस्वि नावधीतमस्तु मा विद्विषावहै॥</strong><br/>
      <em>May the Divine protect us both together; may That nourish us both; may we work together with great energy; may our study be luminous and fruitful.</em>
    </blockquote><p><br/></p>
  `;
  try {
    document.execCommand('insertHTML', false, html);
  } catch (_) {
    canvas.innerHTML += html;
  }
  hmbUpdateEditorMetrics();
}

function hmbUpdateEditorMetrics() {
  const canvas = document.getElementById('hmb-editor-canvas');
  if (!canvas) return;
  const text = (canvas.innerText || canvas.textContent || '').trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const chars = text.length;
  const paras = canvas.querySelectorAll('p, h2, h3, blockquote, li').length || 1;
  const readMins = Math.max(1, Math.ceil(words / 130));

  const wEl = document.getElementById('hmb-metric-words');
  if (wEl) wEl.textContent = String(words);
  const cEl = document.getElementById('hmb-metric-chars');
  if (cEl) cEl.textContent = String(chars);
  const pEl = document.getElementById('hmb-metric-paras');
  if (pEl) pEl.textContent = String(paras);
  const rEl = document.getElementById('hmb-metric-readtime');
  if (rEl) rEl.textContent = `${readMins} min`;
}

function hmbInsertSampleLongGrantha() {
  document.getElementById('hmb-post-title-in').value = 'Katha Upanishad & Nachiketa’s Fearless Inquiry: The Chariot Analogy of the Self (Ratha Kalpana)';
  document.getElementById('hmb-post-subtitle-in').value = 'How young Nachiketa chose Atma-Vidya over empire and celestial pleasures in his dialogue with Yamaraja.';
  document.getElementById('hmb-post-category-in').value = 'Vedanta & Upanishads';
  document.getElementById('hmb-post-cover-in').value = 'assets/images/vedanta-ashram.jpg';
  document.getElementById('hmb-post-tags-in').value = 'Katha Upanishad, Nachiketa, Ratha Kalpana, Atman, Shreyas vs Preyas';
  document.getElementById('hmb-post-shloka-in').value = 'आत्मानं रथिनं विद्धि शरीरं रथमेव तु । बुद्धिं तु सारथिं विद्धि मनः प्रग्रहमेव च ॥';
  document.getElementById('hmb-post-shloka-meaning-in').value = 'Know the Atman as the Lord of the chariot, the body as the chariot itself, the discriminatory intellect (Buddhi) as the charioteer, and the mind (Manas) as the reins (Katha Upanishad 1.3.3).';
  document.getElementById('hmb-post-excerpt-in').value = 'Explore Nachiketa’s three boons at the threshold of Yama, the distinction between Shreyas (the liberating Good) and Preyas (the fleeting pleasant), and the timeless Chariot Allegory.';

  const canvas = document.getElementById('hmb-editor-canvas');
  canvas.innerHTML = `
    <h2>१. नचिकेतोपाख्यानम् • The Fearless Seeker at the Threshold of Yama</h2>
    <p>In the <em>Katha Upanishad</em> of the Krishna Yajurveda, young Nachiketa stands for three nights at the threshold of Dharmaraja Yama without food or water. Granted three boons in honour of his austerity, Nachiketa asks first for his father Vajashravasa's peace of mind, second for the sacred fire-science (Nachiketa Agni) that bridges earth and heaven, and for his third boon poses the ultimate question: what abides beyond the dissolution of the physical body?</p>
    <blockquote class="hmb-shloka-box">
      <strong>श्रेयश्च प्रेयश्च मनुष्यमेतः तौ सम्परीत्य विविनक्ति धीरः ।<br/>श्रेयो हि धीरोऽभिप्रयसो वृणीते प्रेयो मन्दो योगक्षेमाद्वृणीते ॥ (कठोपनिषद् १.२.२)</strong><br/>
      <em>"Both the Good (Shreyas) and the Pleasant (Preyas) approach a human being. The wise person (Dhira), examining both thoroughly, discriminates between them and chooses Shreyas over Preyas."</em>
    </blockquote>
    <h2>२. रथकल्पना • The Masterpiece Allegory of the Chariot</h2>
    <p>To explain how the seeker journeys toward Self-realization, Yamaraja presents the celebrated <strong>Ratha Kalpana</strong> (Chariot Analogy):</p>
    <ul>
      <li><strong>Rathi (Master of the Chariot):</strong> The immutable Atman seated silently within.</li>
      <li><strong>Ratha (The Chariot):</strong> The physical human body (Sharira).</li>
      <li><strong>Sarathi (The Charioteer):</strong> The awakened, discerning intellect (Buddhi).</li>
      <li><strong>Pragraha (The Reins):</strong> The coordinating mind (Manas).</li>
      <li><strong>Hayah (The Five Horses):</strong> The five sensory organs (Jnanendriyas) galloping along the roads of sense-objects (Vishayas).</li>
    </ul>
    <p>When the charioteer (Buddhi) is wakeful and holds the reins of the mind firmly, the horses of the senses become disciplined allies, carrying the seeker across the ocean of Samsara to the supreme abode of Lord Vishnu (<em>Tad Vishnoh Paramam Padam</em>).</p>
  `;
  hmbUpdateEditorMetrics();
  hmbShowToast('Loaded long-form Katha Upanishad Grantha template into editor!', '📜');
}

function hmbResetBlogEditor() {
  document.getElementById('hmb-edit-post-id').value = '';
  document.getElementById('hmb-editor-mode-title').textContent = 'Compose New Dharmic Discourse';
  document.getElementById('hmb-save-post-btn-label').textContent = 'Publish Discourse to Sanctuary';
  document.getElementById('hmb-post-title-in').value = '';
  document.getElementById('hmb-post-subtitle-in').value = '';
  document.getElementById('hmb-post-tags-in').value = '';
  document.getElementById('hmb-post-shloka-in').value = '';
  document.getElementById('hmb-post-shloka-meaning-in').value = '';
  document.getElementById('hmb-post-excerpt-in').value = '';
  document.getElementById('hmb-post-featured-in').checked = false;
  document.getElementById('hmb-editor-canvas').innerHTML = '<p>Begin composing your Dharmic discourse here...</p>';
  hmbUpdateEditorMetrics();
}

async function hmbSaveBlogPost() {
  const editId = document.getElementById('hmb-edit-post-id').value;
  const title = document.getElementById('hmb-post-title-in').value.trim();
  const subtitle = document.getElementById('hmb-post-subtitle-in').value.trim();
  const category = document.getElementById('hmb-post-category-in').value;
  const cover = document.getElementById('hmb-post-cover-in').value;
  const author = document.getElementById('hmb-post-author-in').value.trim() || 'Acharya Vishwanath Shastri';
  const role = document.getElementById('hmb-post-role-in').value.trim() || 'Vedanta Scholar';
  const tagsRaw = document.getElementById('hmb-post-tags-in').value;
  const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);
  const shloka = document.getElementById('hmb-post-shloka-in').value.trim();
  const shlokaMeaning = document.getElementById('hmb-post-shloka-meaning-in').value.trim();
  const excerpt = document.getElementById('hmb-post-excerpt-in').value.trim();
  const isFeatured = document.getElementById('hmb-post-featured-in').checked;
  const contentHtml = document.getElementById('hmb-editor-canvas').innerHTML;

  if (!title || !excerpt) {
    hmbShowToast('Please provide both a Discourse Title and Feed Excerpt.', '⚠️');
    return;
  }

  const plainText = (document.getElementById('hmb-editor-canvas').innerText || '').trim();
  const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 120;
  const charCount = plainText.length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 130));
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || ('grantha-' + Date.now());

  const payload = {
    hmb_post_slug: slug,
    hmb_post_title: title,
    hmb_post_subtitle: subtitle,
    hmb_post_category: category,
    hmb_post_tags: tags.length ? tags : ['Dharma', 'Sanatana'],
    hmb_post_author_name: author,
    hmb_post_author_role: role,
    hmb_post_cover_image: cover,
    hmb_post_shloka_sanskrit: shloka,
    hmb_post_shloka_meaning: shlokaMeaning,
    hmb_post_excerpt: excerpt,
    hmb_post_content_html: contentHtml,
    hmb_post_word_count: wordCount,
    hmb_post_char_count: charCount,
    hmb_post_reading_minutes: readingMinutes,
    hmb_post_is_featured: isFeatured
  };

  if (editId) {
    const numId = Number(editId);
    const res = await hmbApiRequest('PUT', `/posts/${numId}`, payload);
    if (res.status === 401) {
      hmbHandleUnauthorizedError();
      return;
    }
    if (res.ok && res.data && res.data.post) {
      const dbPost = {
        ...res.data.post,
        hmb_post_published_date: hmbFormatDate(res.data.post.hmb_post_published_date)
      };
      const idx = hmbState.posts.findIndex((p) => Number(p.hmb_post_id) === numId);
      if (idx !== -1) hmbState.posts[idx] = dbPost;
      await hmbFetchAuditLogsFromDatabase();
      hmbShowToast('Discourse updated in NeonDB database!', '✅');
    } else if (res.offline) {
      const idx = hmbState.posts.findIndex((p) => Number(p.hmb_post_id) === numId);
      if (idx !== -1) hmbState.posts[idx] = { ...hmbState.posts[idx], ...payload };
      hmbRecordLocalAuditLog('UPDATE_BLOG_POST', 'hmb_blog_posts_tbl', numId, `Updated discourse: "${title}"`);
      hmbShowToast('Discourse updated!', '✅');
    } else {
      hmbShowToast((res.data && res.data.detail) || (res.data && res.data.error) || 'Database error while updating post', '⚠️');
      return;
    }
  } else {
    const res = await hmbApiRequest('POST', '/posts', payload);
    if (res.status === 401) {
      hmbHandleUnauthorizedError();
      return;
    }
    if (res.ok && res.data && res.data.post) {
      const dbPost = {
        ...res.data.post,
        hmb_post_published_date: hmbFormatDate(res.data.post.hmb_post_published_date)
      };
      hmbState.posts.unshift(dbPost);
      await hmbFetchAuditLogsFromDatabase();
      hmbShowToast('New Dharmic Discourse saved to NeonDB & published!', '🕉️');
    } else if (res.offline) {
      const newPost = {
        ...payload,
        hmb_post_id: Date.now(),
        hmb_post_views_count: 108,
        hmb_post_likes_count: 27,
        hmb_post_published_date: new Date().toISOString().slice(0, 10),
        hmb_post_translations_json: {}
      };
      hmbState.posts.unshift(newPost);
      hmbRecordLocalAuditLog('CREATE_BLOG_POST', 'hmb_blog_posts_tbl', newPost.hmb_post_id, `Published new discourse: "${title}"`);
      hmbShowToast('New Dharmic Discourse published!', '🕉️');
    } else {
      hmbShowToast((res.data && res.data.detail) || (res.data && res.data.error) || 'Database error while saving post', '⚠️');
      return;
    }
  }

  hmbSaveLocal(HMB_STORAGE_KEYS.POSTS, hmbState.posts);
  hmbResetBlogEditor();
  hmbRenderAdminPostsTable();
  hmbRenderHeroSpotlight();
  hmbRenderCategoryPills();
  hmbRenderFeed();
}

function hmbLoadPostIntoEditor(postId) {
  const post = hmbState.posts.find((p) => Number(p.hmb_post_id) === Number(postId));
  if (!post) return;
  document.getElementById('hmb-edit-post-id').value = String(post.hmb_post_id);
  document.getElementById('hmb-editor-mode-title').textContent = `Editing Discourse #${post.hmb_post_id}: ${post.hmb_post_title}`;
  document.getElementById('hmb-save-post-btn-label').textContent = 'Update Discourse in Database';
  document.getElementById('hmb-post-title-in').value = post.hmb_post_title;
  document.getElementById('hmb-post-subtitle-in').value = post.hmb_post_subtitle || '';
  document.getElementById('hmb-post-category-in').value = post.hmb_post_category;
  document.getElementById('hmb-post-cover-in').value = post.hmb_post_cover_image;
  document.getElementById('hmb-post-author-in').value = post.hmb_post_author_name;
  document.getElementById('hmb-post-role-in').value = post.hmb_post_author_role || '';
  document.getElementById('hmb-post-tags-in').value = (post.hmb_post_tags || []).join(', ');
  document.getElementById('hmb-post-shloka-in').value = post.hmb_post_shloka_sanskrit || '';
  document.getElementById('hmb-post-shloka-meaning-in').value = post.hmb_post_shloka_meaning || '';
  document.getElementById('hmb-post-excerpt-in').value = post.hmb_post_excerpt;
  document.getElementById('hmb-post-featured-in').checked = Boolean(post.hmb_post_is_featured);
  document.getElementById('hmb-editor-canvas').innerHTML = post.hmb_post_content_html;
  hmbUpdateEditorMetrics();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  hmbShowToast('Loaded discourse into Rich Editor for updating.', '✍️');
}

async function hmbTogglePostFeaturedAdmin(postId) {
  const post = hmbState.posts.find((p) => Number(p.hmb_post_id) === Number(postId));
  if (!post) return;
  const nextFeatured = !post.hmb_post_is_featured;

  const res = await hmbApiRequest('PUT', `/posts/${post.hmb_post_id}`, { hmb_post_is_featured: nextFeatured });
  if (res.status === 401) {
    hmbHandleUnauthorizedError();
    return;
  }
  post.hmb_post_is_featured = nextFeatured;
  hmbSaveLocal(HMB_STORAGE_KEYS.POSTS, hmbState.posts);
  if (res.ok) {
    await hmbFetchAuditLogsFromDatabase();
  } else if (res.offline) {
    hmbRecordLocalAuditLog('TOGGLE_FEATURED_POST', 'hmb_blog_posts_tbl', postId, `Set featured=${nextFeatured} for "${post.hmb_post_title}"`);
  }
  hmbRenderAdminPostsTable();
  hmbRenderHeroSpotlight();
  hmbRenderFeed();
  hmbShowToast(`Featured status updated for "${post.hmb_post_title}"`, '⭐');
}

async function hmbDeleteBlogPostAdmin(postId) {
  const numId = Number(postId);
  const idx = hmbState.posts.findIndex((p) => Number(p.hmb_post_id) === numId);
  if (idx === -1) return;

  const res = await hmbApiRequest('DELETE', `/posts/${numId}`);
  if (res.status === 401) {
    hmbHandleUnauthorizedError();
    return;
  }
  if (!res.ok && !res.offline) {
    hmbShowToast((res.data && res.data.error) || 'Failed to delete discourse from database', '⚠️');
    return;
  }

  const removed = hmbState.posts.splice(idx, 1)[0];
  hmbSaveLocal(HMB_STORAGE_KEYS.POSTS, hmbState.posts);
  if (res.ok) {
    await hmbFetchAuditLogsFromDatabase();
  } else {
    hmbRecordLocalAuditLog('DELETE_BLOG_POST', 'hmb_blog_posts_tbl', numId, `Deleted discourse: "${removed.hmb_post_title}"`);
  }
  hmbRenderAdminPostsTable();
  hmbRenderHeroSpotlight();
  hmbRenderCategoryPills();
  hmbRenderFeed();
  hmbShowToast('Discourse deleted from database.', '🗑️');
}

function hmbRenderAdminPostsTable() {
  const tbody = document.getElementById('hmb-admin-posts-tbody');
  const countEl = document.getElementById('hmb-admin-posts-count');
  if (countEl) countEl.textContent = String(hmbState.posts.length);
  if (!tbody) return;

  tbody.innerHTML = hmbState.posts.map((p) => `
    <tr class="border-b hover:bg-amber-500/5" style="border-color: var(--hmb-border);">
      <td class="py-3 px-3">
        <div class="font-bold line-clamp-1">${p.hmb_post_title}</div>
        <div class="text-xs opacity-70">ID: #${p.hmb_post_id} • By ${p.hmb_post_author_name} • ${hmbFormatDate(p.hmb_post_published_date)}</div>
      </td>
      <td class="py-3 px-3">
        <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold" style="background-color: var(--hmb-pill-bg); color: var(--hmb-accent-primary);">
          ${p.hmb_post_category}
        </span>
      </td>
      <td class="py-3 px-3 text-xs">
        ${p.hmb_post_word_count} words • ${p.hmb_post_reading_minutes} min • 👁️ ${p.hmb_post_views_count}
      </td>
      <td class="py-3 px-3">
        <button type="button" onclick="hmbTogglePostFeaturedAdmin(${p.hmb_post_id})" class="px-2.5 py-1 rounded-lg text-xs font-bold border ${p.hmb_post_is_featured ? 'bg-amber-400 text-amber-950 border-amber-500' : 'opacity-60'}">
          ${p.hmb_post_is_featured ? '⭐ Featured' : '☆ Standard'}
        </button>
      </td>
      <td class="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
        <button type="button" onclick="hmbOpenReaderModal(${p.hmb_post_id})" class="hmb-btn-outline px-2.5 py-1 rounded-lg text-xs font-semibold">👁️ Read</button>
        <button type="button" onclick="hmbLoadPostIntoEditor(${p.hmb_post_id})" class="hmb-btn-outline px-2.5 py-1 rounded-lg text-xs font-semibold">✍️ Edit</button>
        <button type="button" onclick="hmbDeleteBlogPostAdmin(${p.hmb_post_id})" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-600/15 text-red-700 hover:bg-red-600/25">🗑️ Delete</button>
      </td>
    </tr>
  `).join('');
}

// =========================================================================
// 13. QUICK-READS ADMIN MANAGER (Database-Backed CRUD)
// =========================================================================
function hmbRenderAdminQuickReads() {
  const listEl = document.getElementById('hmb-admin-quick-list');
  const countEl = document.getElementById('hmb-admin-quick-count');
  if (countEl) countEl.textContent = String(hmbState.quickReads.length);
  if (!listEl) return;

  listEl.innerHTML = hmbState.quickReads.map((q) => `
    <div class="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3" style="background-color: var(--hmb-bg-elevated); border-color: var(--hmb-border);">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold px-2 py-0.5 rounded-full" style="background-color: var(--hmb-pill-bg); color: var(--hmb-accent-primary);">${q.hmb_quick_category}</span>
          <span class="font-bold text-sm">${q.hmb_quick_title}</span>
        </div>
        <div class="text-xs hmb-font-sanskrit font-semibold">${q.hmb_quick_sanskrit_verse}</div>
        <div class="text-xs opacity-80">${q.hmb_quick_summary}</div>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button type="button" onclick="hmbEditQuickRead(${q.hmb_quick_id})" class="hmb-btn-outline px-2.5 py-1 rounded-lg text-xs font-semibold">✍️ Edit</button>
        <button type="button" onclick="hmbDeleteQuickRead(${q.hmb_quick_id})" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-600/15 text-red-700">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

async function hmbSaveQuickRead() {
  const editId = document.getElementById('hmb-edit-quick-id').value;
  const title = document.getElementById('hmb-quick-title-in').value.trim();
  const cat = document.getElementById('hmb-quick-cat-in').value;
  const source = document.getElementById('hmb-quick-source-in').value.trim() || 'Subhashita Niti';
  const sanskrit = document.getElementById('hmb-quick-sanskrit-in').value.trim();
  const summary = document.getElementById('hmb-quick-summary-in').value.trim();

  if (!title || !sanskrit || !summary) {
    hmbShowToast('Please fill in Title, Sanskrit Shloka, and Summary.', '⚠️');
    return;
  }

  const payload = {
    hmb_quick_title: title,
    hmb_quick_category: cat,
    hmb_quick_scripture_source: source,
    hmb_quick_sanskrit_verse: sanskrit,
    hmb_quick_summary: summary,
    hmb_quick_reading_seconds: 65
  };

  if (editId) {
    const numId = Number(editId);
    const res = await hmbApiRequest('PUT', `/quick-reads/${numId}`, payload);
    if (res.status === 401) {
      hmbHandleUnauthorizedError();
      return;
    }
    if (res.ok && res.data && res.data.quickRead) {
      const idx = hmbState.quickReads.findIndex((q) => Number(q.hmb_quick_id) === numId);
      if (idx !== -1) hmbState.quickReads[idx] = res.data.quickRead;
      await hmbFetchAuditLogsFromDatabase();
    } else if (res.offline) {
      const idx = hmbState.quickReads.findIndex((q) => Number(q.hmb_quick_id) === numId);
      if (idx !== -1) hmbState.quickReads[idx] = { ...hmbState.quickReads[idx], ...payload };
      hmbRecordLocalAuditLog('UPDATE_QUICK_READ', 'hmb_quick_reads_tbl', numId, `Updated Quick-Read: "${title}"`);
    } else {
      hmbShowToast((res.data && res.data.error) || 'Database error updating Quick-Read', '⚠️');
      return;
    }
  } else {
    const res = await hmbApiRequest('POST', '/quick-reads', payload);
    if (res.status === 401) {
      hmbHandleUnauthorizedError();
      return;
    }
    if (res.ok && res.data && res.data.quickRead) {
      hmbState.quickReads.unshift(res.data.quickRead);
      await hmbFetchAuditLogsFromDatabase();
    } else if (res.offline) {
      const newQ = { ...payload, hmb_quick_id: Date.now() };
      hmbState.quickReads.unshift(newQ);
      hmbRecordLocalAuditLog('CREATE_QUICK_READ', 'hmb_quick_reads_tbl', newQ.hmb_quick_id, `Created Quick-Read: "${title}"`);
    } else {
      hmbShowToast((res.data && res.data.error) || 'Database error saving Quick-Read', '⚠️');
      return;
    }
  }

  hmbSaveLocal(HMB_STORAGE_KEYS.QUICK_READS, hmbState.quickReads);
  hmbResetQuickForm();
  hmbRenderAdminQuickReads();
  hmbRenderQuickReads();
  hmbShowToast('Quick-Read Subhashita saved to database!', '✨');
}

function hmbEditQuickRead(qId) {
  const q = hmbState.quickReads.find((item) => Number(item.hmb_quick_id) === Number(qId));
  if (!q) return;
  document.getElementById('hmb-edit-quick-id').value = String(q.hmb_quick_id);
  document.getElementById('hmb-quick-form-heading').textContent = `Editing Quick-Read #${q.hmb_quick_id}`;
  document.getElementById('hmb-quick-title-in').value = q.hmb_quick_title;
  document.getElementById('hmb-quick-cat-in').value = q.hmb_quick_category;
  document.getElementById('hmb-quick-source-in').value = q.hmb_quick_scripture_source;
  document.getElementById('hmb-quick-sanskrit-in').value = q.hmb_quick_sanskrit_verse;
  document.getElementById('hmb-quick-summary-in').value = q.hmb_quick_summary;
}

async function hmbDeleteQuickRead(qId) {
  const numId = Number(qId);
  const idx = hmbState.quickReads.findIndex((item) => Number(item.hmb_quick_id) === numId);
  if (idx === -1) return;

  const res = await hmbApiRequest('DELETE', `/quick-reads/${numId}`);
  if (res.status === 401) {
    hmbHandleUnauthorizedError();
    return;
  }
  const removed = hmbState.quickReads.splice(idx, 1)[0];
  hmbSaveLocal(HMB_STORAGE_KEYS.QUICK_READS, hmbState.quickReads);
  if (res.ok) {
    await hmbFetchAuditLogsFromDatabase();
  } else {
    hmbRecordLocalAuditLog('DELETE_QUICK_READ', 'hmb_quick_reads_tbl', numId, `Removed Quick-Read: "${removed.hmb_quick_title}"`);
  }
  hmbRenderAdminQuickReads();
  hmbRenderQuickReads();
  hmbShowToast('Quick-Read deleted from database.', '🗑️');
}

function hmbResetQuickForm() {
  document.getElementById('hmb-edit-quick-id').value = '';
  document.getElementById('hmb-quick-form-heading').textContent = 'Add New Quick-Read / Subhashita';
  document.getElementById('hmb-quick-title-in').value = '';
  document.getElementById('hmb-quick-source-in').value = '';
  document.getElementById('hmb-quick-sanskrit-in').value = '';
  document.getElementById('hmb-quick-summary-in').value = '';
}

// =========================================================================
// 14. FESTIVE CUSTOMIZER, THEME SWITCHER & CONTACT PERSISTENCE
// =========================================================================
function hmbRenderFestivalPresetsGrid() {
  const grid = document.getElementById('hmb-festival-presets-grid');
  if (!grid) return;

  grid.innerHTML = Object.values(HMB_FESTIVAL_PRESETS).map((preset) => {
    const isCurrent = hmbState.config.hmb_active_festival_key === preset.key;
    return `
      <button
        type="button"
        onclick="hmbApplyFestivalPreset('${preset.key}')"
        class="${isCurrent ? 'hmb-pill-active' : 'hmb-btn-outline'} p-4 rounded-2xl text-left flex flex-col justify-between gap-2 transition"
      >
        <div class="flex items-center justify-between">
          <span class="text-2xl">${preset.icon}</span>
          <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-black/15">${isCurrent ? 'Active' : 'Activate'}</span>
        </div>
        <div>
          <div class="font-bold text-sm">${preset.name}</div>
          <div class="text-xs opacity-80 line-clamp-2 mt-0.5">${preset.headline}</div>
        </div>
      </button>
    `;
  }).join('');
}

async function hmbApplyFestivalPreset(festivalKey) {
  const preset = HMB_FESTIVAL_PRESETS[festivalKey];
  if (!preset) return;

  hmbState.config = {
    ...hmbState.config,
    hmb_active_festival_key: preset.key,
    hmb_active_theme: preset.theme,
    hmb_banner_enabled: true,
    hmb_banner_badge: preset.badge,
    hmb_banner_headline: preset.headline,
    hmb_banner_subtext: preset.subtext,
    hmb_banner_cta_label: preset.ctaLabel,
    hmb_banner_cta_category: preset.ctaCategory,
    hmb_daily_mantra_sanskrit: preset.mantraSa,
    hmb_daily_mantra_meaning: preset.mantraMeaning
  };

  hmbSaveLocal(HMB_STORAGE_KEYS.CONFIG, hmbState.config);
  hmbApplySiteConfigToDOM();
  hmbRenderFestivalPresetsGrid();

  const res = await hmbApiRequest('PUT', '/config', hmbState.config);
  if (res.status === 401) {
    hmbHandleUnauthorizedError();
    return;
  }
  if (res.ok && res.data && res.data.config) {
    hmbState.config = { ...hmbState.config, ...res.data.config };
    hmbSaveLocal(HMB_STORAGE_KEYS.CONFIG, hmbState.config);
    await hmbFetchAuditLogsFromDatabase();
  } else if (res.offline) {
    hmbRecordLocalAuditLog('ACTIVATE_FESTIVAL_THEME', 'hmb_site_config_tbl', preset.key, `Activated festive preset "${preset.name}" with theme '${preset.theme}'`);
  }
  hmbShowToast(`Festive Theme & Banner updated to ${preset.name} and saved to database!`, preset.icon);
}

async function hmbSaveSiteCustomization() {
  hmbState.config = {
    ...hmbState.config,
    hmb_site_title: document.getElementById('hmb-cfg-site-title').value.trim() || 'ॐ हरि Blogging',
    hmb_active_theme: document.getElementById('hmb-cfg-theme-select').value,
    hmb_banner_enabled: document.getElementById('hmb-cfg-banner-enabled').checked,
    hmb_banner_badge: document.getElementById('hmb-cfg-banner-badge').value.trim(),
    hmb_banner_cta_label: document.getElementById('hmb-cfg-banner-cta').value.trim(),
    hmb_banner_headline: document.getElementById('hmb-cfg-banner-headline').value.trim(),
    hmb_banner_subtext: document.getElementById('hmb-cfg-banner-subtext').value.trim(),
    hmb_daily_mantra_sanskrit: document.getElementById('hmb-cfg-mantra-sa').value.trim(),
    hmb_daily_mantra_meaning: document.getElementById('hmb-cfg-mantra-meaning').value.trim()
  };

  hmbSaveLocal(HMB_STORAGE_KEYS.CONFIG, hmbState.config);
  hmbApplySiteConfigToDOM();
  hmbRenderFestivalPresetsGrid();

  const res = await hmbApiRequest('PUT', '/config', hmbState.config);
  if (res.status === 401) {
    hmbHandleUnauthorizedError();
    return;
  }
  if (res.ok && res.data && res.data.config) {
    hmbState.config = { ...hmbState.config, ...res.data.config };
    hmbSaveLocal(HMB_STORAGE_KEYS.CONFIG, hmbState.config);
    await hmbFetchAuditLogsFromDatabase();
  } else if (res.offline) {
    hmbRecordLocalAuditLog('CUSTOMIZE_BANNER_THEME', 'hmb_site_config_tbl', hmbState.config.hmb_active_theme, 'Saved custom banner, mantra, and theme settings');
  }
  hmbShowToast('Website theme, festive banner & mantra saved to database!', '🎨');
}

async function hmbSaveContactDetails() {
  hmbState.contact = {
    hmb_sanctuary_name: document.getElementById('hmb-ct-name').value.trim(),
    hmb_contact_email: document.getElementById('hmb-ct-email').value.trim(),
    hmb_contact_phone: document.getElementById('hmb-ct-phone').value.trim(),
    hmb_contact_address: document.getElementById('hmb-ct-address').value.trim(),
    hmb_contact_hours: document.getElementById('hmb-ct-hours').value.trim(),
    hmb_social_x_handle: document.getElementById('hmb-ct-social-x').value.trim(),
    hmb_social_youtube: document.getElementById('hmb-ct-social-yt').value.trim(),
    hmb_footer_blessing: document.getElementById('hmb-ct-blessing').value.trim()
  };

  hmbSaveLocal(HMB_STORAGE_KEYS.CONTACT, hmbState.contact);
  hmbApplySiteConfigToDOM();

  const res = await hmbApiRequest('PUT', '/contact', hmbState.contact);
  if (res.status === 401) {
    hmbHandleUnauthorizedError();
    return;
  }
  if (res.ok && res.data && res.data.contact) {
    hmbState.contact = { ...hmbState.contact, ...res.data.contact };
    hmbSaveLocal(HMB_STORAGE_KEYS.CONTACT, hmbState.contact);
    await hmbFetchAuditLogsFromDatabase();
  } else if (res.offline) {
    hmbRecordLocalAuditLog('UPDATE_CONTACT_DETAILS', 'hmb_contact_details_tbl', 'primary_sanctuary', `Updated sanctuary contact details (${hmbState.contact.hmb_contact_email})`);
  }
  hmbShowToast('Sanctuary contact details saved to database!', '🪷');
}

// =========================================================================
// 15. AUDIT LOGS & INTERACTIVE API DOCS SANDBOX
// =========================================================================
function hmbRenderAuditLogs() {
  const countBadge = document.getElementById('hmb-audit-count-badge');
  if (countBadge) countBadge.textContent = String(hmbState.auditLogs.length);
  const container = document.getElementById('hmb-audit-logs-container');
  if (!container) return;

  container.innerHTML = hmbState.auditLogs.map((log) => `
    <div class="p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2" style="background-color: var(--hmb-bg-elevated); border-color: var(--hmb-border);">
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20" style="color: var(--hmb-accent-primary);">${log.hmb_audit_action_type}</span>
          <span class="font-mono font-semibold opacity-80">${log.hmb_audit_entity_name}</span>
          <span class="opacity-60">#${log.hmb_audit_entity_ref}</span>
        </div>
        <div class="font-medium text-sm">${log.hmb_audit_summary}</div>
      </div>
      <div class="text-right font-mono opacity-70 shrink-0">
        <div>👤 ${log.hmb_audit_actor || 'pradhan_sevak'}</div>
        <div>🕒 ${new Date(log.hmb_audit_created_at).toLocaleString()}</div>
      </div>
    </div>
  `).join('');
}

function hmbExportAuditLogsJson() {
  const jsonStr = JSON.stringify(hmbState.auditLogs, null, 2);
  hmbCopyTextToClipboard(jsonStr);
}

async function hmbRunApiSandbox(method, endpoint) {
  const outEl = document.getElementById('hmb-api-sandbox-output');
  if (!outEl) return;
  outEl.textContent = `// Executing live ${method} ${endpoint} request...`;

  const relPath = endpoint.replace(/^\/api/, '');
  const liveRes = await hmbApiRequest(method, relPath);
  if (!liveRes.offline && liveRes.data) {
    outEl.textContent = `// LIVE NEONDB RESPONSE — HTTP ${liveRes.status} ${method} ${endpoint}\n` + JSON.stringify(liveRes.data, null, 2);
    return;
  }

  let fallbackData = {};
  if (endpoint === '/api/posts') {
    fallbackData = { count: hmbState.posts.length, posts: hmbState.posts };
  } else if (endpoint === '/api/quick-reads') {
    fallbackData = { count: hmbState.quickReads.length, quickReads: hmbState.quickReads };
  } else if (endpoint === '/api/config') {
    fallbackData = { config: hmbState.config, contact: hmbState.contact };
  } else if (endpoint === '/api/audit-logs') {
    fallbackData = { count: hmbState.auditLogs.length, auditLogs: hmbState.auditLogs };
  }
  outEl.textContent = `// PREVIEW RESPONSE — HTTP 200 ${method} ${endpoint}\n` + JSON.stringify(fallbackData, null, 2);
}

function hmbCopySqlSchema() {
  const codeEl = document.getElementById('hmb-sql-schema-code');
  if (codeEl) hmbCopyTextToClipboard(codeEl.textContent);
}

function hmbRenderAdminDashboard() {
  hmbRenderAdminPostsTable();
  hmbRenderAdminQuickReads();
  hmbRenderFestivalPresetsGrid();
  hmbRenderAuditLogs();
  hmbUpdateEditorMetrics();
}

// =========================================================================
// 16. SCROLL PROGRESS & WINDOW INITIALIZATION
// =========================================================================
window.addEventListener('scroll', () => {
  const bar = document.getElementById('hmb-reading-progress-bar');
  if (!bar) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
  bar.style.width = pct + '%';
});

window.addEventListener('DOMContentLoaded', async () => {
  // Resolve embedded HD images if running in single-file Canvas mode
  document.querySelectorAll('img[data-hmb-src]').forEach((img) => {
    const k = img.getAttribute('data-hmb-src');
    img.src = hmbResolveImg(k);
  });

  hmbApplySiteConfigToDOM();
  hmbUpdateAdminButtonBadge();
  hmbApplyGlobalTranslations();
  hmbRenderAdminDashboard();

  // Fetch live data from NeonDB via /api/bootstrap (also auto-provisions & seeds empty tables!)
  await hmbLoadBootstrapFromDatabase();

  // Verify any stored admin credentials against the live Netlify environment variables
  if (hmbState.isAdminAuthenticated && hmbState.adminCreds.username) {
    const verifyRes = await hmbApiRequest('POST', '/admin/login', {
      username: hmbState.adminCreds.username,
      password: hmbState.adminCreds.password
    });
    if (!verifyRes.offline && !verifyRes.ok) {
      // Stored credentials no longer match Netlify env vars: clear stale session
      hmbState.isAdminAuthenticated = false;
      hmbState.adminCreds = { username: '', password: '' };
      hmbSaveLocal(HMB_STORAGE_KEYS.ADMIN_AUTH, { authenticated: false, username: '', password: '' });
      hmbUpdateAdminButtonBadge();
    } else if (verifyRes.ok) {
      await hmbFetchAuditLogsFromDatabase();
    }
  }
});

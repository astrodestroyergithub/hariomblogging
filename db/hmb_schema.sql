-- =============================================================================
-- ॐ हरि Blogging (Hari Om Blogging) — Complete NeonDB PostgreSQL Schema & Seed
-- Unique Prefix: Every table, view, column, index, sequence, and trigger uses
-- the 'hmb_' prefix to prevent any conflicts with existing database objects.
-- =============================================================================

BEGIN;

-- 1. Site Global Configuration & Persistent State Table
CREATE TABLE IF NOT EXISTS hmb_site_config_tbl (
    hmb_config_id SERIAL PRIMARY KEY,
    hmb_config_key VARCHAR(120) UNIQUE NOT NULL,
    hmb_site_title VARCHAR(255) NOT NULL DEFAULT 'ॐ हरि Blogging',
    hmb_site_subtitle VARCHAR(500) NOT NULL DEFAULT 'Sanatana Vangmaya, Vedic Wisdom & Timeless Dharmic Reflections',
    hmb_active_language VARCHAR(32) NOT NULL DEFAULT 'en',
    hmb_active_theme VARCHAR(64) NOT NULL DEFAULT 'sattvic_gold',
    hmb_active_festival_key VARCHAR(64) NOT NULL DEFAULT 'sattvic_default',
    hmb_banner_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    hmb_banner_badge VARCHAR(200) NOT NULL DEFAULT '🪔 शुभ उत्सव • Deepavali, Sharadotsav & Chhath Parva',
    hmb_banner_headline VARCHAR(400) NOT NULL DEFAULT 'तमसो मा ज्योतिर्गमय — Lead Us From Darkness Unto Sacred Light',
    hmb_banner_subtext TEXT NOT NULL DEFAULT 'Explore special festive discourses on Deepavali, Durga Puja, Chhath Puja, Bhai Dooj, Ganesh Chaturthi, and Vasant Holi.',
    hmb_banner_cta_label VARCHAR(120) NOT NULL DEFAULT 'Read Festive Discourses →',
    hmb_banner_cta_category VARCHAR(120) NOT NULL DEFAULT 'Dharmic Living & Festivals',
    hmb_daily_mantra_sanskrit TEXT NOT NULL DEFAULT 'ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥',
    hmb_daily_mantra_meaning TEXT NOT NULL DEFAULT 'May all sentient beings be at peace; may no one suffer from illness; may all see what is auspicious; may no one suffer.',
    hmb_config_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Long-Form Dharmic Blog Posts Table
CREATE TABLE IF NOT EXISTS hmb_blog_posts_tbl (
    hmb_post_id SERIAL PRIMARY KEY,
    hmb_post_slug VARCHAR(255) UNIQUE NOT NULL,
    hmb_post_title VARCHAR(400) NOT NULL,
    hmb_post_subtitle VARCHAR(600) DEFAULT '',
    hmb_post_category VARCHAR(120) NOT NULL,
    hmb_post_tags TEXT[] NOT NULL DEFAULT '{}',
    hmb_post_author_name VARCHAR(180) NOT NULL DEFAULT 'Acharya Vishwanath Shastri',
    hmb_post_author_role VARCHAR(180) NOT NULL DEFAULT 'Vedanta & Agamic Scholar',
    hmb_post_cover_image TEXT NOT NULL,
    hmb_post_shloka_sanskrit TEXT DEFAULT '',
    hmb_post_shloka_transliteration TEXT DEFAULT '',
    hmb_post_shloka_meaning TEXT DEFAULT '',
    hmb_post_excerpt TEXT NOT NULL,
    hmb_post_content_html TEXT NOT NULL,
    hmb_post_word_count INTEGER NOT NULL DEFAULT 0,
    hmb_post_char_count INTEGER NOT NULL DEFAULT 0,
    hmb_post_reading_minutes INTEGER NOT NULL DEFAULT 5,
    hmb_post_views_count INTEGER NOT NULL DEFAULT 108,
    hmb_post_likes_count INTEGER NOT NULL DEFAULT 27,
    hmb_post_is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    hmb_post_is_published BOOLEAN NOT NULL DEFAULT TRUE,
    hmb_post_translations_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    hmb_post_published_date DATE NOT NULL DEFAULT CURRENT_DATE,
    hmb_post_created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    hmb_post_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Quick-Reads / Subhashita & Sutra Snapshots Table
CREATE TABLE IF NOT EXISTS hmb_quick_reads_tbl (
    hmb_quick_id SERIAL PRIMARY KEY,
    hmb_quick_title VARCHAR(300) NOT NULL,
    hmb_quick_category VARCHAR(120) NOT NULL DEFAULT 'Subhashita',
    hmb_quick_sanskrit_verse TEXT NOT NULL,
    hmb_quick_summary TEXT NOT NULL,
    hmb_quick_scripture_source VARCHAR(200) NOT NULL DEFAULT 'Hitopadesha',
    hmb_quick_reading_seconds INTEGER NOT NULL DEFAULT 90,
    hmb_quick_translations_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    hmb_quick_is_active BOOLEAN NOT NULL DEFAULT TRUE,
    hmb_quick_created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Festive Banners & Seasonal Themes Preset Table
CREATE TABLE IF NOT EXISTS hmb_festive_banners_tbl (
    hmb_festival_id SERIAL PRIMARY KEY,
    hmb_festival_key VARCHAR(64) UNIQUE NOT NULL,
    hmb_festival_name VARCHAR(160) NOT NULL,
    hmb_festival_icon VARCHAR(32) NOT NULL DEFAULT '🪔',
    hmb_festival_theme_code VARCHAR(64) NOT NULL,
    hmb_festival_badge VARCHAR(200) NOT NULL,
    hmb_festival_headline VARCHAR(400) NOT NULL,
    hmb_festival_subtext TEXT NOT NULL,
    hmb_festival_cta_label VARCHAR(120) NOT NULL DEFAULT 'Explore Discourses →',
    hmb_festival_cta_category VARCHAR(120) NOT NULL DEFAULT 'Dharmic Living & Festivals',
    hmb_festival_mantra TEXT NOT NULL,
    hmb_festival_mantra_meaning TEXT NOT NULL DEFAULT '',
    hmb_festival_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Sanctuary Contact Details Table
CREATE TABLE IF NOT EXISTS hmb_contact_details_tbl (
    hmb_contact_id SERIAL PRIMARY KEY,
    hmb_contact_key VARCHAR(64) UNIQUE NOT NULL DEFAULT 'primary_sanctuary',
    hmb_sanctuary_name VARCHAR(250) NOT NULL DEFAULT 'ॐ हरि Blogging — Sanatana Vangmaya पीठम्',
    hmb_contact_email VARCHAR(200) NOT NULL DEFAULT 'samparka@hariomblogging.org',
    hmb_contact_phone VARCHAR(80) NOT NULL DEFAULT '+91 (0542) 250-1088',
    hmb_contact_address TEXT NOT NULL DEFAULT 'Assi Ghat Dharmic Granthagar, Kashi Vishwanath Corridor Marg, Varanasi, Uttar Pradesh 221005, Bharat',
    hmb_contact_hours VARCHAR(200) NOT NULL DEFAULT 'Brahma Muhurta 04:30 AM – Sandhya 08:30 PM IST (All Days)',
    hmb_social_x_handle VARCHAR(160) NOT NULL DEFAULT '@HariOmBlogging',
    hmb_social_youtube VARCHAR(160) NOT NULL DEFAULT 'youtube.com/@HariOmVangmaya',
    hmb_social_telegram VARCHAR(160) NOT NULL DEFAULT 't.me/HariOmDharmaSatsang',
    hmb_footer_blessing TEXT NOT NULL DEFAULT 'लोकाः समस्ताः सुखिनो भवन्तु • धर्मो रक्षति रक्षितः',
    hmb_contact_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Admin Audit Log Table
CREATE TABLE IF NOT EXISTS hmb_admin_audit_log_tbl (
    hmb_audit_id SERIAL PRIMARY KEY,
    hmb_audit_action_type VARCHAR(100) NOT NULL,
    hmb_audit_entity_name VARCHAR(150) NOT NULL,
    hmb_audit_entity_ref VARCHAR(150) DEFAULT '',
    hmb_audit_summary TEXT NOT NULL,
    hmb_audit_payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    hmb_audit_actor VARCHAR(120) NOT NULL DEFAULT 'pradhan_sevak',
    hmb_audit_created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Unique Prefixed Indexes
CREATE INDEX IF NOT EXISTS hmb_idx_posts_category ON hmb_blog_posts_tbl(hmb_post_category);
CREATE INDEX IF NOT EXISTS hmb_idx_posts_published_date ON hmb_blog_posts_tbl(hmb_post_published_date DESC);
CREATE INDEX IF NOT EXISTS hmb_idx_posts_featured ON hmb_blog_posts_tbl(hmb_post_is_featured);
CREATE INDEX IF NOT EXISTS hmb_idx_audit_created_at ON hmb_admin_audit_log_tbl(hmb_audit_created_at DESC);

-- 8. Unique Prefixed Views
CREATE OR REPLACE VIEW hmb_published_feed_vw AS
SELECT
    p.hmb_post_id,
    p.hmb_post_slug,
    p.hmb_post_title,
    p.hmb_post_subtitle,
    p.hmb_post_category,
    p.hmb_post_tags,
    p.hmb_post_author_name,
    p.hmb_post_author_role,
    p.hmb_post_cover_image,
    p.hmb_post_shloka_sanskrit,
    p.hmb_post_shloka_transliteration,
    p.hmb_post_shloka_meaning,
    p.hmb_post_excerpt,
    p.hmb_post_word_count,
    p.hmb_post_char_count,
    p.hmb_post_reading_minutes,
    p.hmb_post_views_count,
    p.hmb_post_likes_count,
    p.hmb_post_is_featured,
    p.hmb_post_translations_json,
    p.hmb_post_published_date
FROM hmb_blog_posts_tbl p
WHERE p.hmb_post_is_published = TRUE
ORDER BY p.hmb_post_is_featured DESC, p.hmb_post_published_date DESC, p.hmb_post_id DESC;

CREATE OR REPLACE VIEW hmb_category_stats_vw AS
SELECT
    p.hmb_post_category AS hmb_stat_category,
    COUNT(*) AS hmb_stat_total_posts,
    COALESCE(SUM(p.hmb_post_word_count), 0) AS hmb_stat_total_words,
    COALESCE(SUM(p.hmb_post_views_count), 0) AS hmb_stat_total_reads,
    ROUND(AVG(p.hmb_post_reading_minutes), 1) AS hmb_stat_avg_reading_mins
FROM hmb_blog_posts_tbl p
WHERE p.hmb_post_is_published = TRUE
GROUP BY p.hmb_post_category
ORDER BY hmb_stat_total_posts DESC;

-- 9. Trigger Function for Automatic Timestamp Updates
CREATE OR REPLACE FUNCTION hmb_fn_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.hmb_post_updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS hmb_trg_posts_updated_at ON hmb_blog_posts_tbl;
CREATE TRIGGER hmb_trg_posts_updated_at
BEFORE UPDATE ON hmb_blog_posts_tbl
FOR EACH ROW EXECUTE FUNCTION hmb_fn_touch_updated_at();

-- =============================================================================
-- 10. SEED PRE-EXISTING DATA (Idempotent INSERT ... ON CONFLICT DO NOTHING)
-- =============================================================================

INSERT INTO hmb_site_config_tbl (
    hmb_config_key, hmb_site_title, hmb_site_subtitle, hmb_active_language,
    hmb_active_theme, hmb_active_festival_key, hmb_banner_enabled,
    hmb_banner_badge, hmb_banner_headline, hmb_banner_subtext,
    hmb_banner_cta_label, hmb_banner_cta_category,
    hmb_daily_mantra_sanskrit, hmb_daily_mantra_meaning
) VALUES (
    'primary_config',
    'ॐ हरि Blogging',
    'Sanatana Vangmaya, Vedic Wisdom & Timeless Dharmic Reflections',
    'en',
    'sattvic_gold',
    'sattvic_default',
    TRUE,
    '🪔 शुभ उत्सव • Deepavali, Sharadotsav & Chhath Parva',
    'तमसो मा ज्योतिर्गमय — Lead Us From Darkness Unto Sacred Light',
    'Explore special festive discourses on Deepavali, Durga Puja, Chhath Puja, Bhai Dooj, Ganesh Chaturthi & Vasant Holi.',
    'Read Festive Discourses →',
    'Dharmic Living & Festivals',
    'ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥',
    'May all sentient beings be at peace; may no one suffer from illness; may all see what is auspicious; may no one suffer.'
) ON CONFLICT (hmb_config_key) DO NOTHING;

INSERT INTO hmb_contact_details_tbl (
    hmb_contact_key, hmb_sanctuary_name, hmb_contact_email, hmb_contact_phone,
    hmb_contact_address, hmb_contact_hours, hmb_social_x_handle,
    hmb_social_youtube, hmb_social_telegram, hmb_footer_blessing
) VALUES (
    'primary_sanctuary',
    'ॐ हरि Blogging — Sanatana Vangmaya पीठम्',
    'samparka@hariomblogging.org',
    '+91 (0542) 250-1088',
    'Assi Ghat Dharmic Granthagar, Kashi Vishwanath Corridor Marg, Varanasi, Uttar Pradesh 221005, Bharat',
    'Brahma Muhurta 04:30 AM – Sandhya 08:30 PM IST (All Days)',
    '@HariOmBlogging',
    'youtube.com/@HariOmVangmaya',
    't.me/HariOmDharmaSatsang',
    'लोकाः समस्ताः सुखिनो भवन्तु • धर्मो रक्षति रक्षितः'
) ON CONFLICT (hmb_contact_key) DO NOTHING;

INSERT INTO hmb_festive_banners_tbl (
    hmb_festival_key, hmb_festival_name, hmb_festival_icon, hmb_festival_theme_code,
    hmb_festival_badge, hmb_festival_headline, hmb_festival_subtext,
    hmb_festival_cta_label, hmb_festival_cta_category, hmb_festival_mantra, hmb_festival_mantra_meaning
) VALUES (
    'sattvic_default', 'Sattvic Swarna (Default)', '🕉️', 'sattvic_gold',
    '🕉️ सनातन वाङ्मय • Nitya Dharma Satsang', 'असतो मा सद्गमय — Contemplate Eternal Vedic & Upanishadic Wisdom', 'Immerse yourself in long-form discourses on Vedanta, Puranic fables, sacred temple architecture, and Sattvic living.',
    'Explore Sacred Feed', 'all', 'ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥', 'May all sentient beings be at peace; may no one suffer from illness; may all see what is auspicious; may no one suffer.'
) ON CONFLICT (hmb_festival_key) DO NOTHING;
INSERT INTO hmb_festive_banners_tbl (
    hmb_festival_key, hmb_festival_name, hmb_festival_icon, hmb_festival_theme_code,
    hmb_festival_badge, hmb_festival_headline, hmb_festival_subtext,
    hmb_festival_cta_label, hmb_festival_cta_category, hmb_festival_mantra, hmb_festival_mantra_meaning
) VALUES (
    'diwali', 'Diwali (Deepavali Parva)', '🪔', 'diwali',
    '🪔 शुभ दीपावली • Festival of Sacred Diyas', 'तमसो मा ज्योतिर्गमय — May the Lamps of Knowledge Illumine Every Heart', 'Celebrate Sri Rama’s auspicious return to Ayodhya and Goddess Mahalakshmi’s grace with special Deepavali reflections.',
    'Read Deepavali Discourses', 'Dharmic Living & Festivals', 'ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद श्रीं ह्रीं श्रीं ॐ महालक्ष्म्यै नमः॥', 'Salutations to Goddess Mahalakshmi, who abides in the sacred lotus and bestows inner and outer radiance.'
) ON CONFLICT (hmb_festival_key) DO NOTHING;
INSERT INTO hmb_festive_banners_tbl (
    hmb_festival_key, hmb_festival_name, hmb_festival_icon, hmb_festival_theme_code,
    hmb_festival_badge, hmb_festival_headline, hmb_festival_subtext,
    hmb_festival_cta_label, hmb_festival_cta_category, hmb_festival_mantra, hmb_festival_mantra_meaning
) VALUES (
    'durga_puja', 'Durga Puja (Sharadotsav)', '🔱', 'durga_puja',
    '🔱 शुभ शारदीय दुर्गा पूजा • Jai Maa Jagadamba', 'या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता — Reverence to the Divine Mother', 'Explore Devi Mahatmyam commentaries, Navadurga symbolism, and the triumph of Dharma over Mahishasura.',
    'Read Shakti Discourses', 'Itihasa & Puranas', 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥', 'O Narayani, auspiciousness of all that is auspicious, fulfiller of all noble aspirations, refuge of the তিন worlds, salutations to Thee.'
) ON CONFLICT (hmb_festival_key) DO NOTHING;
INSERT INTO hmb_festive_banners_tbl (
    hmb_festival_key, hmb_festival_name, hmb_festival_icon, hmb_festival_theme_code,
    hmb_festival_badge, hmb_festival_headline, hmb_festival_subtext,
    hmb_festival_cta_label, hmb_festival_cta_category, hmb_festival_mantra, hmb_festival_mantra_meaning
) VALUES (
    'holi', 'Holi (Vasantotsava)', '🌸', 'holi',
    '🌸 शुभ होली एवं वसन्तोत्सव • Festival of Sacred Colors & Bhakti', 'रंगोत्सव एवं भक्त प्रह्लाद स्मरण — Celebrating Devotion, Spring & Harmony', 'Discover the Puranic legend of Bhakta Prahlada, Vrindavan Raas-Leela philosophy, and herbal Ayurvedic Vasant traditions.',
    'Explore Bhakti & Festival Posts', 'Dharmic Living & Festivals', 'हरेर्नाम हरेर्नाम हरेर्नामैव केवलम्। कलौ नास्त्येव नास्त्येव नास्त्येव गतिरन्यथा॥', 'In this age of Kali, chanting the sacred name of Hari is the supreme path to joyful liberation and inner purity.'
) ON CONFLICT (hmb_festival_key) DO NOTHING;
INSERT INTO hmb_festive_banners_tbl (
    hmb_festival_key, hmb_festival_name, hmb_festival_icon, hmb_festival_theme_code,
    hmb_festival_badge, hmb_festival_headline, hmb_festival_subtext,
    hmb_festival_cta_label, hmb_festival_cta_category, hmb_festival_mantra, hmb_festival_mantra_meaning
) VALUES (
    'ganesh_chaturthi', 'Ganesh Chaturthi (Vinayaka Utsav)', '🐘', 'ganesh_chaturthi',
    '🌺 श्री गणेश चतुर्थी • गणपति बप्पा मोरया', 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ — Invoking the Lord of Wisdom & New Beginnings', 'Read our special series on the Ganapati Atharvashirsha, Mudgala Purana fables, and the philosophical symbolism of Lord Ganesha.',
    'Read Ganapati Granthas', 'Sanskrit & Mantras', 'ॐ एकदन्ताय विद्महे वक्रतुण्डाय धीमहि। तन्नो दन्ती प्रचोदयात्॥', 'We meditate upon the Single-Tusked Lord of Wisdom; may the Curved-Trunked Vinayaka illuminate our intellect.'
) ON CONFLICT (hmb_festival_key) DO NOTHING;
INSERT INTO hmb_festive_banners_tbl (
    hmb_festival_key, hmb_festival_name, hmb_festival_icon, hmb_festival_theme_code,
    hmb_festival_badge, hmb_festival_headline, hmb_festival_subtext,
    hmb_festival_cta_label, hmb_festival_cta_category, hmb_festival_mantra, hmb_festival_mantra_meaning
) VALUES (
    'chhath_puja', 'Chhath Puja (Surya Shashti)', '☀️', 'chhath_puja',
    '☀️ लोकआस्था का महापर्व छठ पूजा • जय छठी मैया एवं सूर्य देव', 'ॐ घृणिः सूर्याय नमः — Offering Sacred Arghya to Pratyaksha Devata Surya', 'Contemplate the Vedic roots of Surya Upasana, Rigvedic Saura Suktas, ecological purity, and the discipline of Chhath Vrata.',
    'Read Surya & Vedic Posts', 'Dharmic Living & Festivals', 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥', 'We meditate on the adorable effulgence of the Divine Sun Savitur; may That awaken and inspire our highest intelligence.'
) ON CONFLICT (hmb_festival_key) DO NOTHING;
INSERT INTO hmb_festive_banners_tbl (
    hmb_festival_key, hmb_festival_name, hmb_festival_icon, hmb_festival_theme_code,
    hmb_festival_badge, hmb_festival_headline, hmb_festival_subtext,
    hmb_festival_cta_label, hmb_festival_cta_category, hmb_festival_mantra, hmb_festival_mantra_meaning
) VALUES (
    'bhai_dooj', 'Bhai Dooj (Yama Dwitiya)', '🏵️', 'bhai_dooj',
    '🏵️ शुभ भाई दूज एवं यम द्वितीया • Sacred Bond of Dharma & Protection', 'भ्रातृ-भगिनी स्नेह पर्व — The Puranic Dialogue of Yamuna and Yamaraja', 'Explore the sacred Grihastha traditions of Bhai Dooj, family dharma in the Smritis, and auspicious festive blessings.',
    'Read Grihastha Dharma Posts', 'Dharmic Living & Festivals', 'भ्रातृस्नेहः सदा रक्षेत् धर्ममार्गे प्रतिष्ठितः। आयुष्यं वर्धतां नित्यं मङ्गलं भवतु सर्वदा॥', 'May the sacred bond of sibling affection grounded in Dharma ever protect, nourish longevity, and bring auspiciousness.'
) ON CONFLICT (hmb_festival_key) DO NOTHING;

INSERT INTO hmb_blog_posts_tbl (
    hmb_post_id, hmb_post_slug, hmb_post_title, hmb_post_subtitle, hmb_post_category,
    hmb_post_tags, hmb_post_author_name, hmb_post_author_role, hmb_post_cover_image,
    hmb_post_shloka_sanskrit, hmb_post_shloka_transliteration, hmb_post_shloka_meaning,
    hmb_post_excerpt, hmb_post_content_html, hmb_post_word_count, hmb_post_char_count,
    hmb_post_reading_minutes, hmb_post_views_count, hmb_post_likes_count,
    hmb_post_is_featured, hmb_post_is_published, hmb_post_translations_json, hmb_post_published_date
) VALUES (
    101, 'mahavakyas-of-advaita-vedanta-and-inner-witness', 'The Four Mahavakyas of the Upanishads: Awakening the Inner Witness (Sakshi Chaitanya)',
    'A comprehensive contemplation on Prajnanam Brahma, Aham Brahmasmi, Tat Tvam Asi, and Ayam Atma Brahma across the four Vedas.', 'Vedanta & Upanishads',
    ARRAY['Upanishads', 'Advaita Vedanta', 'Mahavakya', 'Atman', 'Adi Shankaracharya']::text[], 'Acharya Vishwanath Shastri',
    'Vedanta & Upanishadic Scholar, Kashi', 'assets/images/vedanta-ashram.jpg',
    'प्रज्ञानं ब्रह्म । अहं ब्रह्मास्मि । तत्त्वमसि । अयमात्मा ब्रह्म ॥', 'Prajñānaṁ Brahma | Ahaṁ Brahmāsmi | Tat Tvam Asi | Ayam Ātmā Brahma ||',
    'Pure Consciousness is Brahman (Rigveda); I am Brahman (Yajurveda); That Thou Art (Samaveda); This Self is Brahman (Atharvaveda).', 'Explore how the four sovereign declarations of the Upanishads dissolve the veil of duality and reveal the luminous, unchanging witness consciousness abiding within every living being.',
    '
          <h2>१. उपक्रमणिका • The Himalayan Dawn of Self-Inquiry (Atma-Vichara)</h2>
          <p>In the quietude of Brahma Muhurta, when the first golden rays touch the snow-clad peaks of Devbhumi and illuminate the sacred palm-leaf manuscripts of the Rishis, a single perennial question echoes across millennia: <em>"Kas tvam? Ko''ham?"</em> — Who art thou, and what is the substratum of this experiencing consciousness? Unlike speculative systems that treat philosophy merely as intellectual gymnastics, the <strong>Upanishads</strong> (literally <em>sitting down near</em> the Guru in reverent receptivity) offer direct experiential realization — <strong>Aparoksha Anubhuti</strong>.</p>
          <p>Across the vast expanse of the four Vedas — Rig, Yajur, Sama, and Atharva — the ancient seers distilled the pinnacle of non-dual wisdom into four succinct, sovereign aphorisms known as the <strong>Chatur-Mahavakyas</strong> (The Four Great Contemplative Declarations). Adi Shankaracharya later established four cardinal Peethams across Bharatvarsha — Sringeri, Dwaraka, Govardhana (Puri), and Jyotirmath — dedicating each sanctuary to one of these four Mahavakyas.</p>

          <blockquote class="hmb-shloka-box">
            <strong>ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः ।<br/>अनेन वेद्यं सच्छास्त्रमिति वेदान्तडिण्डिमः ॥</strong><br/>
            <em>"Brahman alone is the unchanging Reality; the phenomenal world of names and forms is an apparent projection; the individual Self (Jiva) is none other than Brahman. This is theclarion proclamation of the Vedanta Shastras."</em>
          </blockquote>

          <h2>२. प्रज्ञानं ब्रह्म • Prajnanam Brahma (Aitareya Upanishad, Rigveda)</h2>
          <p>The first Mahavakya, <strong>Prajnanam Brahma</strong> (प्रज्ञानं ब्रह्म), appears in the third chapter of the <em>Aitareya Upanishad</em> belonging to the Rigveda. Here, the sage Aitareya investigates the nature of the inner controller behind the senses: by whom do we see form, hear nada, inhale fragrance, articulate speech, and discern the sweet from the bitter?</p>
          <p>The Upanishad points out that the mind (Manas), intellect (Buddhi), memory (Smriti), and sensory faculties are all instruments illuminated by a deeper, self-effulgent awareness called <strong>Prajnanam</strong>. Just as a clay lamp illuminates a temple sanctum without needing another lamp to reveal its own flame, <em>Prajnanam</em> is the unconditioned consciousness that renders every thought and perception possible. Therefore, this first Mahavakya serves as the <strong>Lakshana Vakya</strong> — the definitional statement establishing the essential nature of Ultimate Reality as pure, self-luminous Consciousness.</p>

          <h2>३. तत्त्वमसि • Tat Tvam Asi (Chandogya Upanishad, Samaveda)</h2>
          <p>In the sixth Prapathaka of the <em>Chandogya Upanishad</em>, young Svetaketu returns home after twelve years of formal Vedic study, brimming with scholarly pride. His father, Rishi Uddalaka Aruni, gently asks him: <em>"O Svetaketu, hast thou inquired into that instruction (Adesha) by hearing which the unheard becomes heard, the unthought becomes thought, and the unknown becomes known?"</em></p>
          <p>Through nine unforgettable illustrations — clay and pots, gold and ornaments, rivers merging into the ocean, and the subtle essence within the microscopic seed of a mighty Nyagrodha (banyan) tree — Uddalaka Aruni reveals the <strong>Upadesha Vakya</strong> (Instructional Declaration): <strong>Tat Tvam Asi</strong> — <em>"That Subtle Essence which is the root of the entire cosmos, That is Truth, That is the Self, and That Thou Art, O Svetaketu!"</em></p>
          <ul>
            <li><strong>Vachyartha (Literal Meaning):</strong> On the surface, <em>Tat</em> (the omniscient Cosmic Lord, Ishvara) and <em>Tvam</em> (the finite individual Jiva endowed with limited knowledge) appear distinct because of their limiting adjuncts (Upadhis) — Maya and Avidya.</li>
            <li><strong>Lakshyartha (Implied Non-Dual Meaning via Jahad-Ajahad Lakshana):</strong> When we set aside the contradictory adjuncts of cosmic omniscience and individual finitude, what remains in both is pure, indivisible Sat-Chit-Ananda (Existence-Consciousness-Bliss).</li>
          </ul>

          <h2>४. अयमात्मा ब्रह्म • Ayam Atma Brahma (Mandukya Upanishad, Atharvaveda)</h2>
          <p>The <em>Mandukya Upanishad</em> — lauded in the Muktikopanishad as sufficient by itself for liberation — analyzes the totality of human experience through the sacred syllable <strong>Om (प्रणवः)</strong> and the four states of consciousness (Chatushpada):</p>
          <ol>
            <li><strong>Jagrat (Waking State — Vaishvanara / "A"-kara):</strong> Consciousness turned outward through nineteen channels, experiencing the gross physical cosmos.</li>
            <li><strong>Svapna (Dream State — Taijasa / "U"-kara):</strong> Consciousness turned inward, projecting a luminous subtle world woven from mental impressions (Vasanas).</li>
            <li><strong>Sushupti (Deep Dreamless Sleep — Prajna / "M"-kara):</strong> Unified, undifferentiated consciousness where all desires and mental modifications subside into causal peace.</li>
            <li><strong>Turiya (The Fourth — The Audible Silence following Om):</strong> Not a fourth chronological state alongside the other three, but the substratum (Adhishthana) witnessing waking, dream, and deep sleep alike.</li>
          </ol>

          <h2>५. अहं ब्रह्मास्मि • Aham Brahmasmi (Brihadaranyaka Upanishad, Yajurveda)</h2>
          <p>When the seeker assimilates the definition (<em>Prajnanam Brahma</em>), receives the Guru''s compassionate pointer (<em>Tat Tvam Asi</em>), and verifies through fourfold inquiry that the inner witness is universal (<em>Ayam Atma Brahma</em>), there blossoms the culminating <strong>Anubhava Vakya</strong> (Declaration of Direct Realization): <strong>Aham Brahmasmi</strong>.</p>
          <p>Far from egoic inflation (Ahamkara), <em>Aham Brahmasmi</em> is the complete dissolution of the small, separate ego into boundless compassion and equanimity. One who beholds the same Atman shining inside the scholar, the cow, the elephant, the dog, and the outcaste (<em>Panditah समदर्शिनः</em> — Bhagavad Gita 5.18) walks the earth as a living blessing — serene in adversity, humble in prosperity, and anchored in eternal Dharma.</p>
        ', 1840, 11420,
    16, 1420, 324,
    TRUE, TRUE,
    '{"hi": {"title": "उपनिषदों के चार महावाक्य: साक्षी चैतन्य और आत्म-साक्षात्कार का जागरण", "subtitle": "प्रज्ञानं ब्रह्म, अहं ब्रह्मास्मि, तत्त्वमसि और अयमात्मा ब्रह्म — चारों वेदों के सर्वोच्च अद्वैत उद्घोषों का तात्त्विक विवेचन।", "excerpt": "जानिए किस प्रकार चारों वेदों के चार महावाक्य द्वैत के आवरण को हटाकर प्रत्येक प्राणी के भीतर प्रकाशित होने वाले नित्य, शुद्ध और अद्वैत साक्षी चैतन्य का बोध कराते हैं।", "content_html": "\n              <h2>१. उपक्रमणिका • आत्म-विचार का हिमालयी अरुणोदय</h2>\n              <p>ब्रह्ममुहूर्त की पावन निस्तब्धता में, जब सूर्य की प्रथम स्वर्णिम किरणें हिमालय के शिखरों और ऋषियों के ताड़पत्र ग्रन्थों को आलोकित करती हैं, तब सहस्राब्दियों से गूँजता एक ही शाश्वत प्रश्न साधक के हृदय में उदित होता है— <em>\"कोऽहम्? कस्त्वम्?\"</em> — मैं कौन हूँ और इस समस्त अनुभव जगत का मूल अधिष्ठान क्या है? उपनिषद् केवल बौद्धिक तर्क-वितर्क नहीं हैं, अपितु गुरु के समीप श्रद्धापूर्वक बैठकर प्राप्त किया जाने वाला <strong>अपरोक्ष अनुभूति</strong> का विज्ञान हैं।</p>\n              <blockquote class=\"hmb-shloka-box\">\n                <strong>ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः ।<br/>अनेन वेद्यं सच्छास्त्रमिति वेदान्तडिण्डिमः ॥</strong><br/>\n                <em>\"ब्रह्म ही एकमात्र अबाधित सत्य है, नाम-रूपात्मक जगत परिवर्तनशील प्रतीति है, और जीव वास्तव में ब्रह्म से अभिन्न है—यही वेदान्त शास्त्रों की उद्घोषणा है।\"</em>\n              </blockquote>\n              <h2>२. प्रज्ञानं ब्रह्म (ऐतरेय उपनिषद् — ऋग्वेद)</h2>\n              <p>ऋग्वेद के ऐतरेय उपनिषद् में प्रथम महावाक्य <strong>प्रज्ञानं ब्रह्म</strong> आता है। जिस प्रकार दीपक को स्वयं को प्रकाशित करने के लिए किसी अन्य दीपक की आवश्यकता नहीं होती, उसी प्रकार मन, बुद्धि और इन्द्रियों को प्रकाशित करने वाला शुद्ध बोध-स्वरूप चैतन्य ही ''प्रज्ञान'' है और वही परब्रह्म का लक्षण है।</p>\n              <h2>३. तत्त्वमसि (छान्दोग्य उपनिषद् — सामवेद)</h2>\n              <p>महर्षि उद्दालक आरुणि अपने पुत्र श्वेतकेतु को विशाल वटवृक्ष के सूक्ष्म बीज और लवण-जल के दृष्टान्तों से उपदेश देते हैं— <strong>तत्त्वमसि</strong> (हे श्वेतकेतु! वह सूक्ष्म सत् तत्त्व, जो समस्त ब्रह्माण्ड का मूल कारण है, वही आत्मा है और वही तू है)।</p>\n              <h2>४. अयमात्मा ब्रह्म (माण्डूक्य उपनिषद् — अथर्ववेद) एवं ५. अहं ब्रह्मास्मि (बृहदारण्यक उपनिषद् — यजुर्वेद)</h2>\n              <p>जाग्रत, स्वप्न और सुषुप्ति—इन तीनों अवस्थाओं का साक्षी चतुर्थ ''तुरीय'' आत्मा ही ब्रह्म है (<em>अयमात्मा ब्रह्म</em>)। जब साधक श्रवण, मनन और निदिध्यासन के माध्यम से अहंकार की संकीर्ण सीमाओं को पार कर लेता है, तब उसके हृदय में <strong>अहं ब्रह्मास्मि</strong> की समदर्शी और करुणामयी अनुभूति जागृत होती है।</p>\n            "}, "bn": {"title": "উপনিষদের চার মহাবাক্য: সাক্ষী চৈতন্য ও আত্ম-সাক্ষাৎকারের জাগরণ", "subtitle": "প্রজ্ঞানং ব্রহ্ম, অহং ব্রহ্মাস্মি, তত্ত্বমসি এবং অয়মাত্মা ব্রহ্ম — চার বেদের সর্বোচ্চ অদ্বৈত বাণীর দার্শনিক বিশ্লেষণ।", "excerpt": "জানুন কীভাবে চার বেদের চারটি মহাবাক্য দ্বৈতভাবের আবরণ দূর করে প্রতিটি জীবের অন্তরে বিরাজমান নিত্য, শুদ্ধ ও অবিনশ্বর সাক্ষী চৈতন্যকে প্রকাশিত করে।", "content_html": "\n              <h2>১. উপক্রমণিকা • আত্ম-বিচারের হিমালয় অরুণোদয়</h2>\n              <p>ব্রহ্মমুহূর্তের পবিত্র নীরবতায় যখন সূর্যের প্রথম স্বর্ণাভ কিরণ হিমালয়ের তুষারশৃঙ্গ ও ঋষিদের তালপাতার পুঁথিকে আলোকিত করে, তখন একটি শাশ্বত প্রশ্নই সাধকের হৃদয়ে ধ্বনিত হয়— <em>\"কোऽহম্?\"</em> — আমি কে এবং এই বিশ্বজগতের মূল অধিষ্ঠান কী? উপনিषद কেবল তাত্ত্বিক বিচার নয়, বরং গুরুর চরণে বসে লাভ করা <strong>অপরোক্ষ অনুভূতির</strong> বিজ্ঞান।</p>\n              <blockquote class=\"hmb-shloka-box\">\n                <strong>ব্রহ্ম সত্যং জগন্মিথ্যা জীবো ব্রহ্মৈব নাপরঃ ।<br/>অনেন বেদ্যং সচ্ছাস্ত্রমিতি বেদান্তডিণ্ডিমঃ ॥</strong><br/>\n                <em>\"ব্রহ্মই একমাত্র অবিনশ্বর সত্য, নাম-রূপময় জগৎ আপেক্ষিক প্রতীতি মাত্র, এবং জীব স্বরূপত ব্রহ্ম হতে অভিন্ন—ইহাই বেদান্ত শাস্ত্রের ঘোষণা।\"</em>\n              </blockquote>\n              <h2>২. প্রজ্ঞানং ব্রহ্ম (ঐতরেয় উপনিষদ — ঋগ্বেদ) ও ৩. তত্ত্বমসি (ছান্দোগ্য উপনিষদ — সামবেদ)</h2>\n              <p>মন, বুদ্ধি ও ইন্দ্রিয়সমূহকে যাঁর জ্যোতিতে আলোকিত দেখা যায়, সেই স্বয়ংপ্রকাশ চৈতন্যই <strong>প্রজ্ঞানং ব্রহ্ম</strong>। মহর্ষি উদ্দালক আরুণি পুত্র শ্বেতকেতুকে ন্যগ্রোধ বৃক্ষের বীজের দৃষ্টান্ত দিয়ে উপদেশ দেন— <strong>তত্ত্বমসি</strong> (সেই সূক্ষ্ম পরম তত্ত্বই তুমি)।</p>\n              <h2>৪. অয়মাত্মা ব্রহ্ম (মাণ্ডূক্য উপনিষদ) ও ৫. অহং ব্রহ্মাস্মি (বৃহদারণ্যক উপনিষদ)</h2>\n              <p>জাগ্রত, স্বপ্ন ও সুষুপ্তির অতীত তুরীয় সাক্ষীই <strong>অয়মাত্মা ব্রহ্ম</strong>। শ্রবণ, মনন ও নিদিধ্যাসনের দ্বারা যখন অহংকার বিগলিত হয়, তখন সাধক সর্বভূতে এক আত্মাকে দর্শন করে <strong>অহং ব্রহ্মাস্মি</strong>-র পরম শান্তিতে প্রতিষ্ঠিত হন।</p>\n            "}, "sa": {"title": "उपनिषदां चत्वारि महावाक्यानि — साक्षिचैतन्यस्य आत्मसाक्षात्कारस्य च प्रबोधनम्", "subtitle": "प्रज्ञानं ब्रह्म, अहं ब्रह्मास्मि, तत्त्वमसि, अयमात्मा ब्रह्म चेति चतुर्वेदानां परमाद्वैतसिद्धान्तविमर्शः।", "excerpt": "चतुर्वेदेषु प्रतिपादितानि चत्वारि महावाक्यानि कथं मायावरणं निरस्य सर्वभूतान्तर्यामिणं कूटस्थं साक्षिचैतन्यं प्रकाशयन्तीति अत्र विमृश्यते।", "content_html": "\n              <h2>१. उपक्रमणिका • आत्मविचारस्य ब्राह्ममुहूर्तः</h2>\n              <p>ब्राह्ममुहूर्तस्य पावने प्रशान्तवातावरणे यदा भास्करस्य स्वर्णरश्मयः हिमगिरिशिखराणि महर्षीणां तालपत्रग्रन्थांश्च भासयन्ति, तदा मुमुक्षोः हृदये शाश्वतः प्रश्नः उदेति— <em>\"कोऽहम्? किमिदं जगत्?\"</em> इति। उपनिषदः नाम सद्गुरोः समीपे श्रद्धापूर्वकमुपविश्य प्राप्यमाणं ब्रह्मविद्याविज्ञानम्।</p>\n              <blockquote class=\"hmb-shloka-box\">\n                <strong>ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः ।<br/>अनेन वेद्यं सच्छास्त्रमिति वेदान्तडिण्डिमः ॥</strong>\n              </blockquote>\n              <h2>२. प्रज्ञानं ब्रह्म (ऐतरेयोपनिषद्) तथा ३. तत्त्वमसि (छान्दोग्योपनिषद्)</h2>\n              <p>येन मनः बुद्धिश्चेन्द्रियाणि च प्रकाश्यन्ते तत् स्वयंज्योतिः स्वरूपं <strong>प्रज्ञानं ब्रह्म</strong> इति लक्षणवाक्यम्। छान्दोग्योपनिषदि महर्षिः उद्दालकः श्वेतकेतुं वटबीजदृष्टान्तेन उपदिशति— <em>\"स य एषोऽणिमा ऐतदात्म्यमिदं सर्वं तत्सत्यं स आत्मा तत्त्वमसि श्वेतकेतो\"</em> इति।</p>\n              <h2>४. अयमात्मा ब्रह्म (माण्डूक्योपनिषद्) तथा ५. अहं ब्रह्मास्मि (बृहदारण्यकोपनिषद्)</h2>\n              <p>जाग्रत्-स्वप्न-सुषुप्ति-अवस्थात्रयसाक्षी तुरीयः आत्मा एव ब्रह्म। श्रवण-मनन-निदिध्यासनैः अविद्यायां निवृत्तायां मुमुक्षुः <strong>अहं ब्रह्मास्मि</strong> इति समदर्शनेन जीवन्मुक्तो भवति।</p>\n            "}}'::jsonb, '2026-10-28'
) ON CONFLICT (hmb_post_slug) DO NOTHING;
INSERT INTO hmb_blog_posts_tbl (
    hmb_post_id, hmb_post_slug, hmb_post_title, hmb_post_subtitle, hmb_post_category,
    hmb_post_tags, hmb_post_author_name, hmb_post_author_role, hmb_post_cover_image,
    hmb_post_shloka_sanskrit, hmb_post_shloka_transliteration, hmb_post_shloka_meaning,
    hmb_post_excerpt, hmb_post_content_html, hmb_post_word_count, hmb_post_char_count,
    hmb_post_reading_minutes, hmb_post_views_count, hmb_post_likes_count,
    hmb_post_is_featured, hmb_post_is_published, hmb_post_translations_json, hmb_post_published_date
) VALUES (
    102, 'sacred-geometry-of-hindu-temple-architecture-agama-shilpa', 'Devalaya Vastu & Shilpa Shastra: Why the Hindu Temple is a Living Cosmic Mandala',
    'Decoding the Garbhagriha, Shikhara, Mandapa pillars, Apsara reliefs, and Vastu Purusha Mandala in Agamic architecture.', 'Temple Architecture',
    ARRAY['Temple Architecture', 'Shilpa Shastra', 'Agama', 'Garbhagriha', 'Sacred Geometry']::text[], 'Sthapati Dr. Raghavendra Somayaji',
    'Agama & Shilpa Shastra Historian', 'assets/images/temple-mandapa.jpg',
    'देहो देवालयः प्रोक्तो जीवो देवः सनातनः । त्यजेदज्ञाननिर्माल्यं सोऽहंभावेन पूजयेत् ॥', 'Deho devālayaḥ prokto jīvo devaḥ sanātanaḥ | Tyajed ajñāna-nirmālyaṁ so’haṁ-bhāvena pūjayet ||',
    'The human body itself is declared to be the temple, and the indwelling Jiva is the eternal Deity. Casting off the wilted flowers of ignorance, worship the Divine with the awareness "I am That."', 'From the subterranean foundation of the Vastu Purusha Mandala to the golden Kalasha crowning the Shikhara, discover how ancient temple builders mapped the human subtle body in carved stone.',
    '
          <h2>१. प्रासादः पुरुषः • The Temple as the Cosmic Person (Prasada Purusha)</h2>
          <p>When a pilgrim crosses the threshold of a classical Hindu Devalaya — whether the soaring Nagara Shikharas of Kashi and Khajuraho, the monumental Dravida Vimanas of Thanjavur and Madurai, or the star-shaped Vesara sanctums of Belur — they are not merely entering a congregation hall. According to the <em>Mayamata</em>, <em>Manasara</em>, and <em>Kamikagama</em>, the Hindu temple is <strong>Prasada Purusha</strong>: the cosmos and the human subtle anatomy crystallized into stone through sacred proportion (Tala-Mana).</p>

          <blockquote class="hmb-shloka-box">
            <strong>वास्तुपुरुषमण्डलम् — The 64-Square (Manduka) &amp; 81-Square (Paramashayika) Grids:</strong><br/>
            <em>Before a single granite block is laid, the Sthapati (master architect) consecrates the earth with a geometric yantra aligning the four cardinal directions with solar and stellar equinoxes, placing Brahma at the central Brahmasthana.</em>
          </blockquote>

          <h2>२. गर्भगृहम् • Garbhagriha: The Womb of Unmanifest Stillness</h2>
          <p>Why is the innermost sanctum of a temple intentionally kept unadorned, windowless, and illuminated only by the gentle golden flicker of ghee deepas? Its very name — <strong>Garbhagriha</strong> (<em>Womb-Chamber</em>) — holds the secret. While the outer prakara walls and Sahasra-Stambha mandapas teem with exuberant carvings of dancing apsaras, celestial gandharvas, floral torans, and scenes from the Ramayana and Mahabharata, the pilgrim''s journey inward represents a progressive withdrawal of the senses (<strong>Pratyahara</strong>) from outer multiplicity to the singular stillness of the Heart Cave (<em>Hridaya-Guha</em>).</p>

          <h2>३. शिखर एवं आमलक • The Vertical Axis Mundi (Meru &amp; Sushumna)</h2>
          <p>Directly above the Garbhagriha rises the <strong>Shikhara</strong> or <strong>Vimana</strong>, representing Mount Meru — the cosmic axis connecting Bhurloka (earth) to Svarloka (the celestial realms). In yogic correspondence:</p>
          <ul>
            <li><strong>Paduka / Adhishthana (Base Plinth):</strong> Corresponds to the feet and Muladhara grounding stability.</li>
            <li><strong>Jangha &amp; Mandapa Pillars:</strong> Represent the vital torso and pranic channels, adorned with depictions of the four Purusharthas — Dharma, Artha, Kama, and Moksha.</li>
            <li><strong>Shikhara Spire:</strong> Mirrors the ascending <em>Sushumna Nadi</em> piercing the chakras.</li>
            <li><strong>Amalaka &amp; Golden Kalasha:</strong> The ribbed stone disc (Amalaka) and the nectar-pot finial (Kalasha) crown the temple just as the <em>Sahasrara Padma</em> (thousand-petalled lotus) crowns the awakened yogi, culminating in the point of Bindu invading the infinite sky (Akasha).</li>
          </ul>

          <h2>४. प्रदक्षिणा एवं दर्शन • The Science of Acoustic Resonance &amp; Pradakshina</h2>
          <p>Granite and sandstone mandapas were engineered with precise acoustic geometry. When the temple bell (Ghanta) — cast from Panchaloha (five sacred metals) — is rung alongside the blowing of the Panchajanya Shankha and the chanting of Vedic Mantras, the stone pillars sustain a harmonic resonance around 110 Hz, inducing alpha-theta meditative tranquility in the listener.</p>
        ', 1620, 10280,
    14, 1185, 289,
    TRUE, TRUE,
    '{"hi": {"title": "देवालय वास्तु एवं शिल्प शास्त्र: हिन्दू मन्दिर एक जीवन्त ब्रह्माण्डीय मण्डल क्यों है?", "subtitle": "गर्भगृह, शिखर, मण्डप स्तम्भ, अप्सरा शिल्प और वास्तुपुरुष मण्डल के आध्यात्मिक एवं वैज्ञानिक रहस्यों का उद्घाटन।", "excerpt": "वास्तुपुरुष मण्डल की नींव से लेकर शिखर के स्वर्ण कलश तक, जानिए किस प्रकार प्राचीन स्थपतियों ने मानव के सूक्ष्म शरीर और ब्रह्माण्ड को पाषाण में उकेरा।", "content_html": "\n              <h2>१. प्रासादः पुरुषः • मन्दिर ही विराट पुरुष और सूक्ष्म शरीर का प्रतिरूप है</h2>\n              <p>जब कोई श्रद्धालु किसी प्राचीन देवालय के सिंहद्वार में प्रवेश करता है, तो वह केवल एक भवन में नहीं, अपितु पाषाण में निर्मित एक जीवन्त <strong>श्री यन्त्र</strong> और मानव देह के चक्रों में प्रवेश करता है। मयमतम्, मानसार और आगम शास्त्रों के अनुसार देवालय के बाह्य मण्डप में उत्कीर्ण नृत्य करती अप्सराएँ, गन्धर्व और पौराणिक कथाएँ संसार के विविध रूपों को दर्शाती हैं, जबकि भीतर का शांत <strong>गर्भगृह</strong> हमारे हृदय-गुहा में स्थित कूटस्थ आत्मा का प्रतीक है।</p>\n              <blockquote class=\"hmb-shloka-box\">\n                <strong>देहो देवालयः प्रोक्तो जीवो देवः सनातनः । त्यजेदज्ञाननिर्माल्यं सोऽहंभावेन पूजयेत् ॥</strong>\n              </blockquote>\n              <h2>२. गर्भगृह, शिखर एवं स्वर्ण कलश का योगिक रहस्य</h2>\n              <p>गर्भगृह के ठीक ऊपर उठता हुआ <strong>शिखर</strong> मेरु पर्वत और योगियों की सुषुम्ना नाड़ी का प्रतीक है, जिसके शीर्ष पर स्थित आमलक और अमृत कलश सहस्रार चक्र के जागरण को दर्शाते हैं।</p>\n            "}, "bn": {"title": "দেবালয় বাস্তু ও শিল্প শাস্ত্র: হিন্দু মন্দির কেন এক জীবন্ত মহাজাগতিক মণ্ডল?", "subtitle": "গর্ভগৃহ, শিখর, মণ্ডপ স্তম্ভ, অপ্সরা ভাস্কর্য এবং বাস্তুপুরুষ মণ্ডলের আধ্যাত্মিক ও বিজ্ঞানসম্মত তাৎপর্য।", "excerpt": "বাস্তুপুরুষ মণ্ডলের ভিত্তি থেকে শিখরের স্বর্ণ কলশ পর্যন্ত—জানুন কীভাবে প্রাচীন স্থপতিগণ মানব সূক্ষ্ম দেহ ও বিশ্বব্রহ্মাণ্ডকে পাথরে খোদাই করেছিলেন।", "content_html": "\n              <h2>১. প্রাসাদঃ পুরুষঃ • মন্দিরই বিরাট পুরুষ ও মানব দেহের প্রতিরূপ</h2>\n              <p>আগম ও শিল্প শাস্ত্র অনুসারে হিন্দু দেবালয় কেবল ইঁট-পাথরের ইমারত নয়, এটি <strong>প্রাসাদ পুরুষ</strong>। বাইরের মণ্ডপে খোদাই করা অপ্সরা, গন্ধর্ব ও পৌরাণিক আখ্যান জগতের বৈচিত্র্য প্রকাশ করে, আর প্রদীপের মৃদু আলোয় উদ্ভাসিত শান্ত <strong>গর্ভগৃহ</strong> আমাদের হৃদয়-গুহায় বিরাজমান আত্মার প্রতীক।</p>\n            "}, "sa": {"title": "देवालयवास्तुशिल्पशास्त्रम् — देवालयः कथं जीवन्तः ब्रह्माण्डमण्डलः वर्तते?", "subtitle": "गर्भगृह-शिखर-मण्डपस्तम्भ-अप्सरःशिल्प-वास्तुपुरुषमण्डलानां तात्त्विकं रहस्यम्।", "excerpt": "वास्तुपुरुषमण्डलादारभ्य शिखरस्थस्वर्णकलशं यावत् प्राचीनस्थपतिभिः कथं सूक्ष्मशरीरं पाषाणे स्थापत्यरूपेण निर्मितमिति विमृश्यते।", "content_html": "\n              <h2>१. प्रासादः पुरुषः • देहो देवालयः प्रोक्तः</h2>\n              <p>मयमत-मानसार-कामिकगमादिशास्त्रेषु देवालयः <strong>प्रासादपुरुषः</strong> इति अभिधीयते। बाह्यमण्डपेषु उत्कीर्णाः अप्सरसः गन्धर्वाश्च प्रपञ्चवैचित्र्यं दर्शयन्ति, अन्तःस्थं प्रशान्तं <strong>गर्भगृहं</strong> तु हृदयाकाशे स्थितं परमात्मानं सूचयति।</p>\n            "}}'::jsonb, '2026-10-25'
) ON CONFLICT (hmb_post_slug) DO NOTHING;
INSERT INTO hmb_blog_posts_tbl (
    hmb_post_id, hmb_post_slug, hmb_post_title, hmb_post_subtitle, hmb_post_category,
    hmb_post_tags, hmb_post_author_name, hmb_post_author_role, hmb_post_cover_image,
    hmb_post_shloka_sanskrit, hmb_post_shloka_transliteration, hmb_post_shloka_meaning,
    hmb_post_excerpt, hmb_post_content_html, hmb_post_word_count, hmb_post_char_count,
    hmb_post_reading_minutes, hmb_post_views_count, hmb_post_likes_count,
    hmb_post_is_featured, hmb_post_is_published, hmb_post_translations_json, hmb_post_published_date
) VALUES (
    103, 'samudra-manthan-fable-churning-the-cosmic-ocean-of-mind', 'Samudra Manthan: The Puranic Allegory of Churning the Ocean of Consciousness',
    'Why Halahala poison precedes the Amrita Kalasha, and how Devas and Asuras mirror the dual forces within every seeker.', 'Itihasa & Puranas',
    ARRAY['Samudra Manthan', 'Bhagavata Purana', 'Amrita Kalasha', 'Shiva Neelakantha', 'Dhanvantari']::text[], 'Vidushi Maitreyi Devi',
    'Puranic Literature & Bhakti Scholar', 'assets/images/puranic-kalasha.jpg',
    'मथ्यमानेऽर्णवे सोऽथ विषं हालाहलं महत् । उदतिष्ठदप्रतर्क्यं सर्वलोकभयङ्करम् ॥', 'Mathyamāne’rṇave so’tha viṣaṁ hālāhalaṁ mahat | Udatiṣṭhad apratarkyaṁ sarva-loka-bhayaṅkaram ||',
    'When the cosmic ocean of milk was churned in earnest, before any treasure arose, there surfaced the fierce Halahala poison—teaching that deep spiritual sadhana first brings latent impurities to the surface for purification.', 'Unveil the timeless psychological and spiritual meaning behind the churning of Kshira Sagara: Mount Mandara as concentration, Kurma Avatara as unshakable faith, Neelakantha Shiva’s compassion, and the golden Kalasha of immortality.',
    '
          <h2>१. क्षीरसागर मन्थन • More Than Myth: The Inner Alchemy of Sadhana</h2>
          <p>In the eighth Skandha of the <em>Srimad Bhagavata Purana</em>, the <em>Vishnu Purana</em>, and the <em>Adi Parva of the Mahabharata</em>, we encounter one of the most magnificent narratives in all of world literature: <strong>Samudra Manthan</strong>, the churning of the Cosmic Ocean of Milk (Kshira Sagara). While depicted in breathtaking temple murals across India and Southeast Asia, our Acharyas remind us that Puranic Itihasa operates simultaneously on the cosmic (Adhidaivika) and psychological (Adhyatmika) planes.</p>

          <blockquote class="hmb-shloka-box">
            <strong>प्रतीक दर्शन • The Four Symbols of Inner Churning:</strong><br/>
            • <strong>Kshira Sagara (Ocean of Milk):</strong> The vast, undulating field of human consciousness (Chitta).<br/>
            • <strong>Devas &amp; Asuras:</strong> Our luminous Sattvic aspirations and our restless Rajasic/Tamasic impulses.<br/>
            • <strong>Mandara Parvata (Churning Rod):</strong> One-pointed meditative concentration (Dharana &amp; Dhyana).<br/>
            • <strong>Kurma Avatara (Tortoise Pivot):</strong> The divine grace of Lord Hari supporting the heavy mountain of sadhana so it does not sink into despondency.
          </blockquote>

          <h2>२. हालाहल एवं नीलकण्ठ • Why Halahala Poison Emerges First</h2>
          <p>Every sincere meditator discovers a startling truth: when you sit down in silence to churn the mind, you do not immediately taste bliss. Instead, long-buried grievances, anxieties, restlessness, and unresolved samskaras rise to the surface. This is <strong>Halahala</strong>. And how does Mahadeva Shiva respond? He neither swallows the poison into his heart (which would corrupt the inner being) nor spits it out onto the world (which would harm others). Holding it in his throat through <em>Vishuddhi Chakra</em> mastery, he becomes <strong>Neelakantha</strong> — transmuting toxicity into blue-throated compassion.</p>

          <h2>३. चतुर्दश रत्न एवं अमृत कलश • The Fourteen Treasures &amp; Lord Dhanvantari</h2>
          <p>Only after enduring the purification of Halahala with patience and devotion do the luminous treasures (Chaturdasha Ratna) blossom from the depths: Kamadhenu (contentment), Airavata (majestic wisdom), Kaustubha Mani (unblemished love), Goddess Mahalakshmi (auspicious abundance), and finally Lord Dhanvantari bearing the golden <strong>Amrita Kalasha</strong> — the nectar of self-realization and immortal peace.</p>
        ', 1510, 9640,
    13, 980, 245,
    FALSE, TRUE,
    '{"hi": {"title": "समुद्र मन्थन: चित्त के क्षीरसागर से अमृत कलश की प्राप्ति का पौराणिक दर्शन", "subtitle": "अमृत से पूर्व हालाहल विष क्यों निकलता है, और देवासुर संग्राम प्रत्येक साधक के अन्तर्मन की यात्रा कैसे है?", "excerpt": "श्रीमद्भागवत पुराण के समुद्र मन्थन आख्यान का आध्यात्मिक रहस्य—मन्दराचल पर्वत के रूप में एकाग्रता, कूर्म अवतार के रूप में ईश्वरीय कृपा, नीलकण्ठ महादेव का विषपान और धन्वन्तरि का अमृत कलश।", "content_html": "\n              <h2>१. क्षीरसागर मन्थन • साधना का आन्तरिक रसायन शास्त्र</h2>\n              <p>श्रीमद्भागवत महापुराण के अष्टम स्कन्ध में वर्णित <strong>समुद्र मन्थन</strong> केवल एक प्राचीन घटना नहीं, अपितु प्रत्येक साधक के चित्त में घटित होने वाली ध्यान-प्रक्रिया का सजीव रूपक है। क्षीरसागर हमारा चित्त है, मन्दराचल पर्वत एकाग्र ध्यान है, वासुकि नाग श्वास-प्रश्वास (प्राणायाम) की डोरी है और भगवान कूर्म की पीठ वह अटूट श्रद्धा है जिस पर साधना टिकी रहती है।</p>\n              <h2>२. हालाहल विष एवं नीलकण्ठ महादेव का संदेश</h2>\n              <p>जब साधक ध्यान में बैठता है तो सर्वप्रथम चित्त के संचित विकार ''हालाहल'' के रूप में बाहर आते हैं। भगवान शिव की भाँति उन्हें न तो हृदय में उतरने देना है और न ही संसार पर उगलना है, अपितु विवेक के कण्ठ में धारण कर ''नीलकण्ठ'' बनना है। तभी अन्ततः भगवान धन्वन्तरि <strong>अमृत कलश</strong> लेकर प्रकट होते हैं।</p>\n            "}, "bn": {"title": "সমুদ্র মন্থন: চিত্তের ক্ষীরসাগর থেকে অমৃত কলশ লাভের পৌরাণিক দর্শন", "subtitle": "অমৃতের পূর্বে কেন হলাহল বিষ উত্থিত হয় এবং দেবাসুর সংগ্রাম কীভাবে প্রতিটি সাধকের অন্তর্যাত্রা?", "excerpt": "শ্রীমদ্ভাগবত পুরাণের সমুদ্র মন্থন উপাখ্যানের আধ্যাত্মিক তাৎপর্য—মন্দর পর্বত রূপে একাগ্রতা, কূর্ম অবতার রূপে ঈশ্বরকৃপা, নীলকণ্ঠ মহাদেবের করুণা এবং ধন্বন্তরির অমৃত কলশ।", "content_html": "\n              <h2>১. ক্ষীরসাগর মন্থন • সাধনার আন্তর রসায়ন</h2>\n              <p>শ্রীমদ্ভাগবত পুরাণে বর্ণিত <strong>সমুদ্র মন্থন</strong> প্রতিটি সাধকের চিত্তশুদ্ধির প্রতীক। ক্ষীরসাগর হলো আমাদের মন, মন্দর পর্বত হলো একাগ্র ধ্যান, আর ভগবান কূর্ম হলেন অটুট শ্রদ্ধা। হলাহল বিষের সংযম ও শুদ্ধির পরেই আত্মজ্ঞানের স্বর্ণময় <strong>অमृत কলশ</strong> প্রকটিত হয়।</p>\n            "}, "sa": {"title": "समुद्रमन्थनम् — चित्तक्षीरसागरात् अमृतकलशप्राप्तेः पौराणिकं रहस्यम्", "subtitle": "अमृतात् पूर्वं हालाहलविषं किमर्थमुत्तिष्ठति? देवासुरमन्थनस्य आध्यात्मिकं तात्पर्यम्।", "excerpt": "श्रीमद्भागवतपुराणोक्तस्य समुद्रमन्थनस्य आध्यात्मिकः विमर्शः — मन्दरपर्वतरूपेण ध्यानम्, कूर्मावताररूपेण भगवत्कृपा, नीलकण्ठस्य करुणा, धन्वन्तरेः अमृतकलशश्च।", "content_html": "\n              <h2>१. क्षीरसागरमन्थनम् • अन्तःकरणशोधनस्य रूपकम्</h2>\n              <p>श्रीमद्भागवतमहापुराणे अष्टमस्कन्धे वर्णितं <strong>समुद्रमन्थनं</strong> साधकस्य चित्तमन्थनस्यैव रूपकम्। नीलकण्ठमहादेवस्य प्रसादेन हालाहलविषं तीर्त्वा एव साधकः आत्मज्ञानामृतकलशं लभते।</p>\n            "}}'::jsonb, '2026-10-21'
) ON CONFLICT (hmb_post_slug) DO NOTHING;
INSERT INTO hmb_blog_posts_tbl (
    hmb_post_id, hmb_post_slug, hmb_post_title, hmb_post_subtitle, hmb_post_category,
    hmb_post_tags, hmb_post_author_name, hmb_post_author_role, hmb_post_cover_image,
    hmb_post_shloka_sanskrit, hmb_post_shloka_transliteration, hmb_post_shloka_meaning,
    hmb_post_excerpt, hmb_post_content_html, hmb_post_word_count, hmb_post_char_count,
    hmb_post_reading_minutes, hmb_post_views_count, hmb_post_likes_count,
    hmb_post_is_featured, hmb_post_is_published, hmb_post_translations_json, hmb_post_published_date
) VALUES (
    104, 'sattvic-dinacharya-tulsi-deepa-and-ayurvedic-rhythm', 'Sattvic Dinacharya: Aligning Daily Life with Cosmic Rta, Tulsi Aradhana & Sandhya Deepa',
    'Practical Ayurvedic and Grihastha wisdom from Charaka Samhita and Ashtanga Hridaya for mental clarity, Ojas, and peaceful homes.', 'Yoga & Ayurveda',
    ARRAY['Ayurveda', 'Dinacharya', 'Tulsi', 'Pranayama', 'Sattvic Living']::text[], 'Vaidya Narayanacharya Joshi',
    'Ayurvedacharya & Yoga Darshana Teacher', 'assets/images/meditation-tulsi.jpg',
    'ब्राह्मे मुहूर्ते उत्तिष्ठेत् स्वस्थो रक्षार्थमायुषः । शरीरचिन्तां निर्वर्त्य कृतशौचविधिस्ततः ॥', 'Brāhme muhūrte uttiṣṭhet svastho rakṣārtham āyuṣaḥ | Śarīra-cintāṁ nirvartya kṛta-śauca-vidhis tataḥ ||',
    'One who desires to preserve radiant health and longevity should awaken during Brahma Muhurta, attuning the body and mind to the serene rhythm of nature (Ashtanga Hridaya, Sutrasthana 2.1).', 'How awakening in Brahma Muhurta, tending the sacred Vrinda Tulsi, lighting sesame and ghee lamps at twilight, and honoring the three Gunas transforms an ordinary household into a tranquil ashram.',
    '
          <h2>१. ऋत एवं दिनचर्या • Living in Harmony with Cosmic Rhythm (Rta)</h2>
          <p>The Vedic seers perceived the universe not as a chaotic collision of matter, but as <strong>Rta</strong> — a sacred, intelligent cosmic symphony governing the movement of the sun, the changing of the छह Ritus (seasons), and the subtle biological tides of <em>Vata</em>, <em>Pitta</em>, and <em>Kapha</em> within the human body. In both the <em>Charaka Samhita</em> and Vagbhata''s <em>Ashtanga Hridaya</em>, health is called <strong>Svasthya</strong> (स्वस्थ) — literally "to be established in one''s own true Self."</p>

          <blockquote class="hmb-shloka-box">
            <strong>तुलसी मङ्गलाष्टकम् • Reverence to Sacred Vrinda:</strong><br/>
            <em>"यन्मूले सर्वतीर्थानि यन्मध्ये सर्वदेवताः। यदग्रे सर्ववेदाश्च तुलसि त्वां नमाम्यहम्॥"<br/>
            At whose roots abide all sacred Tirthas, at whose center dwell all Deities, and at whose summit reside the Vedas — O Sacred Tulsi, I bow to thee.</em>
          </blockquote>

          <h2>२. ब्राह्ममुहूर्त एवं प्राणायाम • The Sattvic Window Before Dawn</h2>
          <p>Approximately 96 minutes before sunrise (two Muhurtas prior to Usha), the atmosphere is rich in nascent Prana and free from the clatter of worldly Rajas. Awakening during <strong>Brahma Muhurta</strong>, sipping warm water stored in a copper vessel (Tamra-Jala), practicing twelve rounds of <em>Nadi Shodhana Pranayama</em>, and reciting the Gayatri or Mahamrityunjaya Mantra builds <strong>Ojas</strong> — the subtle essence of immunity, patience, and spiritual radiance.</p>

          <h2>३. सन्ध्या दीप एवं सात्त्विक आहार • The Twilight Lamp &amp; Mindful Nourishment</h2>
          <p>As day transitions into night (Sayam Sandhya), lighting a brass or earthen diya fuelled by pure cow''s ghee or til (sesame) oil beside the courtyard Tulsi and home altar marks a sacred pause. As the <em>Chandogya Upanishad</em> (7.26.2) teaches: <strong>"आहारशुद्धौ सत्त्वशुद्धिः सत्त्वशुद्धौ ध्रुवा स्मृतिः"</strong> — when nourishment (both physical food and sensory impressions) is pure and Sattvic, the inner mind becomes crystal clear, and in that clarity, remembrance of the Divine becomes unwavering.</p>
        ', 1480, 9310,
    12, 1120, 276,
    FALSE, TRUE,
    '{"hi": {"title": "सात्त्विक दिनचर्या: वैदिक ऋत, तुलसी आराधना एवं सन्ध्या दीप से जीवन का रूपान्तरण", "subtitle": "चरक संहिता और अष्टांग हृदय के आलोक में मानसिक शांति, ओजस और गृहस्थ आश्रम की पवित्रता के व्यावहारिक सूत्र।", "excerpt": "जानिए कैसे ब्रह्ममुहूर्त में जागरण, आँगन की पवित्र तुलसी की सेवा, सन्ध्या दीप प्रज्वलन और सात्त्विक आहार साधारण घर को भी एक शांत तपोवन में बदल देते हैं।", "content_html": "\n              <h2>१. वैदिक ''ऋत'' एवं आयुर्वेदिक दिनचर्या</h2>\n              <p>आयुर्वेद में स्वास्थ्य की परिभाषा है— <strong>''स्वस्थ''</strong> अर्थात् अपने आत्म-स्वरूप में स्थित होना। अष्टांग हृदय के अनुसार ब्रह्ममुहूर्त में उठकर ताम्रपात्र का जल ग्रहण करना, नाड़ी-शोधन प्राणायाम करना, पवित्र वृन्दा (तुलसी) के समक्ष घृत का दीपक प्रज्वलित करना और सात्त्विक आहार लेना मनुष्य के भीतर <strong>ओजस</strong> और सात्त्विक मेधा का संचार करता है।</p>\n            "}, "bn": {"title": "সাত্ত্বিক দিনচর্যা: বৈদিক ঋত, তুলসী আরাধনা ও সন্ধ্যা প্রদীপে জীবনের রূপান্তর", "subtitle": "চরক সংহিতা ও অষ্টাঙ্গ হৃদয়ের আলোকে মানসিক প্রশান্তি, ওজস এবং গৃহস্থ আশ্রমের পবিত্রতার ব্যবহারিক সূত্র।", "excerpt": "জানুন কীভাবে ব্রহ্মমুহূর্তে জাগরণ, পবিত্র তুলসী মঞ্চে সন্ধ্যা প্রদীপ প্রজ্বলন এবং সাত্ত্বিক আহার একটি সাধারণ গৃহকে শান্ত তপোবনে পরিণত করে।", "content_html": "\n              <h2>১. বৈদিক ঋত ও আয়ুর্বেদিক দিনচর্যা</h2>\n              <p>আয়ুর্বেদে স্বাস্থ্যের অর্থ হলো <strong>''স্বস্থ''</strong>—অর্থাৎ নিজ আত্মস্বরূপে প্রতিষ্ঠিত থাকা। ব্রহ্মমুহূর্তে জাগরণ, প্রাণায়াম, তুলসী তলায় ঘৃত প্রদীপ প্রজ্বলন ও সাত্ত্বিক আহার চিত্তকে নির্মল ও জ্যোতির্ময় করে তোলে।</p>\n            "}, "sa": {"title": "सात्त्विकदिनचर्या — वैदिकऋत-तुलसीसमर्चन-सन्ध्यादीपैः जीवनस्य पावनीकरणम्", "subtitle": "चरकसंहिता-अष्टाङ्गहृदययोः आलोके मानसिकशान्तेः ओजसः च व्यावहारिकाणि सूत्राणि।", "excerpt": "ब्राह्ममुहूर्ते जागरणम्, वृन्दातुलसीसेवा, सन्ध्यादीपप्रज्वलनं सात्त्विकाहारश्च कथं गृहस्थाश्रमं तपोवनमिव पावनं कुर्वन्तीति विमृश्यते।", "content_html": "\n              <h2>१. ब्राह्मे मुहूर्ते उत्तिष्ठेत् स्वस्थो रक्षार्थमायुषः</h2>\n              <p>आहारशुद्धौ सत्त्वशुद्धिः सत्त्वशुद्धौ ध्रुवा स्मृतिः। ब्राह्ममुहूर्ते उत्थाय प्राणायामेन तुलसीपूजनेन सन्ध्यादीपप्रज्वलनेन च साधकः दीर्घायुष्यं ब्रह्मतेजश्च विन्दति।</p>\n            "}}'::jsonb, '2026-10-18'
) ON CONFLICT (hmb_post_slug) DO NOTHING;
INSERT INTO hmb_blog_posts_tbl (
    hmb_post_id, hmb_post_slug, hmb_post_title, hmb_post_subtitle, hmb_post_category,
    hmb_post_tags, hmb_post_author_name, hmb_post_author_role, hmb_post_cover_image,
    hmb_post_shloka_sanskrit, hmb_post_shloka_transliteration, hmb_post_shloka_meaning,
    hmb_post_excerpt, hmb_post_content_html, hmb_post_word_count, hmb_post_char_count,
    hmb_post_reading_minutes, hmb_post_views_count, hmb_post_likes_count,
    hmb_post_is_featured, hmb_post_is_published, hmb_post_translations_json, hmb_post_published_date
) VALUES (
    105, 'science-of-sanskrit-mantras-chandas-and-nada-brahma', 'Nada Brahma & Chandas Shastra: The Phonetic Science of Sanskrit Mantras',
    'How Paninian articulatory phonetics (Shiksha), Vedic meters (Gayatri, Anushtubh, Trishtubh), and Svara intonation awaken subtle pranic centers.', 'Sanskrit & Mantras',
    ARRAY['Sanskrit', 'Nada Brahma', 'Chandas', 'Gayatri Mantra', 'Panini']::text[], 'Mahamahopadhyaya Dr. Devadatta Tripathi',
    'Vyakarana & Shiksha Shastra Professor', 'assets/images/hero-mural.jpg',
    'मननात् त्रायते इति मन्त्रः । नादब्रह्ममयो लोको नादः सर्वमिदं जगत् ॥', 'Mananāt trāyate iti mantraḥ | Nāda-brahmamayo loko nādaḥ sarvam idaṁ jagat ||',
    'That which protects and liberates the mind through contemplative repetition is called a Mantra. The entire cosmos is woven out of Nada Brahma—primordial vibrational sound.', 'Why is Sanskrit called Devavani? Explore thefour levels of speech (Para, Pashyanti, Madhyama, Vaikhari), the five oral resonance points of the Varnamala, and the sacred geometry of Vedic meters.',
    '
          <h2>१. चत्वारि वाक् परिमिता पदानि • The Four Levels of Sacred Speech (Vak)</h2>
          <p>In the famous riddle hymn of the Rigveda (1.164.45), Rishi Dirghatamas declares: <em>"चत्वारि वाक् परिमिता पदानि तानि विदुर्ब्राह्मणा ये मनीषिणः। गुहा त्रीणि निहिता नेङ्गयन्ति तुरीयं वाचो मनुष्या वदन्ति॥"</em> — Speech is measured in four progressive planes; three abide hidden in the cave of consciousness, while humanity ordinarily speaks only the fourth outward fraction:</p>
          <ol>
            <li><strong>Para Vak (Transcendental Seed Sound):</strong> Resting motionless at the Muladhara as pure unmanifest intention.</li>
            <li><strong>Pashyanti Vak (Luminous Visualizing Sound):</strong> Rising to the navel center (Manipura), where sound and meaning are perceived as an indivisible flash of intuition.</li>
            <li><strong>Madhyama Vak (Subtle Mental Articulation):</strong> Residing in the heart (Anahata), where internal mantra japa takes place without moving the physical tongue.</li>
            <li><strong>Vaikhari Vak (Audible Spoken Word):</strong> Expressed through the throat, palate, roof, teeth, and lips (Kanthya, Talavya, Murdhanya, Dantya, Oshthya).</li>
          </ol>

          <blockquote class="hmb-shloka-box">
            <strong>छन्दः पादौ तु वेदस्य — Chandas as the Rhythmic Feet of the Vedas:</strong><br/>
            <em>From the 24-syllable Gayatri Chandas (three padas of eight syllables each) to the 32-syllable Anushtubh of the Bhagavad Gita and Valmiki Ramayana, Vedic meters synchronize respiration with heart rate variability.</em>
          </blockquote>

          <h2>२. पाणिनीय शिक्षा एवं वर्णमाला • The Acoustic Precision of the Varnamala</h2>
          <p>Unlike arbitrary alphabets, the Sanskrit <strong>Varnamala</strong> (Garland of Matrix Sounds from <em>अ</em> to <em>ह</em>) is mapped scientifically according to the exact anatomical point of articulation in the vocal tract. Chanting with proper <em>Udatta</em>, <em>Anudatta</em>, and <em>Svarita</em> intonations transforms the human cranium into a living resonance chamber.</p>
        ', 1710, 10890,
    15, 1310, 312,
    FALSE, TRUE,
    '{"hi": {"title": "नाद ब्रह्म एवं छन्द शास्त्र: संस्कृत मन्त्रों और देववाणी का ध्वनि-विज्ञान", "subtitle": "पाणिनीय शिक्षा, वैदिक छन्द (गायत्री, अनुष्टुप्, त्रिष्टुप्) और परा-पश्यन्ती-मध्यमा-वैखरी वाणी के माध्यम से प्राण-केन्द्रों का जागरण।", "excerpt": "संस्कृत को देववाणी क्यों कहा जाता है? जानिए वाणी के चार स्तरों, संस्कृत वर्णमाला के वैज्ञानिक उच्चारण स्थानों और वैदिक छन्दों की लयबद्ध ऊर्जा का रहस्य।", "content_html": "\n              <h2>१. चत्वारि वाक् परिमिता पदानि • वाणी के चार सूक्ष्म स्तर</h2>\n              <p>ऋग्वेद (१.१६४.४५) के अनुसार वाणी के चार पद हैं— <strong>परा, पश्यन्ती, मध्यमा और वैखरी</strong>। कण्ठ, तालु, मूर्धा, दन्त और ओष्ठ के वैज्ञानिक क्रम से सजी संस्कृत वर्णमाला का जब शुद्ध स्वरों (उदात्त, अनुदात्त, स्वरित) के साथ जप किया जाता है, तो ''मननात् त्रायते इति मन्त्रः'' सार्थक हो उठता है।</p>\n            "}, "bn": {"title": "নাদ ব্রহ্ম ও ছন্দ শাস্ত্র: সংস্কৃত মন্ত্র ও দেববাণীর ধ্বনি-বিজ্ঞান", "subtitle": "পাণিনীয় শিক্ষা, বৈদিক ছন্দ (গায়ত্রী, অনুষ্টুপ) এবং পরা-পশ্যন্তী-মধ্যমা-বৈখরী বাণীর মাধ্যমে প্রাণশক্তির জাগরণ।", "excerpt": "সংস্কৃতকে কেন দেববাণী বলা হয়? জানুন বাণীর চারটি স্তর, সংস্কৃত বর্ণমালার বৈজ্ঞানিক উচ্চারণ স্থান এবং বৈদিক ছন্দের জ্যোতির্ময় স্পন্দন।", "content_html": "\n              <h2>১. চত্বারি বাক্ পরিমিতা পদানি • বাণীর চারটি স্তর</h2>\n              <p>ঋগ্বেদ অনুসারে বাণীর চারটি স্তর— <strong>পরা, পশ্যন্তী, মধ্যমা ও বৈখরী</strong>। কণ্ঠ, তালু, মূর্ধা, দন্ত ও ওষ্ঠের নিখুঁত বৈজ্ঞানিক বিন্যাসে রচিত সংস্কৃত মন্ত্র জপ চিত্তকে পরম প্রশান্তিতে ভরে দেয়।</p>\n            "}, "sa": {"title": "नादब्रह्म छन्दःशास्त्रं च — संस्कृतमन्त्राणां पाणिनीयध्वनिविज्ञानम्", "subtitle": "परा-पश्यन्ती-मध्यमा-वैखरीवाचां गायत्र्यनुष्टुबादिच्छन्दसां च प्राणायामसमन्वितं रहस्यम्।", "excerpt": "संस्कृतभाषा किमर्थं देववाणीत्युच्यते? वर्णमालायाः पञ्चोच्चारणस्थानानां वैदिकस्वराणां च वैज्ञानिकं विश्लेषणम्।", "content_html": "\n              <h2>१. चत्वारि वाक् परिमिता पदानि</h2>\n              <p>ऋग्वेदे दीर्घतमसा महर्षिणा प्रोक्तम् — परा, पश्यन्ती, मध्यमा, वैखरी चेति वाचः चत्वारः पादाः। मननात् त्रायते इति मन्त्रः।</p>\n            "}}'::jsonb, '2026-10-14'
) ON CONFLICT (hmb_post_slug) DO NOTHING;
INSERT INTO hmb_blog_posts_tbl (
    hmb_post_id, hmb_post_slug, hmb_post_title, hmb_post_subtitle, hmb_post_category,
    hmb_post_tags, hmb_post_author_name, hmb_post_author_role, hmb_post_cover_image,
    hmb_post_shloka_sanskrit, hmb_post_shloka_transliteration, hmb_post_shloka_meaning,
    hmb_post_excerpt, hmb_post_content_html, hmb_post_word_count, hmb_post_char_count,
    hmb_post_reading_minutes, hmb_post_views_count, hmb_post_likes_count,
    hmb_post_is_featured, hmb_post_is_published, hmb_post_translations_json, hmb_post_published_date
) VALUES (
    106, 'sacred-festivals-of-bharat-spiritual-significance-uttarayana-chaturmasya', 'Panchanga & Parva: The Inner Spiritual Meaning of Bharat’s Sacred Festivals',
    'From Holi, Ganesh Chaturthi, and Sharadiya Durga Puja to Deepavali, Bhai Dooj, and Chhath Puja — how our festivals align human joy with cosmic Dharma.', 'Dharmic Living & Festivals',
    ARRAY['Festivals', 'Diwali', 'Durga Puja', 'Chhath Puja', 'Holi', 'Ganesh Chaturthi', 'Bhai Dooj']::text[], 'Acharya Vishwanath Shastri',
    'Vedanta & Agamic Scholar, Kashi', 'assets/images/hero-mural.jpg',
    'उत्सवप्रियाः खलु मनुष्याः । धर्मार्थकाममोक्षाणां पर्वकाले विशेषतः ॥', 'Utsava-priyāḥ khalu manuṣyāḥ | Dharmārtha-kāma-mokṣāṇāṁ parva-kāle viśeṣataḥ ||',
    'Human beings naturally delight in celebration; our sacred Parvas channel that festive joy toward Dharma, noble prosperity, harmony, and spiritual liberation.', 'Why does the Hindu calendar follow lunar Tithis and solar Sankrantis? Discover the deep spiritual symbolism connecting Vasant Holi, Vinayaka Chaturthi, Sharad Durga Puja, Deepavali, Bhai Dooj, and Surya Shashti Chhath Puja.',
    '
          <h2>१. पर्व एवं उत्सव दर्शन • Why Every Festival in Sanatana Dharma is a Sadhana</h2>
          <p>In the Vedic tradition, time (<strong>Kala</strong>) is not a flat, mechanical ticking of clocks; it is an auspicious spiral of cosmic energy measured by the five limbs of the <strong>Panchanga</strong> — Tithi (lunar phase), Vara (weekday), Nakshatra (stellar constellation), Yoga, and Karana. Each major festival (<strong>Parva</strong>) occurs at an astronomical junction (Sandhikala) when subtle pranic currents are heightened, allowing households and communities to renew their spiritual vitality together.</p>

          <blockquote class="hmb-shloka-box">
            <strong>षड्-पर्व माला • The Sacred Garland of Seasonal Festivals:</strong><br/>
            <em>Every Ritu (season) offers a distinct portal to the Divine: Vasant brings the joyful devotion of Holi; Bhadrapada brings the wisdom of Ganesh Chaturthi; Sharad awakens the Shakti of Durga Puja; Kartika radiates the lamps of Deepavali, the affection of Bhai Dooj, and the solar gratitude of Chhath Puja.</em>
          </blockquote>

          <h2>२. वसन्तोत्सव होली एवं श्री गणेश चतुर्थी • Spring Renewal &amp; Sovereign Wisdom</h2>
          <p>When winter yields to Vasant Ritu on Phalguna Purnima, <strong>Holi</strong> celebrates the indestructible faith of Bhakta Prahlada, reminding us that egoic arrogance (Hiranyakashipu and Holika) perishes before pure devotion to Lord Narayana. Later, on Bhadrapada Shukla Chaturthi, <strong>Ganesh Chaturthi</strong> invites <em>Buddhi-Pradata</em> Lord Vinayaka into our homes in eco-friendly clay (Parthiva Murti), teaching that even the most beloved form eventually dissolves back into the five elements during Visarजन.</p>

          <h2>३. शारदीय दुर्गा पूजा एवं दीपावली • The Triumph of Shakti and Light</h2>
          <p>During Sharad Navaratri and <strong>Durga Puja</strong>, the cosmos honors <em>Adi Shakti</em> in her nine forms (Navadurga), culminating in Vijayadashami. Twenty days later, on Kartika Amavasya — the darkest night of the autumn moon — millions of earthen diyas transform the earth into a mirror of the starlit heavens during <strong>Deepavali</strong>. Each diya represents the individual Jiva (earthen clay), filled with the ghee of devotion (Bhakti), holding the wick of steady contemplation (Dhyana), lit by the flame of Atma-Jnana.</p>

          <h2>४. भाई दूज एवं लोकआस्था का महापर्व छठ पूजा • Sacred Relationships &amp; Cosmic Gratitude</h2>
          <p>Two days after Deepavali, <strong>Bhai Dooj (Yama Dwitiya)</strong> sanctifies the protective bond between brothers and sisters, recalling Yamuna''s hospitality to Yamaraja. And on Kartika Shukla Shashti, <strong>Chhath Puja</strong> stands as one of humanity''s purest ecological and Vedic observances: standing waist-deep in sacred rivers, devotees offer Arghya first to the setting sun (Aस्ताचलगामी सूर्य) and then to the rising sun (उदयाचलगामी सूर्य) — honoring both completion and new beginnings with austere purity.</p>
        ', 1920, 12150,
    17, 1640, 418,
    TRUE, TRUE,
    '{"hi": {"title": "पञ्चाङ्ग एवं पर्व दर्शन: भारत के पावन त्योहारों का आध्यात्मिक और वैज्ञानिक रहस्य", "subtitle": "होली, गणेश चतुर्थी और शारदीय दुर्गा पूजा से लेकर दीपावली, भाई दूज और छठ महापर्व तक—कैसे हमारे उत्सव लोक-आनन्द को धर्म और मोक्ष से जोड़ते हैं।", "excerpt": "जानिए क्यों सनातन पञ्चाङ्ग की तिथियाँ और ऋतु-सन्धियाँ होली, गणेश उत्सव, दुर्गा पूजा, दीपावली, भाई दूज और सूर्य षष्ठी छठ पूजा के माध्यम से हमारे तन, मन और समाज को आलोकित करती हैं।", "content_html": "\n              <h2>१. पर्व एवं उत्सव दर्शन • सनातन परम्परा में प्रत्येक त्योहार एक साधना है</h2>\n              <p>सनातन धर्म में काल (समय) केवल घड़ी की सुइयों की गति नहीं है, अपितु तिथि, वार, नक्षत्र, योग और करण—इस पञ्चाङ्ग से जुड़ी ब्रह्माण्डीय ऊर्जा का प्रवाह है। फाल्गुन की <strong>होली</strong> भक्त प्रह्लाद की अटूट भक्ति का उत्सव है; भाद्रपद की <strong>गणेश चतुर्थी</strong> विवेक और पार्थिव सृष्टि चक्र का बोध कराती है; <strong>शारदीय दुर्गा पूजा</strong> मातृशक्ति की आराधना है; <strong>दीपावली</strong> अमावस्या के गहन अन्धकार में आत्म-ज्ञान के दीप जलाने का पर्व है; <strong>भाई दूज</strong> पारिवारिक धर्म का प्रतीक है और <strong>छठ महापर्व</strong> प्रत्यक्ष देवता भगवान सूर्य एवं प्रकृति के प्रति कृतज्ञता का सर्वोच्च वैदिक अनुष्ठान है।</p>\n            "}, "bn": {"title": "পঞ্চাঙ্গ ও পর্ব দর্শন: ভারতের পবিত্র উৎসবসমূহের আধ্যাত্মিক ও বৈজ্ঞানিক তাৎপর্য", "subtitle": "দোলযাত্রা, গণেশ চতুর্থী ও শারদীয় দুর্গাপূজা থেকে দীপাবলি, ভাইফোঁটা এবং ছট পূজা—কীভাবে আমাদের উৎসব আনন্দকে ধর্মের সাথে যুক্ত করে।", "excerpt": "জানুন কীভাবে বসন্তোৎসব হোলি, বিনায়ক চতুর্থী, শারদোৎসব দুর্গাপূজা, দীপাবলি, ভ্রাতৃদ্বিতীয়া এবং সূর্য ষষ্ঠী ছট পূজা আমাদের চিত্ত ও সমাজকে পবিত্র ও জ্যোতির্ময় করে তোলে।", "content_html": "\n              <h2>১. পর্ব ও উৎসব দর্শন • প্রতিটি সনাতন উৎসবই এক আনন্দময় সাধনা</h2>\n              <p>সনাতন ঐতিহ্যে প্রতিটি তিথি ও ঋতু-সন্ধি আধ্যাত্মিক চেতনার জাগরণ ঘটায়। বসন্তের দোলযাত্রা ভক্তির উৎসব, গণেশ চতুর্থী প্রজ্ঞার আবাহন, শারদীয় দুর্গাপূজা মাতৃশক্তির বোধন, দীপাবলি তমসা নাশ করে জ্ঞানের প্রदीप প্রজ্বলন, ভাইফোঁটা ভ্রাতৃ-ভগিনীর পবিত্র বন্ধন এবং ছট পূজা প্রত্যক্ষ দেবতা সূর্যদেবের প্রতি প্রকৃতির বিশুদ্ধ অর্ঘ্য নিবেদন।</p>\n            "}, "sa": {"title": "पञ्चाङ्गपर्वदर्शनम् — भारतस्य पावनपर्वणां आध्यात्मिकं वैज्ञानिकं च रहस्यम्", "subtitle": "वासन्तिकहोली-गणेशचतुर्थी-शारदीयदुर्गापूजा-दीपावली-यमद्वितीया-सूर्यषष्ठीपर्वणां तात्त्विकः विमर्शः।", "excerpt": "सनातनपञ्चाङ्गस्य तिथयः ऋतुसन्धयश्च कथं होली-गणेशोत्सव-दुर्गापूजा-दीपावली-भ्रातृद्वितीया-छठपर्वभिः मानवान् धर्ममोक्षमार्गे प्रेरयन्तीति विमृश्यते।", "content_html": "\n              <h2>१. उत्सवप्रियाः खलु मनुष्याः • पर्वणां साधनास्वरूपम्</h2>\n              <p>सनातनधर्मे प्रत्येकं पर्व आत्मशोधनस्य समाजैक्यस्य च पावनः अवसरः वर्तते। दुर्गापूजा शक्तिसाधनायाः, दीपावली ज्ञानज्योतिषः, यमद्वितीया भ्रातृस्नेहस्य, सूर्यषष्ठी च प्रत्यक्षदेवतायाः सवितुः उपासनायाः महोत्सवः अस्ति।</p>\n            "}}'::jsonb, '2026-10-30'
) ON CONFLICT (hmb_post_slug) DO NOTHING;
INSERT INTO hmb_blog_posts_tbl (
    hmb_post_id, hmb_post_slug, hmb_post_title, hmb_post_subtitle, hmb_post_category,
    hmb_post_tags, hmb_post_author_name, hmb_post_author_role, hmb_post_cover_image,
    hmb_post_shloka_sanskrit, hmb_post_shloka_transliteration, hmb_post_shloka_meaning,
    hmb_post_excerpt, hmb_post_content_html, hmb_post_word_count, hmb_post_char_count,
    hmb_post_reading_minutes, hmb_post_views_count, hmb_post_likes_count,
    hmb_post_is_featured, hmb_post_is_published, hmb_post_translations_json, hmb_post_published_date
) VALUES (
    107, 'nishkama-karma-yoga-in-srimad-bhagavad-gita', 'Nishkama Karma in the Bhagavad Gita: Acting with Excellence in Complete Inner Freedom',
    'How Sri Krishna reconciles dynamic worldly engagement with unshakeable meditative equanimity (Samatvam Yoga Uchyate).', 'Vedanta & Upanishads',
    ARRAY['Bhagavad Gita', 'Karma Yoga', 'Sri Krishna', 'Equanimity', 'Svadharma']::text[], 'Acharya Vishwanath Shastri',
    'Vedanta & Upanishadic Scholar, Kashi', 'assets/images/vedanta-ashram.jpg',
    'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥', 'Karmaṇy evādhikāras te mā phaleṣu kadācana | Mā karma-phala-hetur bhūr mā te saṅgo’stv akarmaṇi ||',
    'Thy right is to perform thy duty alone, never to claim autonomous ownership over its fruits; let not the fruits of action be thy motive, nor let thy attachment be to inaction (Bhagavad Gita 2.47).', 'Why does the Bhagavad Gita begin not in a secluded forest cave, but in the middle of Kurukshetra? Discover the transformative secret of Yajna-Bhava, Prasada-Buddhi, and Yogaḥ Karmasu Kauśalam.',
    '
          <h2>१. कुरुक्षेत्रे धर्मक्षेत्रे • Serenity in the Heart of Action</h2>
          <p>When Arjuna''s Gandiva bow slips from his hands on the battlefield of Kurukshetra, his dilemma is universal: how can a sensitive seeker act in a complex world without accumulating karmic bondage and mental agitation? Bhagavan Sri Krishna''s answer in the second and third chapters of the <em>Srimad Bhagavad Gita</em> revolutionized spiritual thought forever: renunciation is not running away from duty (<em>Karma-Sannyasa</em> without inner maturity), but renouncing egoic anxiety over results right in the midst of wholehearted action (<strong>Karma-Phala-Tyaga</strong>).</p>

          <blockquote class="hmb-shloka-box">
            <strong>योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।<br/>सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥ (गीता २.४८)</strong><br/>
            <em>"Established in Yoga, O Dhananjaya, perform actions abandoning clinging, remaining poised alike in success and failure. This very equanimity of mind is called Yoga."</em>
          </blockquote>

          <h2>२. ईश्वरार्पण एवं प्रसाद बुद्धि • The Two Wings of Karma Yoga</h2>
          <p>How does one practice <em>Karmany evadhikaras te</em> in daily life? Through two complementary attitudes:</p>
          <ul>
            <li><strong>Ishvararpana Buddhi (Consecrating the Effort):</strong> Performing every task — whether writing, teaching, caring for family, or serving society — as an offering (Yajna) at the feet of the Divine, giving 100% of one''s skill and attention.</li>
            <li><strong>Prasada Buddhi (Receiving the Outcome as Grace):</strong> Accepting whatever outcome unfolds — praise or criticism, gain or delay — with a cheerful, unagitated mind as <em>Prasada</em> from the Cosmic Order, learning from it without bitterness.</li>
          </ul>
        ', 1560, 9890,
    13, 1290, 350,
    FALSE, TRUE,
    '{"hi": {"title": "श्रीमद्भगवद्गीता में निष्काम कर्मयोग: पूर्ण आन्तरिक स्वतन्त्रता के साथ श्रेष्ठ कर्म की कला", "subtitle": "भगवान श्रीकृष्ण किस प्रकार गतिशील कर्तव्य-पालन और ध्यानस्थ समत्व (समत्वं योग उच्यते) का अद्भुत समन्वय करते हैं?", "excerpt": "भगवद्गीता का उपदेश किसी एकान्त वन में नहीं अपितु धर्मक्षेत्र कुरुक्षेत्र के मध्य क्यों हुआ? जानिए ईश्वरार्पण बुद्धि, प्रसाद बुद्धि और योगः कर्मसु कौशलम् का जीवन-दर्शन।", "content_html": "\n              <h2>१. समत्वं योग उच्यते • कर्म के मध्य ध्यान की प्रशान्तता</h2>\n              <p>श्रीमद्भगवद्गीता (२.४७-४८) में भगवान श्रीकृष्ण स्पष्ट करते हैं कि कर्म से पलायन संन्यास नहीं है, अपितु कर्तव्य को पूर्ण कुशलता के साथ <strong>ईश्वरार्पण बुद्धि</strong> से करना और उसके फल को <strong>प्रसाद बुद्धि</strong> से स्वीकार करना ही सच्चा निष्काम कर्मयोग है।</p>\n            "}, "bn": {"title": "শ্রীমদ্ভগবদ্গীতায় নিষ্কাম কর্মযোগ: পূর্ণ আন্তরিক স্বাধীনতায় শ্রেষ্ঠ কর্মের শিল্প", "subtitle": "ভগবান শ্রীকৃষ্ণ কীভাবে গতিশীল কর্তব্য পালন এবং ধ্যানস্থ সমত্বের (সমত্বং যোগ উচ্যতে) অপূর্ব সমন্বয় ঘটিয়েছেন?", "excerpt": "জানুন ঈশ্বরার্পণ বুদ্ধি, প্রসাদ বুদ্ধি এবং যোগঃ কর্মসু কৌশলম্-এর মাধ্যমে কীভাবে কর্মের মাঝেও চিত্তকে অবিচল ও প্রশান্ত রাখা যায়।", "content_html": "\n              <h2>১. সমত্বং যোগ উচ্যতে • কর্মের মাঝে ধ্যানের প্রশান্তি</h2>\n              <p>শ্রীমদ্ভগবদ্গীতায় ভগবান শ্রীকৃষ্ণ উপদেশ দিয়েছেন—ফলের আসক্তি ত্যাগ করে পূর্ণ দক্ষতার সাথে স্বধর্ম পালন করাই নিষ্কাম কর্মযোগ।</p>\n            "}, "sa": {"title": "श्रीमद्भगवद्गीतायां निष्कामकर्मयोगः — समत्वबुद्ध्या स्वधर्मपालनस्य कौशलम्", "subtitle": "ईश्वरार्पणबुद्ध्या प्रसादबुद्ध्या च कथं कर्मबन्धनात् मुक्तिः लभ्यते?", "excerpt": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन — भगवतः श्रीकृष्णस्य कर्मयोगोपदेशस्य तात्त्विकं व्यावहारिकं च विवेचनम्।", "content_html": "\n              <h2>१. योगः कर्मसु कौशलम्</h2>\n              <p>सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते। ईश्वरार्पणभावेन कृतं कर्म अन्तःकरणं शोधयति ज्ञाननिष्ठां च जनयति।</p>\n            "}}'::jsonb, '2026-10-10'
) ON CONFLICT (hmb_post_slug) DO NOTHING;
INSERT INTO hmb_blog_posts_tbl (
    hmb_post_id, hmb_post_slug, hmb_post_title, hmb_post_subtitle, hmb_post_category,
    hmb_post_tags, hmb_post_author_name, hmb_post_author_role, hmb_post_cover_image,
    hmb_post_shloka_sanskrit, hmb_post_shloka_transliteration, hmb_post_shloka_meaning,
    hmb_post_excerpt, hmb_post_content_html, hmb_post_word_count, hmb_post_char_count,
    hmb_post_reading_minutes, hmb_post_views_count, hmb_post_likes_count,
    hmb_post_is_featured, hmb_post_is_published, hmb_post_translations_json, hmb_post_published_date
) VALUES (
    108, 'panchatantra-and-hitopadesha-dharmic-fables-of-niti-shastra', 'Panchatantra & Hitopadesha: How Ancient Sanskrit Fables Teach Practical Niti & Viveka',
    'Exploring Vishnu Sharma’s timeless stories of swans, tortoises, lions, and sages as a mirror of ethical statecraft, friendship, and discernment.', 'Itihasa & Puranas',
    ARRAY['Panchatantra', 'Hitopadesha', 'Niti Shastra', 'Sanskrit Fables', 'Viveka']::text[], 'Vidushi Maitreyi Devi',
    'Puranic Literature & Bhakti Scholar', 'assets/images/puranic-kalasha.jpg',
    'अयं निजः परो वेति गणना लघुचेतसाम् । उदारचरितानां तु वसुधैव कुटुम्बकम् ॥', 'Ayaṁ nijaḥ paro veti gaṇanā laghu-cetasām | Udāra-caritānāṁ tu vasudhaiva kuṭumbakam ||',
    '"This one is mine, and that one is a stranger"—such calculation belongs to the narrow-minded. For those of magnanimous character, the entire earth is one family (Panchatantra 5.38 & Maha Upanishad 6.71).', 'How Acharya Vishnu Sharma awakened three unmotivated princes in six months using the five treatises (Tantras) of forest fables, weaving ethical Dharma together with worldly wisdom.',
    '
          <h2>१. नीतिशास्त्र एवं कथा परम्परा • Wisdom Wearing the Garment of Story</h2>
          <p>When King Amarashakti of Mahilaropya despaired over educating his three princes, eighty-year-old Acharya <strong>Vishnu Sharma</strong> accepted the challenge—not by forcing them to memorize dry manuals, but by composing the <strong>Panchatantra</strong> (Five Treatises of Wise Conduct): <em>Mitra-Bheda</em> (Loss of Friends), <em>Mitra-Samprapti</em> (Winning of Friends), <em>Kakolukiyam</em> (Of Crows and Owls), <em>Labdhapranasham</em> (Loss of Gains), and <em>Aparikshitakarakam</em> (Rash Deeds).</p>
          <blockquote class="hmb-shloka-box">
            <strong>उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः ।<br/>न हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः ॥ (हितोपदेश)</strong><br/>
            <em>"Noble endeavors are accomplished through diligent effort, not merely by wishful thinking; deer do not walk by themselves into the mouth of a sleeping lion."</em>
          </blockquote>
          <h2>२. हंस-कूर्म आख्यान • The Swan, the Tortoise &amp; Mastery Over Speech</h2>
          <p>In the fable of <em>Kambugriva</em> the tortoise and his two hamsa swan friends, Sankata and Vikata, the swans carry the tortoise across the sky on a wooden staff held in his jaws, with one condition: he must maintain silence (Mauna) when villagers below marvel or mock. Unable to restrain his reactive impulse to retort, Kambugriva opens his mouth and falls. Thus a simple fable imparts a profound lesson in <strong>Vak-Samyama</strong> (mastery of speech and emotional equanimity).</p>
        ', 1390, 8820,
    11, 910, 219,
    FALSE, TRUE,
    '{"hi": {"title": "पञ्चतन्त्र एवं हितोपदेश: संस्कृत की नीति-कथाएँ हमें व्यावहारिक विवेक और धर्म कैसे सिखाती हैं?", "subtitle": "आचार्य विष्णु शर्मा के पाँच तन्त्रों और सुभाषितों में छिपा मैत्री, पुरुषार्थ, वाक्-संयम और वसुधैव कुटुम्बकम् का अमर संदेश।", "excerpt": "जानिए कैसे आचार्य विष्णु शर्मा ने हंस, कछुए, सिंह और ऋषियों की रोचक कथाओं के माध्यम से नीतिशास्त्र और धर्म के गूढ़ सिद्धांतों को जन-जन तक पहुँचाया।", "content_html": "\n              <h2>१. नीतिशास्त्र एवं कथा परम्परा</h2>\n              <p>आचार्य विष्णु शर्मा द्वारा रचित <strong>पञ्चतन्त्र</strong> और नारायण पण्डित के <strong>हितोपदेश</strong> ने कथाओं के माध्यम से मित्र-सम्प्राप्ति, विवेक, वाक्-संयम और पुरुषार्थ की जो शिक्षा दी, वह विश्व साहित्य की अमूल्य धरोहर है।</p>\n            "}, "bn": {"title": "পঞ্চতন্ত্র ও হিতোপদেশ: সংস্কৃত নীতি-গল্প কীভাবে আমাদের ব্যবহারিক বিবেক ও ধর্ম শেখায়?", "subtitle": "আচার্য বিষ্ণু শর্মার পাঁচটি তন্ত্র ও সুভাষিতে নিহিত মৈত্রী, পুরুষার্থ, বাক্-সংযম এবং বসুধৈব কুটুম্বকম্-এর অমর বার্তা।", "excerpt": "জানুন কীভাবে আচার্য বিষ্ণু শর্মা হংস, কচ্ছপ, সিংহ ও ঋষিদের মনোজ্ঞ উপাখ্যানের মাধ্যমে নীতিশাস্ত্র ও ধর্মের গভীর তত্ত্ব সহজবোধ্য করে তুলেছেন।", "content_html": "\n              <h2>১. নীতিশাস্ত্র ও কথা পরম্পরা</h2>\n              <p>আচার্য বিষ্ণু শর্মার <strong>পঞ্চতন্ত্র</strong> এবং নারায়ণ পণ্ডিতের <strong>হিতোপদেশ</strong> আনন্দময় গল্পের ছলে মানুষকে বিবেক, মৈত্রী ও পুরুষার্থের শিক্ষা দেয়।</p>\n            "}, "sa": {"title": "पञ्चतन्त्रं हितोपदेशश्च — संस्कृतनीतिकथाभिः व्यावहारिकविवेकस्य धर्मस्य च शिक्षणम्", "subtitle": "आचार्यविष्णुशर्मणः पञ्चतन्त्रेषु निहितं मैत्री-पुरुषार्थ-वाक्संयम-वसुधैवकुटुम्बकम् इति तत्त्वज्ञानम्।", "excerpt": "हंस-कूर्म-सिंहादीनां मनोहराभिः कथाभिः कथं नीतिशास्त्रं धर्मविवेकश्च सुगमतया शिक्ष्यते इति विमृश्यते।", "content_html": "\n              <h2>१. नीतिशास्त्रं कथापरम्परा च</h2>\n              <p>उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः। आचार्यविष्णुशर्मणा विरचितं पञ्चतन्त्रं बालकान् प्रौढांश्च समानरूपेण विवेकं शिक्षयति।</p>\n            "}}'::jsonb, '2026-10-05'
) ON CONFLICT (hmb_post_slug) DO NOTHING;

SELECT setval(pg_get_serial_sequence('hmb_blog_posts_tbl', 'hmb_post_id'), COALESCE((SELECT MAX(hmb_post_id) FROM hmb_blog_posts_tbl), 108), true);

INSERT INTO hmb_quick_reads_tbl (
    hmb_quick_id, hmb_quick_title, hmb_quick_category, hmb_quick_sanskrit_verse,
    hmb_quick_summary, hmb_quick_scripture_source, hmb_quick_reading_seconds,
    hmb_quick_translations_json, hmb_quick_is_active
) VALUES (
    201, 'Vidya Dadati Vinayam — The Chain of True Education', 'Subhashita',
    'विद्या ददाति विनयं विनयाद्याति पात्रताम् । पात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम् ॥', 'True knowledge bestows humility; from humility comes worthiness; from worthiness one attains righteous prosperity; from prosperity one performs Dharma, and from Dharma flows enduring happiness.',
    'Hitopadesha, Prastavana 6', 60,
    '{"hi": {"title": "विद्या ददाति विनयम् — सच्ची शिक्षा की शृंखला", "summary": "सच्ची विद्या विनम्रता प्रदान करती है; विनम्रता से पात्रता आती है; पात्रता से धर्मसम्मत धन की प्राप्ति होती है, जिससे धर्म और अन्ततः शाश्वत सुख मिलता है।"}, "bn": {"title": "বিদ্যা দদাতি বিনয়ম্ — প্রকৃত শিক্ষার শৃঙ্খল", "summary": "প্রকৃত বিদ্যা বিনয় দান করে; বিনয় থেকে যোগ্যতা আসে; যোগ্যতা থেকে সৎ ধন অর্জিত হয়, ধন থেকে ধর্ম এবং ধর্ম থেকে অক্ষয় সুখ লাভ হয়।"}, "sa": {"title": "विद्या ददाति विनयम् — सद्विद्यायाः फलश्रुतिः", "summary": "सद्विद्या विनयं यच्छति, विनयात् पात्रता भवति, पात्रत्वात् धर्म्यं धनम् आप्यते, धनात् धर्मः ततश्च शाश्वतं सुखं लभ्यते।"}}'::jsonb, TRUE
) ON CONFLICT (hmb_quick_id) DO NOTHING;
INSERT INTO hmb_quick_reads_tbl (
    hmb_quick_id, hmb_quick_title, hmb_quick_category, hmb_quick_sanskrit_verse,
    hmb_quick_summary, hmb_quick_scripture_source, hmb_quick_reading_seconds,
    hmb_quick_translations_json, hmb_quick_is_active
) VALUES (
    202, 'Purnamadah Purnamidam — Wholeness Born of Wholeness', 'Upanishad Sutra',
    'ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते । पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥', 'That unmanifest Brahman is Infinite Wholeness, and this manifest cosmos is also Whole. From the Infinite arises the Infinite, and even when Wholeness is drawn out, Infinite Wholeness alone remains.',
    'Isha & Brihadaranyaka Upanishad', 75,
    '{"hi": {"title": "पूर्णमदः पूर्णमिदम् — पूर्ण से पूर्ण का प्राकट्य", "summary": "वह अव्यक्त परब्रह्म भी पूर्ण है और यह व्यक्त जगत् भी पूर्ण है। पूर्ण से ही पूर्ण की उत्पत्ति होती है और पूर्ण में से पूर्ण निकालने पर भी पूर्ण ही शेष रहता है।"}, "bn": {"title": "পূর্ণমদঃ পূর্ণমিদম্ — পূর্ণ হতে পূর্ণের প্রকাশ", "summary": "সেই অব্যক্ত ব্রহ্ম পূর্ণ এবং এই ব্যক্ত জগৎও পূর্ণ। পূর্ণ হতেই পূর্ণের উদ্ভব হয় এবং পূর্ণ থেকে পূর্ণ নিলেও পূর্ণই অবশিষ্ট থাকে।"}, "sa": {"title": "पूर्णमदः पूर्णमिदम् — परब्रह्मणः पूर्णत्वम्", "summary": "तत् परब्रह्म पूर्णमस्ति, इदं जगदपि पूर्णमस्ति। पूर्णात् पूर्णमुदच्यते, पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते।"}}'::jsonb, TRUE
) ON CONFLICT (hmb_quick_id) DO NOTHING;
INSERT INTO hmb_quick_reads_tbl (
    hmb_quick_id, hmb_quick_title, hmb_quick_category, hmb_quick_sanskrit_verse,
    hmb_quick_summary, hmb_quick_scripture_source, hmb_quick_reading_seconds,
    hmb_quick_translations_json, hmb_quick_is_active
) VALUES (
    203, 'Hamsa Ksheera Nyaya — The Swan’s Discernment', 'Puranic Fable',
    'हंसः श्वेतो बकः श्वेतः को भेदो बकहंसयोः । नीरक्षीरविवेके तु हंसो हंसो बको बकः ॥', 'Both the swan (Hamsa) and the crane (Baka) are white in appearance; yet when tested with separating pure milk from water, the noble swan reveals its Viveka (discernment) by partaking only of the essence.',
    'Subhashita Ratna Bhandagara', 65,
    '{"hi": {"title": "हंस-क्षीर न्याय — नीर-क्षीर विवेक की कला", "summary": "हंस भी श्वेत होता है और बगुला भी श्वेत; किन्तु जब जल और दुग्ध को अलग करने की परीक्षा आती है, तब विवेकी हंस सार (दुग्ध) को ग्रहण कर अपनी श्रेष्ठता सिद्ध करता है।"}, "bn": {"title": "হংস-ক্ষীর ন্যায় — নীর-ক্ষীর বিবেকের শিল্প", "summary": "হংস ও বক উভয়ই শ্বেতবর্ণ; কিন্তু জল ও দুগ্ধ পৃথক করার পরীক্ষায় বিবেকী হংস সারটুকু গ্রহণ করে নিজের শ্রেষ্ঠত্ব প্রমাণ করে।"}, "sa": {"title": "हंसक्षीरन्यायः — नीरक्षीरविवेकः", "summary": "हंसो बकश्च उभावपि श्वेतौ, परं नीरक्षीरविवेके तु हंसः सारं गृह्णाति असारं च त्यजति।"}}'::jsonb, TRUE
) ON CONFLICT (hmb_quick_id) DO NOTHING;
INSERT INTO hmb_quick_reads_tbl (
    hmb_quick_id, hmb_quick_title, hmb_quick_category, hmb_quick_sanskrit_verse,
    hmb_quick_summary, hmb_quick_scripture_source, hmb_quick_reading_seconds,
    hmb_quick_translations_json, hmb_quick_is_active
) VALUES (
    204, 'Hitam Mitam Rutam Bhuktam — The Three Pillars of Ayurvedic Diet', 'Ayurveda & Dinacharya',
    'हितभुक् मितभुक् ऋतभुक् — यो भवेत् स निरामयः ।', 'When Acharya Vagbhata was asked who remains free from disease, he replied in three words: Hitabhuk (eating what is wholesome), Mitabhuk (eating in moderation), and Rutabhuk (eating in harmony with seasons and honest labor).',
    'Charaka & Vagbhata Tradition', 60,
    '{"hi": {"title": "हितभुक् मितभुक् ऋतभुक् — आयुर्वेदिक स्वास्थ्य के तीन स्तम्भ", "summary": "महर्षि वाग्भट से पूछा गया कि निरोग कौन रहता है? उन्होंने तीन शब्दों में उत्तर दिया— हितभुक् (सात्त्विक व हितकारी भोजन करने वाला), मितभुक् (संयमित मात्रा में खाने वाला) और ऋतभुक् (ऋतु व ईमानदारी का अन्न खाने वाला)।"}, "bn": {"title": "হিতভুক্ মিতভুক্ ঋতভুক্ — আয়ুর্বেদিক স্বাস্থ্যের তিনটি স্তম্ভ", "summary": "আচার্য বাগ্‌ভট বলেছেন—যিনি হিতভুক্ (কল্যাণকর আহার করেন), মিতভুক্ (পরিমিত আহার করেন) এবং ঋতভুক্ (ঋতু ও সততার অন্ন গ্রহণ করেন), তিনিই প্রকৃত নিরোগ থাকেন।"}, "sa": {"title": "हितभुक् मितभुक् ऋतभुक् — आरोग्याधारत्रयम्", "summary": "यः मानवः हितं मितं ऋतं च अन्नं भुङ्क्ते स एव निरामयः दीर्घायुश्च भवति इति आयुर्वेदसिद्धान्तः।"}}'::jsonb, TRUE
) ON CONFLICT (hmb_quick_id) DO NOTHING;
INSERT INTO hmb_quick_reads_tbl (
    hmb_quick_id, hmb_quick_title, hmb_quick_category, hmb_quick_sanskrit_verse,
    hmb_quick_summary, hmb_quick_scripture_source, hmb_quick_reading_seconds,
    hmb_quick_translations_json, hmb_quick_is_active
) VALUES (
    205, 'Chhandogya Salt-in-Water Parable — The Invisible Presence', 'Upanishad Sutra',
    'लवणमेवोदकेऽवधाय अथ मा प्रातरुपसीदथा इति... सर्वत्र सदा सत् वर्तते ।', 'Uddalaka asked Svetaketu to dissolve rock salt in water overnight. Though invisible to the eye the next morning, the water tasted salty from top, middle, and bottom—showing how the invisible Atman pervades every atom.',
    'Chandogya Upanishad 6.13', 80,
    '{"hi": {"title": "छान्दोग्य लवण-जल दृष्टान्त — सर्वव्यापी आत्मा की उपस्थिति", "summary": "महर्षि उद्दालक ने श्वेतकेतु से जल में नमक घोलने को कहा। दिखायी न देने पर भी जैसे नमक जल के प्रत्येक बूँद में व्याप्त रहता है, वैसे ही परमात्मा चराचर जगत् के कण-कण में व्याप्त है।"}, "bn": {"title": "ছান্দোগ্য লবণ-জল দৃষ্টান্ত — সর্বব্যাপী আত্মার উপস্থিতি", "summary": "জলে লবণ গুলে গেলে তা চোখে দেখা না গেলেও যেমন প্রতিটি বিন্দুতে অনুভূত হয়, তেমনই অদৃশ্য পরমাত্মা সমগ্র চরাচর জগতের কণায় কণায় বিরাজমান।"}, "sa": {"title": "छान्दोग्यलवणोदकदृष्टान्तः — सर्वव्यापकः आत्मा", "summary": "यथा उदके लीनं लवणं चक्षुषा न दृश्यते तथापि सर्वत्र रसेन अनुभूयते, तथैव सर्वभूतान्तर्यामी आत्मा सर्वत्र वर्तते।"}}'::jsonb, TRUE
) ON CONFLICT (hmb_quick_id) DO NOTHING;
INSERT INTO hmb_quick_reads_tbl (
    hmb_quick_id, hmb_quick_title, hmb_quick_category, hmb_quick_sanskrit_verse,
    hmb_quick_summary, hmb_quick_scripture_source, hmb_quick_reading_seconds,
    hmb_quick_translations_json, hmb_quick_is_active
) VALUES (
    206, 'Paropakaraya Phalanti Vrikshah — Nature’s Selfless Seva', 'Subhashita',
    'परोपकाराय फलन्ति वृक्षाः परोपकाराय वहन्ति नद्यः । परोपकाराय दुहन्ति गावः परोपकारार्थमिदं शरीरम् ॥', 'Trees bear fruit for the welfare of others; rivers flow for the benefit of others; cows yield nourishing milk for others; indeed, this human body is blessed when dedicated to selfless service (Paropakara).',
    'Subhashita Niti Shastra', 60,
    '{"hi": {"title": "परोपकाराय फलन्ति वृक्षाः — प्रकृति का निःस्वार्थ सेवा-धर्म", "summary": "वृक्ष परोपकार के लिए फल देते हैं, नदियाँ परोपकार के लिए बहती हैं, गायें परोपकार के लिए दुग्ध देती हैं; वास्तव में यह मानव शरीर भी परोपकार और धर्म-सेवा के लिए ही मिला है।"}, "bn": {"title": "পরোপকারায় ফলন্তি বৃক্ষাঃ — প্রকৃতির নিঃস্বার্থ সেবা-ধর্ম", "summary": "বৃক্ষ পরোপকারের জন্য ফল দেয়, নদী পরোপকারের জন্য প্রবাহিত হয়, গাভী পরোপকারের জন্য দুগ্ধ দেয়; এই মানব দেহও পরোপকার ও সেবার জন্যই ধন্য হয়।"}, "sa": {"title": "परोपकाराय फलन्ति वृक्षाः — परोपकारधर्मः", "summary": "वृक्षाः नद्यः गावश्च निःस्वार्थभावेन लोकहितं कुर्वन्ति; इदं मानुषं शरीरमपि परोपकाराय धर्मसेवायै च वर्तते।"}}'::jsonb, TRUE
) ON CONFLICT (hmb_quick_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('hmb_quick_reads_tbl', 'hmb_quick_id'), COALESCE((SELECT MAX(hmb_quick_id) FROM hmb_quick_reads_tbl), 206), true);

INSERT INTO hmb_admin_audit_log_tbl (
    hmb_audit_action_type, hmb_audit_entity_name, hmb_audit_entity_ref,
    hmb_audit_summary, hmb_audit_payload_json, hmb_audit_actor
)
SELECT
    'INITIAL_DATABASE_SEED', 'hmb_blog_posts_tbl', 'seed_v1',
    'Seeded 8 pre-existing Dharmic discourses, 6 Quick-Read Subhashitas, 7 festive presets, site config, and contact details into NeonDB.',
    '{"seeded_posts": 8, "seeded_quick_reads": 6, "seeded_festivals": 7}'::jsonb,
    'system_seed'
WHERE NOT EXISTS (SELECT 1 FROM hmb_admin_audit_log_tbl LIMIT 1);

COMMIT;

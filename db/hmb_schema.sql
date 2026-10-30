-- =============================================================================
-- ॐ हरि Blogging (Hari Om Blogging) - NeonDB PostgreSQL Schema
-- Prefix Convention: Every table, view, column, index, sequence, and function
-- uses the unique 'hmb_' prefix to prevent any naming collisions in shared DBs.
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
    hmb_active_festival_key VARCHAR(64) NOT NULL DEFAULT 'sharad_deepavali',
    hmb_banner_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    hmb_banner_badge VARCHAR(120) NOT NULL DEFAULT 'शुभ उत्सव • Auspicious Chaturmasya & Deepavali Parva',
    hmb_banner_headline VARCHAR(300) NOT NULL DEFAULT 'तमसो मा ज्योतिर्गमय — Lead Us From Darkness Unto Sacred Light',
    hmb_banner_subtext TEXT NOT NULL DEFAULT 'Explore special festive discourses on Deepavali, Durga Puja, Chhath Puja, Bhai Dooj, Ganesh Chaturthi, and Vasant Holi.',
    hmb_banner_cta_label VARCHAR(120) NOT NULL DEFAULT 'Read Festive Discourses',
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
    hmb_festival_theme_code VARCHAR(64) NOT NULL,
    hmb_festival_badge VARCHAR(160) NOT NULL,
    hmb_festival_headline VARCHAR(350) NOT NULL,
    hmb_festival_subtext TEXT NOT NULL,
    hmb_festival_mantra TEXT NOT NULL,
    hmb_festival_Updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
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

-- 6. Admin Audit Log Table (Tracks every configuration, theme, language, and content change)
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

-- 8. Unique Prefixed Views for Public Feed & Category Analytics
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

-- 9. Unique Prefixed Trigger Function for Automatic Timestamp Updates
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

COMMIT;

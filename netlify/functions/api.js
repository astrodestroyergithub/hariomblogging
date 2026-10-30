/**
 * ॐ हरि Blogging (Hari Om Blogging) — Unified Serverless API & Developer Gateway
 * Uses NeonDB Serverless driver (@neondatabase/serverless) via process.env.DATABASE_URL
 * Admin credentials verified against process.env.ADMIN_USERNAME and process.env.ADMIN_PASSWORD
 * Exposes public & admin endpoints with full CORS support for external developer consumption.
 */

const { neon } = require('@neondatabase/serverless');

const HMB_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-HMB-Admin-User, X-HMB-Admin-Password',
  'Access-Control-Expose-Headers': 'X-HMB-Total-Count, X-HMB-Platform',
  'X-HMB-Platform': 'Hari-Om-Blogging-API-v1',
  'Content-Type': 'application/json; charset=utf-8'
};

function hmbResponse(statusCode, payload, extraHeaders = {}) {
  return {
    statusCode,
    headers: { ...HMB_CORS_HEADERS, ...extraHeaders },
    body: JSON.stringify(payload)
  };
}

function hmbVerifyAdmin(event, bodyObj = {}) {
  const expectedUser = process.env.ADMIN_USERNAME || 'hariom_admin';
  const expectedPass = process.env.ADMIN_PASSWORD || 'Sanatana@108';

  const headers = event.headers || {};
  const headerUser = headers['x-hmb-admin-user'] || headers['X-HMB-Admin-User'];
  const headerPass = headers['x-hmb-admin-password'] || headers['X-HMB-Admin-Password'];

  let authUser = headerUser || bodyObj.username;
  let authPass = headerPass || bodyObj.password;

  const authHeader = headers['authorization'] || headers['Authorization'] || '';
  if (authHeader.startsWith('Basic ')) {
    try {
      const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
      const sepIdx = decoded.indexOf(':');
      if (sepIdx !== -1) {
        authUser = decoded.slice(0, sepIdx);
        authPass = decoded.slice(sepIdx + 1);
      }
    } catch (_) {}
  }

  return authUser === expectedUser && authPass === expectedPass;
}

async function hmbEnsureSchema(hmbSql) {
  await hmbSql`
    CREATE TABLE IF NOT EXISTS hmb_site_config_tbl (
      hmb_config_id SERIAL PRIMARY KEY,
      hmb_config_key VARCHAR(120) UNIQUE NOT NULL,
      hmb_site_title VARCHAR(255) NOT NULL DEFAULT 'ॐ हरि Blogging',
      hmb_site_subtitle VARCHAR(500) NOT NULL DEFAULT 'Sanatana Vangmaya, Vedic Wisdom & Timeless Dharmic Reflections',
      hmb_active_language VARCHAR(32) NOT NULL DEFAULT 'en',
      hmb_active_theme VARCHAR(64) NOT NULL DEFAULT 'sattvic_gold',
      hmb_active_festival_key VARCHAR(64) NOT NULL DEFAULT 'sharad_deepavali',
      hmb_banner_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      hmb_banner_badge VARCHAR(120) NOT NULL DEFAULT 'शुभ उत्सव • Auspicious Festive Parva',
      hmb_banner_headline VARCHAR(300) NOT NULL DEFAULT 'तमसो मा ज्योतिर्गमय — Lead Us From Darkness Unto Sacred Light',
      hmb_banner_subtext TEXT NOT NULL DEFAULT 'Explore special festive discourses on Deepavali, Durga Puja, Chhath Puja, Bhai Dooj, Ganesh Chaturthi, and Vasant Holi.',
      hmb_banner_cta_label VARCHAR(120) NOT NULL DEFAULT 'Read Festive Discourses',
      hmb_banner_cta_category VARCHAR(120) NOT NULL DEFAULT 'Dharmic Living & Festivals',
      hmb_daily_mantra_sanskrit TEXT NOT NULL DEFAULT 'ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥',
      hmb_daily_mantra_meaning TEXT NOT NULL DEFAULT 'May all sentient beings be at peace; may no one suffer from illness; may all see what is auspicious; may no one suffer.',
      hmb_config_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await hmbSql`
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
  `;

  await hmbSql`
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
  `;

  await hmbSql`
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
  `;

  await hmbSql`
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
  `;
}

async function hmbWriteAuditLog(hmbSql, actionType, entityName, entityRef, summary, payload = {}) {
  try {
    await hmbSql`
      INSERT INTO hmb_admin_audit_log_tbl (
        hmb_audit_action_type,
        hmb_audit_entity_name,
        hmb_audit_entity_ref,
        hmb_audit_summary,
        hmb_audit_payload_json
      ) VALUES (
        ${actionType},
        ${entityName},
        ${String(entityRef || '')},
        ${summary},
        ${JSON.stringify(payload)}::jsonb
      );
    `;
  } catch (_) {}
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return hmbResponse(204, {});
  }

  const rawPath = (event.path || '')
    .replace(/^\/\.netlify\/functions\/api/, '')
    .replace(/^\/api/, '') || '/';
  const segments = rawPath.split('/').filter(Boolean);
  const resource = segments[0] || 'status';
  const resourceId = segments[1] || null;
  const method = event.httpMethod;
  const queryParams = event.queryStringParameters || {};

  let bodyObj = {};
  if (event.body) {
    try {
      bodyObj = JSON.parse(event.body);
    } catch (_) {
      return hmbResponse(400, { error: 'Invalid JSON request payload' });
    }
  }

  // Admin authentication check endpoint (works with or without DATABASE_URL)
  if (resource === 'admin' && resourceId === 'login' && method === 'POST') {
    const isValid = hmbVerifyAdmin(event, bodyObj);
    if (!isValid) {
      return hmbResponse(401, { authenticated: false, message: 'Invalid Sevak credentials' });
    }
    return hmbResponse(200, {
      authenticated: true,
      role: 'pradhan_sevak',
      message: 'Pranam! Admin sanctuary unlocked.'
    });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return hmbResponse(200, {
      mode: 'local_sanctuary_persistence',
      message: 'Configure DATABASE_URL in Netlify environment variables to activate live NeonDB SQL persistence.',
      resource
    });
  }

  try {
    const hmbSql = neon(dbUrl);
    await hmbEnsureSchema(hmbSql);

    // 1. /api/posts (GET, POST, PUT, DELETE)
    if (resource === 'posts') {
      if (method === 'GET') {
        if (resourceId) {
          const rows = await hmbSql`
            SELECT * FROM hmb_blog_posts_tbl
            WHERE hmb_post_slug = ${resourceId} OR CAST(hmb_post_id AS TEXT) = ${resourceId}
            LIMIT 1;
          `;
          if (!rows.length) return hmbResponse(404, { error: 'Discourse not found' });
          return hmbResponse(200, { post: rows[0] });
        }

        const category = queryParams.category;
        const limit = Math.min(parseInt(queryParams.limit || '50', 10), 100);
        const offset = Math.max(parseInt(queryParams.offset || '0', 10), 0);

        let rows;
        if (category && category !== 'all') {
          rows = await hmbSql`
            SELECT * FROM hmb_blog_posts_tbl
            WHERE hmb_post_is_published = TRUE AND hmb_post_category = ${category}
            ORDER BY hmb_post_is_featured DESC, hmb_post_published_date DESC, hmb_post_id DESC
            LIMIT ${limit} OFFSET ${offset};
          `;
        } else {
          rows = await hmbSql`
            SELECT * FROM hmb_blog_posts_tbl
            WHERE hmb_post_is_published = TRUE
            ORDER BY hmb_post_is_featured DESC, hmb_post_published_date DESC, hmb_post_id DESC
            LIMIT ${limit} OFFSET ${offset};
          `;
        }
        return hmbResponse(200, { count: rows.length, posts: rows }, { 'X-HMB-Total-Count': String(rows.length) });
      }

      if (!hmbVerifyAdmin(event, bodyObj)) {
        return hmbResponse(401, { error: 'Unauthorized: Valid ADMIN_USERNAME and ADMIN_PASSWORD required.' });
      }

      if (method === 'POST') {
        const p = bodyObj;
        const slug = p.hmb_post_slug || String(p.hmb_post_title || 'discourse').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const inserted = await hmbSql`
          INSERT INTO hmb_blog_posts_tbl (
            hmb_post_slug, hmb_post_title, hmb_post_subtitle, hmb_post_category,
            hmb_post_tags, hmb_post_author_name, hmb_post_author_role, hmb_post_cover_image,
            hmb_post_shloka_sanskrit, hmb_post_shloka_transliteration, hmb_post_shloka_meaning,
            hmb_post_excerpt, hmb_post_content_html, hmb_post_word_count, hmb_post_char_count,
            hmb_post_reading_minutes, hmb_post_is_featured, hmb_post_translations_json
          ) VALUES (
            ${slug}, ${p.hmb_post_title}, ${p.hmb_post_subtitle || ''}, ${p.hmb_post_category || 'Vedanta & Upanishads'},
            ${p.hmb_post_tags || []}, ${p.hmb_post_author_name || 'Acharya Vishwanath Shastri'},
            ${p.hmb_post_author_role || 'Vedanta Scholar'}, ${p.hmb_post_cover_image || ''},
            ${p.hmb_post_shloka_sanskrit || ''}, ${p.hmb_post_shloka_transliteration || ''},
            ${p.hmb_post_shloka_meaning || ''}, ${p.hmb_post_excerpt || ''}, ${p.hmb_post_content_html || ''},
            ${p.hmb_post_word_count || 0}, ${p.hmb_post_char_count || 0}, ${p.hmb_post_reading_minutes || 5},
            ${Boolean(p.hmb_post_is_featured)}, ${JSON.stringify(p.hmb_post_translations_json || {})}::jsonb
          )
          RETURNING *;
        `;
        await hmbWriteAuditLog(hmbSql, 'CREATE_BLOG_POST', 'hmb_blog_posts_tbl', inserted[0].hmb_post_id, `Published new discourse: ${p.hmb_post_title}`, { slug });
        return hmbResponse(201, { post: inserted[0] });
      }

      if (method === 'PUT' && resourceId) {
        const p = bodyObj;
        const updated = await hmbSql`
          UPDATE hmb_blog_posts_tbl
          SET
            hmb_post_title = COALESCE(${p.hmb_post_title}, hmb_post_title),
            hmb_post_subtitle = COALESCE(${p.hmb_post_subtitle}, hmb_post_subtitle),
            hmb_post_category = COALESCE(${p.hmb_post_category}, hmb_post_category),
            hmb_post_tags = COALESCE(${p.hmb_post_tags}, hmb_post_tags),
            hmb_post_author_name = COALESCE(${p.hmb_post_author_name}, hmb_post_author_name),
            hmb_post_author_role = COALESCE(${p.hmb_post_author_role}, hmb_post_author_role),
            hmb_post_cover_image = COALESCE(${p.hmb_post_cover_image}, hmb_post_cover_image),
            hmb_post_shloka_sanskrit = COALESCE(${p.hmb_post_shloka_sanskrit}, hmb_post_shloka_sanskrit),
            hmb_post_shloka_meaning = COALESCE(${p.hmb_post_shloka_meaning}, hmb_post_shloka_meaning),
            hmb_post_excerpt = COALESCE(${p.hmb_post_excerpt}, hmb_post_excerpt),
            hmb_post_content_html = COALESCE(${p.hmb_post_content_html}, hmb_post_content_html),
            hmb_post_word_count = COALESCE(${p.hmb_post_word_count}, hmb_post_word_count),
            hmb_post_char_count = COALESCE(${p.hmb_post_char_count}, hmb_post_char_count),
            hmb_post_reading_minutes = COALESCE(${p.hmb_post_reading_minutes}, hmb_post_reading_minutes),
            hmb_post_is_featured = COALESCE(${p.hmb_post_is_featured}, hmb_post_is_featured)
          WHERE CAST(hmb_post_id AS TEXT) = ${resourceId} OR hmb_post_slug = ${resourceId}
          RETURNING *;
        `;
        await hmbWriteAuditLog(hmbSql, 'UPDATE_BLOG_POST', 'hmb_blog_posts_tbl', resourceId, `Updated discourse: ${p.hmb_post_title || resourceId}`, p);
        return hmbResponse(200, { post: updated[0] || null });
      }

      if (method === 'DELETE' && resourceId) {
        await hmbSql`
          DELETE FROM hmb_blog_posts_tbl
          WHERE CAST(hmb_post_id AS TEXT) = ${resourceId} OR hmb_post_slug = ${resourceId};
        `;
        await hmbWriteAuditLog(hmbSql, 'DELETE_BLOG_POST', 'hmb_blog_posts_tbl', resourceId, `Removed discourse ID/Slug: ${resourceId}`);
        return hmbResponse(200, { deleted: true, id: resourceId });
      }
    }

    // 2. /api/quick-reads (GET, POST, PUT, DELETE)
    if (resource === 'quick-reads') {
      if (method === 'GET') {
        const rows = await hmbSql`
          SELECT * FROM hmb_quick_reads_tbl
          WHERE hmb_quick_is_active = TRUE
          ORDER BY hmb_quick_id DESC;
        `;
        return hmbResponse(200, { count: rows.length, quickReads: rows });
      }

      if (!hmbVerifyAdmin(event, bodyObj)) {
        return hmbResponse(401, { error: 'Unauthorized: Valid ADMIN_USERNAME and ADMIN_PASSWORD required.' });
      }

      if (method === 'POST') {
        const q = bodyObj;
        const inserted = await hmbSql`
          INSERT INTO hmb_quick_reads_tbl (
            hmb_quick_title, hmb_quick_category, hmb_quick_sanskrit_verse,
            hmb_quick_summary, hmb_quick_scripture_source, hmb_quick_reading_seconds
          ) VALUES (
            ${q.hmb_quick_title}, ${q.hmb_quick_category || 'Subhashita'},
            ${q.hmb_quick_sanskrit_verse || ''}, ${q.hmb_quick_summary || ''},
            ${q.hmb_quick_scripture_source || 'Subhashita Ratna Bhandagara'},
            ${q.hmb_quick_reading_seconds || 90}
          )
          RETURNING *;
        `;
        await hmbWriteAuditLog(hmbSql, 'CREATE_QUICK_READ', 'hmb_quick_reads_tbl', inserted[0].hmb_quick_id, `Added Quick-Read: ${q.hmb_quick_title}`);
        return hmbResponse(201, { quickRead: inserted[0] });
      }

      if (method === 'PUT' && resourceId) {
        const q = bodyObj;
        const updated = await hmbSql`
          UPDATE hmb_quick_reads_tbl
          SET
            hmb_quick_title = COALESCE(${q.hmb_quick_title}, hmb_quick_title),
            hmb_quick_category = COALESCE(${q.hmb_quick_category}, hmb_quick_category),
            hmb_quick_sanskrit_verse = COALESCE(${q.hmb_quick_sanskrit_verse}, hmb_quick_sanskrit_verse),
            hmb_quick_summary = COALESCE(${q.hmb_quick_summary}, hmb_quick_summary),
            hmb_quick_scripture_source = COALESCE(${q.hmb_quick_scripture_source}, hmb_quick_scripture_source)
          WHERE CAST(hmb_quick_id AS TEXT) = ${resourceId}
          RETURNING *;
        `;
        await hmbWriteAuditLog(hmbSql, 'UPDATE_QUICK_READ', 'hmb_quick_reads_tbl', resourceId, `Updated Quick-Read #${resourceId}`);
        return hmbResponse(200, { quickRead: updated[0] || null });
      }

      if (method === 'DELETE' && resourceId) {
        await hmbSql`DELETE FROM hmb_quick_reads_tbl WHERE CAST(hmb_quick_id AS TEXT) = ${resourceId};`;
        await hmbWriteAuditLog(hmbSql, 'DELETE_QUICK_READ', 'hmb_quick_reads_tbl', resourceId, `Deleted Quick-Read #${resourceId}`);
        return hmbResponse(200, { deleted: true, id: resourceId });
      }
    }

    // 3. /api/config (GET, PUT) — Persists Theme, Language, Festive Banner & Contact Info
    if (resource === 'config') {
      if (method === 'GET') {
        const cfg = await hmbSql`SELECT * FROM hmb_site_config_tbl WHERE hmb_config_key = 'primary_config' LIMIT 1;`;
        const contact = await hmbSql`SELECT * FROM hmb_contact_details_tbl WHERE hmb_contact_key = 'primary_sanctuary' LIMIT 1;`;
        return hmbResponse(200, {
          config: cfg[0] || null,
          contact: contact[0] || null
        });
      }

      if (method === 'PUT') {
        if (!hmbVerifyAdmin(event, bodyObj)) {
          return hmbResponse(401, { error: 'Unauthorized: Valid ADMIN_USERNAME and ADMIN_PASSWORD required.' });
        }
        const c = bodyObj;
        const upserted = await hmbSql`
          INSERT INTO hmb_site_config_tbl (
            hmb_config_key, hmb_site_title, hmb_site_subtitle, hmb_active_language,
            hmb_active_theme, hmb_active_festival_key, hmb_banner_enabled,
            hmb_banner_badge, hmb_banner_headline, hmb_banner_subtext,
            hmb_banner_cta_label, hmb_banner_cta_category,
            hmb_daily_mantra_sanskrit, hmb_daily_mantra_meaning, hmb_config_updated_at
          ) VALUES (
            'primary_config',
            ${c.hmb_site_title || 'ॐ हरि Blogging'},
            ${c.hmb_site_subtitle || 'Sanatana Vangmaya, Vedic Wisdom & Timeless Dharmic Reflections'},
            ${c.hmb_active_language || 'en'},
            ${c.hmb_active_theme || 'sattvic_gold'},
            ${c.hmb_active_festival_key || 'sharad_deepavali'},
            ${c.hmb_banner_enabled !== undefined ? Boolean(c.hmb_banner_enabled) : true},
            ${c.hmb_banner_badge || ''},
            ${c.hmb_banner_headline || ''},
            ${c.hmb_banner_subtext || ''},
            ${c.hmb_banner_cta_label || 'Explore Discourses'},
            ${c.hmb_banner_cta_category || 'all'},
            ${c.hmb_daily_mantra_sanskrit || ''},
            ${c.hmb_daily_mantra_meaning || ''},
            CURRENT_TIMESTAMP
          )
          ON CONFLICT (hmb_config_key) DO UPDATE SET
            hmb_site_title = EXCLUDED.hmb_site_title,
            hmb_site_subtitle = EXCLUDED.hmb_site_subtitle,
            hmb_active_language = EXCLUDED.hmb_active_language,
            hmb_active_theme = EXCLUDED.hmb_active_theme,
            hmb_active_festival_key = EXCLUDED.hmb_active_festival_key,
            hmb_banner_enabled = EXCLUDED.hmb_banner_enabled,
            hmb_banner_badge = EXCLUDED.hmb_banner_badge,
            hmb_banner_headline = EXCLUDED.hmb_banner_headline,
            hmb_banner_subtext = EXCLUDED.hmb_banner_subtext,
            hmb_banner_cta_label = EXCLUDED.hmb_banner_cta_label,
            hmb_banner_cta_category = EXCLUDED.hmb_banner_cta_category,
            hmb_daily_mantra_sanskrit = EXCLUDED.hmb_daily_mantra_sanskrit,
            hmb_daily_mantra_meaning = EXCLUDED.hmb_daily_mantra_meaning,
            hmb_config_updated_at = CURRENT_TIMESTAMP
          RETURNING *;
        `;

        if (c.contact) {
          const ct = c.contact;
          await hmbSql`
            INSERT INTO hmb_contact_details_tbl (
              hmb_contact_key, hmb_sanctuary_name, hmb_contact_email,
              hmb_contact_phone, hmb_contact_address, hmb_contact_hours,
              hmb_social_x_handle, hmb_social_youtube, hmb_social_telegram,
              hmb_footer_blessing, hmb_contact_updated_at
            ) VALUES (
              'primary_sanctuary',
              ${ct.hmb_sanctuary_name || 'ॐ हरि Blogging'},
              ${ct.hmb_contact_email || ''},
              ${ct.hmb_contact_phone || ''},
              ${ct.hmb_contact_address || ''},
              ${ct.hmb_contact_hours || ''},
              ${ct.hmb_social_x_handle || ''},
              ${ct.hmb_social_youtube || ''},
              ${ct.hmb_social_telegram || ''},
              ${ct.hmb_footer_blessing || ''},
              CURRENT_TIMESTAMP
            )
            ON CONFLICT (hmb_contact_key) DO UPDATE SET
              hmb_sanctuary_name = EXCLUDED.hmb_sanctuary_name,
              hmb_contact_email = EXCLUDED.hmb_contact_email,
              hmb_contact_phone = EXCLUDED.hmb_contact_phone,
              hmb_contact_address = EXCLUDED.hmb_contact_address,
              hmb_contact_hours = EXCLUDED.hmb_contact_hours,
              hmb_social_x_handle = EXCLUDED.hmb_social_x_handle,
              hmb_social_youtube = EXCLUDED.hmb_social_youtube,
              hmb_social_telegram = EXCLUDED.hmb_social_telegram,
              hmb_footer_blessing = EXCLUDED.hmb_footer_blessing,
              hmb_contact_updated_at = CURRENT_TIMESTAMP;
          `;
        }

        await hmbWriteAuditLog(
          hmbSql,
          'UPDATE_SITE_CONFIG',
          'hmb_site_config_tbl',
          'primary_config',
          `Updated site configuration (Theme: ${c.hmb_active_theme}, Lang: ${c.hmb_active_language}, Festival: ${c.hmb_active_festival_key})`,
          c
        );

        return hmbResponse(200, { config: upserted[0] });
      }
    }

    // 4. /api/audit-logs (GET)
    if (resource === 'audit-logs' && method === 'GET') {
      if (!hmbVerifyAdmin(event, bodyObj)) {
        return hmbResponse(401, { error: 'Unauthorized: Admin credentials required to inspect audit logs.' });
      }
      const logs = await hmbSql`
        SELECT * FROM hmb_admin_audit_log_tbl
        ORDER BY hmb_audit_created_at DESC
        LIMIT 100;
      `;
      return hmbResponse(200, { count: logs.length, auditLogs: logs });
    }

    return hmbResponse(200, {
      platform: 'ॐ हरि Blogging (Hari Om Blogging) Open Dharmic API',
      endpoints: [
        'GET /api/posts',
        'GET /api/posts/:slug',
        'POST /api/posts',
        'PUT /api/posts/:id',
        'DELETE /api/posts/:id',
        'GET /api/quick-reads',
        'POST /api/quick-reads',
        'PUT /api/quick-reads/:id',
        'DELETE /api/quick-reads/:id',
        'GET /api/config',
        'PUT /api/config',
        'GET /api/audit-logs'
      ]
    });
  } catch (err) {
    return hmbResponse(500, { error: 'Internal sanctuary service error', detail: err.message });
  }
};

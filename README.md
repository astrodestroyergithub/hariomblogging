# ॐ हरि Blogging (Hari Om Blogging)

A serene, responsive, full-featured Dharmic blogging platform designed for Netlify hosting with NeonDB PostgreSQL persistence (`hmb_` unique schema prefix), a rich multilingual engine (English, Hindi, Bengali, and Sanskrit), seasonal Hindu festival themes & banners, long-form WYSIWYG blog formatting utilities, and CORS-enabled REST APIs for external developers.

## Quick Deployment on Netlify

1. **Upload or Push to Netlify**:
   - Drag and drop this folder (or connect your Git repository) to Netlify.
   - `netlify.toml` automatically configures the publish directory (`.`), serverless functions (`netlify/functions`), and `/api/*` CORS routing.
2. **Configure Environment Variables**:
   - In your Netlify Dashboard, navigate to **Site configuration → Environment variables** and set:
     - `DATABASE_URL`: Your NeonDB PostgreSQL connection URI.
     - `ADMIN_USERNAME`: Your administrator username (default demo fallback: `hariom_admin`).
     - `ADMIN_PASSWORD`: Your administrator password (default demo fallback: `Sanatana@108`).
3. **Database Initialization**:
   - Execute `db/hmb_schema.sql` in the NeonDB SQL Editor (or let `netlify/functions/api.js` auto-provision the `hmb_` tables on first request).
   - Every table, view, column, index, and trigger uses the `hmb_` prefix (`hmb_blog_posts_tbl`, `hmb_quick_reads_tbl`, `hmb_site_config_tbl`, `hmb_contact_details_tbl`, `hmb_admin_audit_log_tbl`, `hmb_published_feed_vw`, `hmb_category_stats_vw`) to guarantee zero conflicts with existing tables in your database.


Vercel Engagement RSVP

1) Upload to GitHub
2) Import to Vercel
3) Add Environment Variable:
   DATABASE_URL=your_neon_url

Run this SQL in Neon:

CREATE TABLE guests (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE responses (
  guest_id INT PRIMARY KEY REFERENCES guests(id),
  status TEXT NOT NULL,
  dietary TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

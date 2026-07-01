# YMRMC Attendance System

Three files, no build step:
- `schema.sql` — run once in Supabase
- `config.js` — your credentials, edited once
- `admin.html` — admin console (add employees, view roster & log)
- `employee.html` — employee check-in (login → GPS lock → photo → submit)

## 1. Set up Supabase (5 min)

1. Create a project at supabase.com (free tier is fine).
2. **SQL Editor** → paste the contents of `schema.sql` → Run.
   - This creates the `employees` and `attendance` tables, the ID/password
     generator, login/attendance functions, and the `attendance-photos`
     storage bucket.
3. **Authentication → Users → Add user** — create yourself an admin login
   (email + password). This is the *only* account that can sign into
   `admin.html`; employees never use Supabase Auth.
4. **Project Settings → API** — copy your **Project URL** and **anon public
   key**.

## 2. Configure the app

Open `config.js` and fill in:

```js
SUPABASE_URL: "https://xxxxxxxx.supabase.co",
SUPABASE_ANON_KEY: "eyJ...",
SITE_LAT: 25.404502,
SITE_LNG: 88.5262493,
GEOFENCE_RADIUS_M: 4,
```

## 3. Host the three files

Any static host works: Netlify, Vercel, GitHub Pages, or your own server —
**as long as it's served over HTTPS**, since browsers only allow camera and
GPS access on secure origins (localhost also works for testing).

Keep `config.js`, `admin.html`, and `employee.html` in the same folder.

## 4. How it works

**Admin** (`admin.html`)
- Signs in with the Supabase Auth account you created.
- "Add employee" calls `create_employee()`, which generates the next
  sequential ID (`YMRMC-0001`, `YMRMC-0002`, …) and a random password
  meeting the policy (1 uppercase, several lowercase, 1 number, 1 special
  character from `!@#$%&*`). The password is shown **once** — copy it and
  send it to the employee. Only a bcrypt hash is stored, never the
  plaintext.
- Roster and attendance log (with photo thumbnails, distance, and
  in/out-of-geofence status) refresh automatically.

**Employee** (`employee.html`)
1. Logs in with the ID/password from admin.
2. **Locate screen** — live radar shows real-time distance from the fixed
   site point using the GPS Haversine distance; the app keeps the most
   accurate fix it has seen. "Lock this location" freezes that precise
   reading (this is the "final precise tagging" step).
3. **Camera screen** — takes the photo after the location is locked.
4. **Review screen** — shows the photo plus the locked coordinates,
   accuracy, and distance before submitting.
5. **Submit** — uploads the photo to Supabase Storage and calls
   `record_attendance()`, which writes employee ID, photo URL, latitude,
   longitude, GPS accuracy, distance from site, in/out-of-geofence flag,
   device info, and a server-generated timestamp.

Employees are allowed to check in even if they're outside the 4 m radius —
the record is just flagged `within_geofence = false` so admin can see it,
rather than silently blocking them (useful for spotty GPS days). Tighten
this in `record_attendance()` if you'd rather hard-block out-of-range
submissions.

## Notes & things to harden before production

- The employee login (`verify_login`) is a database function callable
  without Supabase Auth, by design — employees only have an ID/password,
  not real accounts. Add rate limiting (e.g. a Supabase Edge Function in
  front of it) if brute-force attempts are a concern.
- The storage bucket is public-read so photo URLs work directly in the
  admin log. If check-in photos are sensitive, switch the bucket to
  private and generate signed URLs instead.
- GPS accuracy varies by device; `GEOFENCE_RADIUS_M = 4` is tight — most
  phones report 3–8 m accuracy outdoors and worse indoors/under cover.
  Consider widening it if employees frequently check in near buildings.

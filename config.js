// =====================================================================
// EDIT THESE THREE VALUES, then keep this file next to admin.html and
// employee.html (same folder). Both pages load it.
// =====================================================================
const APP_CONFIG = {
  SUPABASE_URL: "https://ubvfwfsajteaazivcbzw.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVidmZ3ZnNhanRlYWF6aXZjYnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NzkwNTksImV4cCI6MjA5ODQ1NTA1OX0.7Ur1p-lBIx6iMPgczqGpZhNMUT0Elo57HQ2bF62VdHo",

  // The site's fixed coordinates employees must check in near.
  SITE_LAT: 25.404502,
  SITE_LNG: 88.5262493,
  GEOFENCE_RADIUS_M: 4,       // metres
  ID_PREFIX: "YMRMC",
};

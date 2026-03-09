# Run Seerr with Docker

[Seerr](https://docs.seerr.dev) is a media **request** manager: it lets users request movies and TV shows. It integrates with **Plex**, **Jellyfin**, or **Emby** (for the library) and **Radarr** / **Sonarr** (to fetch content). Seerr does **not** serve video streams itself.

## What Seerr does

- **Discovery** – Browse and search movies/shows (via TMDB).
- **Requests** – Users request a title; you approve; Radarr/Sonarr add it to your library; Plex/Jellyfin/Emby serve it.
- **Scraping** – Seerr doesn’t scrape files. Radarr/Sonarr handle downloading; Plex/Jellyfin/Emby index and stream.

---

## I don’t have any configuration – how do I connect Plex/Jellyfin/Emby?

You need **at least one media server** running before Seerr can manage a library. Choose one:

| Server   | Best for              | Account / cost      |
|----------|------------------------|---------------------|
| **Jellyfin** | Self‑hosted, no account | Free, open source   |
| **Plex**     | Easiest for many users | Free tier or Plex Pass |
| **Emby**     | Similar to Plex        | Free tier or Emby Premiere |

### Option A: Start with Jellyfin (recommended if you have nothing)

Jellyfin is free, open source, and doesn’t require an account. Use the combined stack:

```bash
# From project root – starts both Seerr and Jellyfin
docker compose -f docker/seerr/docker-compose.jellyfin.yaml up -d
```

Then:

1. **Set up Jellyfin**
   - Open **http://localhost:8096**
   - Create an admin user (any username/password – no email or sign‑up).
   - Add a **media library**: e.g. “Movies” or “Shows”, point it to a folder.  
     If you have no media yet, create an empty folder and add it; you can add real paths later in Jellyfin settings.

2. **Get Jellyfin API key** (so Seerr can talk to Jellyfin)
   - In Jellyfin: **Dashboard** (hamburger menu) → **API Keys**
   - Click **“New API Key”**, name it e.g. “Seerr”, copy the key.

3. **Connect Jellyfin in Seerr**
   - Open **http://localhost:5055**
   - Create the Seerr admin user when prompted.
   - Go to **Settings** → **Services** → **Jellyfin**
   - **Server URL**: `http://jellyfin:8096` (from other Docker containers) or `http://localhost:8096` (from your browser/host).
   - **API Key**: paste the key from step 2.
   - Save. Seerr will import your Jellyfin users and library.

4. **Optional: Radarr/Sonarr**  
   For Seerr to *request* and *download* new movies/shows you add Radarr and Sonarr and point them at the same media folders Jellyfin uses. See [Seerr docs](https://docs.seerr.dev) for that. Without them, Seerr can still browse and show what’s in Jellyfin and manage requests (you’d add files manually).

### Option B: You already use Plex or Emby

1. **Run only Seerr** (if not already running):
   ```bash
   docker compose -f docker/seerr/docker-compose.yaml up -d
   ```
2. Open **http://localhost:5055** → **Settings** → **Services**.
3. **Plex**: sign in with your Plex account (or use Plex server URL + token).  
   **Emby**: add server URL and API key (from Emby dashboard → API Keys).

Use the URL that Seerr can reach (e.g. from the same machine `http://localhost:32400` for Plex, or `http://host.docker.internal:32400` if Seerr is in Docker and Plex is on the host).

### Option C: Run only Seerr (no media server yet)

You can run Seerr alone and complete its setup wizard; when it asks for a service, skip or add one later. You won’t have a library until you add at least one of Plex, Jellyfin, or Emby.

```bash
docker compose -f docker/seerr/docker-compose.yaml up -d
```

Then open **http://localhost:5055** and create the admin user. Add Plex/Jellyfin/Emby when you have one running.

---

## Run Seerr only (no Jellyfin in this compose)

From the project root:

```bash
docker compose -f docker/seerr/docker-compose.yaml up -d
```

Then open **http://localhost:5055** and complete the setup (create admin user, then add Plex or Jellyfin or Emby + optionally Radarr/Sonarr).

---

## Setflix vs Seerr

| | Setflix | Seerr |
|---|--------|--------|
| **Role** | Front-end player + family profiles + catalog UI | Request and library management |
| **Catalog** | `data/movies.json` and `data/shows.json` (or future Plex/Jellyfin API) | TMDB discovery + your Plex/Jellyfin/Emby library |
| **Playback** | Setflix video player uses `streamUrl` from catalog | No playback; Plex/Jellyfin/Emby serve the files |

To have Setflix show “real” movies from your library you would either:

1. **Keep using the JSON catalog** – Add entries to `data/movies.json` / `data/shows.json` with `streamUrl` pointing to your Plex/Jellyfin stream URLs (or direct links).
2. **Future integration** – Add a Setflix backend or API route that talks to Plex/Jellyfin API to list library items and resolve stream URLs, then show them in Setflix. Seerr would still be used only for requesting new content.

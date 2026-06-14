# Crate Digger

A 3D, scrollable journey through the history of **heavy metal** — from Blue Cheer (1968) to today. Scroll the timeline, hear a 30-second preview of the record you're on, and open any record for a bio + discography. Built as an immersive WebGL experience with a clean, editorial UI.

## Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**-style components
- **Framer Motion** for transitions and the staggered text reveals
- **Three.js** (bloom post-processing) for the 3D scene — encapsulated in `src/engine.js` and mounted by React
- **Anton** (display) + **Inter** (UI) typography

## Data & media

- Curated, real metal milestones (grounded in the Wikipedia history of heavy metal)
- Album art + 30-second previews via the **iTunes Search API** (no auth)
- Band bios + photos via the **Wikipedia REST API**
- Falls back to procedurally generated cover art when offline

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the build
```

## Structure

```
src/
  engine.js              # Three.js scene, audio, scroll/snap — emits state, takes commands
  App.tsx                # wires the engine to React, handles transitions
  components/
    Landing.tsx          # home screen (orb of albums + title)
    Timeline.tsx         # Notion-style vertical timeline
    NowInfo.tsx          # centered now-playing info
    DetailPanel.tsx      # bio + discography (Wikipedia + iTunes)
    EndCard.tsx          # end-of-timeline restart / home
    SoundToggle.tsx      # global music on/off
    AudioControls.tsx    # play/pause + volume
    Logo.tsx             # cursor-tracking mascot
    StaggerWords.tsx     # reusable blurred word reveal
    ui/                  # shadcn-style Button + Slider
```

`index.standalone.html` is the original single-file prototype, kept for reference.

---
🤖 Built with [Claude Code](https://claude.com/claude-code)

# Field Score Calculator

Victory-point tracker for Bolt Action and Konflikt '47.

## Files
- `index.html` – the app itself
- `manifest.webmanifest` – lets phones install it to the home screen
- `sw.js` – offline cache (service worker)
- `icons/` – app icons

## Try it on your PC
Double-click `index.html`. Everything works except offline install, which needs the app to be hosted over https.

## Put it on your phone (free, via GitHub Pages)
1. Create a free account at github.com and make a new **public** repository, e.g. `score-tracker`.
2. Choose **Add file → Upload files** and drag in everything from this folder, including the `icons` folder. Commit.
3. Go to **Settings → Pages**, set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After a minute or two the app is live at `https://<your-username>.github.io/score-tracker/`.
5. Open that link on your phone:
   - **iPhone (Safari):** Share → Add to Home Screen
   - **Android (Chrome):** menu → Install app / Add to Home screen
6. Open it once while online. After that it works with no signal.

## Updating
Upload the changed files to the repository, then change `VERSION` in `sw.js` (e.g. `fsc-v2`) so phones fetch the new version. It updates the next time the app is opened online.

## Notes
- Scoring values are editable in the app ("Edit this scenario's scoring") and saved on each device.
- Game data is stored on the device only.

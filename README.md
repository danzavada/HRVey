# HRVey

**HRVey** — an HRV (heart-rate variability) analysis tool for 10-second ECG PDFs.

HRVey is a browser-based reimplementation of a Windows desktop tool for measuring
R–R intervals on scanned, single-page 10-second ECG PDFs. It runs entirely in the
browser — **no install, no server, and ECG files never leave your device.**

## Status

🚧 **Early development.** Porting an existing Python/Tkinter desktop app to a
single-file, offline-capable web app. See [`docs/PLAN.md`](docs/PLAN.md) for the
full design and the verification test vector.

## What it does

Load a scanned 10-second ECG PDF, then:

1. **Level** — correct the scan tilt by clicking two points on a horizontal feature.
2. **Calibrate** — click a known time interval (e.g. one large square = 200 ms at 25 mm/s).
3. **Mark** — click each R-peak.
4. **Read & export** — RR intervals, heart rate, RMSSD and SDNN, exported to Excel.

## Planned stack

- A single self-contained `index.html` — no build step; double-click to run, fully offline.
- Installable **PWA** (manifest + service worker) when served over http(s).
- **PDF.js** to render the PDF page, **Canvas 2D** to display and measure, **ExcelJS** to export.
- 100% client-side — patient data stays in the browser.

## Privacy

HRVey performs all processing locally in your browser. No ECG image, measurement,
or patient identifier is ever uploaded or transmitted.

## Development

This is a no-build project. Open `index.html` directly in a browser, or serve the
folder to test PWA / offline behaviour:

```sh
python -m http.server 8000
# then open http://localhost:8000
```

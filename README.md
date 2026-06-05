# HRVey

**HRVey** — an HRV (heart-rate variability) analysis tool for 10-second ECG PDFs.

HRVey is a browser-based reimplementation of a Windows desktop tool for measuring
R–R intervals on scanned, single-page 10-second ECG PDFs. It runs entirely in the
browser — **no install, no server, and ECG files never leave your device.**

## Status

✅ **v1 built.** The full manual measurement workflow (open → level → calibrate →
mark → RR/HRV → export) is implemented in a single `index.html` and verified against
the desktop reference (see [Verification](#verification)). See [`docs/PLAN.md`](docs/PLAN.md)
for the design. Auto-detection of peaks/grid is a possible phase 2.

## What it does

Load a scanned 10-second ECG PDF, then:

1. **Level** — correct the scan tilt by clicking two points on a horizontal feature.
2. **Calibrate** — click a known time interval (e.g. one large square = 200 ms at 25 mm/s).
3. **Mark** — click each R-peak.
4. **Read & export** — RR intervals, heart rate, RMSSD and SDNN, exported to Excel.

## Stack

- All app code lives in one `index.html` — no build step / no toolchain.
- **PDF.js** renders the PDF page, **Canvas 2D** displays and measures, **SheetJS** reads/writes Excel.
  These two libraries are vendored under [`vendor/`](vendor/) so the app works fully offline.
- Installable **PWA** (`manifest.webmanifest` + `sw.js`) caches everything for offline use over http(s).
- 100% client-side — patient data stays in the browser.

Export formats: `.xlsx` (Analysis / RR Intervals / Technical details), `.csv`, a `.json`
session (for exact reload), and an annotated `.png`. Load restores a prior `.json` session
or any `.xlsx` with a *Technical details* sheet (including files from the desktop tool).

## Verification

The geometry/HRV math and the Excel load/export path are checked against the desktop
tool's own output for the reference recording `ID001_ecg_2016_10_16_10_30`. Feeding the
saved peaks + calibration reproduces the desktop result exactly, and survives an
export→reload round-trip:

```
calibration = 200 ms (one large square @ 25 mm/s)
RR = [138, 146, 180] ms   HR = 387.9 bpm   RMSSD = 24.7 ms   SDNN = 18.2 ms
```

To check it yourself in the browser: open the sample PDF, Load its analysis, and confirm
the side panel shows the numbers above.

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

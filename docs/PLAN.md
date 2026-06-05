# HRVey — porting plan (desktop → single-file offline web app)

## Context
HRVey replaces a ~1,800-line Python/Tkinter desktop program (packaged as a ~110 MB
Windows `.exe` via PyInstaller) that loads a scanned, single-page PDF of a 10-second
ECG and lets a clinician **manually** measure R–R intervals: deskew (level) the scan,
set a time calibration, click each R-peak, then read off RR / heart-rate / HRV and
export to Excel.

Goal: a **website that does the same thing** — no install, no server, runs in any
modern browser. The decisive finding from the reference source: there is **zero
automatic image processing** (no grid detection, trace extraction, or peak-finding).
It is purely an interactive caliper/annotation tool over a rasterized PDF page —
a clean fit for a 100% client-side web app where **patient ECG data never leaves the
browser**.

> The original Python desktop app is the reference spec; it is intentionally kept
> **out of this repository** (along with the patient sample file).

## Decisions
- **Scope:** Faithful 1:1 parity with the manual workflow. No auto-detection in v1.
- **Packaging:** A single self-contained `index.html`, no build step. Libraries inlined.
- **Delivery:** Installable, offline **PWA** (small static sidecar files — see below).
- **Excel I/O:** Free to improve the format, but the loader must still read the legacy
  format so existing exports load.

## Library mapping (Python → browser)
| Desktop (Python) | Browser | Notes |
|---|---|---|
| PyMuPDF `fitz` (rasterize page 1 @ 2×) | **PDF.js** | Render page 0 at scale 2.0 → `ImageBitmap`; worker via Blob URL or main-thread. |
| Pillow (rotate/crop/scale) | **Canvas 2D** | Rotation + zoom/pan via `ctx.setTransform`. |
| Tkinter Canvas + widgets | **`<canvas>` + HTML/CSS** | One canvas for image+overlays; HTML toolbar/panel/dialogs. |
| openpyxl (read/write xlsx) | **ExcelJS** | Can embed the annotated PNG and style cells; also reads xlsx. |
| `math` | JS `Math` | Identical formulas (see golden vector). |

All libs are single UMD files, **inlined** so the app works from `file://`.

## Target structure
```
HRVey/
├── index.html              ← THE app: inlined PDF.js + ExcelJS + CSS + app JS. Offline by double-click.
├── manifest.webmanifest    ← PWA metadata
├── sw.js                   ← service worker (cache-first; enables install + offline)
├── icons/                  ← 192 / 512 / maskable PNGs
└── docs/PLAN.md            ← this file
```
Inside `index.html`, the app `<script>` is organized into clear sections mirroring the
original class: **State → Geometry/transforms → PDF load → Rendering → Modes & mouse
handlers → Zoom/Pan → Undo/Redo → Export/Import → UI wiring & shortcuts**.

### "single .html" + "offline PWA" reconciliation
A service worker cannot be inlined and won't run from `file://`. So: the **app is one
file** (`index.html`, fully offline by double-click); **installability** is layered on
by `manifest.webmanifest` + `sw.js` + icons, which activate only when the folder is
served over http(s). Register the SW only when `location.protocol` is http/https.

## Faithful behavior spec
**Coordinate spaces:** image-space = rasterized pixels (post-rotation); display =
`image × zoom` + pan.

**Modes:** Select / Level / Calibrate / Mark. Clicking near an existing peak (~20 px)
in a non-mark mode toggles its selection.

**Level / deskew** (the one subtle algorithm):
1. Click 2 points; `angleDeg = degrees(atan2(dy, dx))`.
2. Rotate the image by `angleDeg` (CCW for +deg, expand, white fill); new size =
   `(|w·cos|+|h·sin|, |w·sin|+|h·cos|)`.
3. Forward-transform existing cal/peaks into the new space (y-down CW matrix):
   `fwd(p) = ( cos·ddx + sin·ddy + cxNew , -sin·ddx + cos·ddy + cyNew )`, `dd = p − oldCenter`.
4. Reset `level_angle → 0`, set `appliedRotationDeg = angleDeg`, restore transformed data.
   → After leveling, RR distances are plain horizontal `|dx|`.
- Clean implementation: keep the original `ImageBitmap` immutable + `appliedRotationDeg`,
  re-render the rotated view from the original (makes undo cheap).

**Calibrate:** click 2 points → modal asks ms → `px = xDist(c0,c1)`, `px_per_ms = px/ms`;
guard `px < 1`. Double-click a cal marker re-enters ms.

**Mark peaks:** click empty → append, then sort by `peakX = px·cos(angle)+py·sin(angle)`
(left→right). Click near a peak toggles selection. Right-click removes nearest within
30 canvas px; Delete removes the selected peak.

**Distance + RR + HRV:**
```
xDist(p1,p2) = |(p2.x−p1.x)·cos(level_angle) + (p2.y−p1.y)·sin(level_angle)|
rr_ms        = round( xDist(peak[i], peak[i+1]) / px_per_ms )
mean_rr = mean(rr);  HR = 60000 / mean_rr
SDNN    = sqrt( mean( (rr_i − mean_rr)^2 ) )      # population, ÷ n
RMSSD   = sqrt( mean( (rr_{i+1} − rr_i)^2 ) )     # ÷ (n−1)
```

**Zoom/pan:** zoom 0.05–20, fit-to-window as the floor. Ctrl+wheel = zoom at cursor;
wheel = vertical pan; Shift+wheel = horizontal; middle-drag = pan; `Z` toggles
max-zoom ↔ fit. Implement with a single `ctx.setTransform` + `drawImage`.

**Undo/redo:** unified stack of lightweight state snapshots
`{appliedRotationDeg, level_pts, level_angle, cal_pts, px_per_ms, r_peaks, selected}`.

**Shortcuts:** Ctrl+O open, Ctrl+S export, `Z` zoom toggle, `S` select, `L` level,
`C` calibrate, `M` mark, Ctrl+Z undo, Ctrl+Y redo, Delete.

**Side panel + status bar:** RR list, Mean RR, HR, RMSSD, SDNN, Cal status, Level angle;
live status messages.

**Open + filename parse:** `<input type=file>` / drag-drop → PDF.js render page 0 @2×.
Parse base name `^(.+?)_(\d{4})_(\d{2})_(\d{2})_(\d{2})_(\d{2})$` → subject_id (`ID…`
prefix), `DD/MM/YYYY`, `HH:MM` to prefill the exam dialog.

## Improved export / import
**Write (ExcelJS):**
- `Analysis`: subject_id, date, time, heart_rate, rmssd, sdnn + mean_rr, n_peaks, n_intervals.
- `RR Intervals`: order, rr_interval_ms + cumulative_time_ms, instantaneous_hr_bpm.
- `Technical details`: keep legacy keys (`ecg_file, image_rotation_applied_deg,
  level_angle_deg, level_pt{1,2}_{x,y}, px_per_ms, cal_pt{1,2}_{x,y}`) + peaks table.
- Optional `Snapshot` sheet: embedded annotated ECG PNG.
- Also offer PNG snapshot, CSV, and a clean `.json` session (canonical exact-reload artifact).

**Read (Load Analysis):** parse `.json` session first; else the `Technical details`
sheet — accept both the new and legacy schema. Requires a PDF open first.

## Implementation milestones
1. **Shell**: `index.html` skeleton (toolbar, canvas, side panel, status bar, CSS); inline ExcelJS + PDF.js.
2. **PDF load + render**: open/drag-drop → page 0 @2× → `ImageBitmap`; fit; zoom/pan; rotate-90.
3. **Geometry core**: transforms, `xDist`, `calcRR`, `calcHRV`. Unit-check vs the golden vector first.
4. **Modes + overlays**: Level (rotation + transform), Calibrate (+ edit), Mark (add/select/delete), overlay drawing, panel, status.
5. **Undo/redo** + Reset / Clear Cal / Clear Peaks + shortcuts + exam dialog + filename prefill.
6. **Export/import**: ExcelJS workbook (+ optional PNG), JSON session, CSV, PNG; Load (new + legacy).
7. **PWA**: manifest, `sw.js` (cache-first, versioned), icons; conditional SW registration.

## Verification — golden parity test (arithmetic-verified)
Using the reference sample, feeding saved peaks + `px_per_ms = 1.8539` (level_angle 0)
reproduces the desktop app exactly:
```
calibration ms = 200 (one large square @ 25 mm/s)  →  px_per_ms 1.8539
RR = [138, 146, 180] ms
mean_rr = 154.667 ms   HR = 387.9 bpm   RMSSD = 24.7 ms   SDNN = 18.2 ms
```
- **Math test:** Load the reference analysis → assert the four metrics + RR list match.
- **UX test:** Open the sample PDF → Level → Calibrate (one large square = 200 ms,
  expect px/ms ≈ 1.854) → mark 4 peaks → expect RR ≈ [138,146,180]. Export → reopen → Load → identical state.
- **PWA/offline:** serve over http; confirm SW + manifest; toggle Offline → still works;
  double-click `index.html` → full app runs (no install), no console errors.
- **Browsers:** Chromium primary; spot-check Firefox.

## Risks / notes
- **PDF.js worker:** prefer Blob-URL worker; fall back to main-thread for `file://`/CSP.
- **Single-file size:** inlining PDF.js + ExcelJS makes `index.html` ~2–3 MB (acceptable; SW caches it).
- **Float parity:** RR uses `Math.round` on ms — matches the golden vector; watch edge cases.
- **ExcelJS image embedding** is why it's preferred over SheetJS; if fiddly, ship PNG separately.

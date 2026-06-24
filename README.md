# HRVey

HRV analysis for scanned 10-second ECG PDFs. Runs entirely in your browser — nothing is ever uploaded.

**Hosted version: https://danzavada.github.io/HRVey/**

---

## Table of contents

1. [Introduction](#introduction)
2. [Quick start](#quick-start)
3. [Step-by-step workflow](#step-by-step-workflow)
   - [1. Open a PDF](#1-open-a-pdf)
   - [2. Level the scan](#2-level-the-scan)
   - [3. Calibrate](#3-calibrate)
   - [4. Mark R-peaks](#4-mark-r-peaks)
   - [5. Fill in participant data](#5-fill-in-participant-data)
   - [6. Export](#6-export)
4. [Navigating the canvas](#navigating-the-canvas)
5. [Keyboard shortcuts](#keyboard-shortcuts)
6. [Toolbar reference](#toolbar-reference)
7. [File naming convention](#file-naming-convention)
8. [HRV metrics](#hrv-metrics)
9. [Export formats](#export-formats)
10. [Reviewing a past analysis](#reviewing-a-past-analysis)
11. [Image adjustments](#image-adjustments)
12. [Customising keyboard shortcuts](#customising-keyboard-shortcuts)
13. [Privacy](#privacy)
14. [Example files](#example-files)

---

## Introduction

HRVey was born out of frustration with traditional tools. A 10-second ECG is a valuable
addition of data, but measuring it was cumbersome and, just as importantly, not repeatable:
once an analysis was done there was no straightforward way to check it. HRVey makes the
measurement quick and keeps the original scan together with your markings, so any analysis
can be reopened and verified later.

---

## Quick start

1. Go to **https://danzavada.github.io/HRVey/**
2. Open a 10-second ECG PDF (drag & drop or **Open PDF**)
3. **Level** → click two points on the same horizontal gridline
4. **Calibrate** → click two points, enter the number of large squares between them
5. **Mark** → click every R-peak
6. Fill in Subject ID, Date, Time on the right
7. **Export .xlsx** → done

---

## Step-by-step workflow

### 1. Open a PDF

| Method | How |
|---|---|
| Button | Click **Open PDF** in the toolbar |
| Drag & drop | Drop a `.pdf` onto the canvas |
| Keyboard | Press **Ctrl+O** |
| Click canvas | Click the grey canvas area when no file is loaded |

Only `.pdf` files are accepted. The scan is rendered locally — nothing is sent to a server.

---

### 2. Level the scan

Real-world ECG prints are rarely perfectly horizontal. Levelling corrects for a skewed scan before you calibrate and mark peaks, making the time axis accurate.

1. Press **L** (or click **Level** in the toolbar) to enter Level mode.
2. Click one point on a horizontal gridline, then a second point on the **same** gridline further along.
3. HRVey rotates the image so those two points lie on a true horizontal. The status bar shows the applied angle.

> **Tip**: choose widely-spaced points — the longer the baseline, the more precise the correction.

You can re-level at any time; re-levelling clears calibration and peaks (undo is available).

---

### 3. Calibrate

Calibration converts pixels to milliseconds. Without it HRVey cannot compute RR intervals.

1. Press **C** (or click **Calibrate**) to enter Calibrate mode.
2. Click one point, then a second point further along a horizontal gridline.
3. A dialog asks **how many large squares** are between your two clicks. Enter the number and confirm.

HRVey derives milliseconds per pixel from the grid spacing and the current paper speed setting:

| Paper speed | 1 large square |
|---|---|
| 25 mm/s (default) | 200 ms |
| 50 mm/s | 100 ms |
| 12.5 mm/s | 400 ms |

The calibration value (px/ms) is shown in the left panel and saved in the exported workbook.

> If the paper speed on the print differs from the selector, change **Paper speed** in the right panel **before** calibrating.

---

### 4. Mark R-peaks

1. Press **M** (or click **Mark**) to enter Mark mode.
2. Click the tip of each R-peak (the tall sharp upward deflection).  
   A blue dot and vertical line mark each click.
3. Click anywhere on or very close to an existing marker to **select** it (it turns orange). You can select multiple peaks by clicking them one by one.
4. **Remove a peak** with one of:
   - Right-click on (or near) the peak
   - Select it, then press **Delete** or **Backspace**

RR intervals and HRV metrics update live in the left panel as you add or remove peaks.

> **Undo/redo** (Ctrl+Z / Ctrl+Y) works for every peak addition and removal, up to 120 steps.

---

### 5. Fill in participant data

The right panel contains three required fields:

| Field | Format | Example |
|---|---|---|
| Subject ID | Free text | `ID001` |
| Date | DD/MM/YYYY | `16/06/2026` |
| Time | HH:MM | `14:30` |

These are written into the exported workbook and used to name the exported PDF (see [File naming convention](#file-naming-convention)).

If you name your PDF files according to the naming convention, these fields are filled in automatically when the file is opened.

---

### 6. Export

Click **Export .xlsx** to save an Excel workbook containing:

- A **Results** sheet with HR, SDNN, RMSSD, mean RR, peak count, and all participant fields
- A **Peaks** sheet with every marked peak position and the RR interval to the next peak

The export button is enabled as soon as at least two peaks are marked (one RR interval).

---

## Navigating the canvas

| Action | How |
|---|---|
| Pan | Click and drag on the canvas in **Select** mode (or middle-click drag in any mode) |
| Zoom in / out | Scroll wheel (mouse) or pinch (trackpad / touchscreen) |
| Zoom to fit | Press **Z** (toggles between fit-to-window and a configurable zoom level) |
| Fit to screen | Click **Fit to screen** in the toolbar |
| Zoom level badge | Displayed in the bottom-left corner; click it to reset to fit |

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| **S** | Select mode |
| **L** | Level mode |
| **C** | Calibrate mode |
| **M** | Mark mode |
| **Z** | Zoom in / Fit to window (toggle) |
| **Ctrl+O** | Open PDF |
| **Ctrl+Z** | Undo |
| **Ctrl+Y** | Redo |
| **Delete / Backspace** | Remove selected peak(s) |

All mode keys (S, L, C, M, Z) are fully customisable — see [Customising keyboard shortcuts](#customising-keyboard-shortcuts).

---

## Toolbar reference

| Button | What it does |
|---|---|
| **Open PDF** | Open a new ECG file |
| **Close PDF** | Unload the current file and return to the start screen |
| **Rotate 90°** | Rotate the scan by 90° (useful for landscape scans stored portrait) |
| **Select** / **Level** / **Calibrate** / **Mark** | Switch interaction modes |
| **Fit to screen** | Zoom and pan so the whole scan is visible |
| **Clear calibration** | Remove the calibration (peaks remain; RR intervals become undefined) |
| **Clear peaks** | Remove all marked R-peaks |
| **Reset** | Clear calibration, peaks, and level in one step |
| **Load analysis** | Reload a previously exported `.xlsx` to restore all markings |
| **Export .xlsx** | Save an Excel workbook with results and peak data |
| **Export PDF** | Save the opened PDF renamed to match the participant fields (requires Subject ID, Date, and Time to be filled in) |

---

## File naming convention

HRVey can auto-fill the participant panel from the PDF filename. Use this pattern:

```
<subject>_YYYY_MM_DD_HH_MM.pdf
```

**Example**: `ID123_2026_06_16_14_30.pdf`

| Field | Parsed value |
|---|---|
| Subject ID | `ID123` |
| Date | `16/06/2026` |
| Time | `14:30` |

Notes:

- Everything before the date segment is used as the Subject ID (underscores included).
- The date is displayed as `DD/MM/YYYY`; the time as `HH:MM`.
- If the filename does not match the pattern, the three fields are left blank.
- The source filename and the analysis filename are written into every exported workbook, so each record stays traceable.

The **Export PDF** button produces a file named using the inverse of this pattern, derived from whatever you have filled in the participant fields — useful for uniformly renaming scans that arrived with arbitrary names.

---

## HRV metrics

All metrics are computed from the RR intervals (beat-to-beat intervals in ms) derived from your marked R-peaks.

| Metric | Formula | Meaning |
|---|---|---|
| **HR** | 60 000 / mean RR | Heart rate in beats per minute |
| **Mean RR** | Arithmetic mean of all RR intervals | Average beat-to-beat interval in ms |
| **RMSSD** | √(mean of squared successive differences) | Reflects short-term HRV; primary vagal index |
| **SDNN** | Standard deviation of all RR intervals | Overall HRV; reflects total autonomic modulation |

All values update live while you add or move peaks. They are shown in the left panel and written to the Results sheet on export.

---

## Export formats

### Excel workbook (`.xlsx`)

The workbook contains two sheets:

**Results** — one row of scalar values:

| Column | Value |
|---|---|
| ECG filename | `ID001_2026_06_16_14_30.pdf` |
| ECG analysis filename | `ID001_2026_06_16_14_30.xlsx` |
| ECG date | from participant fields |
| ECG time | from participant fields |
| Heart rate | bpm (1 decimal) |
| SDNN | ms (1 decimal) |
| RMSSD | ms (1 decimal) |
| subject_id | from participant fields |
| paper_speed_mm_s | mm/s |
| mean_rr | ms (1 decimal) |
| n_peaks | count of marked R-peaks |
| n_intervals | count of RR intervals (n_peaks − 1) |

**Peaks** — one row per R-peak with position and RR interval to the next peak.

**Settings** — internal calibration data used when loading the analysis back.

### PDF export

**Export PDF** saves a copy of the original scan with its name derived from the participant fields (`Subject_YYYY_MM_DD_HH_MM.pdf`). This is useful when the original scan had an arbitrary name and you want a consistently named archive. All three participant fields must be filled before the button is enabled.

---

## Reviewing a past analysis

1. Open the **original PDF** (the same scan used for the initial analysis).
2. Click **Load analysis** and choose the exported `.xlsx`.
3. The level angle, calibration, and all R-peak positions are restored exactly over the scan.
4. You can re-check any peak, add or remove peaks, and re-export.

> The analysis file contains internal pixel coordinates, so the same PDF must be used — a different scan of the same strip will not align.

---

## Image adjustments

If a scan is too faint or too dark, click the **◐** button in the bottom-right corner of the canvas to open the adjustment panel.

| Slider | Effect |
|---|---|
| Contrast | Increases or decreases tonal range |
| Brightness | Lightens or darkens the image |

Click **Reset** in the panel to return to the original rendering. Adjustments are cosmetic only — they do not affect the pixel coordinates of your markings.

---

## Customising keyboard shortcuts

Right-click any mode button (**Select**, **Level**, **Calibrate**, **Mark**, **Fit to screen**) to open the shortcut editor for that action. Press the new key you want to assign, then click **Save**. If the key is already taken, a warning highlights the clash.

Shortcuts are saved in `localStorage` and persist across sessions in the same browser.

The default assignments are:

| Action | Default key |
|---|---|
| Select | S |
| Level | L |
| Calibrate | C |
| Mark | M |
| Zoom / Fit | Z |

The zoom editor also lets you set the **zoom target** — the percentage of fit-to-window that the zoom key jumps to (default 800 %, which fills the canvas vertically with one or two beats).

---

## Privacy

All processing happens locally in your browser. ECG files are never uploaded or transmitted anywhere. No account, no server, no telemetry.

HRVey can be installed as a Progressive Web App (PWA) — look for the install prompt in your browser's address bar — and works fully offline once installed.

---

## Example files

The `EXAMPLE/` folder in this repository contains:

| File | Description |
|---|---|
| `ID001_ecg_2016_10_16_10_30.pdf` | A sample 10-second ECG scan (filename follows the naming convention) |
| `ID001_ecg_2016_10_16_10_30.xlsx` | The corresponding exported analysis (load it via **Load analysis**) |
| `SCANNED_PDF01.pdf` | A scan without a structured filename (manually fill in participant fields) |

Open either PDF in HRVey to follow the tutorial; load the `.xlsx` to see a completed analysis restored over the scan.

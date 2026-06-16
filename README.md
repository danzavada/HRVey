# HRVey

HRV analysis for scanned 10-second ECG PDFs. Runs entirely in your browser, nothing uploaded.

Hosted version: https://danzavada.github.io/HRVey/

## Introduction

HRVey was born out of frustration with traditional tools. A 10-second ECG is a valuable
addition of data, but measuring it was cumbersome and, just as importantly, not repeatable:
once an analysis was done there was no straightforward way to check it. HRVey makes the
measurement quick and keeps the original scan together with your markings, so any analysis
can be reopened and verified later.

## Use

1. **Open** a 10-second ECG PDF
2. **Level**: click two points along a horizontal gridline to straighten the scan
3. **Calibrate**: click two points, then choose how many large squares apart they are
4. **Mark**: click each R-peak (right-click or Delete to remove)
5. **Export**: read HR / RMSSD / SDNN and save an Excel file

Fill in the participant details on the right.

## Naming

HRVey can fill in the participant details automatically from the PDF filename. Name your file
using this pattern (parts separated by underscores):

```
<subject>_YYYY_MM_DD_HH_MM.pdf
```

For example `ID123_2026_06_16_14_30.pdf` is read as:

| Field   | Value                |
|---------|----------------------|
| Subject | `ID123`              |
| Date    | `16/06/2026`         |
| Time    | `14:30`              |

Notes:

- The whole prefix before the date is used as the Subject.
- The date is shown as `DD/MM/YYYY` and the time as `HH:MM`.
- If the filename doesn't match this pattern, the Subject / Date / Time fields are left blank
  for you to fill in by hand.

The filename (and the resulting analysis filename) are also written into the exported workbook,
so each record stays traceable back to its source scan.

## Review a past analysis

Open the original PDF, then **Load analysis** and choose the exported `.xlsx`. Your level,
calibration and R-peaks are restored over the scan, so you can re-check or continue the measurement.

## Privacy

All processing happens locally in your browser. ECG files never leave your device.

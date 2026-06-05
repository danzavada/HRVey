# HRVey

HRV analysis for scanned 10-second ECG PDFs. Runs entirely in your browser, nothing uploaded.

Hosted version: https://danielzavada.cz/hrvey

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

## Review a past analysis

Open the original PDF, then **Load analysis** and choose the exported `.xlsx`. Your level,
calibration and R-peaks are restored over the scan, so you can re-check or continue the measurement.

## Run

Use the hosted version above, open `index.html` directly, or serve the folder to install it as an offline app:

```sh
python -m http.server 8000   # then open http://localhost:8000
```

## Privacy

All processing happens locally in your browser. ECG files never leave your device.

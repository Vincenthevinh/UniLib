# Weekly status reports

## PA1 — 15–21 October 2026

- Course-template report: [Filled Week 03 Word report](W03-status.docx), based on the user-supplied root `W03-status.docx`. Its six tables cover report information, task status, next-week plans, risks, meeting minutes and metrics. Daily Google Meet discussions at 21:00 ICT for approximately one hour are included.
- Source: [PA1 weekly report](PA1-Weekly-Report-2026-10-21.tex)
- PDF: [Compiled report](PA1-Weekly-Report-2026-10-21.pdf)
- Evidence cutoff: `main` at `0a1ed17` (21 October 2026).
- Course-week label: Week 3 from PA0 and the PA1 task plan; the revised schedule uses Week 1 for PA1. The report uses explicit dates to distinguish these conventions.
- The Word report follows the course template supplied after the initial LaTeX report. The initial LaTeX/PDF remains available as a supplementary report. Team review is pending; unverified percentages and individual daily attendance have not been invented.

Compile the UTF-8 source using **XeLaTeX**, twice, or **Tectonic**:

```sh
xelatex -interaction=nonstopmode -halt-on-error PA1-Weekly-Report-2026-10-21.tex
xelatex -interaction=nonstopmode -halt-on-error PA1-Weekly-Report-2026-10-21.tex
# Alternative
tectonic PA1-Weekly-Report-2026-10-21.tex
```

For Overleaf, upload the `.tex` file, choose XeLaTeX and set it as the main document. Fonts fall back to TeX Gyre when Windows fonts are unavailable. No external images or bibliography files are needed.

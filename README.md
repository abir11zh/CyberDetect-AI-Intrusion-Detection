# CyberDetect AI — Intrusion Detection Dashboard

CyberDetect is a prototype project for exploring AI-assisted network intrusion detection. It combines a browser-based dashboard with Jupyter notebooks for data exploration, feature preparation, visualization, and machine learning experiments.

> **Project status:** This is a prototype and educational project. The dashboard includes demonstration interfaces and visualizations; do not treat its output as a production security alert or use it as a substitute for validated monitoring tools.

## Project contents

- **`cyberdetect-site/`** — static dashboard pages, styles, and JavaScript:
  - `index.html` — project overview
  - `prediction.html` — prediction interface
  - `visualization.html` — charts and visualizations
- **`projet python/`** — Jupyter notebooks for intrusion data exploration, feature preparation, and ML/DL experiments.
- **`projet python/ML DL/lstm_model.keras`** — saved LSTM model artifact.

Large generated scan data, benign datasets, and raw packet captures are excluded from this repository. Notebooks that load local data may need their input paths adjusted to your environment.

## View the dashboard

The dashboard is static HTML, CSS, and JavaScript. Open `cyberdetect-site/index.html` in a browser, or serve the repository root locally:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000/cyberdetect-site/](http://localhost:8000/cyberdetect-site/).

## Notebooks

Open the notebooks in `projet python/` with Jupyter Notebook or JupyterLab. Install the Python packages required by a notebook before running it; dependencies may vary between experiments. The notebooks can reference datasets stored locally, which are not distributed here.

## Repository layout

```text
.
├── cyberdetect-site/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── prediction.html
│   └── visualization.html
└── projet python/
    ├── ML DL/
    ├── explor nett feature/
    └── visual$/
```

## Responsible use

Only analyze network data you own or are authorized to inspect. Validate model behavior and data quality before drawing conclusions; this prototype has not been presented as production-ready security software.

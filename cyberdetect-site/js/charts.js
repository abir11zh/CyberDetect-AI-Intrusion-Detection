/**
 * CyberDetect AI — charts.js
 * Renders 3 interactive Chart.js visualizations:
 *   1. Line chart  → Network traffic over time
 *   2. Pie chart   → Attack type distribution
 *   3. Bar chart   → Traffic size distribution (histogram)
 */

// ── Palette ────────────────────────────────────
const PRIMARY = '#2563EB';
const ACCENT = '#06B6D4';
const SECONDARY = '#1E293B';
const COLORS = [
  '#2563EB', '#06B6D4', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#f97316'
];

// ── Global Chart.js defaults ───────────────────
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#64748B';

// ── 1. Network Traffic Line Chart ─────────────
(function buildLineChart() {
  const ctx = document.getElementById('lineChart');
  if (!ctx) return;

  // Simulate 24 hours of traffic (hourly)
  const labels = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, '0');
    return `${h}:00`;
  });

  const normalTraffic = [
    420, 380, 310, 290, 260, 300, 480, 620,
    740, 810, 860, 900, 870, 820, 790, 830,
    780, 810, 760, 720, 680, 600, 540, 470
  ];

  const attackTraffic = [
    10, 5, 8, 3, 12, 7, 25, 18,
    32, 45, 28, 1250, 680, 42, 30, 22,
    18, 35, 28, 15, 20, 12, 9, 7
  ];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Normal Traffic (packets/s)',
          data: normalTraffic,
          borderColor: PRIMARY,
          backgroundColor: 'rgba(37,99,235,.08)',
          fill: true,
          tension: 0.45,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: PRIMARY,
          borderWidth: 2.5,
        },
        {
          label: 'Attack Traffic (packets/s)',
          data: attackTraffic,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,.06)',
          fill: true,
          tension: 0.45,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#ef4444',
          borderWidth: 2.5,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: { usePointStyle: true, padding: 16, font: { size: 12, weight: '600' } }
        },
        tooltip: {
          backgroundColor: SECONDARY,
          titleFont: { size: 12, weight: '700' },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8,
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,.04)' },
          ticks: { maxTicksLimit: 12, font: { size: 11 } }
        },
        y: {
          grid: { color: 'rgba(0,0,0,.04)' },
          ticks: { font: { size: 11 } },
          title: { display: true, text: 'Packets / second', font: { size: 11 } }
        }
      }
    }
  });
})();


// ── 2. Attack Type Pie Chart ───────────────────
(function buildPieChart() {
  const ctx = document.getElementById('pieChart');
  if (!ctx) return;

  const labels = [
    'DDoS', 'Port Scan', 'Brute Force',
    'SQL Injection', 'Reconnaissance',
    'Man-in-the-Middle', 'Normal'
  ];
  const data = [28, 18, 14, 11, 9, 6, 14];

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: COLORS,
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 10,
      }]
    },
    options: {
      responsive: true,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true, padding: 14,
            font: { size: 11, weight: '600' },
            generateLabels: chart => {
              const ds = chart.data.datasets[0];
              return chart.data.labels.map((label, i) => ({
                text: `${label} (${ds.data[i]}%)`,
                fillStyle: ds.backgroundColor[i],
                strokeStyle: '#fff',
                lineWidth: 2,
                pointStyle: 'circle',
                index: i
              }));
            }
          }
        },
        tooltip: {
          backgroundColor: SECONDARY,
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed}% of events`
          },
          padding: 12, cornerRadius: 8,
        }
      }
    }
  });
})();


// ── 3. Packet Size Histogram (Bar) ────────────
(function buildHistogram() {
  const ctx = document.getElementById('histogramChart');
  if (!ctx) return;

  const bins = [
    '0–64', '64–128', '128–256', '256–512',
    '512–1024', '1024–1500', '>1500'
  ];
  const counts = [1240, 3580, 4920, 3210, 2100, 890, 340];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: bins,
      datasets: [{
        label: 'Number of Packets',
        data: counts,
        backgroundColor: bins.map((_, i) =>
          i === 2 ? PRIMARY : `rgba(37,99,235,${0.3 + i * 0.08})`
        ),
        borderColor: PRIMARY,
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: ACCENT,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: SECONDARY,
          callbacks: {
            title: items => `Packet Size: ${items[0].label} bytes`,
            label: item => ` Count: ${item.parsed.y.toLocaleString()} packets`
          },
          padding: 12, cornerRadius: 8,
        }
      },
      scales: {
        x: {
          grid: { display: false },
          title: { display: true, text: 'Packet Size (bytes)', font: { size: 11 } }
        },
        y: {
          grid: { color: 'rgba(0,0,0,.04)' },
          title: { display: true, text: 'Number of Packets', font: { size: 11 } },
          ticks: { callback: v => v.toLocaleString() }
        }
      }
    }
  });
})();

// ── 4. Feature Separation Scatter Plot ────────────
(function buildFeatureScatter() {
  const ctx = document.getElementById('scatterChart');
  if (!ctx) return;

  const normalData = Array.from({ length: 80 }, () => ({
    x: Math.random() * 10,
    y: Math.random() * 2
  }));

  const attackData = Array.from({ length: 40 }, () => ({
    x: Math.random() * 10,
    y: Math.random() * 2 + 0.5
  }));

  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Normal',
          data: normalData,
          backgroundColor: 'rgba(37,99,235,0.7)',
          borderColor: PRIMARY,
          borderWidth: 1,
          pointRadius: 5,
          pointHoverRadius: 7
        },
        {
          label: 'Attaque',
          data: attackData,
          backgroundColor: 'rgba(239,68,68,0.7)',
          borderColor: '#ef4444',
          borderWidth: 1,
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { usePointStyle: true, font: { size: 12, weight: '600' } }
        },
        tooltip: {
          backgroundColor: SECONDARY,
          padding: 12, cornerRadius: 8
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Valeur brute du message', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,.04)' }
        },
        y: {
          title: { display: true, text: 'Moyenne glissante (Feature)', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,.04)' }
        }
      }
    }
  });
})();

// ── 5. LSTM Anomaly Detection (Line + Threshold) ────────────
(function buildLstmErrorChart() {
  const ctx = document.getElementById('lstmErrorChart');
  if (!ctx) return;

  const labels = Array.from({ length: 100 }, (_, i) => i * 10);
  const mseErrors = labels.map(x => {
    if (x >= 800 && x <= 850) return 0.5 + Math.random() * 0.3; // Attack simulation
    if (x === 300) return 1.05; // Peak anomaly
    return Math.random() * 0.25;
  });

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Erreur de prédiction',
          data: mseErrors,
          borderColor: PRIMARY,
          backgroundColor: 'rgba(37,99,235,0.1)',
          fill: false,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2
        },
        {
          label: "Seuil d'alerte (Threshold)",
          data: Array(100).fill(0.4),
          borderColor: '#ef4444',
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          fill: {
            target: 0,
            below: 'rgba(239,68,68,0.3)',
            above: 'transparent'
          }
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { usePointStyle: true, font: { size: 12, weight: '600' } }
        },
        tooltip: {
          backgroundColor: SECONDARY,
          padding: 12, cornerRadius: 8,
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Index temporel', font: { size: 11 } },
          ticks: { maxTicksLimit: 12 },
          grid: { display: false }
        },
        y: {
          title: { display: true, text: "Score d'erreur (MSE)", font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,.04)' },
          beginAtZero: true
        }
      }
    }
  });
})();

// ── 6. Grouped Bar Chart — Model Comparison ────────────
(function buildModelComparisonChart() {
  const ctx = document.getElementById('modelComparisonChart');
  if (!ctx) return;

  const labels = ['XGBoost', 'MLP Optimisé', 'Isolation Forest'];

  // Data from notebooks
  const recallData = [0.90, 0.6785, 0.25];
  const accuracyData = [0.90, 0.9110, 0.75];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Taux de Détection (Recall)',
          data: recallData,
          backgroundColor: '#ef4444',
          borderRadius: 4,
          borderWidth: 0,
        },
        {
          label: 'Précision Globale (Accuracy)',
          data: accuracyData,
          backgroundColor: PRIMARY,
          borderRadius: 4,
          borderWidth: 0,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: { size: 13, weight: '500' }
          }
        },
        tooltip: {
          backgroundColor: SECONDARY,
          titleFont: { size: 13, weight: '600' },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 6,
          mode: 'index',
          intersect: false
        },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              yMin: 0.90,
              yMax: 0.90,
              borderColor: '#f59e0b',
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                content: 'Seuil de Sécurité (0.90)',
                enabled: true,
                position: 'start'
              }
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 12, weight: '500' }, color: '#475569' }
        },
        y: {
          grid: { color: 'rgba(0,0,0,.04)', drawBorder: false },
          border: { display: false },
          ticks: {
            font: { size: 12 },
            color: '#64748B',
            padding: 10,
            min: 0,
            max: 1.0,
            stepSize: 0.2
          }
        }
      }
    }
  });
})();

// ── 7. Radar Chart — Model Performance Comparison ────────────
(function buildRadarChart() {
  const ctx = document.getElementById('modelRadarChart');
  if (!ctx) return;

  const labels = ['Accuracy', 'Recall', 'Precision', 'F1-Score'];

  // Data matching the notebooks findings
  const xgboostData = [0.90, 0.90, 0.94, 0.92];
  const lstmData = [0.89, 0.95, 0.88, 0.91];

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'XGBoost',
          data: xgboostData,
          backgroundColor: 'rgba(37,99,235,0.2)',
          borderColor: PRIMARY,
          pointBackgroundColor: PRIMARY,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: PRIMARY,
          borderWidth: 2
        },
        {
          label: 'LSTM',
          data: lstmData,
          backgroundColor: 'rgba(16,185,129,0.2)',
          borderColor: '#10b981',
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#10b981',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          angleLines: { color: 'rgba(0,0,0,.04)' },
          grid: { color: 'rgba(0,0,0,.04)' },
          pointLabels: { font: { size: 12, weight: '500' }, color: '#475569' },
          ticks: { display: false, min: 0, max: 1 }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { usePointStyle: true, font: { size: 12, weight: '600' } }
        },
        tooltip: {
          backgroundColor: SECONDARY,
          padding: 12, cornerRadius: 8
        }
      }
    }
  });
})();

// ── 8. Horizontal Bar — Top Targeted Topics ────────────
(function buildTargetedTopicsChart() {
  const ctx = document.getElementById('targetedTopicsChart');
  if (!ctx) return;

  const topics = [
    'mqtt/sensors/temp',
    'system/status',
    'auth/login',
    'device/config',
    'telemetry/data'
  ];
  const attackCounts = [420, 310, 250, 180, 95];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: topics,
      datasets: [{
        label: 'Attacks Targeting Topic',
        data: attackCounts,
        backgroundColor: 'rgba(6,182,212,0.8)',
        borderRadius: 4,
        barPercentage: 0.6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: SECONDARY,
          padding: 12, cornerRadius: 8
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Number of Attacks', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,.04)' }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        }
      }
    }
  });
})();

// ── 9. Histogram — Message Value Analysis ────────────
(function buildMessageValueChart() {
  const ctx = document.getElementById('messageValueChart');
  if (!ctx) return;

  const bins = ['0.0-0.2', '0.2-0.4', '0.4-0.6', '0.6-0.8', '0.8-1.0'];
  const normalCounts = [800, 450, 300, 150, 50];
  const attackCounts = [50, 100, 250, 600, 1200];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: bins,
      datasets: [
        {
          label: 'Normal Messages',
          data: normalCounts,
          backgroundColor: 'rgba(37,99,235,0.7)',
          borderRadius: { topLeft: 4, topRight: 4 },
          barPercentage: 0.9,
          categoryPercentage: 0.8
        },
        {
          label: 'Attack Messages',
          data: attackCounts,
          backgroundColor: 'rgba(239,68,68,0.7)',
          borderRadius: { topLeft: 4, topRight: 4 },
          barPercentage: 0.9,
          categoryPercentage: 0.8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { usePointStyle: true, font: { size: 12, weight: '600' } }
        },
        tooltip: {
          backgroundColor: SECONDARY,
          mode: 'index',
          intersect: false,
          padding: 12, cornerRadius: 8
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Normalized Message Value', font: { size: 11 } },
          grid: { display: false },
          stacked: true
        },
        y: {
          title: { display: true, text: 'Frequency', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,.04)' },
          stacked: true
        }
      }
    }
  });
})();

// ── 10. Density Plot — Confidence Score Distribution ────────────
(function buildConfidenceScoreChart() {
  const ctx = document.getElementById('confidenceScoreChart');
  if (!ctx) return;

  // Simulating density plot with a line chart across bins of probabilities
  const labels = ['0.0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0'];
  const xgboostConfidence = [5, 10, 15, 20, 30, 40, 60, 120, 250, 400, 650];
  const lstmConfidence = [10, 20, 40, 80, 150, 200, 250, 300, 350, 400, 500];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'XGBoost Confidence',
          data: xgboostConfidence,
          borderColor: PRIMARY,
          backgroundColor: 'rgba(37,99,235,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2
        },
        {
          label: 'LSTM Confidence',
          data: lstmConfidence,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { usePointStyle: true, font: { size: 12, weight: '600' } }
        },
        tooltip: {
          backgroundColor: SECONDARY,
          mode: 'index',
          intersect: false,
          padding: 12, cornerRadius: 8
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Prediction Probability', font: { size: 11 } },
          grid: { display: false }
        },
        y: {
          title: { display: true, text: 'Density Volume', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,.04)' },
          ticks: { display: false }
        }
      }
    }
  });
})();

// ── 11. Line Chart — Prediction Latency ────────────
(function buildPredictionLatencyChart() {
  const ctx = document.getElementById('predictionLatencyChart');
  if (!ctx) return;

  const labels = Array.from({ length: 50 }, (_, i) => `Evt ${i * 10}`);

  // Baseline ~20ms, spikes to ~80ms 
  const latencyData = labels.map(x => {
    const base = 15 + Math.random() * 10;
    if (Math.random() > 0.95) return base + 50 + Math.random() * 30; // Spike
    return base;
  });

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Latency (ms) per Event Batch',
          data: latencyData,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,0.1)',
          fill: true,
          tension: 0.2,
          pointRadius: 2,
          pointHoverRadius: 5,
          borderWidth: 2
        },
        {
          label: "Critical Threshold (50ms)",
          data: Array(50).fill(50),
          borderColor: '#ef4444',
          borderDash: [5, 5],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { usePointStyle: true, font: { size: 12, weight: '600' } }
        },
        tooltip: {
          backgroundColor: SECONDARY,
          padding: 12, cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 10, font: { size: 11 } }
        },
        y: {
          title: { display: true, text: 'Latency (ms)', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,.04)' },
          beginAtZero: true
        }
      }
    }
  });
})();

// ── 12. Line Chart — ROC Curve ────────────
(function buildROCCurveChart() {
  const ctx = document.getElementById('rocCurveChart');
  if (!ctx) return;

  // Simple simulated ROC points
  const fpr = [0, 0.02, 0.05, 0.1, 0.2, 0.5, 1];
  const tprXGB = [0, 0.85, 0.92, 0.96, 0.98, 0.99, 1];
  const tprLSTM = [0, 0.70, 0.85, 0.90, 0.94, 0.97, 1];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: fpr,
      datasets: [
        {
          label: 'XGBoost (AUC = 0.98)',
          data: tprXGB,
          borderColor: PRIMARY,
          backgroundColor: 'transparent',
          pointRadius: 3,
          borderWidth: 2,
          tension: 0.2
        },
        {
          label: 'LSTM (AUC = 0.92)',
          data: tprLSTM,
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          pointRadius: 3,
          borderWidth: 2,
          tension: 0.2
        },
        {
          label: 'Random Model',
          data: fpr,
          borderColor: '#94a3b8',
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 1.5,
          tension: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, font: { size: 12, weight: '600' } } },
        tooltip: { backgroundColor: SECONDARY, padding: 12, cornerRadius: 8 }
      },
      scales: {
        x: {
          title: { display: true, text: 'False Positive Rate (FPR)', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,.04)' },
          type: 'linear', min: 0, max: 1
        },
        y: {
          title: { display: true, text: 'True Positive Rate (TPR)', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,.04)' },
          min: 0, max: 1
        }
      }
    }
  });
})();

// ── 13. Line Chart — Precision-Recall ────────────
(function buildPRCurveChart() {
  const ctx = document.getElementById('prCurveChart');
  if (!ctx) return;

  const recall = [0, 0.2, 0.4, 0.6, 0.8, 0.9, 0.95, 1];
  const precisionXGB = [1, 0.99, 0.98, 0.97, 0.96, 0.94, 0.88, 0.7];
  const precisionLSTM = [1, 0.97, 0.95, 0.92, 0.89, 0.82, 0.75, 0.5];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: recall,
      datasets: [
        {
          label: 'XGBoost PR',
          data: precisionXGB,
          borderColor: PRIMARY,
          backgroundColor: 'transparent',
          pointRadius: 3,
          borderWidth: 2,
          tension: 0.2
        },
        {
          label: 'LSTM PR',
          data: precisionLSTM,
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          pointRadius: 3,
          borderWidth: 2,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, font: { size: 12, weight: '600' } } },
        tooltip: { backgroundColor: SECONDARY, padding: 12, cornerRadius: 8 }
      },
      scales: {
        x: {
          title: { display: true, text: 'Recall', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,.04)' },
          type: 'linear', min: 0, max: 1
        },
        y: {
          title: { display: true, text: 'Precision', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,.04)' },
          min: 0, max: 1
        }
      }
    }
  });
})();

// ── 14. Matrix — (XGBoost) ────────────
(function buildConfusionMatrixChart() {
  const ctx = document.getElementById('confusionMatrixChart');
  if (!ctx) return;

  // Normalized values (Final XGBoost Results)
  const matrixData = [
    { x: 'Normal', y: 'Normal', v: 0.98 },
    { x: 'Attack', y: 'Normal', v: 0.02 },
    { x: 'Normal', y: 'Attack', v: 0.04 },
    { x: 'Attack', y: 'Attack', v: 0.96 }
  ];

  new Chart(ctx, {
    type: 'matrix',
    data: {
      datasets: [{
        label: 'Confusion Matrix',
        data: matrixData,
        backgroundColor(context) {
          const value = context.dataset.data[context.dataIndex]?.v;
          if (value === undefined) return 'transparent';
          // Elite Cyber-Tech Gradient: Deep Navy to Vibrant Cyan 
          const alpha = 0.1 + (value * 0.85);
          return value > 0.5
            ? `rgba(6, 182, 212, ${alpha})` // Cyan for core detections
            : `rgba(239, 68, 68, ${alpha})`; // Red for errors
        },
        borderWidth: 2,
        borderColor: '#0f172a',
        width: ({ chart }) => (chart.chartArea || {}).width / 2 - 4,
        height: ({ chart }) => (chart.chartArea || {}).height / 2 - 4,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { size: 13, weight: '700' },
          bodyFont: { size: 12 },
          padding: 12,
          displayColors: false,
          callbacks: {
            title: () => 'MATRIX_CELL_INTEL',
            label: (context) => {
              const v = context.raw;
              return [`Actual: ${v.y}`, `Predicted: ${v.x}`, `Confidence: ${(v.v * 100).toFixed(1)}%`];
            }
          }
        }
      },
      scales: {
        x: {
          type: 'category',
          labels: ['Normal', 'Attack'],
          title: { display: true, text: 'PREDICTED_LABEL', font: { family: 'JetBrains Mono, monospace', size: 10, weight: '700' }, color: '#64748b' },
          grid: { display: false },
          ticks: { color: '#475569', font: { weight: '600' } }
        },
        y: {
          type: 'category',
          labels: ['Normal', 'Attack'],
          title: { display: true, text: 'ACTUAL_LABEL', font: { family: 'JetBrains Mono, monospace', size: 10, weight: '700' }, color: '#64748b' },
          grid: { display: false },
          ticks: { color: '#475569', font: { weight: '600' } }
        }
      }
    },
    plugins: [{
      id: 'matrixLabels',
      afterDatasetsDraw(chart) {
        const { ctx, data } = chart;
        ctx.save();
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const dataset = data.datasets[0];
        for (let i = 0; i < dataset.data.length; i++) {
          const point = dataset.data[i];
          const meta = chart.getDatasetMeta(0).data[i];

          if (meta) {
            const { x, y } = meta;
            ctx.fillStyle = point.v > 0.4 ? '#ffffff' : '#64748b';
            ctx.fillText(`${(point.v * 100).toFixed(1)}%`, x, y);
          }
        }
        ctx.restore();
      }
    }]
  });
})();

// ── 15. Bar Chart — Feature Importance (XGBoost) ────────────
(function buildFeatureImportanceChart() {
  const ctx = document.getElementById('featureImportanceChart');
  if (!ctx) return;

  const features = [
    'Destination Port', 'Flow Duration', 'Total Fwd Packets',
    'Total Length of Fwd Packets', 'Fwd Packet Length Max',
    'Flow Bytes/s', 'Flow Packets/s', 'Flow IAT Mean',
    'Fwd IAT Total', 'Init_Win_bytes_forward'
  ];
  const importanceScores = [0.28, 0.15, 0.12, 0.10, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03]; // Simulated probabilities

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: features,
      datasets: [{
        label: 'Feature Selection Weight',
        data: importanceScores,
        backgroundColor: features.map((_, i) => `rgba(139,92,246,${1 - i * 0.08})`),
        borderRadius: 4,
        barPercentage: 0.7
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: SECONDARY,
          callbacks: {
            label: (ctx) => ` Weight: ${(ctx.raw * 100).toFixed(1)}%`
          },
          padding: 12, cornerRadius: 8
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Importance Weight', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,.04)' },
          max: 0.35
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 10 } }
        }
      }
    }
  });
})();

// ── 16. Polar Area — Protocol Distribution ────────────
(function buildProtocolDistributionChart() {
  const ctx = document.getElementById('protocolDistributionChart');
  if (!ctx) return;

  const labels = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'];
  const data = [4500, 2100, 850, 3200, 1500];

  new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: labels,
      datasets: [{
        label: 'Traffic Volume',
        data: data,
        backgroundColor: [
          'rgba(37, 99, 235, 0.7)',  // PRIMARY
          'rgba(6, 182, 212, 0.7)',  // ACCENT
          'rgba(239, 68, 68, 0.7)',  // Red
          'rgba(16, 185, 129, 0.7)', // Green
          'rgba(139, 92, 246, 0.7)'  // Purple
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'right',
          labels: { usePointStyle: true, padding: 16, font: { size: 11, weight: '600' } }
        },
        tooltip: {
          backgroundColor: SECONDARY,
          padding: 12, cornerRadius: 8
        }
      },
      scales: {
        r: {
          grid: { color: 'rgba(0,0,0,.04)' },
          ticks: { display: false } // Hide numbers to keep it clean
        }
      }
    }
  });
})();

// ── 17. Stacked Area — Attack Rate Over Time ────────────
(function buildAttackRateChart() {
  const ctx = document.getElementById('attackRateChart');
  if (!ctx) return;

  // Simulate weeks/days of traffic
  const labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

  const normalVolume = labels.map(() => 5000 + Math.random() * 2000);
  const attackVolume = labels.map((_, i) => {
    // Inject two simulated "Attack campaigns"
    if (i > 10 && i < 15) return 3000 + Math.random() * 1000;
    if (i > 22 && i < 25) return 4000 + Math.random() * 1500;
    return 200 + Math.random() * 300; // Baseline background scanning
  });

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Attack Traffic',
          data: attackVolume,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.5)',
          fill: true,
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: 'Normal Traffic',
          data: normalVolume,
          borderColor: PRIMARY,
          backgroundColor: 'rgba(37,99,235,0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { usePointStyle: true, font: { size: 12, weight: '600' } }
        },
        tooltip: {
          backgroundColor: SECONDARY,
          padding: 12, cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 10, font: { size: 11 } }
        },
        y: {
          stacked: true, // Key property for stacked area chart
          title: { display: true, text: 'Total Requests', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,.04)' }
        }
      }
    }
  });
})();

// ── 18. Line Chart — LSTM Training vs Validation Loss ────────────
(function buildLSTMTrainingChart() {
  const ctx = document.getElementById('lstmTrainingChart');
  if (!ctx) return;

  const epochs = Array.from({ length: 50 }, (_, i) => i + 1);
  // Simulate exponential decay with some noise
  const trainLoss = epochs.map(e => 0.5 * Math.exp(-0.1 * e) + 0.05 + Math.random() * 0.02);
  const valLoss = epochs.map(e => 0.55 * Math.exp(-0.08 * e) + 0.08 + Math.random() * 0.03);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: epochs,
      datasets: [
        {
          label: 'Training Loss',
          data: trainLoss,
          borderColor: '#ec4899',
          backgroundColor: 'transparent',
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.3
        },
        {
          label: 'Validation Loss',
          data: valLoss,
          borderColor: '#8b5cf6',
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, font: { size: 11 } } },
        tooltip: { backgroundColor: SECONDARY }
      },
      scales: {
        x: { title: { display: true, text: 'Epochs' }, grid: { display: false } },
        y: { title: { display: true, text: 'MSE Loss' }, grid: { color: 'rgba(0,0,0,.04)' } }
      }
    }
  });
})();

// ── 19. Scatter Chart — Flow Duration vs Packet Length ────────────
(function buildFlowRelChart() {
  const ctx = document.getElementById('flowRelChart');
  if (!ctx) return;

  const normalPoints = Array.from({ length: 60 }, () => ({
    x: Math.random() * 5000,
    y: Math.random() * 1500
  }));
  const attackPoints = Array.from({ length: 40 }, () => ({
    x: 4000 + Math.random() * 6000, // Longer duration
    y: 50 + Math.random() * 200     // Smaller packets (e.g., Slowloris)
  }));

  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Normal Flow',
          data: normalPoints,
          backgroundColor: 'rgba(37,99,235,0.6)',
          pointRadius: 4
        },
        {
          label: 'Attack Flow',
          data: attackPoints,
          backgroundColor: 'rgba(239,68,68,0.7)',
          pointRadius: 4,
          pointStyle: 'triangle'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { position: 'top', labels: { usePointStyle: true } } },
      scales: {
        x: { title: { display: true, text: 'Duration (ms)' }, grid: { color: 'rgba(0,0,0,.04)' } },
        y: { title: { display: true, text: 'Avg Packet Length' }, grid: { color: 'rgba(0,0,0,.04)' } }
      }
    }
  });
})();

// ── 20. Bar Chart — TCP Flags Distribution ────────────
(function buildTCPFlagsChart() {
  const ctx = document.getElementById('tcpFlagsChart');
  if (!ctx) return;

  const flags = ['SYN', 'ACK', 'FIN', 'RST', 'PSH', 'URG'];
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: flags,
      datasets: [{
        label: 'Flag Frequency',
        data: [15000, 32000, 8000, 4500, 12000, 300],
        backgroundColor: 'rgba(245,158,11,0.8)',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(0,0,0,.04)' }, title: { display: true, text: 'Count' } }
      }
    }
  });
})();

// ── 21. Horizontal Bar — Avg Pkt Size by Attack ────────────
(function buildAvgSizeAttackChart() {
  const ctx = document.getElementById('avgSizeAttackChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Heartbleed', 'DDoS', 'Brute Force', 'Port Scan', 'Infiltration'],
      datasets: [{
        label: 'Avg Packet Size (Bytes)',
        data: [2500, 1200, 450, 64, 850],
        backgroundColor: 'rgba(16,185,129,0.8)',
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(0,0,0,.04)' } },
        y: { grid: { display: false } }
      }
    }
  });
})();

// ── 22. Histogram — Flow Speed (Bytes/sec) ────────────
(function buildFlowSpeedChart() {
  const ctx = document.getElementById('flowBytesSpeedChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['0-1K', '1K-10K', '10K-50K', '50K-100K', '100K-500K', '500K+'],
      datasets: [{
        label: 'Flows',
        data: [5000, 3500, 1200, 800, 450, 150],
        backgroundColor: 'rgba(139,92,246,0.8)',
        barPercentage: 1.0,
        categoryPercentage: 1.0
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, title: { display: true, text: 'Bytes / sec' } },
        y: { grid: { color: 'rgba(0,0,0,.04)' } }
      }
    }
  });
})();

// ── 23. Bar Chart — TTL Distribution ────────────
(function buildTTLChart() {
  const ctx = document.getElementById('ttlAnalysisChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['32', '64', '128', '255'],
      datasets: [{
        label: 'Packets',
        data: [1500, 25000, 42000, 8000],
        backgroundColor: 'rgba(6,182,212,0.8)',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, title: { display: true, text: 'Time To Live (TTL)' } },
        y: { grid: { color: 'rgba(0,0,0,.04)' } }
      }
    }
  });
})();

// ── 24. Area Chart — Isolation Forest Anomaly Scores ────────────
(function buildIsolationForestChart() {
  const ctx = document.getElementById('isolationForestChart');
  if (!ctx) return;

  const labels = Array.from({ length: 60 }, (_, i) => i);
  const data = labels.map(i => {
    // Generate normal scores ~0, with occasional spikes ~1
    if (i === 15 || i === 16 || i === 45) return 0.85 + Math.random() * 0.1;
    return Math.random() * 0.2 - 0.1;
  });

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Anomaly Score',
        data: data,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.2)',
        fill: true,
        tension: 0.2,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: {
          min: -0.5, max: 1.1,
          grid: { color: 'rgba(0,0,0,.04)' },
          title: { display: true, text: 'Score (-1 to 1)' }
        }
      }
    }
  });
})();

// ── 25. Doughnut — Fwd vs Backward Flow ────────────
(function buildFwdBwdChart() {
  const ctx = document.getElementById('fwdBwdChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Forward Pkts (Sent)', 'Backward Pkts (Rcvd)'],
      datasets: [{
        data: [75, 25],
        backgroundColor: ['rgba(239,68,68,0.8)', 'rgba(37,99,235,0.8)'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      cutout: '70%',
      plugins: { legend: { position: 'bottom' } }
    }
  });
})();

// ── 26. Pie Chart — Port Scan Target Vectors ────────────
(function buildPortScanTargetChart() {
  const ctx = document.getElementById('portScanPieChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Port 80 (HTTP)', 'Port 22 (SSH)', 'Port 443 (HTTPS)', 'Port 21 (FTP)', 'Other'],
      datasets: [{
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          'rgba(37,99,235,0.8)',
          'rgba(245,158,11,0.8)',
          'rgba(16,185,129,0.8)',
          'rgba(139,92,246,0.8)',
          'rgba(148,163,184,0.8)'
        ],
        borderWidth: 2, borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'right', labels: { usePointStyle: true, font: { size: 10 } } } }
    }
  });
})();
// ── 27. Matrix — Feature Correlation Matrix ────────────
(function buildCorrelationMatrixChart() {
  const ctx = document.getElementById('correlationMatrixChart');
  if (!ctx) return;

  const features = ['Msg Value', 'Traffic', 'Mean Value', 'Topic', 'App', 'Attack'];

  // Real correlation values calculated from test_ready.csv
  const rawData = [
    [1.00, 0.77, 0.63, 0.19, 0.22, 0.09], // Msg Value
    [0.77, 1.00, 0.57, -0.23, -0.20, 0.05], // Traffic
    [0.63, 0.57, 1.00, 0.32, 0.35, 0.04], // Mean Value
    [0.19, -0.23, 0.32, 1.00, 0.99, 0.02], // Topic
    [0.22, -0.20, 0.35, 0.99, 1.00, 0.02], // App
    [0.09, 0.05, 0.04, 0.02, 0.02, 1.00]  // Attack
  ];

  const matrixData = [];
  for (let y = 0; y < features.length; y++) {
    for (let x = 0; x < features.length; x++) {
      matrixData.push({ x: features[x], y: features[y], v: rawData[y][x] });
    }
  }

  new Chart(ctx, {
    type: 'matrix',
    data: {
      datasets: [{
        label: 'Correlation Matrix',
        data: matrixData,
        backgroundColor(context) {
          const value = context.dataset.data[context.dataIndex]?.v;
          if (value === undefined) return 'transparent';

          // Cyberdivergent scale: Navy (negative) -> Cyber Blue (neutral) -> Vibrant Cyan (positive)
          if (value >= 0) {
            const alpha = 0.2 + (value * 0.8);
            return `rgba(0, 255, 255, ${alpha})`; // Positive: Vibrant Cyan
          } else {
            const alpha = 0.2 + (Math.abs(value) * 0.8);
            return `rgba(10, 25, 47, ${alpha})`; // Negative: Deep Navy
          }
        },
        borderWidth: 1,
        borderColor: '#0f172a',
        width: ({ chart }) => (chart.chartArea || {}).width / features.length - 2,
        height: ({ chart }) => (chart.chartArea || {}).height / features.length - 2,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { size: 12, weight: '700' },
          bodyFont: { size: 11 },
          padding: 10,
          displayColors: false,
          callbacks: {
            title: (items) => `CORR_ANALYSIS: ${items[0].raw.y} / ${items[0].raw.x}`,
            label: (context) => `Coefficient: ${context.raw.v.toFixed(3)}`
          }
        }
      },
      scales: {
        x: {
          type: 'category',
          labels: features,
          ticks: { color: '#64748b', font: { size: 10, weight: '600' }, maxRotation: 45, minRotation: 45 },
          grid: { display: false }
        },
        y: {
          type: 'category',
          labels: features,
          ticks: { color: '#64748b', font: { size: 10, weight: '600' } },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: 'matrixValueLabels',
      afterDatasetsDraw(chart) {
        const { ctx, data } = chart;
        ctx.save();
        ctx.font = '600 11px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const dataset = data.datasets[0];
        for (let i = 0; i < dataset.data.length; i++) {
          const point = dataset.data[i];
          const meta = chart.getDatasetMeta(0).data[i];

          if (meta) {
            const { x, y } = meta;
            // Only show values > 0.4 for clarity, or if it's the diagonal
            if (point.v > 0.4 || point.x === point.y) {
              ctx.fillStyle = point.v > 0.6 ? '#ffffff' : 'rgba(255,255,255,0.7)';
              ctx.fillText(point.v.toFixed(2), x, y);
            }
          }
        }
        ctx.restore();
      }
    }]
  });
})();

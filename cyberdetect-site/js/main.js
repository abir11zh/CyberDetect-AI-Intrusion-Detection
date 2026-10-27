/**
 * CyberDetect AI — main.js
 * Handles: navbar toggling, active links, prediction form simulation.
 */

/* ── Navbar ─────────────────────────────────── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Mark current page link as active
(function markActive() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.includes(page)) a.classList.add('active');
  });
})();

/* ── Prediction Form ─────────────────────────── */
const predForm   = document.getElementById('prediction-form');
const resultCard = document.getElementById('result-card');
const randomBtn  = document.getElementById('random-btn');

if (randomBtn) {
  randomBtn.addEventListener('click', () => {
    // Generate random realistic IP
    const randomIP = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
    document.getElementById('src-ip').value = randomIP();
    document.getElementById('dst-ip').value = randomIP();
    
    // Packet size (1-65535)
    document.getElementById('packet-size').value = Math.floor(Math.random() * 6000) + 40;
    
    // Protocol
    const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'FTP', 'SSH'];
    document.getElementById('protocol').value = protocols[Math.floor(Math.random() * protocols.length)];
    
    // Duration
    document.getElementById('duration').value = (Math.random() * 10).toFixed(2);
  });
}

// Attack scenarios simulated on the client side for each model
const xgbScenarios = [
  { label: 'DDoS Attack',         risk: 'High',   confidence: '97.3%', status: 'Attack Detected' },
  { label: 'Port Scan',           risk: 'Medium', confidence: '84.1%', status: 'Attack Detected' },
  { label: 'Normal Traffic',      risk: 'Low',    confidence: '99.5%', status: 'Normal' },
  { label: 'Brute Force',         risk: 'High',   confidence: '98.2%', status: 'Attack Detected' },
  { label: 'SQL Injection',       risk: 'High',   confidence: '95.8%', status: 'Attack Detected' },
  { label: 'Normal Traffic',      risk: 'Low',    confidence: '99.9%', status: 'Normal' },
];

const lstmScenarios = [
  { label: 'DDoS (SlowLoris)',    risk: 'High',   confidence: '94.3%', status: 'Attack Detected' },
  { label: 'Port Scan',           risk: 'Medium', confidence: '88.1%', status: 'Attack Detected' },
  { label: 'Normal Traffic',      risk: 'Low',    confidence: '99.1%', status: 'Normal' },
  { label: 'Brute Force',         risk: 'High',   confidence: '93.2%', status: 'Attack Detected' },
  { label: 'Botnet Beacon',       risk: 'High',   confidence: '91.8%', status: 'Attack Detected' },
  { label: 'Normal Traffic',      risk: 'Low',    confidence: '98.7%', status: 'Normal' },
];

if (predForm) {
  predForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Show loading state
    const submitBtn = this.querySelector('#submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Pick deterministic scenario based on form values
      const packetSize = parseInt(document.getElementById('packet-size').value) || 0;
      const duration   = parseFloat(document.getElementById('duration').value) || 0;
      const idx = (packetSize + Math.floor(duration)) % xgbScenarios.length;
      
      const xgb = xgbScenarios[idx];
      const lstm = lstmScenarios[idx];
      
      const overallRisk = (xgb.risk === 'High' || lstm.risk === 'High') ? 'High' : 
                          (xgb.risk === 'Medium' || lstm.risk === 'Medium') ? 'Medium' : 'Low';

      // Overall Badge
      const badge = document.getElementById('risk-badge');
      badge.textContent = overallRisk + ' Risk';
      badge.className = 'risk-badge risk-' + overallRisk.toLowerCase();

      // XGBoost UI
      const xgbStatusEl = document.getElementById('res-xgb-status');
      xgbStatusEl.textContent = xgb.status;
      xgbStatusEl.className = 'result-item-value ' + (xgb.status === 'Normal' ? 'normal' : 'attack');
      document.getElementById('res-xgb-attack').textContent = xgb.status === 'Normal' ? 'None' : xgb.label;
      document.getElementById('res-xgb-conf').textContent = xgb.confidence;
      document.getElementById('res-xgb-time').textContent = 'Inference: ' + (Math.random() * 1.5 + 0.2).toFixed(2) + 'ms';

      // LSTM UI
      const lstmStatusEl = document.getElementById('res-lstm-status');
      lstmStatusEl.textContent = lstm.status;
      lstmStatusEl.className = 'result-item-value ' + (lstm.status === 'Normal' ? 'normal' : 'attack');
      document.getElementById('res-lstm-attack').textContent = lstm.status === 'Normal' ? 'None' : lstm.label;
      document.getElementById('res-lstm-conf').textContent = lstm.confidence;
      document.getElementById('res-lstm-time').textContent = 'Inference: ' + (Math.random() * 5 + 8).toFixed(2) + 'ms';

      // Show card
      if (resultCard) {
        resultCard.classList.add('visible');
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Record history
      const histData = {
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
        srcIp: document.getElementById('src-ip').value || 'Unknown',
        protocol: document.getElementById('protocol').value || 'Unknown',
        xgbStatus: xgb.status,
        lstmStatus: lstm.status,
        risk: overallRisk
      };
      
      if (typeof window.predictionHistory === 'undefined') {
        window.predictionHistory = [];
      }
      window.predictionHistory.push(histData);
      
      // Save to localStorage
      try {
        localStorage.setItem('cyberDetectHistory', JSON.stringify(window.predictionHistory));
      } catch (e) {
        console.error('Failed to save history to localStorage', e);
      }
      
      if (typeof updateHistoryUI === 'function') {
        updateHistoryUI(histData);
      }

      // Restore button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1800);
  });
}

/* ── Smooth anchor scroll ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── Home Page Dashboard Chart ───────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const homeCtx = document.getElementById('homeModelChart');
  if (homeCtx) {
    new Chart(homeCtx, {
      type: 'bar',
      data: {
        labels: ['XGBoost', 'CatBoost', 'Random Forest', 'MLP Obj', 'LSTM', 'Isolation Forest'],
        datasets: [
          {
            label: 'Recall',
            data: [90.0, 91.6, 92.0, 67.8, 48.0, 25.0],
            backgroundColor: 'rgba(37, 99, 235, 0.85)',
            borderColor: 'rgba(37, 99, 235, 1)',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Accuracy',
            data: [73.0, 71.0, 72.0, 91.1, 80.0, 43.0],
            backgroundColor: 'rgba(6, 182, 212, 0.85)',
            borderColor: 'rgba(6, 182, 212, 1)',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { family: "'Inter', sans-serif", weight: '500' },
              color: '#64748B',
              usePointStyle: true,
              boxWidth: 8
            }
          },
          tooltip: {
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            titleColor: '#fff',
            bodyColor: '#cbd5e1',
            padding: 12,
            cornerRadius: 8,
            titleFont: { family: "'Inter', sans-serif", size: 14 },
            bodyFont: { family: "'Inter', sans-serif", size: 13 },
            callbacks: {
               label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y + '%';
               }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
            ticks: {
              color: '#64748B',
              font: { family: "'Inter', sans-serif", size: 11 },
              callback: function(value) { return value + '%'; }
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#64748B', font: { family: "'Inter', sans-serif", size: 11 } }
          }
        }
      }
    });
  }

  /* ── Home Page Distribution Doughnut Chart ───── */
  const distCtx = document.getElementById('attackDistributionChart');
  if (distCtx) {
    new Chart(distCtx, {
      type: 'doughnut',
      data: {
        labels: ['Normal Traffic', 'DDoS', 'PortScan', 'Brute Force', 'Others'],
        datasets: [{
          data: [80.3, 10.5, 5.2, 2.1, 1.9],
          backgroundColor: [
            'rgba(16, 185, 129, 0.9)', /* Green (Normal) */
            'rgba(239, 68, 68, 0.9)',  /* Red (DDoS) */
            'rgba(245, 158, 11, 0.9)', /* Orange (PortScan) */
            'rgba(139, 92, 246, 0.9)', /* Purple (BruteForce) */
            'rgba(59, 130, 246, 0.9)'  /* Blue (Others) */
          ],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: { family: "'Inter', sans-serif", size: 12 },
              color: '#64748B',
              usePointStyle: true,
              padding: 16
            }
          },
          tooltip: {
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            bodyFont: { family: "'Inter', sans-serif", size: 13 },
            callbacks: {
               label: function(context) {
                  return ' ' + context.label + ': ' + context.parsed + '%';
               }
            }
          }
        }
      }
    });
  }
});

/* ── Scroll Animations Observer ──────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // Animate only once
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% visible
      rootMargin: "0px 0px -50px 0px" // Trigger slightly before it comes into view fully
    });

    animatedElements.forEach(el => observer.observe(el));
  }
});

/* ── Prediction History & Chart ──────────────── */
let historyChartInstance = null;

function updateHistoryUI(data) {
  const historySec = document.getElementById('history-section');
  if (historySec) historySec.style.display = 'block';

  // Update Table
  const tbody = document.getElementById('history-tbody');
  if (tbody) {
    const row = document.createElement('tr');
    
    // Smooth fade in
    row.style.opacity = '0';
    row.style.transition = 'opacity 0.5s ease, background 0.3s ease';
    
    const getBadge = (status) => status === 'Normal' ? `<span class="badge badge-success">Normal</span>` : `<span class="badge badge-danger">Attack</span>`;
    const getRiskBadge = (risk) => {
      if (risk === 'Low') return `<span class="badge badge-success">Low</span>`;
      if (risk === 'Medium') return `<span class="badge badge-warning">Med</span>`;
      return `<span class="badge badge-danger">High</span>`;
    };

    row.innerHTML = `
      <td style="white-space:nowrap; font-size:.85rem;">${data.time}</td>
      <td><strong>${data.srcIp}</strong></td>
      <td>${data.protocol}</td>
      <td>${getBadge(data.xgbStatus)}</td>
      <td>${getBadge(data.lstmStatus)}</td>
      <td>${getRiskBadge(data.risk)}</td>
    `;
    tbody.insertBefore(row, tbody.firstChild);
    
    // Trigger reflow for transition
    void row.offsetWidth;
    row.style.opacity = '1';
  }

  // Update Chart
  updateHistoryChart();
}

function updateHistoryChart() {
  const ctx = document.getElementById('historyChart');
  if (!ctx || typeof Chart === 'undefined') return;

  let xgbNormal = 0, xgbAttack = 0;
  let lstmNormal = 0, lstmAttack = 0;

  (window.predictionHistory || []).forEach(item => {
    if (item.xgbStatus === 'Normal') xgbNormal++; else xgbAttack++;
    if (item.lstmStatus === 'Normal') lstmNormal++; else lstmAttack++;
  });

  if (!historyChartInstance) {
    historyChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['XGBoost Model', 'LSTM Network'],
        datasets: [
          {
            label: 'Normal Traffic',
            data: [xgbNormal, lstmNormal],
            backgroundColor: 'rgba(16, 185, 129, 0.85)',
            borderRadius: 4
          },
          {
            label: 'Attacks Detected',
            data: [xgbAttack, lstmAttack],
            backgroundColor: 'rgba(239, 68, 68, 0.85)',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { family: "'Inter', sans-serif" }, color: '#64748B', usePointStyle: true, boxWidth: 8 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0, color: '#64748B' },
            grid: { color: 'rgba(226, 232, 240, 0.6)' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#64748B', font: { family: "'Inter', sans-serif", weight: '600' } }
          }
        }
      }
    });
  } else {
    historyChartInstance.data.datasets[0].data = [xgbNormal, lstmNormal];
    historyChartInstance.data.datasets[1].data = [xgbAttack, lstmAttack];
    historyChartInstance.update();
  }
}

/* ── Initialize History from LocalStorage ────── */
document.addEventListener('DOMContentLoaded', () => {
  try {
    const saved = localStorage.getItem('cyberDetectHistory');
    window.predictionHistory = saved ? JSON.parse(saved) : [];
    
    if (window.predictionHistory.length > 0 && document.getElementById('history-section')) {
      // Temporarily disable chart updates while rendering table
      const originalUpdate = updateHistoryChart;
      updateHistoryChart = function(){}; 
      
      window.predictionHistory.forEach(data => updateHistoryUI(data));
      
      // Restore and update chart once
      updateHistoryChart = originalUpdate;
      updateHistoryChart();
    }
  } catch(e) {
    console.error('Failed to parse history from localStorage', e);
    window.predictionHistory = [];
  }
});

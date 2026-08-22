document.addEventListener('DOMContentLoaded', function () {

  const $ = (sel) => document.querySelector(sel);

  function randBetween(min, max) {
    return Math.random() * (max - min) + min;
  }


  function formatInt(n) {
    return Math.round(n).toLocaleString();
  }



  function safeText(text) {
    return String(text)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '<')
      .replaceAll('>', '>')
      .replaceAll('"', '"')
      .replaceAll("'", '&#039;');
  }

  function riskClass(score) {
    if (score >= 75) return { cls: 'risk-high', label: 'High' };
    if (score >= 45) return { cls: 'risk-med', label: 'Medium' };
    return { cls: 'risk-low', label: 'Low' };
  }

  function tryInitCharts() {

    // animate in
    document.querySelectorAll('.fade-in').forEach((el) => {
      el.style.animationDelay = (Math.random() * 0.2).toFixed(2) + 's';
    });

    // Charts are initialized in this function after DOMContentLoaded.
    // Canvas sizing is handled via CSS (.chart-canvas has fixed min-height).


    // Prefer server-driven model if present
    const server = (window.__DASHBOARD__ && typeof window.__DASHBOARD__ === 'object') ? window.__DASHBOARD__ : null;


    const DEMO_MODE = true;

const kpis = DEMO_MODE
  ? {
      totalUsers: 128,
      loginAttempts: 1247,
      activeSessions: 34,
      failedLogins: 86
    }
  : {
      totalUsers: Number(server?.totalUsers || 0),
      loginAttempts: Number(server?.loginAttempts || 0),
      activeSessions: Number(server?.activeSessions || 0),
      failedLogins: Number(server?.failedLogins || 0)
    };

    // security status heuristic
    const status = server && server.securityStatus
      ? String(server.securityStatus)
      : ((kpis.failedLogins / Math.max(1, kpis.loginAttempts)) * 10000 > 7.5
          ? 'Elevated Risk'
          : ((kpis.failedLogins / Math.max(1, kpis.loginAttempts)) * 10000 > 3.5
              ? 'Monitoring'
              : 'Secure'));

    // update DOM
    const totalUsersEl = $('#kpi-total-users');
    if (totalUsersEl) totalUsersEl.textContent = formatInt(kpis.totalUsers);

    const loginAttemptsEl = $('#kpi-login-attempts');
    if (loginAttemptsEl) loginAttemptsEl.textContent = formatInt(kpis.loginAttempts);

    const activeSessionsEl = $('#kpi-active-sessions');
    if (activeSessionsEl) activeSessionsEl.textContent = formatInt(kpis.activeSessions);

    const failedLoginsEl = $('#kpi-failed-logins');
    if (failedLoginsEl) failedLoginsEl.textContent = formatInt(kpis.failedLogins);

    const securityStatusEl = $('#kpi-security-status');
    if (securityStatusEl) securityStatusEl.textContent = status;


    // ===== Chart.js charts (server-driven; safe fallbacks) =====
    

    const fallbackLabels24 = Array.from({ length: 24 }, (_, i) => String(i));
    const fallback24 = Array.from({ length: 24 }, () => 0);

    const loginLabels = (server && Array.isArray(server.loginChartLabels)) ? server.loginChartLabels : fallbackLabels24;
    const loginSuccessSeries = (server && Array.isArray(server.loginSuccessSeries)) ? server.loginSuccessSeries : fallback24;
    const loginAttemptsSeries = (server && Array.isArray(server.loginAttemptsSeries)) ? server.loginAttemptsSeries : fallback24;

    // Failed login analytics - hour/day bucketing (dummy-safe for now)
    const failedByTimeLabels = (server && Array.isArray(server.failedByTimeLabels) && server.failedByTimeLabels.length)
      ? server.failedByTimeLabels
      : ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

    const failedByTimeSeries = (server && Array.isArray(server.failedByTimeSeries) && server.failedByTimeSeries.length)
      ? server.failedByTimeSeries
      : [12, 9, 15, 22, 28, 19, 25, 14];

    // Cybersecurity doughnut segments
    // Requirements: Risk Index, Threat Likelihood, Secure Sessions, Failed Attempts
    const cyberLabels = ['Risk Index', 'Threat Likelihood', 'Secure Sessions', 'Failed Attempts'];
    const cyberSeries = (server && Array.isArray(server.cyberSeries) && server.cyberSeries.length === 4)
      ? server.cyberSeries
      : [28, 17, 55, 21];

    // Radar chart data
    const radarLabels = ['Brute force', 'Suspicious IP', 'Credential stuffing', 'Session anomalies'];
    const radarSeries = (server && Array.isArray(server.radarSeries) && server.radarSeries.length === 4)
      ? server.radarSeries
      : [78, 62, 71, 49];

    const riskLabels = (server && Array.isArray(server.riskLabels) && server.riskLabels.length === 3) ? server.riskLabels : ['Low', 'Medium', 'High'];
    const riskSeries = (server && Array.isArray(server.riskSeries) && server.riskSeries.length === 3) ? server.riskSeries : [30, 12, 6];

    const sessionLabels = (server && Array.isArray(server.sessionChartLabels) && server.sessionChartLabels.length) ? server.sessionChartLabels : fallbackLabels24.slice(0, 6);
    const sessionSeries = (server && Array.isArray(server.activeSessionSeries) && server.activeSessionSeries.length) ? server.activeSessionSeries : [2, 2, 2, 2, 2, 2];

        // MOVE getCss ABOVE const colors
function getCss(name, fallbackRGB) {

  const v = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();

  if (!v) return fallbackRGB;

  if (v.startsWith('#')) {

    const hex = v.substring(1);

    const full = hex.length === 3
      ? hex.split('').map((ch) => ch + ch).join('')
      : hex;

    const r = parseInt(full.substring(0, 2), 16);
    const g = parseInt(full.substring(2, 4), 16);
    const b = parseInt(full.substring(4, 6), 16);

    return `${r},${g},${b}`;
  }

  return v;
}


// KEEP ONLY ONE const colors
const colors = {
  neon1: getCss('--neon1', '109,40,255'),
  neon2: getCss('--neon2', '34,211,238'),
  neon3: getCss('--neon3', '96,165,250'),
  danger: getCss('--danger', '251,113,133'),
  text: getCss('--text', '231,241,255'),
  muted: getCss('--muted', '231,241,255')
};
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 900,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(7,17,31,.92)',
          borderColor: 'rgba(120,170,255,.18)',
          borderWidth: 1,
          titleColor: `rgba(${colors.text},.95)`,
          bodyColor: `rgba(${colors.text},.88)`
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(120,170,255,.10)' },
          ticks: { color: 'rgba(231,241,255,.65)', maxRotation: 0, autoSkip: true }
        },
        y: {
          grid: { color: 'rgba(120,170,255,.10)' },
          ticks: { color: 'rgba(231,241,255,.65)' }
        }
      }
    };

    let chartAuth = null;
    let chartCyber = null;
    let chartFailed = null;
    let chartSessions = null;

    function ctx2d(c) {
      return c && c.getContext ? c.getContext('2d') : null;
    }

   // ===== Chart.js charts (server-driven; safe fallbacks) =====


    // Login Activity line chart (success vs attempts)
    const c1 = $('#chart-auth');
    if (c1 && window.Chart) {
      const ctx = ctx2d(c1);
      if (ctx) {
        chartAuth = new Chart(ctx, {
          type: 'line',
          data: {
            labels: loginLabels,
            datasets: [
              {
                label: 'Successful',
                data: loginSuccessSeries,
                borderColor: `rgba(${colors.neon2},.95)`,
                backgroundColor: `rgba(${colors.neon2},.18)`,
                fill: true,
                tension: 0.35,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4
              },
              {
                label: 'Denied / Noise (approx)',
                data: loginAttemptsSeries.map((a, i) => Math.max(0, a - (loginSuccessSeries[i] || 0))),
                borderColor: `rgba(${colors.neon1},.95)`,
                backgroundColor: `rgba(${colors.neon1},.12)`,
                fill: false,
                tension: 0.35,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4
              }
            ]
          },
          options: {
            ...commonOptions,
            plugins: { ...commonOptions.plugins, legend: { display: false } },
            scales: {
              ...commonOptions.scales,
              x: { ...commonOptions.scales.x, ticks: { ...commonOptions.scales.x.ticks, maxTicksLimit: 6 } }
            }
          }
        });
      }
    }

    // Login Analytics line chart already handled above.

    // Failed login analytics bar chart (hour/day bucketing)
    const cFail = $('#chart-failed-logins');

    if (cFail && window.Chart) {
      const ctx = ctx2d(cFail);
      if (ctx) {
        chartFailed = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: failedByTimeLabels,
            datasets: [
              {
                label: 'Login Failures',
                data: failedByTimeSeries,
                backgroundColor: `rgba(${colors.danger},.30)`,
                borderColor: `rgba(${colors.danger},.95)`,
                borderWidth: 1.5,
                borderRadius: 10,
                barPercentage: 0.9,
                categoryPercentage: 0.75,
                // subtle glow via bar shadow (Chart.js supports via dataset property in some versions; keep safe)
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 950,
              easing: 'easeOutQuart'
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(7,17,31,.92)',
                borderColor: 'rgba(120,170,255,.18)',
                borderWidth: 1,
                titleColor: `rgba(${colors.text},.95)`,
                bodyColor: `rgba(${colors.text},.88)`,
              }
            },
            scales: {
              x: {
                grid: { color: 'rgba(120,170,255,.08)' },
                ticks: { color: 'rgba(231,241,255,.65)', maxTicksLimit: 8 }
              },
              y: {
                grid: { color: 'rgba(120,170,255,.08)' },
                ticks: { color: 'rgba(231,241,255,.65)' }
              }
            }
          }
        });
      }
    }

    // Cybersecurity metrics doughnut chart (4 segments)
    const c2 = $('#chart-cyber');
    if (c2 && window.Chart) {
      const ctx = ctx2d(c2);
      if (ctx) {
        const total = cyberSeries.reduce((a, b) => a + b, 0) || 1;

        chartCyber = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: cyberLabels,
            datasets: [
              {
                data: cyberSeries.map((v) => Math.max(0, v)),
                backgroundColor: [
                  `rgba(${colors.neon3},.86)`, // Risk Index
                  `rgba(${colors.neon1},.86)`, // Threat Likelihood
                  `rgba(52,211,153,.80)`,    // Secure Sessions
                  `rgba(${colors.danger},.82)` // Failed Attempts
                ],
                borderColor: 'rgba(5,14,32,.9)',
                borderWidth: 2,
                hoverOffset: 10,
                spacing: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 950, easing: 'easeOutQuart' },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(7,17,31,.92)',
                borderColor: 'rgba(120,170,255,.18)',
                borderWidth: 1,
                callbacks: {
                  label: function (ctx) {
                    const v = ctx.parsed || 0;
                    const pct = total ? Math.round((v / total) * 100) : 0;
                    return `${ctx.label}: ${v} (${pct}%)`;
                  }
                },
                titleColor: `rgba(${colors.text},.95)`,
                bodyColor: `rgba(${colors.text},.88)`
              }
            },
            cutout: '62%'
          },
          // important: leave Chart.js sizing intact; legend is handled by the existing DOM
        });

      }
    }

    // Threat Monitoring radar chart
    const cRadar = $('#chart-threat-radar');
    if (cRadar && window.Chart) {
      const ctx = ctx2d(cRadar);
      if (ctx) {
        chartSessions = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: radarLabels,
            datasets: [
              {
                label: 'Threat Signal Strength',
                data: radarSeries.map((v) => Math.max(0, v)),
                borderColor: `rgba(${colors.neon2},.95)`,
                backgroundColor: `rgba(${colors.neon2},.18)`,
                borderWidth: 2,
                pointBackgroundColor: `rgba(${colors.neon1},.95)`,
                pointBorderColor: 'rgba(5,14,32,.9)',
                pointRadius: 3,
                pointHoverRadius: 5
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 950, easing: 'easeOutQuart' },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(7,17,31,.92)',
                borderColor: 'rgba(120,170,255,.18)',
                borderWidth: 1,
                titleColor: `rgba(${colors.text},.95)`,
                bodyColor: `rgba(${colors.text},.88)`
              }
            },
            scales: {
              r: {
                angleLines: { color: 'rgba(120,170,255,.15)' },
                grid: { color: 'rgba(120,170,255,.10)' },
                pointLabels: { color: 'rgba(231,241,255,.75)', font: { size: 11, weight: '600' } },
                ticks: { display: false }
              }
            }
          }
        });
      }
    }


    // activity rows (server-driven if available)

    const activity = server && Array.isArray(server.activity) ? server.activity : [];

    const sampleIPs = ['185.23.12.88', '45.76.21.104', '102.54.9.17', '200.15.33.211', '61.12.190.6', '172.16.12.44'];
    const sampleStatuses = ['Success', 'Denied', 'MFA Required', 'Brute-force Suspected'];

    const tbody = $('#activity-tbody');
    if (tbody) {
      const rows = activity.length
        ? activity.map((row, idx) => {
            const score = Number(row.riskScore ?? 25);
            const rc = row.riskClass || riskClass(score).cls;
            return {
              email: row.email,
              time: row.time,
              status: row.status,
              ip: row.ip,
              riskScore: score,
              riskLabel: row.riskLabel || riskClass(score).label,
              riskClass: rc,
            };
          })
        : Array.from({ length: 10 }, (_, i) => {
            const score = Math.round(randBetween(12, 98));
            const s = riskClass(score);
            return {
              email: `user${100 + i}@company.com`,
              time: new Date(Date.now() - i * 1000 * 60 * Math.floor(randBetween(7, 40))).toISOString().slice(0, 19).replace('T', ' '),
              status: sampleStatuses[Math.floor(randBetween(0, sampleStatuses.length))],
              ip: sampleIPs[Math.floor(randBetween(0, sampleIPs.length))],
              riskScore: score,
              riskLabel: s.label,
              riskClass: s.cls,
            };
          });

      tbody.innerHTML = rows
        .map((row) => {
          const statusLower = String(row.status || '').toLowerCase();
          const statusClass = statusLower.includes('success')
            ? ''
            : statusLower.includes('denied')
              ? 'fail'
              : statusLower.includes('brute')
                ? 'warn'
                : 'warn';

          const dotClass = statusClass ? `status ${statusClass}` : 'status';

          return `
            <tr class="tr-glow">
              <td>${safeText(row.email || '')}</td>
              <td>${safeText(String(row.time || ''))}</td>
              <td>
                <span class="${dotClass}">
                  <span class="s-dot"></span>
                  ${safeText(row.status || '')}
                </span>
              </td>
              <td>${safeText(row.ip || '')}</td>
              <td>
                <span class="risk-pill ${row.riskClass}">${row.riskScore} • ${safeText(row.riskLabel || '')}</span>
              </td>
            </tr>
          `;
        })
        .join('');
    }

    // threat panel (server-driven if available)
    const threatWrap = $('#threat-list');
    const threats = server && Array.isArray(server.threats) ? server.threats : [
      { name: 'Suspicious Login Pattern', meta: 'Velocity spike detected • 3m window', risk: 'High' },
      { name: 'IP Reputation Degradation', meta: 'Geo drift • ASN mismatch', risk: 'Medium' },
      { name: 'Credential Stuffing Indicators', meta: 'Repeated failures • user/target entropy', risk: 'Medium' },
    ];

    if (threatWrap) {
      threatWrap.innerHTML = threats
        .slice(0, 3)
        .map((t) => {
          const risk = String(t.risk || 'Low');
          const cls = risk === 'High' ? 'risk-high' : 'risk-med';
          return `
            <div class="threat-item hoverable">
              <div class="threat-left">
                <div class="name">${safeText(t.name || '')}</div>
                <div class="meta">${safeText(t.meta || '')}</div>
              </div>
              <div class="risk-pill ${cls}">${safeText(risk)} Risk</div>
            </div>
          `;
        })
        .join('');
    }

    // Handle responsive redraw for charts
    // Chart.js is responsive; no manual redraw required.
    // Keep resize debounce only for older browsers (optional).
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        try {
          chartAuth && chartAuth.resize();
          chartCyber && chartCyber.resize();
          chartFailed && chartFailed.resize();
          chartSessions && chartSessions.resize();
        } catch (e) {}
      }, 120);
    });


  }



    // Wait for Chart.js CDN to be available, then initialize charts.
    const start = Date.now();
    const timeoutMs = 4000;

    const waitForChart = () => {
      if (window.Chart) {
        tryInitCharts();
        return;
      }

      if (Date.now() - start > timeoutMs) return;
      setTimeout(waitForChart, 50);
    };

    setTimeout(waitForChart, 50);
});










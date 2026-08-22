# TODO - SOCAction Dashboard Chart.js Enhancements

## Plan (Option A - implement full requirements)
- [ ] Update frontend (dashboard.html) only where needed to add missing chart canvases/legends for Radar/Threat Monitoring and adjust existing analytics section if required.
- [ ] Update frontend (dashboard.js) to:
  - [ ] Fix existing chart rendering issue (likely resize/legend/sizing timing).
  - [ ] Ensure cards/canvas sizing works with Chart.js responsive mode.
  - [ ] Populate charts with dummy/static data when backend data is missing.
  - [ ] Add Neon animated Line chart for successful vs failed login trends.
  - [ ] Add cyber-themed Bar chart for failed login attempts by hour/day.
  - [ ] Upgrade Doughnut chart in Cybersecurity Metrics to include: Risk Index, Threat Likelihood, Secure Sessions, Failed Attempts.
  - [ ] Add Radar chart for threat monitoring signals (brute force, suspicious IP activity, credential stuffing, session anomalies).
- [ ] Update backend (DashboardService.java + DashboardController.java if needed) to provide dummy-safe datasets/labels for the new charts (or reuse existing logs) without changing UI layout.
- [ ] Verify Chart.js is loaded once and charts initialize after DOM + layout.
- [ ] Run the app and manually check dashboard rendering & responsiveness.


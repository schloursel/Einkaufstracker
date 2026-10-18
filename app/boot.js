// Start: Theme, erster Render, Einrichtung beim ersten Start, Service Worker.
(function () {
  const ET = window.ET;
  ET.applyTheme();
  ET.render();
  if (!ET.S.setupDone) ET.openSetup();
  let noSw = false; try { noSw = !!localStorage.getItem('et_nosw'); } catch (e) {}   // Entwicklung: localStorage.et_nosw = 1
  if (!noSw && 'serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();

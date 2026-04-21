/* ==============================================
   registerPWA.js
   Call this once from your App.js or index.js:
   import { registerPWA } from "./registerPWA";
   registerPWA();
============================================== */

let deferredPrompt = null;

export function registerPWA() {
  // Register service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => {
          console.log("SW registered:", reg.scope);

          // Check for updates every 60 seconds
          setInterval(() => reg.update(), 60000);

          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            newWorker?.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New version available — you can show a toast here
                console.log("New version available — refresh to update");
              }
            });
          });
        })
        .catch((err) => console.warn("SW registration failed:", err));
    });
  }

  // Capture install prompt for custom "Add to Home Screen" button
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Dispatch custom event so any component can listen
    window.dispatchEvent(new CustomEvent("pwa-installable"));
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    console.log("PWA installed");
  });
}

/* Call this from a button to trigger the native install dialog */
export async function promptInstall() {
  if (!deferredPrompt) return false;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return outcome === "accepted";
}

/* Check if app is already installed as PWA */
export function isInstalledPWA() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

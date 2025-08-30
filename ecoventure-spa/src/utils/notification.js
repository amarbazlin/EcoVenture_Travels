// src/utils/notification.js
export function askNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notifications granted");
      } else {
        console.log("Notifications denied");
      }
    });
  }
}
// src/utils/notification.js
export function showTourUpdateNotification(tourName) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("EcoVenture Tours", {
      body: `New tour available: ${tourName}`,
      icon: "/public/react.webp" // use your PWA icon
    });
  }
}
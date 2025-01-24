// Les coordonnées latitude longitude du coffre
let latPapier = 45.65496057866898;
let lonPapier = 0.1489350003864729;

// Les coordonnées latitude longitude de l'utilisateur
let latUser;
let lonUser;

navigator.geolocation.getCurrentPosition(success, error, options);

var $notifstatus = document.getElementById("notifstatus");

if ("Notification" in window) {
  $notifstatus.innerText = Notification.permission;
}

/**
 * Fonction permettant de demander la permissions de Notification
 * @returns null
 */
function requestNotifsPermission() {
  if (!("Notification" in window)) {
    alert("Notification API not supported!");
    return;
  }

  Notification.requestPermission(function (result) {
    $notifstatus.innerText = result;
  });
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  var crd = pos.coords;

  console.log("Votre position actuelle est :");
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude : ${crd.longitude}`);

  var lat = crd.latitude;
  var lon = crd.longitude;
  latUser = lat;
  lonUser = lon;

  console.log(distance(lat, lon, latPapier, lonPapier));
  let distanceTarget = document.getElementById("distancePont");
  let lenght = document.createElement("p");
  lenght.innerHTML =
    "distance : " + distance(lat, lon, latPapier, lonPapier) + " mètres";
  distanceTarget.append(lenght);
}

function error(err) {
  console.warn(`ERREUR (${err.code}): ${err.message}`);
}

// Geolocalisation
var target = document.getElementById("target");
var watchId;

function appendLocation(location, verb) {
  verb = verb || "updated";
  var newLocation = document.createElement("p");
  newLocation.innerHTML =
    "Location " +
    verb +
    ": " +
    location.coords.latitude +
    ", " +
    location.coords.longitude +
    "";
  target.appendChild(newLocation);
}

if ("geolocation" in navigator) {
  document.getElementById("askButton").addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition(function (location) {
      appendLocation(location, "fetched");
    });
    watchId = navigator.geolocation.watchPosition(appendLocation);
  });
} else {
  target.innerText = "Geolocation API not supported.";
}

// READ NFC
document.getElementById("nfc_read").addEventListener("click", readTag);

async function readTag() {
  if ("NDEFReader" in window) {
    const ndef = new NDEFReader();
    try {
      await ndef.scan();
      ndef.onreading = (event) => {
        const decoder = new TextDecoder();
        for (const record of event.message.records) {
          consoleLog("Record type:  " + record.recordType);
          consoleLog("=== data ===\n" + decoder.decode(record.data));
        }
      };
    } catch (error) {
      consoleLog(error);
    }
  } else {
    consoleLog("Web NFC is not supported.");
  }
}

function consoleLog(data) {
  var logElement = document.getElementById("log");
  logElement.innerHTML += data + "\n";
}

/**
 * Renvoit un angle en radian en prenant en entrée un angle en degré
 * @param angle l'angle en degré
 **/
function toRadians(angle) {
  return angle * (Math.PI / 180);
}

/**
 * La fonction permet d'envoyer des notifications selons la proximités de l'utilisateur au coffre
 */
function checkDistance() {
  let d = distance(lat, lon, latPapier, lonPapier);

  str = "";
  if (d > 1000) {
    str = "Oh, il semblerait que le coffre soit loin";
    persistentNotification(str);
  }

  if (d < 900 && d > 50) {
    str = "Hey Un coffre est pas loin !";
    persistentNotification(str);
  }

  if (d < 50) {
    vibrateSimple(500);
    vibrateSimple(500);
    vibrateSimple(500);
    vibrateSimple(500);
    str = "Le coffre est vraiment proche !";
    persistentNotification(str);
  }
}

/**
 * Fonction permettant d'envoyer des notifications permanentes sur le navigateur
 * @param text le texte a afficher dans la notification
 * @returns null
 */
function persistentNotification(text) {
  if (!("Notification" in window) || !("ServiceWorkerRegistration" in window)) {
    alert("Persistent Notification API not supported!");
    return;
  }

  try {
    navigator.serviceWorker
      .getRegistration()
      .then((reg) => reg.showNotification(text))
      .catch((err) => alert("Service Worker registration error: " + err));
  } catch (err) {
    alert("Notification API error: " + err);
  }
}

/**
 * Calcul de la distance entre 2 point géographique
 * Utilise la formule de Haversine
 *  @param user_lat La Latitude de l'utilisateur
 *  @param user_lon La longitude de l'utilisateur
 *  @param chest_lat La latitude du coffre
 *  @param chest_lon La longitude du coffre
 *  @returns La distance entre l'utilisateur et le coffre en mètre arrondis au centième
 */
function distance(user_lat, user_lon, chest_lat, chest_lon) {
  let radius = 6371; // Rayon de la terre en Km
  let dLat = toRadians(chest_lat - user_lat);
  let dLon = toRadians(chest_lon - user_lon);

  let userLatRad = toRadians(user_lat);
  let chestLatRad = toRadians(chest_lat);

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(userLatRad) *
      Math.cos(chestLatRad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (radius * c * 1000).toFixed(2);
}

/**
 * Une simple fonction permmetant de vibre le téléphone pendant un temps donnée
 * @param duration la durée de la vibration en milliseconde
 **/
function vibrateSimple(duration) {
  navigator.vibrate(duration);
}

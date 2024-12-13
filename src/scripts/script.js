console.log("Hello World");

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
document.querySelector("button").addEventListener("click", readTag);
async function readTag() {
  if ("NDEFReader" in window) {
    const ndef = new NDEFReader();
    try {
      await ndef.scan();
      ndef.onreading = (event) => {
        const decoder = new TextDecoder();
        for (const record of event.message.records) {
          consoleLog("Record type:  " + record.recordType);
          consoleLog("MIME type:    " + record.mediaType);
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

async function writeTag() {
  if ("NDEFReader" in window) {
    const ndef = new NDEFReader();
    try {
      await ndef.write("What Web Can Do Today");
      consoleLog("NDEF message written!");
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

// VIBRATE
function vibrateSimple() {
  navigator.vibrate(200);
}

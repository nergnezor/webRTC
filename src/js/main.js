const videoElem = document.getElementById("video");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
console.log = msg => (logElem.innerHTML += `${msg}<br>`);
console.error = msg =>
  (logElem.innerHTML += `<span class="error">${msg}</span><br>`);
console.warn = msg =>
  (logElem.innerHTML += `<span class="warn">${msg}<span><br>`);
console.info = msg =>
  (logElem.innerHTML += `<span class="info">${msg}</span><br>`);
// Options for getDisplayMedia()

var displayMediaOptions = {
  video: true,
  audio: false
};

// Set event listeners for the start and stop buttons
startElem.addEventListener(
  "click",
  function(evt) {
    startCapture();
  },
  false
);

stopElem.addEventListener(
  "click",
  function(evt) {
    stopCapture();
  },
  false
);

function gotLocalMediaStream(mediaStream) {
  videoElem.srcObject = mediaStream;
  dumpOptionsInfo();
}
function handleLocalMediaStreamError(error) {
  console.log("navigator.getUserMedia error: ", error);
}

function StartScreenCapture() {
  if (navigator.getDisplayMedia) {
    return navigator.getDisplayMedia(displayMediaOptions);
  } else if (navigator.mediaDevices.getDisplayMedia) {
    return navigator.mediaDevices.getDisplayMedia({ video: true });
  } else {
    return navigator.mediaDevices.getUserMedia(displayMediaOptions);
  }
}

async function startCapture() {
  logElem.innerHTML = "";
  StartScreenCapture()
    .then(gotLocalMediaStream)
    .catch(handleLocalMediaStreamError);
}

function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;
}
function dumpOptionsInfo() {
  const videoTrack = videoElem.srcObject.getVideoTracks()[0];

  console.info("Track settings:");
  console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.info("Track constraints:");
  console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

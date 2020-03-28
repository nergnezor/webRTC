const logElem = document.getElementById("log");
const startElem = document.getElementById("start") as HTMLButtonElement;
const stopElem = document.getElementById("stop") as HTMLButtonElement;
const sourcesElem = document.getElementById("videos");
const videoSources: HTMLVideoElement[] = [];

console.log = msg => (logElem.innerHTML += `${msg}<br>`);
console.error = msg =>
  (logElem.innerHTML += `<span class="error">${msg}</span><br>`);
console.warn = msg =>
  (logElem.innerHTML += `<span class="warn">${msg}<span><br>`);
console.info = msg =>
  (logElem.innerHTML += `<span class="info">${msg}</span><br>`);

var displayMediaOptions = {
  video: true,
  audio: false
};

function UpdateButtons() {
  stopElem.hidden = videoSources.length == 0;
}

startElem.addEventListener(
  "click",
  function(evt) {
    startCapture();
    UpdateButtons();
  },
  false
);

stopElem.addEventListener(
  "click",
  function(evt) {
    stopCapture();
    UpdateButtons();
  },
  false
);

function gotLocalMediaStream(mediaStream: MediaStream) {
  videoSources[videoSources.length - 1].srcObject = mediaStream;
  dumpOptionsInfo();
}
async function error(error: Error) {
  console.error(error);
}

async function startCapture() {
  let video = document.createElement("video") as HTMLVideoElement;
  video.autoplay = true;
  video.className = "server";
  video.width = 200;
  // video.
  videoSources.push(video);
  logElem.innerHTML = "";
  try {
    // @ts-ignore
    video.srcObject = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );
    dumpOptionsInfo();
  } catch (err) {
    error(err);
    navigator.mediaDevices
      .getUserMedia(displayMediaOptions)
      .then(gotLocalMediaStream)
      .catch(error);
    return;
  } finally {
    sourcesElem.appendChild(video);
    call(video.srcObject as MediaStream);
  }
}

function stopCapture() {
  let tracks = (videoSources[videoSources.length - 1]
    .srcObject as MediaStream).getTracks();

  tracks.forEach(track => track.stop());

  sourcesElem.removeChild(videoSources[videoSources.length - 1]);
  remoteElem.removeChild(videoRemotes[videoRemotes.length - 1]);
  videoSources[videoSources.length - 1].srcObject = null;
  videoRemotes[videoRemotes.length - 1].srcObject = null;
  videoSources.pop();
  videoRemotes.pop();
}
function dumpOptionsInfo() {
  const videoTrack = (videoSources[videoSources.length - 1]
    .srcObject as MediaStream).getVideoTracks()[0];

  console.info("Track settings:");
  console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.info("Track constraints:");
  console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

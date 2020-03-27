const videoElem = document.getElementById("video");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
console.log = msg => (logElem.innerHTML += `${msg}<br>`);
console.error = msg => (logElem.innerHTML += `<span class="error">${msg}</span><br>`);
console.warn = msg => (logElem.innerHTML += `<span class="warn">${msg}<span><br>`);
console.info = msg => (logElem.innerHTML += `<span class="info">${msg}</span><br>`);
// Options for getDisplayMedia()
var displayMediaOptions = {
    video: true,
    audio: false
};
// Set event listeners for the start and stop buttons
startElem.addEventListener("click", function (evt) {
    startCapture();
}, false);
stopElem.addEventListener("click", function (evt) {
    stopCapture();
}, false);
function gotLocalMediaStream(mediaStream) {
    videoElem.srcObject = mediaStream;
    dumpOptionsInfo();
}
async function error(error) {
    console.error(error);
}
async function startCapture() {
    let video = document.createElement("video");
    let video2 = video;
    let div = document.getElementById("videos");
    div.appendChild(video2);
    logElem.innerHTML = "";
    try {
        // @ts-ignore
        videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        dumpOptionsInfo();
    }
    catch (err) {
        error(err);
        navigator.mediaDevices
            .getUserMedia(displayMediaOptions)
            .then(gotLocalMediaStream)
            .catch(error);
    }
}
function stopCapture() {
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
//# sourceMappingURL=main.js.map
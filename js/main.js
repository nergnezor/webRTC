const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
const videoSources = [];
const servers = null;
const pc1 = new RTCPeerConnection(servers);
const remoteStream = new MediaStream();
const remoteVideo = document.getElementById("remoteVideo");
// pc1.addEventListener("track", async event => {
//   console.info("pc1.addEventListener");
//   remoteVideo.srcObject = remoteStream;
//   remoteStream.addTrack(event.track);
// });
pc1.ontrack = e => {
    console.info("pc1.addEventListener");
    return false;
};
const pc2 = new RTCPeerConnection(servers);
pc2.ontrack = gotRemoteStream;
function gotRemoteStream(e) {
    console.info("gotRemoteStream");
    remoteVideo.srcObject = e.stream;
}
console.log = msg => (logElem.innerHTML += `${msg}<br>`);
console.error = msg => (logElem.innerHTML += `<span class="error">${msg}</span><br>`);
console.warn = msg => (logElem.innerHTML += `<span class="warn">${msg}<span><br>`);
console.info = msg => (logElem.innerHTML += `<span class="info">${msg}</span><br>`);
var displayMediaOptions = {
    video: true,
    audio: false
};
// const desc: RTCSessionDescription = {
//   sdp = "",
//   type = null,
//   toJSON
// };
function UpdateButtons() {
    stopElem.hidden = videoSources.length == 0;
}
startElem.addEventListener("click", function (evt) {
    startCapture();
    UpdateButtons();
}, false);
stopElem.addEventListener("click", function (evt) {
    stopCapture();
    UpdateButtons();
}, false);
function gotLocalMediaStream(mediaStream) {
    videoSources[videoSources.length - 1].srcObject = mediaStream;
    dumpOptionsInfo();
}
async function error(error) {
    console.error(error);
}
async function startCapture() {
    let video = document.createElement("video");
    video.autoplay = true;
    video.width = 200;
    // video.
    videoSources.push(video);
    logElem.innerHTML = "";
    try {
        // @ts-ignore
        video.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        dumpOptionsInfo();
    }
    catch (err) {
        error(err);
        navigator.mediaDevices
            .getUserMedia(displayMediaOptions)
            .then(gotLocalMediaStream)
            .catch(error);
        return;
    }
    finally {
        let div = document.getElementById("videos");
        div.appendChild(video);
        let tracks = videoSources[videoSources.length - 1]
            .srcObject.getTracks();
        tracks.forEach(track => {
            console.info("track: " + track);
            pc1.addTrack(track, video.srcObject);
        });
    }
}
function stopCapture() {
    let tracks = videoSources[videoSources.length - 1]
        .srcObject.getTracks();
    tracks.forEach(track => track.stop());
    document
        .getElementById("videos")
        .removeChild(videoSources[videoSources.length - 1]);
    videoSources[videoSources.length - 1].srcObject = null;
    videoSources.pop();
}
function dumpOptionsInfo() {
    const videoTrack = videoSources[videoSources.length - 1]
        .srcObject.getVideoTracks()[0];
    console.info("Track settings:");
    console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
    console.info("Track constraints:");
    console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}
UpdateButtons();
//# sourceMappingURL=main.js.map
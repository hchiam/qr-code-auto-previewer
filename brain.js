let overlayOpacity = 0.75;
let cameraId = 0; // default fallback
let numberofCameras = 0; // default fallback

document.getElementById('clear-button').style.display = 'none';
document.getElementById('try-another-camera').style.display = 'none';

let scanner = new Instascan.Scanner({
  video: document.getElementById('video')
});

scanner.addListener('scan', function (content) {
  console.log(content);
  var isOk = true; // content.startsWith('https://localhost/');
  if (isOk) {
    document.getElementById('preview').src = content.replace(/^http:/,'https:');
    document.getElementById('preview').style.opacity = overlayOpacity;
    document.getElementById('placeholder').innerHTML = '';
    document.getElementById('clear-button').style.display = 'initial';
    // this line will auto-open the content in another window:
    // window.open(content);
  }
});

useCamera();

function useCamera() {
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      numberofCameras = cameras.length;
      scanner.start(cameras[cameraId]);
    } else {
      alert('No camera detected.');
      console.error('No camera detected.');
    }
    if (numberofCameras > 1) {
      document.getElementById('try-another-camera').style.display = 'initial';
    }
  }).catch(function (e) {
    alert(e);
    console.error(e);
  });
}

function tryAnotherCamera() {
  cameraId += 1;
  let atMaxIndex = (cameraId === numberofCameras);
  if (atMaxIndex) {
    cameraId = 0;
  }
  console.log(cameraId);
  useCamera();
}

function clearPreview() {
  document.getElementById('preview').src = '';
  document.getElementById('preview').style.opacity = 0;
  document.getElementById('placeholder').innerHTML = 'Show me a QR code';
  document.getElementById('clear-button').style.display = 'none';
}
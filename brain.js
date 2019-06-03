let overlayOpacity = 0.75;
let cameraId = 0; // default fallback
let numberofCameras = 0; // default fallback
let isScanOn = false;

document.getElementById('clear-button').style.display = 'none';
document.getElementById('try-another-camera').style.display = 'none';
$('#print-qr-code').hide();

let scanner = new Instascan.Scanner({
  video: document.getElementById('video')
});

scanner.addListener('scan', function (content) {
  console.log(content);
  var isOk = true; // content.startsWith('https://localhost/');
  if (isScanOn && isOk) {
    document.getElementById('preview').src = content.replace(/^http:/,'https:');
    document.getElementById('preview').style.opacity = overlayOpacity;
    document.getElementById('placeholder').innerHTML = '';
    document.getElementById('clear-button').style.display = 'initial';
    // this line will auto-open the content in another window:
    // window.open(content);
  }
});

function scanNow() {
  isScanOn = true;
  document.getElementById('scan').style.background = 'blue';
  document.getElementById('scan').style.color = 'white';
  document.getElementById('scan').innerHTML = 'Scanning...';
  let interval = 5000;
  setTimeout(function() {
    isScanOn = false;
    document.getElementById('scan').style.background = 'yellow';
    document.getElementById('scan').style.color = 'black';
    document.getElementById('scan').innerHTML = 'Scan Now';
  }, interval);
}

function autoScan() {
  document.getElementById('auto-scan').style.background = 'blue';
  alert('Warning: Auto-scan will use more battery.');
  isScanOn = true;
}

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

function createQRCode() {
  var data = $('#data').val();
  $('#qr-code').empty();
  if (data) {
    $('#qr-code').qrcode(data);
    $('#print-qr-code').show();
  } else {
    $('#print-qr-code').hide();
  }
};

$('#data').keyup(createQRCode);
$('#data').change(createQRCode);

function printQRCode() {
  let elemID = 'qr-code';
  $('body > :not(#' + elemID + ')').hide();
  $('#' + elemID).appendTo('body');
  window.print();
  $('#' + elemID).appendTo('#qr-code-container');
  $('#scan').show();
  $('#auto-scan').show();
  $('#overlay').show();
  $('#create-qr-code').show();
  return true;
}
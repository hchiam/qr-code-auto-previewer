let overlayOpacity = 0.75;
let cameraId = 0; // default fallback
let numberofCameras = 0; // default fallback
let isScanOn = false;

$('#clear-button').hide();
$('#try-another-camera').hide();
$('#print-qr-code').hide();
$('#auto-scan').hide();

let scanner = new Instascan.Scanner({
  video: document.getElementById('video')
});
scanner.addListener('scan', function (content) {
  console.log(content);
  var isOk = content.startsWith('https://') || content.startsWith('http://');
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
  scanner.start(cameraSelected);
  isScanOn = true;
  $('#scan').text('Scanning...').addClass('scanning');
  $('#auto-scan').hide();
  let interval = 5000;
  setTimeout(function() {
    isScanOn = false;
    $('#scan').text('Scan Now').removeClass('scanning');
    $('#auto-scan').show();
    scanner.stop(cameraSelected);
    webcamOn();
  }, interval);
}

function autoScan() {
  if (isScanOn == false) {
    $('#auto-scan').addClass('scanning');
    alert('Warning: Auto-scan will use more battery.');
    isScanOn = true;
    $('#scan').hide();
    scanner.start(cameraSelected);
  } else {
    $('#auto-scan').removeClass('scanning');
    isScanOn = false;
    $('#scan').show();
    scanner.stop(cameraSelected);
    webcamOn();
  }
}

useCamera();
let cameraSelected
function useCamera() {
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      numberofCameras = cameras.length;
      cameraSelected = cameras[cameraId];
      if (isScanOn) {
        scanner.start(cameraSelected);
      }
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

$('#data').keyup(createQRCode);
$('#data').change(createQRCode);
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

function printQRCode() {
  let elemID = 'qr-code';
  let urlDisplay = 'url-display';
  $('#url-display').show().text($('#data').val());
  $('body > :not(#' + elemID + '):not(#' + urlDisplay + ')').hide();
  $('#' + urlDisplay).appendTo('body');
  $('#' + elemID).appendTo('body');
  window.print();
  $('#' + elemID).appendTo('#qr-code-container');
  $('#url-display').hide();
  $('#scan').show();
  $('#auto-scan').show();
  $('#overlay').show();
  $('#create-qr-code').show();
  return true;
}

webcamOn();
function webcamOn() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
      video: {
        width: 600,
        height: 600
      }
    }).then(function(stream) {
      let video = document.querySelector("video");
      video.srcObject = stream;
    }).catch(function(err) {
      console.error(err.message);
    });
  }
}

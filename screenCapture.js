let captureInterval;
const apiEndpoint = 'http://65.2.5.121/screen/actions'; // The specified API endpoint

document.getElementById('startCapture').addEventListener('click', startCapture);
document.getElementById('stopCapture').addEventListener('click', stopCapture);

async function startCapture() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const video = document.getElementById('screenVideo');
        video.srcObject = stream;

        captureInterval = setInterval(async () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            const blob = dataURItoBlob(dataUrl);
            await sendToAPI(blob);
        }, 1000);
    } catch (err) {
        console.error('Error: ' + err);
    }
}

function stopCapture() {
    clearInterval(captureInterval);
    const video = document.getElementById('screenVideo');
    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
}

async function sendToAPI(blob) {
    const formData = new FormData();
    formData.append('file', blob, 'screenshot.png');

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log('Image sent successfully');
    } catch (err) {
        console.error('Error sending data to API: ' + err);
    }
}

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}


// document.getElementById('vishrutButton').addEventListener('click', vishrutCall);

// async function vishrutCall() {
//   const a = await fetch("http://65.2.5.121/screen/actions", {
//     "headers": {
//       "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8",
//       "accept-language": "en-GB,en",
//       "cache-control": "max-age=0",
//       "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryC1UjzYq97IIge7kk",
//       "sec-gpc": "1",
//       "upgrade-insecure-requests": "1"
//     },
//     "referrer": "http://65.2.5.121/screen/actions",
//     "referrerPolicy": "strict-origin-when-cross-origin",
//     "body": "------WebKitFormBoundaryC1UjzYq97IIge7kk\r\nContent-Disposition: form-data; name=\"image\"; filename=\"Screenshot 2024-06-13 001443.png\"\r\nContent-Type: image/png\r\n\r\n\r\n------WebKitFormBoundaryC1UjzYq97IIge7kk\r\nContent-Disposition: form-data; name=\"visualize\"\r\n\r\non\r\n------WebKitFormBoundaryC1UjzYq97IIge7kk--\r\n",
//     "method": "POST",
//     "mode": "cors",
//     "credentials": "omit"
//   });
//   console.log(a);
// }

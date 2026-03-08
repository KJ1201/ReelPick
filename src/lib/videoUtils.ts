export async function generateVideoThumbnail(videoFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        video.autoplay = true;
        video.muted = true;
        video.src = URL.createObjectURL(videoFile);

        video.onloadeddata = () => {
            // Seek to 1 second (or start if shorter) to get a good frame
            video.currentTime = Math.min(video.duration, 1);
        };

        video.onseeked = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context?.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg");
            URL.revokeObjectURL(video.src);
            resolve(dataUrl);
        };

        video.onerror = (e) => {
            reject(e);
        };
    });
}

export async function dataURLtoBlob(dataurl: string): Promise<Blob> {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

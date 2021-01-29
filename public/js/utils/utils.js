const compressImage = async (file, quality = 0.8) => {
  const base64 = await fileReaderToBase64(file);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = base64;
    image.onload = e => {
      console.log(e);
      const imageTarget = e.path[0];
      const { width, height } = imageTarget;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
      context?.clearRect(0, 0, width, height);
      context?.drawImage(imageTarget, 0, 0, width, height);
      canvas.toBlob(
        blob => {
          resolve(blob);
        },
        'image/jpeg',
        quality
      );
      return;
    };

    image.onerror = e => reject(e);
  });
};

const convertBase64UrlToBlob = (urlData, type, filename) => {
  const arr = urlData.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  if (type === 'file' && filename) {
    return new File([u8arr], filename, { type: mime });
  }
  return new Blob([u8arr], {
    type: mime
  });
};

const fileReaderToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = res => {
      resolve(res.currentTarget.result);
    };
    reader.onerror = e => reject(e);
  });
};

const downloadFile = (data, type, filename = 'download') => {
  const blob = new Blob([data], { type });
  const objectUrl = URL.createObjectURL(blob);
  let elA = document.createElement('a');
  elA.href = objectUrl;
  elA.download = filename;
  // elA.click();
  // 下面这个写法兼容火狐
  elA.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  elA = null;
  window.URL.revokeObjectURL(objectUrl);
};

const throttle = function(fn, delay = 500) {
  let flag = true;
  return (...args) => {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, args);
      flag = true;
    }, delay);
  };
};
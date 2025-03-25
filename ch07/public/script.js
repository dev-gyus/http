class Downloader {
  constructor(controller) {
    this.controller = controller;
  }
  render() {
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download';
    downloadButton.addEventListener('click', () => {
      // this.download();
      this.downloadWithAbort()
    });
    document.body.appendChild(downloadButton);
  }
  async download() {
    try {
      const res = await fetch('/chunk');
      const totalLength = Number(res.headers.get('Content-Length'));
      const chunks = [];
      let receivedLength = 0;

      const reader = res.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          this.renderResponseBody(chunks);
          break;
        }
        chunks.push(value);
        receivedLength += value.length;
        this.renderProgress(receivedLength, totalLength);
      }

    } catch (error) {
      console.error(`다운로드 중 오류 발생:`, error);
    }
  }

  async downloadWithAbort() {
    try {
      const res = await fetch('/chunk', {
        // 취소 가능한 요청이 됨
        signal: this.controller.signal,
      });
      const totalLength = Number(res.headers.get('Content-Length'));
      const chunks = [];
      let receivedLength = 0;

      const reader = res.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          this.renderResponseBody(chunks);
          break;
        }
        chunks.push(value);
        receivedLength += value.length;
        this.renderProgress(receivedLength, totalLength);
      }

    } catch (error) {
      console.error(`다운로드 중 오류 발생:`, error);
    }
  }

  renderResponseBody(chunks) {
    const textDecoder = new TextDecoder('utf-8');
    const responseText = chunks.map(chunk => textDecoder.decode(chunk)).join('');
    const el = this.download.createElement('div');
    el.textContent = responseText;
    document.body.appendChild(el);
  }

  renderProgress(receivedLength, totalLength) {
    const gaugeEl = document.createElement('div');
    gaugeEl.textContent = `${receivedLength} / ${totalLength} byte downloaded \n`
    document.body.appendChild(gaugeEl);
  }
}

class Aborter {
  constructor(controller) {
    this.controller = controller;
  }
  render() {
    const abortButton = document.createElement('button');
    abortButton.textContent = 'abort';
    abortButton.addEventListener('click', () => {
      this.controller.abort();

      const cancelMsgEl = document.createElement('p');
      cancelMsgEl.textContent = 'Download canceled';
      cancelMsgEl.style.color = 'red';
      document.body.appendChild(cancelMsgEl);
    });
    document.body.appendChild(abortButton);
  }
}

class Uploader {
  render() {
    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      this.upload(file);
    });
    document.body.appendChild(uploadInput);
  }
  upload(file) {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
      this.renderProgress(e);
    });
    xhr.open("POST", '/upload');
    xhr.send(formData);
  }
  renderProgress(e) {
    let uploadProgress = 0;
    if (e.lengthComputable) {
      uploadProgress = Math.round((e.loaded / e.total) * 100);
      const uploadGauge = document.createElement('div');
      uploadGauge.textContent = `[progress]: ${uploadProgress}% uploaded`;
      document.body.appendChild(uploadGauge);
    }
  }
}
const init = () => {
  const controller = new AbortController();

  const downloader = new Downloader(controller);
  downloader.render();

  const aborter = new Aborter(controller)
  aborter.render();

  const uploader = new Uploader();
  uploader.render();
};

document.addEventListener('DOMContentLoaded', init);
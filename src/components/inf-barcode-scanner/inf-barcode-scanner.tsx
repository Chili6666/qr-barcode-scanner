import { Component, ComponentInterface, Host, h } from '@stencil/core';
import { scanImageData } from '@undecaf/zbar-wasm';

@Component({
  tag: 'inf-barcode-scanner',
  styleUrl: 'inf-barcode-scanner.css',
  shadow: true,
})
export class InfBarcodeScanner implements ComponentInterface {
  private scanner!: HTMLVideoElement;
  private readonly SCAN_PROID_MS = 800;

  private sleep = ms =>
    new Promise(r => {
      setTimeout(r, ms);
    });

  private scan = async () => {
    const canvas = document.createElement('canvas');
    const width = this.scanner.videoWidth;
    const height = this.scanner.videoHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.scanner, 0, 0, width, height);
    const imgData = ctx.getImageData(0, 0, width, height);


   //TODO PAOLA  I can not access the wasm file. check the console output. Maybe we have to use this lib here: https://www.npmjs.com/package/@rollup/plugin-wasm
   //link to the barcode scan lib: https://github.com/undecaf/zbar-wasm/tree/master
   

    const res = await scanImageData(imgData);
    // // console.log(res, Date.now());
    // this.renderOverlay(res);

    // console.log(`width: ${width} - height: ${height}`);
  };

    private renderOverlay = (res: any) : void =>{

    };

  async componentDidLoad(): Promise<void> {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'environment',
        width: { max: 640 },
        height: { max: 640 },
      },
    });

    if (!mediaStream) {
      console.error(`mediaStream: ${mediaStream}`);
    } else {
      this.scanner.srcObject = mediaStream;
      this.scanner.setAttribute('playsinline', '');
      this.scanner.play();
      await new Promise(r => {
        this.scanner.onloadedmetadata = r;
      });
    }

    while (true) {
      await this.scan();
      await this.sleep(this.SCAN_PROID_MS);
    }
  }

  render() {
    return (
      <Host>
        <div class="scanner-container">
          <video ref={el => (this.scanner = el as HTMLVideoElement)}></video>
          <div class="laser"></div>
        </div>
      </Host>
    );
  }
}

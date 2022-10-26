import 'phaser';
import Scene from './Scene';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#0827F5',
  width: 1920,
  height: 1080,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: Scene
};

const init = () => {
  console.log('Hello from main.ts');
  const game = new Phaser.Game(config);
  
  if ("serial" in navigator) {
    // The Web Serial API is supported.
    console.log('serial supported');
    document.querySelector('.serialButton').addEventListener('click', async () => {
      // Prompt user to select any serial port.
      const port = await navigator.serial.requestPort();

      //wait for port to open.
      await port.open({ baudRate: 9600 });

      console.log('port open');

      //start reading for incoming data from the serial device as 
      // const textDecoder = new TextDecoderStream();
      // const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      // const reader = textDecoder.readable.getReader();


      // const textEncoder = new TextEncoderStream();
      // const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

      // const writer = textEncoder.writable.getWriter();
      // await writer.write("coderona");

      // // Listen to data coming from the serial device.
      // while (true) {
      //   const { value, done } = await reader.read();
      //   if (done) {
      //     // Allow the serial port to be closed later.
      //     reader.releaseLock();
      //     break;
      //   }
      //   // value is a Uint8Array.
      //   console.log(value);
      // }
    });
  }
}

init()
postMessage({ payload: 'removeLoading' }, '*')

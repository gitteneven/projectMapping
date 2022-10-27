//todo

//implement serial communication to communicate to the arduino when the powerup button can be used as bootup button for the game
//start serial comm
//remove button from screen when successful
// send signal when connected that powerup button can be used (pass through 'bootup' to arduino)
//turn on powerup button in the arduino IDE when incoming message == 'bootup'

//activate powerup bootup for the startscene OK
//activate powerup bootup for the game-over scene, if this case then no need to press this again within the startscene as well.

//fix restarting game screen

import 'phaser';
import GameScene from './GameScene';
import StartScene from './StartScene';
import UserWinsScene from './UserWinsScene';
import CoderonaWinsScene from './CoderonaWinsScene';

const serialConnect = document.querySelector('.connect__serialButton');
const connectWindow = document.querySelector('.connect');
let writer;

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
  parent: 'app',
  scene: [StartScene, GameScene, UserWinsScene, CoderonaWinsScene],
  arduinoWriter: null,
  gameRestart: false,
  // scene: CoderonaWinsScene
};

const handleClickConnect = async () => {
  // Prompt user to select any serial port.
  const port = await navigator.serial.requestPort();

  //wait for port to open.
  await port.open({ baudRate: 9600 });

  console.log('port open');

  //start reading for incoming data from the serial device as 
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();

  const textEncoder = new TextEncoderStream();
  const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

  writer = textEncoder.writable.getWriter();

  //write bootup on start of connection
  // await writer.write("bootup");

  //start the game
  let game = new Phaser.Game(config);
  game.config.arduinoWriter = writer;
  game.config.gameRestart = false;
  connectWindow.classList.add('hidden');

  // Listen to data coming from the serial device.
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      // Allow the serial port to be closed later.
      reader.releaseLock();
      break;
    }
    // value is a Uint8Array.
    console.log(value);
  }
}

const init = () => {
  console.log('Hello from main.ts');
  
  if ("serial" in navigator) {
    // The Web Serial API is supported.
    console.log('serial supported');
    serialConnect.addEventListener('click', handleClickConnect);
  }
}

init()
postMessage({ payload: 'removeLoading' }, '*')

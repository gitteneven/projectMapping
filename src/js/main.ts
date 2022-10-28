import 'phaser';
import GameScene from './GameScene';
import StartScene from './StartScene';
import UserWinsScene from './UserWinsScene';
import CoderonaWinsScene from './CoderonaWinsScene';

const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const serialConnect = document.querySelector('.connect__serialButton');
const connectWindow = document.querySelector('.connect');

let writer;
let serPort;
let arduinoPortPath;

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  width: 1920,
  height: 1080,
  
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  parent: 'app',
  scene: [StartScene, GameScene, UserWinsScene, CoderonaWinsScene],
  arduinoWriter: null,
  gameRestart: false,
  serPort: null
};

const writeonSer = (data) => {
  //Write the data to serial port.
  console.log('going to write ', data);

  serPort.write(data, (err) => {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });

}

const handleClickConnect = async () => {
  console.log('opening new serial port');

  await SerialPort.list().then((ports, err) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('ports', ports);

    if (ports.length === 0) {
      console.log('No ports discovered');
    } else {
      //loop through ports to find the arduino llc connection
      ports.forEach((port) => {
        if (port.manufacturer === 'Arduino LLC') {
          console.log('arduino found');
          arduinoPortPath = port.path;
        } 
      });
    }
  })

  //connecting to the serial port for the arduino
  serPort = await new SerialPort({ path: arduinoPortPath, baudRate: 9600 });

  //parse incoming data line-by-line from serial port.
  const parser = serPort.pipe(new ReadlineParser({ delimiter: '\r\n' }))
  parser.on('data', (event) => { console.log(event) });

  //add listener to close port before page refresh
  window.onbeforeunload = () => {
    serPort.close();
  };

  let game = new Phaser.Game(config);
  game.config.serPort = serPort;
  game.config.gameRestart = false;
  connectWindow.classList.add('hidden');
}

const init = () => {  
  if ("serial" in navigator) {
    // The Web Serial API is supported.
    console.log('serial supported');
    serialConnect.addEventListener('click', handleClickConnect);
  }
}

init()
postMessage({ payload: 'removeLoading' }, '*')

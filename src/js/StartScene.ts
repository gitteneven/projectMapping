import Phaser, { Sound } from "phaser";

let textUser, textCoderona, textCountdown;
let coderona, user, bootButton, welcome;
let welcomeStarted = false;
let welcomeEnded = false;
let fight;
let countdownStarted = false;

let userReady = false;
let coderonaReady = false;

let countdownStartTimer;
let initialTime = 3;
let normalSound;
let fightSound;
let goodSound;

export default class StartScene extends Phaser.Scene {
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private leftCap?: Phaser.GameObjects.Image
  private middle?: Phaser.GameObjects.Image
  private rightCap?: Phaser.GameObjects.Image
  private fullWidth?: number

  constructor() {
    super('startscene');
  }

  preload() {
    //welcome video
    this.load.video('welcome', 'assets/welcome2.mp4', 'loadeddata', false, true);
    this.load.video('fight', 'assets/fightloop.mp4', 'loadeddata', false, true);
    
    this.load.audio('good-sound', 'assets/audio/loopGood.mp3')
    this.load.audio('normal-sound', 'assets/audio/loopNormal.mp3')
    this.load.audio('fight-sound', 'assets/audio/fightsfx.mp3')
  }

  async create() {
    console.log('in startscene', this.game.config.gameRestart);

    if(this.game.config.gameRestart == true) {
      console.log('going to restart this scene');

      // this.scene.stop();

      console.log(welcome.getCurrentTime());
      console.log(welcome);
      console.log(welcome.getCurrentTime());
      welcomeStarted = false;
      welcomeEnded = false;
      userReady = false;
      coderonaReady = false;
      countdownStarted = false;
      countdownStartTimer = null;
      initialTime = 3;

      goodSound = this.sound.add('good-sound', { loop: true });
      goodSound.setVolume(0.2)
      goodSound.play();
    } else {
      // console.log(this.game.config.arduinoWriter);
      await this.game.config.serPort.write('bootup', (err) => {
        if (err) {
          return console.log('Error on write: ', err.message);
        }
        console.log('message written');
      });
    }

    

    //background video
    welcome = this.add.video(0, 0, 'welcome').setOrigin(0, 0);
    if(welcome.isPlaying()) {
      console.log('welcome is playing');
      welcome.setPaused(true);
    }
    
    welcome.on('complete', () => {
      goodSound.stop()
      fightSound = this.sound.add('fight-sound', { loop: false });
      fightSound.setVolume(0.2)
      fightSound.play();
      normalSound = this.sound.add('normal-sound', { loop: true });
      normalSound.setVolume(0.2)
      normalSound.play();
      console.log('video ended, let users press butons and play fightloop');
      welcome.stop();

      textCountdown.setText([
        `Press when ready`
      ]);

      fight = this.add.video(0, 0, 'fight').setOrigin(0, 0);
      fight.setLoop(true);
      fight.play();
     
      welcomeEnded = true;
    });

    this.cursors = this.input.keyboard.createCursorKeys()
    this.input.mouse.disableContextMenu();

    //players
    coderona = this.input.keyboard.addKey('C');
    user = this.input.keyboard.addKey('U');
    bootButton = this.input.keyboard.addKey('P');

   

    // test text
    textUser = this.add.text(1690, 660, '', { font: '72px lores-9-plus-wide', color: '#ffffff' }).setOrigin(0.5, 0.5).setDepth(1);
    textCoderona = this.add.text(230, 660, '', { font: '64px lores-9-plus-wide', color: '#ffffff' }).setOrigin(0.5, 0.5).setDepth(1);
    textCountdown = this.add.text(960, 340, '', { font: '80px lores-9-plus-wide', color: '#ffffff' }).setOrigin(0.5, 0.5).setDepth(1);
   
    //action of setup team to boot up the game and play the starting video
    bootButton.on('down', () => {
      if(!welcomeStarted) {
        console.log('bootup clicked, start video sequence of the game');
        welcomeStarted = true;
        // welcome.setVisibility(true);
        welcome.play();

        goodSound = this.sound.add('good-sound', { loop: true });
        goodSound.setVolume(0.2)
        goodSound.play();
      }
    });

    //actions of the users
    coderona.on('down', () => {
      if(welcomeEnded){
        coderonaReady = true;
        console.log('coderona is ready');
        textCoderona.setText([
          'READY'
        ]);

        if (userReady && coderonaReady && !countdownStarted) {
          countdownStarted = true;
          textCountdown.setText([
            `00: 0${initialTime}`
          ]);
          console.log('start game');
          // this.scene.start('gamescene');
          countdownStartTimer = this.time.addEvent({ delay: 1000, callback: this.secondCountdownStart, callbackScope: this, loop: true });
        }
      }
    })

    user.on('down', () => {
      if (welcomeEnded) {
        userReady = true;
        console.log('user is ready');
        textUser.setText([
          'READY'
        ]);

        if (userReady && coderonaReady && !countdownStarted) {
          countdownStarted = true;
          console.log('start game');
          textCountdown.setText([
            `00:0${initialTime}`
          ]);
          countdownStartTimer = this.time.addEvent({ delay: 1000, callback: this.secondCountdownStart, callbackScope: this, loop: true });
        }
      }
    })

    if (this.game.config.gameRestart == true) {
      console.log('autoplaying the video on restart game');
      welcome.setCurrentTime(0);
      welcome.play();
      // welcome.setVisibility(true);
      this.game.config.gameRestart = false;
    }
  }

  secondCountdownStart() {
    if(initialTime >= 1) {
      initialTime -= 1;
      console.log(initialTime);
      textCountdown.setText([
        `00:0${initialTime}`
      ]);
    } else {
      //timer is at end, start game;
      // this.game.config.gameRestart = true;
      // this.scene.start('startscene');
      normalSound.stop();
      this.game.config.gameRestart = true;
      this.scene.start('gamescene');
    }
  }

  update() {

  }
}
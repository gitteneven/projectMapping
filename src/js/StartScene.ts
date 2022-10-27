import Phaser from "phaser";

let textUser, textCoderona, textCountdown;
let coderona, user, bootButton, welcome;
let welcomeStarted = false;
let welcomeEnded = false;
let countdownStarted = false;

let userReady = false;
let coderonaReady = false;

let countdownStartTimer;
let initialTime = 3;

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
    this.load.video('welcome', 'assets/welcome.mp4', 'loadeddata', false, true);
    this.load.video('fight', 'assets/fightloop.mp4', 'loadeddata', false, true);
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
    } else {
      console.log(this.game.config.arduinoWriter);
      await this.game.config.arduinoWriter.write('bootup');
    }

    

    //background video Game
    welcome = this.add.video(0, 0, 'welcome').setOrigin(0, 0);
    // welcome.setViscuuuuuibility(false);
    welcome.on('complete', () => {
      console.log('video ended, let users press butons and play fightloop');
      welcome.changeSource('fight');
      var loop = welcome.getLoop();  // loop: true/false
      welcome.setLoop(loop); 
      welcome.play(true);

      welcomeEnded = true;
    });

    this.cursors = this.input.keyboard.createCursorKeys()
    this.input.mouse.disableContextMenu();

    //players
    coderona = this.input.keyboard.addKey('C');
    user = this.input.keyboard.addKey('U');
    bootButton = this.input.keyboard.addKey('P');

    // test text
    textUser = this.add.text(1690, 660, '', { font: '72px lores-9-plus-wide', color: '#ffffff'}).setOrigin(0.5, 0.5);
    textCoderona = this.add.text(230, 660, '', { font: '64px lores-9-plus-wide', color: '#ffffff' }).setOrigin(0.5, 0.5);
    textCountdown = this.add.text(960, 300, '', { font: '80px lores-9-plus-wide', color: '#ffffff' }).setOrigin(0.5, 0.5);
   
    //action of setup team to boot up the game and play the starting video
    bootButton.on('down', () => {
      if(!welcomeStarted) {
        console.log('bootup clicked, start video sequence of the game');
        welcomeStarted = true;
        // welcome.setVisibility(true);
        welcome.play();
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
      this.game.config.gameRestart = true;
      this.scene.start('gamescene');
    }
  }

  update() {

  }
}
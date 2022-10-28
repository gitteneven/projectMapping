import Phaser from "phaser";
import StartScene from "./StartScene";

let textReboot, bootButton, background;
let videoEnded = false;

export default class CoderonaWinsScene extends Phaser.Scene {
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private leftCap?: Phaser.GameObjects.Image
  private middle?: Phaser.GameObjects.Image
  private rightCap?: Phaser.GameObjects.Image
  private fullWidth?: number

  constructor() {
    super('coderonawinsscene');
  }

  preload() {
    //user wins video
    // this.load.video('coderonawins', 'assets/corrupted.mp4', 'loadeddata', false, false);
    // this.load.video('coderonawins', 'assets/viruswins_nogrid.mp4', 'loadeddata', false, false);
    // this.load.video('coderonawins', 'assets/viruswins_nogrid_hd.mp4', 'loadeddata', false, false);
    this.load.video('coderonawins', 'assets/corrupted_final.mp4', 'loadeddata', false, false);
  }

  create() {
    //background video Game
    background = this.add.video(0, 0, 'coderonawins').setOrigin(0, 0).setVolume(0.7);
    background.play();
    background.on('complete', async () => {
      console.log('video ended, let users press butons');
      videoEnded = true;
      textReboot.setText([
        `Reboot BK6?`
      ]);

      await this.game.config.serPort.write('bootup', (err) => {
        if (err) {
          return console.log('Error on write: ', err.message);
        }
        console.log('message written');
      });
    });

    // this.cursors = this.input.keyboard.createCursorKeys()
    this.input.mouse.disableContextMenu();

    bootButton = this.input.keyboard.addKey('P');

    // test text
    textReboot = this.add.text(960, 340, '', { font: '80px lores-9-plus-wide', color: '#ffffff' }).setOrigin(0.5, 0.5);

    //action of setup team to boot up the game and play the starting video
    bootButton.on('down', () => {
      if (videoEnded) {
        console.log('bootup clicked, restart the game');

        this.game.config.gameRestart = true;
        this.scene.start('startscene');
      }
    });

    if (this.game.config.gameRestart == true) {
      background.setCurrentTime(0);
      background.play();
      // welcome.setVisibility(true);
      this.game.config.gameRestart = false;
    }
  }

  update() {

  }
}
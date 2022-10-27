import Phaser from "phaser";
import HealthBar from "./HealthBar";
// import PowerupBar from "./PowerupBar";
import ErrorPopups from "./ErrorPopups";

let coderona, user, bar, back_healthbar, top_healthbar, blue, background;
let userEnabled = true;
let errorCount = 0;
let userCount = 0;
let coderonaCount = 0;

let mouseUp, mouseLeft, mouseDown, mouseRight, powerupActivate;
let mouseCoordinates = { x: 1040, y: 830 };

let errorContainer = {
    xStart: 226,
    xEnd: 1864,
    yStart: 692,
    yEnd: 966
}
let errorWidth = 240;
let errorHeight = 153;

let countdownStartTimer, textCountdown;
let initialTime = 10;

function playerHitPopup (popup, popupX) {
    console.log('user hit popup');
    popup.destroy();
    popupX.destroy();

    userEnabled = true;
    errorCount -= 1;
}

export default class GameScene extends Phaser.Scene {
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private leftCap?: Phaser.GameObjects.Image
    private middle?: Phaser.GameObjects.Image
    private rightCap?: Phaser.GameObjects.Image
    private fullWidth?: number

    constructor() {
        super('gamescene');
    }

    preload() {
        //background image
        this.load.video('background', 'assets/game_5.mp4', 'loadeddata', false, true)

        //cursor image
        this.load.image('cursor', 'assets/cursor.png');

        //healthbar
        this.load.image('left-cap', 'assets/redbar-left.png')
        this.load.image('middle', 'assets/redbar-middle.png')
        this.load.image('right-cap', 'assets/redbar-right.png')

        this.load.image('back_healthbar', 'assets/loading_bar-back.png')
        this.load.image('top_healthbar', 'assets/loading_bar-top.png')
        this.load.image('blue', 'assets/fullblue.png')

        //powerup
        // this.load.image('left-cap', 'assets/redbar-left.png')
        // this.load.image('middle', 'assets/redbar-middle.png')
        // this.load.image('right-cap', 'assets/redbar-right.png')

        // this.load.image('back_healthbar', 'assets/loading_bar-back.png')
        // this.load.image('top_healthbar', 'assets/loading_bar-top.png')
        // this.load.image('blue', 'assets/fullblue.png')

        this.load.image('error-popup', 'assets/errorframered.png');
        this.load.image('error-x', 'assets/errorframex.png');

        // this.load.image('logo', 'assets/phaser3-logo.png');
        // this.load.image('libs', 'assets/libs.png');
        // this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        // this.load.glsl('stars', 'assets/starfields.glsl.js');
    }

    create() {
        console.log(this.game.config.gameRestart);

        if (this.game.config.gameRestart == true) {
            console.log('going to restart the game scene');

            userEnabled = true;
            errorCount = 0;
            userCount = 0;
            coderonaCount = 0;
            mouseCoordinates = { x: 1040, y: 830 };

            initialTime = 10;
        }

        //background video Game
        background = this.add.video(0, 545, 'background').setOrigin(0, 0.5)
        var loop = background.getLoop();  // loop: true/false
        background.setLoop(loop);  // loop: true/false
        background.play(true);

        // this.add.image(0, 0, 'cursor').setOrigin(0);
        this.player = this.physics.add.sprite(mouseCoordinates.x, mouseCoordinates.y, 'cursor').setOrigin(0, 0).setScale(.1).setDepth(1);
        this.cursors = this.input.keyboard.createCursorKeys()
        this.input.mouse.disableContextMenu();

        //players
        coderona = this.input.keyboard.addKey('C');
        user = this.input.keyboard.addKey('U');
        mouseUp = this.input.keyboard.addKey('t');
        mouseLeft = this.input.keyboard.addKey('l');
        mouseDown = this.input.keyboard.addKey('b');
        mouseRight = this.input.keyboard.addKey('r');
        powerupActivate = this.input.keyboard.addKey('p');

        //health bar
        // this.fullWidth = 117;
        this.fullWidth = 829;

        back_healthbar = this.add.image(55, 645, 'back_healthbar').setOrigin(0, 0.5)
        blue = this.add.image(55, 645, 'blue').setOrigin(0, 0.5)

        this.leftCap = this.add.image(75, 645, 'left-cap').setOrigin(0, 0.5)
        this.middle = this.add.image(this.leftCap.x + this.leftCap.width, 645, 'middle')
            .setOrigin(0, 0.5)

        this.rightCap = this.add.image(this.middle.x + this.middle.displayWidth, 645, 'right-cap')
            .setOrigin(0, 0.5)

        this.setMeterPercentage(1)

        top_healthbar = this.add.image(55, 645, 'top_healthbar').setOrigin(0, 0.5)
        
        //actions of the users
        coderona.on('down', () => {
            coderonaCount += 1;
        })

        user.on('down', () => {
            if(userEnabled) {
                userCount += 1;
            }
        })

        mouseUp.on('down', () => {
            if (mouseCoordinates.y - 10 > errorContainer.yStart) {
                mouseCoordinates.y -= 10;
            }
        });

        mouseDown.on('down', () => {
            if (mouseCoordinates.y + 10 < errorContainer.yEnd - 60) {
                mouseCoordinates.y += 10;
            }
        });

        mouseLeft.on('down', () => {
            if (mouseCoordinates.x - 10 > errorContainer.xStart) {
                mouseCoordinates.x -= 10;
            }
        });

        mouseRight.on('down', () => {
            if (mouseCoordinates.x + 10 < errorContainer.xEnd - 39) {
                mouseCoordinates.x += 10;
            }
        });

        powerupActivate.on('down', () => {
            console.log('powerup activated, spawn errors');

            userEnabled = false;
            errorCount += 1;

            let errorX = Phaser.Math.Between(errorContainer.xStart, errorContainer.xEnd - errorWidth);
            let errorY = Phaser.Math.Between(errorContainer.yStart, errorContainer.yEnd - errorHeight);

            let popup = this.physics.add.sprite(errorX, errorY, 'error-popup').setOrigin(0, 0);
            let popupX = this.physics.add.sprite(errorX + 200, errorY + 11, 'error-x').setOrigin(0, 0);

            this.physics.add.collider(this.player, popupX, () => { playerHitPopup(popup, popupX) });
        }); 
        
        //start countdown on scene boot
        textCountdown = this.add.text(960, 230, `00:${initialTime}`, { font: '80px lores-9-plus-wide', color: '#ffffff' }).setOrigin(0.5, 0.5);
        countdownStartTimer = this.time.addEvent({ delay: 1000, callback: this.gameCountdownStep, callbackScope: this, loop: true });
    }

    gameCountdownStep() {
        if (initialTime >= 1) {
            initialTime -= 1;
            if (initialTime.toString().length == 1) {
                textCountdown.setText([
                    `00:0${initialTime}`
                ]); 
            } else {
                textCountdown.setText([
                    `00:${initialTime}`
                ]); 
            }
        } else {
            this.decideGameWinner();
        }
    }

    decideGameWinner() {
        console.log('decide winner here');
        if(userCount > coderonaCount) {
            //user wins
            console.log('user wins');
            //start user wins scene
            this.game.config.gameRestart = true;
            this.scene.start('userwinsscene');
        } else {
            //coderona wins
            console.log('coderona wins');
            //start coderona wins scene
            this.game.config.gameRestart = true;
            this.scene.start('coderonawinsscene');
        }
    }

    setMeterPercentage(percent = 1) {
        const width = this.fullWidth

        this.middle.displayWidth = width
        this.rightCap.x = this.middle.x + this.middle.displayWidth
    }

    update() {
        let totalDifference = userCount - coderonaCount;

        if(totalDifference > 0) {
            if (totalDifference < 10) {
                this.drawHealthBar(0);
            } else if (totalDifference < 20) {
                this.drawHealthBar(-1);
            } else if (totalDifference < 30) {
                this.drawHealthBar(-2);
            } else if (totalDifference < 40) {
                this.drawHealthBar(-3);
            } else {
                this.drawHealthBar(-4);
            }
        } else {
            if (totalDifference > -10) {
                this.drawHealthBar(0);
            } else if (totalDifference > -20) {
                this.drawHealthBar(1);
            } else if (totalDifference > -30) {
                this.drawHealthBar(2);
            } else if (totalDifference > -40) {
                this.drawHealthBar(3);
            } else {
                this.drawHealthBar(4);
            }
        }

        this.physics.moveToObject(this.player, mouseCoordinates, 300, 250);
    }

    drawHealthBar(bricks) {
        let newWidth = 829 + (bricks * 178);
        this.fullWidth = newWidth;
        this.setMeterPercentage(1)
    }
}
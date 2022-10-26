import Phaser from "phaser";
import HealthBar from "./HealthBar";
// import PowerupBar from "./PowerupBar";
import ErrorPopups from "./ErrorPopups";

var text1;
var text2;
var text3;
let coderona;
let user;
let bar;
let back_healthbar;
let top_healthbar;
let blue;
let background
let userEnabled = true;
let errorCount = 0;

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

function playerHitPopup (popup, popupX) {
    console.log('user hit popup');
    popup.destroy();
    popupX.destroy();

    userEnabled = true;
    errorCount -= 1;
}

export default class Scene extends Phaser.Scene {
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private leftCap?: Phaser.GameObjects.Image
    private middle?: Phaser.GameObjects.Image
    private rightCap?: Phaser.GameObjects.Image
    private fullWidth?: number

    constructor() {
        super('demo');

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

        // test text
        text1 = this.add.text(10, 10, '');
        text2 = this.add.text(500, 10, '');
        text3 = this.add.text(500, 30, '');

        //health bar
        this.fullWidth = 117;

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
            text2.setText([
                'player one ready'
            ]);
            if (this.fullWidth < 1570){
                this.fullWidth += 178

            }
            this.setMeterPercentage(1)

        })

        user.on('down', () => {
            if(userEnabled == true && errorCount == 0) {
                //we can update counter on user's side
                console.log('player one clicked')
            }
            text3.setText([
                'player two ready'
            ]);
            if(this.fullWidth >120){
                this.fullWidth -= 178
            }
            this.setMeterPercentage(1)
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

        // this.physics.moveToObject(this.player, pointer, 100, 300);
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

    }

    setMeterPercentage(percent = 1) {
        const width = this.fullWidth

        this.middle.displayWidth = width
        this.rightCap.x = this.middle.x + this.middle.displayWidth
    }

    // update() {
    //     //check if the 2 players are ready
    //     if (!this.cursors) {
    //         return
    //     }

    //     //move user with the coordinates
    //     // var pointer = this.input.activePointer;

        

    //     //listen for powerup, then spawn errors
           
    // }


    update() {
        //check if the 2 players are ready
        if (!this.cursors) {
            return
        }

        if (this.cursors?.left.isDown) {
            text3.setText([
                'player two ready'
            ]);
        };

        this.physics.moveToObject(this.player, mouseCoordinates, 300, 250);
    }
}
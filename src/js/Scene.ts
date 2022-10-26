import Phaser from "phaser";
import HealthBar from "./HealthBar";
// import PowerupBar from "./PowerupBar";
import ErrorPopups from "./ErrorPopups";

var text1;
var text2;
var text3;
var space;
var backspace;
let coderona;
let user;
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
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('demo');
    }

    preload() {
        //cursor image
        this.load.image('cursor', 'assets/cursor.png');

        //healthbar
        this.load.image('left-cap', 'assets/barHorizontal_green_left.png')
        this.load.image('middle', 'assets/barHorizontal_green_mid.png')
        this.load.image('right-cap', 'assets/barHorizontal_green_right.png')

        this.load.image('left-cap-shadow', 'assets/barHorizontal_shadow_left.png')
        this.load.image('middle-shadow', 'assets/barHorizontal_shadow_mid.png')
        this.load.image('right-cap-shadow', 'assets/barHorizontal_shadow_right.png')

        this.load.image('error-popup', 'assets/errorframered.png');
        this.load.image('error-x', 'assets/errorframex.png');

        // this.load.image('logo', 'assets/phaser3-logo.png');
        // this.load.image('libs', 'assets/libs.png');
        // this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        // this.load.glsl('stars', 'assets/starfields.glsl.js');
    }

    create() {

        // this.add.image(0, 0, 'cursor').setOrigin(0);
        this.player = this.physics.add.sprite(mouseCoordinates.x, mouseCoordinates.y, 'cursor').setOrigin(0, 0).setScale(.1).setDepth(1);
        this.cursors = this.input.keyboard.createCursorKeys()
        this.input.mouse.disableContextMenu();
        coderona = this.input.keyboard.addKey('C');
        user = this.input.keyboard.addKey('U');
        mouseUp = this.input.keyboard.addKey('t');
        mouseLeft = this.input.keyboard.addKey('l');
        mouseDown = this.input.keyboard.addKey('b');
        mouseRight = this.input.keyboard.addKey('r');
        powerupActivate = this.input.keyboard.addKey('p');

        text1 = this.add.text(10, 10, '');
        text2 = this.add.text(500, 10, '');
        text3 = this.add.text(500, 30, '');

        //health bar
        const y = 48
        const x = 10
        const fullWidth = 300

        const bar = new HealthBar(this, x, y, fullWidth)
            .withLeftCap(this.add.image(0, 0, 'left-cap'))
            .withMiddle(this.add.image(0, 0, 'middle'))
            .withRightCap(this.add.image(0, 0, 'right-cap'))
            .layout()

        //const powerupBar = new PowerupBar(this);

        coderona.on('down', () => {
            text2.setText([
                'player one ready'
            ]);
        });

        user.on('down', () => {
            if(userEnabled == true && errorCount == 0) {
                //we can update counter on user's side
                console.log('player one clicked')
            }
            text3.setText([
                'player two ready'
            ]);
        });

        mouseUp.on('down', () => {
            if(mouseCoordinates.y -10 > errorContainer.yStart) {
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

        //listen for powerup, then spawn errors
        powerupActivate.on('down', () => {
            console.log('powerup activated, spawn errors');

            userEnabled = false;
            errorCount += 1;

            let errorX = Phaser.Math.Between(errorContainer.xStart, errorContainer.xEnd - errorWidth);
            let errorY = Phaser.Math.Between(errorContainer.yStart, errorContainer.yEnd - errorHeight);

            let popup = this.physics.add.sprite(errorX, errorY, 'error-popup').setOrigin(0, 0);
            let popupX = this.physics.add.sprite(errorX + 200, errorY + 11, 'error-x').setOrigin(0, 0);

            this.physics.add.collider(this.player, popupX, () => {playerHitPopup(popup, popupX)});
        });        
    }


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
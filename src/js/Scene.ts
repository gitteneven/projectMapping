import Phaser from "phaser";
import HealthBar from "./HealthBar";

var text1;
var text2;
var text3;
var space;
var backspace;
let coderona;
let user; 


export default class Scene extends Phaser.Scene {
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys


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

        // this.load.image('logo', 'assets/phaser3-logo.png');
        // this.load.image('libs', 'assets/libs.png');
        // this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        // this.load.glsl('stars', 'assets/starfields.glsl.js');
    }

    create() {

        // this.add.image(0, 0, 'cursor').setOrigin(0);
        this.player = this.physics.add.sprite(100, 450, 'cursor')
        this.cursors = this.input.keyboard.createCursorKeys()
        this.input.mouse.disableContextMenu();
        coderona = this.input.keyboard.addKey('C');
        user = this.input.keyboard.addKey('U')

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


        // this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

        // this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);

        // this.add.image(400, 300, 'libs');


        // const logo = this.add.image(400, 70, 'logo');

        // this.tweens.add({
        //   targets: logo,
        //   y: 350,
        //   duration: 1500,
        //   ease: 'Sine.inOut',
        //   yoyo: true,
        //   repeat: -1
        // })
    }


    update() {

        //check if the 2 players are ready
        if (!this.cursors) {
            return
        }
        // if (this.cursors?.space.isDown) {
        //     console.log('player one ready');
        //     text2.setText([
        //         'player one ready'
        //     ]);
        // }

        if (this.cursors?.left.isDown) {
            text3.setText([
                'player two ready'
            ]);
        }

        coderona.on('down', () => {
            text2.setText([
                'player one ready'
            ]);
        })

        user.on('down', () => {
            text3.setText([
                'player two ready'
            ]);
        })

        //move user with the coordinates
        var pointer = this.input.activePointer;

        text1.setText([
            'x: ' + pointer.worldX,
            'y: ' + pointer.worldY,
            'isDown: ' + pointer.isDown
        ]);

        this.physics.moveToObject(this.player, pointer, 800);

    }


}
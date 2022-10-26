import Phaser from "phaser";
import HealthBar from "./HealthBar";

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

    }

    create() {
        //background video Game
        background = this.add.video(0, 545, 'background').setOrigin(0, 0.5)
        var loop = background.getLoop();  // loop: true/false
        background.setLoop(loop);  // loop: true/false
        background.play(true);

        //cursor
        this.player = this.physics.add.sprite(100, 450, 'cursor')
        this.cursors = this.input.keyboard.createCursorKeys()
        this.input.mouse.disableContextMenu();

        //players
        coderona = this.input.keyboard.addKey('C');
        user = this.input.keyboard.addKey('U')

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
            text3.setText([
                'player two ready'
            ]);
            if(this.fullWidth >120){
                this.fullWidth -= 178
            }
            this.setMeterPercentage(1)
        })

    }

    setMeterPercentage(percent = 1) {
        const width = this.fullWidth

        this.middle.displayWidth = width
        this.rightCap.x = this.middle.x + this.middle.displayWidth
    }

    update() {
        //check if the 2 players are ready
        if (!this.cursors) {
            return
        }

        //move user with the coordinates
        var pointer = this.input.activePointer;

        text1.setText([
            'x: ' + pointer.worldX,
            'y: ' + pointer.worldY,
            'isDown: ' + pointer.isDown
        ]);

        this.physics.moveToObject(this.player, pointer, 100, 300);

    }


}
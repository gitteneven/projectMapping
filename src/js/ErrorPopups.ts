export default class ErrorPopups {
  private x: number
  private y: number
  private image: Phaser.GameObjects.Image
  private scene: Phaser.Scene
  
  private errorPopup?: Phaser.GameObjects.Image
  
  constructor(scene: Phaser.Scene, image: Phaser.GameObjects.Image, ) {
    this.scene = scene
    this.image = image.setOrigin(0, 0);
  }

  layout() {
    if (!this.errorPopup) {
      return this
    }

    return this
  }
}
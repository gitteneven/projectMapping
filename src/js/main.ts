import 'phaser';
import Scene from './Scene';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#0827F5',
  width: 1920,
  height: 1080,
  physics: {
    default: 'arcade',
  },
  scene: Scene
};

const init = () => {
  console.log('Hello from main.ts');
  const game = new Phaser.Game(config);


}

init()
postMessage({ payload: 'removeLoading' }, '*')

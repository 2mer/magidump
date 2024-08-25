import { Game as MainGame } from './scenes/Game';
import { Game, Math, Types, WEBGL } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
	type: WEBGL,
	width: 1024,
	height: 768,
	parent: 'game-container',
	backgroundColor: '#028af8',
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: Math.Vector2.ZERO,
			// overlapBias: 10,
		}
	},
	scene: [
		MainGame
	]
};

const StartGame = (parent: any) => {
	return new Game({ ...config, parent });
}

export default StartGame;


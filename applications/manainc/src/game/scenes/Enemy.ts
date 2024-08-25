import { GameObjects, Physics, Scene } from "phaser";
import { TEXTURES } from "../textures";

export default class Enemy extends Physics.Arcade.Image {

	spawnDistance = 100;
	despawnDistance = 200;
	isDead = true;
	health = 0;
	target: GameObjects.GameObject | null = null;

	constructor(scene: Scene) {
		super(scene, 0, 0, TEXTURES.gazeMonster);


		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setCircle(this.body!.halfWidth);

		this.scale = 4;



		this.body!.onCollide = true;
	}

	update(t: number, d: number): void {
		if (this.target && this.active) {
			this.scene.physics.moveToObject(this, this.target, 100);
		}
	}

	disableEnemy() {
		this.setVisible(false);
		this.setActive(false);
		this.disableBody(true)
	}

	enableEnemy() {
		this.setVisible(true);
		this.setActive(true);
		this.enableBody(true)
	}

	die() {
		this.disableEnemy();
		this.isDead = true;
	}

	spawn(x: number, y: number, health: number, target: GameObjects.GameObject) {
		this.enableEnemy();

		if (this.isDead) {
			this.health = health;
		}
		this.isDead = false;

		this.setPosition(x, y);
		this.target = target;

	}

	damage(dmg: number) {
		this.health -= dmg;
		if (this.health < 0) {
			this.die();
		}
	}

	despawn() {
		this.disableEnemy();
	}
}
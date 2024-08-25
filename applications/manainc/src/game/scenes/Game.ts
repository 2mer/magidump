import { GameObjects, Types, Scene, Math, Geom } from 'phaser';
import { EventBus } from '../EventBus';
import { TEXTURES, Textures } from '../textures';
import { listify } from 'radash';
import Enemy from './Enemy';

function inflateRect(rect: Geom.Rectangle, size: number) {
	rect.x -= size;
	rect.y -= size;
	rect.width += size * 2;
	rect.height += size * 2;
}

const sides = [
	'getLineA',
	'getLineB',
	'getLineC',
	'getLineD',
]
function randPerimeter(rect: Geom.Rectangle, point?: Geom.Point) {
	const side = sides[Math.Between(0, 3)];
	const line: Geom.Line = (rect as any)[side as any]();
	return line.getRandomPoint(point);
}

export class Game extends Scene {

	floor: GameObjects.TileSprite;
	cursors: Types.Input.Keyboard.CursorKeys;
	wishDir: Math.Vector2;
	player: Types.Physics.Arcade.ImageWithDynamicBody;

	playerSpeed = 300;
	globalScale = 4;

	spawnDistance = 100;
	despawnDistance = 300;

	enemies: GameObjects.Group;
	debug: GameObjects.Rectangle;

	constructor() {
		super('Game');
	}

	preload() {
		this.load.setPath('assets');

		this.load.image(listify(Textures, (k, v) => ({ key: k, url: v })));
	}

	create() {

		EventBus.emit('current-scene-ready', this);

		this.floor = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, TEXTURES.floor).setOrigin(0, 0)
		this.floor.setTileScale(this.globalScale, this.globalScale);
		this.floor.setScrollFactor(0, 0);

		this.cursors = this.input.keyboard!.createCursorKeys();

		this.player = this.physics.add.image(0, 0, TEXTURES.mage);
		this.player.setCircle(this.player.body.halfWidth);
		this.player.scale = this.globalScale;

		this.cameras.main.startFollow(this.player);

		this.wishDir = new Math.Vector2();

		this.enemies = this.physics.add.group({
			classType: Enemy,
			maxSize: 500,
			runChildUpdate: true,
		})

		const computeRect = new Geom.Rectangle();
		const computePoint = new Geom.Point();

		this.time.addEvent({
			loop: true,
			delay: 100,
			callback: () => {
				computeRect.setTo(this.cameras.main.worldView.x, this.cameras.main.worldView.y, this.cameras.main.worldView.width, this.cameras.main.worldView.height)
				inflateRect(computeRect, this.spawnDistance);

				const spawnEnemy = () => {
					const enemy: Enemy = this.enemies.get();

					if (enemy) {
						randPerimeter(computeRect, computePoint);

						enemy.spawn(computePoint.x, computePoint.y, 100, this.player);
					}
				}

				computeRect.setTo(this.cameras.main.worldView.x, this.cameras.main.worldView.y, this.cameras.main.worldView.width, this.cameras.main.worldView.height)
				inflateRect(computeRect, this.despawnDistance);

				let respawns = 0;

				this.enemies.children.iterate((e) => {
					const enemy: Enemy = e as any;

					if (!computeRect.contains(enemy.x, enemy.y)) {
						enemy.despawn();
						respawns++;
					}

					return true;
				})

				respawns += Math.Between(1, 3);

				for (let i = 0; i < respawns; i++) {
					spawnEnemy();
				}
			}
		})

		this.player.body.immovable = true;

		this.physics.add.collider(this.player, this.enemies).overlapOnly = true;
		this.physics.add.collider(this.enemies, this.enemies)
	}

	update(time: number, delta: number): void {

		this.wishDir
			.set(
				Number(+this.cursors.right.isDown) - Number(this.cursors.left.isDown),
				Number(+this.cursors.down.isDown) - Number(this.cursors.up.isDown)
			)
			.normalize()
			.scale(this.playerSpeed);

		this.player.setVelocity(this.wishDir.x, this.wishDir.y);

		this.floor.setTilePosition(this.cameras.main.scrollX / this.globalScale, this.cameras.main.scrollY / this.globalScale);
	}


}

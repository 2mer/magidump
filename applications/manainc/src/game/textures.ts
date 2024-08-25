import { mapValues } from "radash";

export const Textures = {
	mage: 'mage.png',
	fireProjectile: 'projectile/fire.png',
	manaProjectile: 'projectile/mana.png',
	gazeMonster: 'monster/gaze.png',
	floor: 'world/floor.png',
};

export const TEXTURES = mapValues(Textures, (_, k) => k);
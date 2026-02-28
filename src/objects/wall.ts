import { GameObject } from "../object.ts";
import type { GameSprite } from "../types/sprite.ts";
import chalk from "chalk";

export class Wall extends GameObject {
    constructor(y: number, x: number, name: string = "wall", sprite: GameSprite = {
        ch: "#", color: chalk.white
    }) {
        super(y, x, name, sprite);
    }
}
import type { GameSprite } from "./types/sprite.ts";


export class GameObject {
    private id: string = Bun.randomUUIDv7();
    private name: string;
    private sprite: GameSprite;
    private y: number;
    private x: number;

    constructor(y: number, x: number, name: string, sprite: GameSprite) {
        this.name = name;
        this.sprite = sprite;
        this.y = y;
        this.x = x;
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getSprite(): GameSprite {
        return this.sprite;
    }

    public getPosition(): { y: number, x: number } {
        return {
            y: this.y,
            x: this.x,
        }
    }

    public setPosition(y: number, x: number): void {
        this.y = y;
        this.x = x;
    }
}
import fs from "fs";
import { GameObject } from "../object.ts";
import { Wall } from "../objects/wall.ts";
import path from "path";

const stdin = process.stdin;

stdin.setEncoding("utf-8");
stdin.setRawMode(true);
stdin.resume();

let flags = {
    editing: true,
    resizing: false,
    searching: false,
}

let cursor: string | undefined;

let y: number = 0;
let x: number = 0;
let searchY: number = 0;
let searchX: number = 0;
let objectIndex: number = 0;

// Load all game objects
let objects: (new () => GameObject)[] = [];
let placedObjects: GameObject[] = [];

async function loadObjects() {
    const files: string[] = fs.readdirSync(path.resolve(process.cwd(), "src/objects"));

    for (let i = 0; i < files.length; ++i) {
        const file: string = files[i]!;

        if (!file.endsWith(".ts")) continue;

        const filePath = path.join(process.cwd(), "src/objects", file);

        try {
            const obj: GameObject = await import(filePath);

            for (const exportedProp of Object.values(obj)) {
                if (
                    typeof exportedProp === "function" &&
                    exportedProp.prototype instanceof GameObject
                ) {
                    objects.push(exportedProp as new () => GameObject);
                }
            }
        } catch (err) {
            console.error("Failed to load file: " + file);
            process.exit(1);
        }
    }
}

await loadObjects();

let selectedObject = new objects[objectIndex]!;

if (selectedObject === undefined) {
    console.error("Failed to load selectedObject");
    process.exit(1);
}

let height: number = 10;
let width: number = 10;

function draw() {
    let out: string = "";
    // console.log(objects);

    for (let i = 0; i < Object.keys(flags).length; i++) {
        console.log(`${Object.keys(flags)[i]}: ${Object.values(flags)[i]}`);
    }

    for (let i = 0; i < height; i++) {
        for (let p = 0; p < width; p++) {
            if (y === i && x === p) {
                if (cursor) {
                    out += `[${cursor}]`;
                    continue;
                }

                out += `[-]`
                continue;
            }

            const doesExist: boolean = placedObjects.some(
                (v: GameObject) => v.getPosition().y === i && v.getPosition().x === p
            );

            // console.log(doesExist);

            if (doesExist) {
                const placedObject: GameObject | undefined = placedObjects.find(
                    (v: GameObject) => v.getPosition().y === i && v.getPosition().x === p
                );

                if (placedObject !== undefined) {
                    out += ` ${[placedObject.getSprite().color(placedObject.getSprite().ch)]} `;
                    continue;
                } else {
                    console.error("Unable to find placed object.");
                    process.exit(1);
                }
            } else {
                out += ` - `;
                continue;
            }
        }

        out += "\n";
    }

    console.log(out);
    console.log("\n\n");
    console.log(`y: ${y} | x: ${x}`);
}

function searchMenuDraw() {

}

function update() {
    console.clear();
}

function move(deltaY: number, deltaX: number) {
    if (x + deltaX > width - 1 || x + deltaX < 0) {
        return;
    } else if (y + deltaY > width - 1 || y + deltaY < 0) {
        return;
    }
    y += deltaY
    x += deltaX;
}

async function saveToFile() {
    const saveObj: { objects: GameObject[], width: number, height: number } = {
        objects: placedObjects,
        width: width,
        height: height,
    }

    await Bun.file(path.resolve(process.cwd(), "src/levels", `${await Bun.randomUUIDv7()}.json`)).write(JSON.stringify(saveObj));
}

cursor = selectedObject.getSprite().color(selectedObject.getSprite().ch);

console.clear();
draw();

stdin.on("data", async (key: string) => {
    if (flags.editing) {
        switch (key) {
            case "w":
                move(-1, 0)
                break;
            case "d":
                move(0, 1);
                break;
            case "s":
                move(1, 0);
                break;
            case "a":
                move(0, -1);
                break;
            case ".":
                if (objectIndex + 1 >= objects.length) break;
                objectIndex++;
                try {
                    cursor = selectedObject.getSprite().color(selectedObject.getSprite().ch)
                } catch (err) {
                    console.log(`Failed to change cursor to ${selectedObject.getSprite()}`);
                    process.exit(1);
                }
                break;
            case ",":
                if (objectIndex - 1 < 0) break;
                objectIndex--;

                try {
                    cursor = selectedObject.getSprite().color(selectedObject.getSprite().ch)
                } catch (err) {
                    console.log(`Failed to change cursor to ${selectedObject.getSprite()}`);
                    process.exit(1);
                }
                break;
            case "r":
                flags.editing = false;
                flags.resizing = true;
                break;
            case " ":
                // 1. Sync the object position with the cursor coordinates
                selectedObject.setPosition(y, x); // Assuming this method exists

                // 2. Fix the .find (or use .some) with a proper return
                const doesExist: boolean = placedObjects.some(
                    (v: GameObject) => v.getPosition().y === y && v.getPosition().x === x
                );

                if (!doesExist) {
                    placedObjects.push(selectedObject);
                    selectedObject = new objects[objectIndex]!;
                }
                break;
            case "e":
                // Search functionality
                flags.searching = true;
                break;
            case "S":
                await saveToFile();
                break;
            case "q":
                process.exit(0);
                break;
        }
    } else if (flags.resizing) {
        switch (key) {
            case "w":
                height--;
                break;
            case "d":
                width++;
                break;
            case "s":
                height++;
                break;
            case "a":
                width--;
                break;
            case "e":
                flags.editing = true;
                flags.resizing = false;
                break;
            case "q":
                process.exit(0);
                break;
        }
    } else if (flags.searching) {
        switch (key) {
            case "w":
                searchY--;
                break;
            case "s":
                searchY++;
                break;
        }
    }

    if (flags.editing || flags.resizing) {
        update();
        draw();
    } else {
        searchMenuDraw();
    }
})
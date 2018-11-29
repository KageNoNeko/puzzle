import * as PIXI from 'pixi.js';
import * as Particles from 'pixi-particles';
import { PuzzlePiece } from './puzzle-piece';

export const DropEffectDefaults = {
    alpha: {
        start: 0.74,
        end: 0
    },
    scale: {
        start: 0.1,
        end: 1.2
    },
    color: {
        start: 'eb8b58',
        end: '575757'
    },
    speed: {
        start: 700,
        end: 50
    },
    startRotation: {
        min: 0,
        max: 360
    },
    rotationSpeed: {
        min: 0,
        max: 200
    },
    lifetime: {
        min: 0.4,
        max: 0.7
    },
    blendMode: 'normal',
    frequency: 0.001,
    emitterLifetime: 0.2,
    maxParticles: 100,
    pos: {
        x: 0,
        y: 0
    },
    addAtBack: true,
    spawnType: 'point'
};

export class DropEffect {

    protected emitter: Particles.Emitter;

    constructor(protected texture: PIXI.Texture, protected sound?: PIXI.sound.Sound) {

        this.emitter = new Particles.Emitter(new PIXI.Container(), [ this.texture ], DropEffectDefaults);
        this.emitter.autoUpdate = true;
        this.emitter.emit = false;
    }

    show(piece: PuzzlePiece) {

        piece.parent.addChildAt(this.emitter.parent, piece.parent.getChildIndex(piece));

        this.emitter.emit = true;
        this.emitter.resetPositionTracking();
        this.emitter.updateOwnerPos(piece.x + piece.width / 2, piece.y + piece.height / 2);

        if (this.sound) {

            this.sound.play();
        }
    }
}
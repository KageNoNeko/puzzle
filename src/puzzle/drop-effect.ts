import particles = require('pixi-particles');
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

    protected _emitter: particles.Emitter;

    protected getEmitter(piece: PuzzlePiece): particles.Emitter {

        if (!this._emitter) {

            this._emitter = new particles.Emitter(piece, [ this.texture ], DropEffectDefaults);
            this._emitter.autoUpdate = true;
            this._emitter.emit = false;
        } else {

            this._emitter.parent = piece;
        }

        return this._emitter;
    }

    constructor(protected texture: PIXI.Texture) {
    }

    play(piece: PuzzlePiece) {

        const emitter = this.getEmitter(piece);

        emitter.emit = true;
        emitter.resetPositionTracking();
        // emitter.updateSpawnPos(cellCenter.x, cellCenter.y);
    }
}
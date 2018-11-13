import * as PIXI from 'pixi.js';

export class PuzzlePiece extends PIXI.Sprite {

    protected drag: {
        position: PIXI.Point,
        data: PIXI.interaction.InteractionData
    };

    onDragStart(event: PIXI.interaction.InteractionEvent) {

        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = {
            data: event.data,
            position: event.data.getLocalPosition(this.parent)
        };
    }
}
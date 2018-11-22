import * as PIXI from 'pixi.js';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { PuzzleCell } from './types';

type InteractionEvent = PIXI.interaction.InteractionEvent;

export class PuzzlePiece extends PIXI.Sprite {

    protected dragHandlers: { [event: string]: (...args: any[]) => any };
    protected dragFilters: PIXI.Filter<any>[] = [
        new DropShadowFilter()
    ];

    protected dragging: {
        data: PIXI.interaction.InteractionData,
        position: PIXI.Point
    };

    protected toParentTop() {

        this.parent.setChildIndex(this, this.parent.children.length - 1);
    }

    protected onDragStart(event: InteractionEvent) {

        this.dragging = {
            data: event.data,
            position: event.data.getLocalPosition(this.parent)
        };
        this.filters = this.dragFilters;
        this.toParentTop();
    }

    protected onDragMove() {

        if (this.dragging) {

            const newPosition = this.dragging.data.getLocalPosition(this.parent);
            this.x += (
                newPosition.x - this.dragging.position.x
            );
            this.y += (
                newPosition.y - this.dragging.position.y
            );
            this.dragging.position = newPosition;
        }
    }

    protected onDragEnd() {

        this.dragging = null;
        this.filters = null;

        this.emit('moved');
    }

    constructor(texture: PIXI.Texture, readonly cell: PuzzleCell) {

        super(texture);

        this.dragHandlers = {
            pointerdown: (event: InteractionEvent) => this.onDragStart(event),
            pointerup: () => this.onDragEnd(),
            pointerupoutside: () => this.onDragEnd(),
            pointermove: () => this.onDragMove()
        };
    }

    enableDragging() {

        this.interactive = this.buttonMode = true;

        this.on('pointerdown', this.dragHandlers.pointerdown)
            .on('pointerup', this.dragHandlers.pointerup)
            .on('pointerupoutside', this.dragHandlers.pointerupoutside)
            .on('pointermove', this.dragHandlers.pointermove);
    }

    disableDragging() {

        this.interactive = this.buttonMode = false;

        this.off('pointerdown', this.dragHandlers.pointerdown)
            .off('pointerup', this.dragHandlers.pointerup)
            .off('pointerupoutside', this.dragHandlers.pointerupoutside)
            .off('pointermove', this.dragHandlers.pointermove);
    }
}
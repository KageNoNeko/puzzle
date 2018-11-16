import * as PIXI from 'pixi.js';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { Point, Size } from './types';

type InteractionEvent = PIXI.interaction.InteractionEvent;

export class PuzzlePiece extends PIXI.Sprite {

    protected _valid: boolean;
    protected dragFilters: PIXI.Filter<any>[] = [
        new DropShadowFilter()
    ];
    protected dragging: {
        data: PIXI.interaction.InteractionData,
        position: PIXI.Point
    };

    protected get positionDelta(): Point {

        return {
            x: Math.abs(this.validPosition.x - this.x),
            y: Math.abs(this.validPosition.y - this.y)
        };
    }

    validPositionDelta: Point = { x: 10, y: 10 };

    get valid(): boolean {

        return this._valid;
    }

    protected updateValidity() {

        const delta = this.positionDelta;

        this._valid = delta.x <= this.validPositionDelta.x && delta.y <= this.validPositionDelta.y;
    }

    protected makeDraggable() {

        this.interactive = this.buttonMode = true;

        this.on('pointerdown', (event: InteractionEvent) => this.onDragStart(event))
            .on('pointerup', () => this.onDragEnd())
            .on('pointerupoutside', () => this.onDragEnd())
            .on('pointermove', () => this.onDragMove());
    }

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
        this.updateValidity();

        this.emit('dragend');
    }

    constructor(public validPosition: PIXI.Point, size: Size, texture: PIXI.Texture) {

        super(texture);

        this.width = size.width;
        this.height = size.height;

        this.moveToValidPosition();
        this.updateValidity();
        this.makeDraggable();
    }

    moveToValidPosition() {

        this.x = this.validPosition.x;
        this.y = this.validPosition.y;
    }
}
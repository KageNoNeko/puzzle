import * as PIXI from 'pixi.js';

export class Puzzle extends PIXI.Application {

    protected valid: boolean;
    protected image: PIXI.Texture;
    protected pieceSize: {
        width: number,
        height: number,
        texture: {
            width: number,
            height: number
        }
    };

    protected safeCoord(coord: number): number {

        return Math.round(coord * 10) / 10;
    }

    protected createPieceForCell(row: number, column: number): PIXI.Sprite {

        const texture = new PIXI.Texture(this.image.baseTexture, new PIXI.Rectangle(
            this.safeCoord(column * this.pieceSize.texture.width),
            this.safeCoord(row * this.pieceSize.texture.height),
            this.pieceSize.texture.width,
            this.pieceSize.texture.height
        ));
        const piece = new PIXI.Sprite(texture);

        piece.width = this.pieceSize.width;
        piece.height = this.pieceSize.height;
        piece.interactive = true;
        piece.buttonMode = true;
        piece.x = column * this.pieceSize.width;
        piece.y = row * this.pieceSize.height;

        piece
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);

        function onDragStart(event: PIXI.interaction.InteractionEvent) {

            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = this.data.getLocalPosition(this.parent);
            this.parent.setChildIndex(this, this.parent.children.length - 1);
        }

        function onDragEnd() {

            this.alpha = 1;
            this.dragging = false;
            this.data = null;
        }

        function onDragMove() {

            if (this.dragging) {

                const newPosition = this.data.getLocalPosition(this.parent);
                this.x += (
                    newPosition.x - this.dragging.x
                );
                this.y += (
                    newPosition.y - this.dragging.y
                );
                this.dragging = newPosition;
            }
        }

        return piece;
    }

    protected onImageLoad(texture: PIXI.Texture) {

        this.image = texture;

        this.pieceSize = {
            width: this.view.width / this.dimension.columns,
            height: this.view.height / this.dimension.rows,
            texture: {
                width: this.image.width / this.dimension.columns,
                height: this.image.height / this.dimension.rows
            }
        };

        for (let r = 0; r < this.dimension.rows; r++) {

            for (let c = 0; c < this.dimension.columns; c++) {

                this.stage.addChild(this.createPieceForCell(r, c));
            }
        }
    }

    protected loadImage(image: string) {

        this.loader.add('puzzleImage', image);
        this.loader.load((loader: any, resources: { [key: string]: PIXI.loaders.Resource }) =>
                             this.onImageLoad(resources.puzzleImage.texture));
    }

    constructor(protected dimension: { rows: number, columns: number }, image: string, ...args: any[]) {

        super(...args);

        this.loadImage(image);
    }
}
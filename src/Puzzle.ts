import * as PIXI from 'pixi.js';
import { PuzzlePiece } from './PuzzlePiece';

export class Puzzle extends PIXI.Application {

    protected _valid: boolean;
    protected image: PIXI.Texture;
    protected pieceSize: {
        width: number,
        height: number,
        texture: {
            width: number,
            height: number
        }
    };

    protected get pieces(): PuzzlePiece[] {

        return <PuzzlePiece[]>this.stage.children;
    }

    get valid(): boolean {

        return this.pieces.every((piece) => piece.valid);
    }

    protected safeCoord(coord: number): number {

        return Math.round(coord * 10) / 10;
    }

    protected createPieceForCell(row: number, column: number): PIXI.Sprite {

        const piece = new PuzzlePiece(
            new PIXI.Point(column * this.pieceSize.width, row * this.pieceSize.height),
            {
                width: this.pieceSize.width,
                height: this.pieceSize.height
            },
            new PIXI.Texture(this.image.baseTexture, new PIXI.Rectangle(
                this.safeCoord(column * this.pieceSize.texture.width),
                this.safeCoord(row * this.pieceSize.texture.height),
                this.pieceSize.texture.width,
                this.pieceSize.texture.height
            )));

        piece.on('dragend', () => {

            if (this.valid) {

                this.finish();
            }
        });

        return piece;
    }

    protected finish() {

        this.stage.removeChildren();
        const fullImage = new PIXI.Sprite(this.image);
        fullImage.width = this.view.width;
        fullImage.height = this.view.height;
        const text = new PIXI.Text('You did it!', { fontFamily: 'Arial', fontSize: 48, fill: 0xff1010, dropShadow: true });
        text.anchor.set(0.5);
        text.x = this.view.width / 2;
        text.y = this.view.height / 2;
        this.stage.addChild(fullImage);
        this.stage.addChild(text);
    }

    protected createPieces() {

        for (let r = 0; r < this.dimension.rows; r++) {

            for (let c = 0; c < this.dimension.columns; c++) {

                this.stage.addChild(this.createPieceForCell(r, c));
            }
        }
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

        this.createPieces();
        this.shuffle();
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

    shuffle() {

        const pieces = this.pieces;

        for (let i = pieces.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (
                i + 1
            ));

            this.stage.swapChildren(pieces[ i ], pieces[ j ]);
            [ pieces[ i ].x, pieces[ j ].x ] = [ pieces[ j ].x, pieces[ i ].x ];
            [ pieces[ i ].y, pieces[ j ].y ] = [ pieces[ j ].y, pieces[ i ].y ];
        }
    }
}
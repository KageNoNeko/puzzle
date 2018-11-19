import * as PIXI from 'pixi.js';
import { PuzzleCell, PuzzleDimension, Size } from './types';
import { safePixel } from './utils';

export class Puzzle extends PIXI.Container {

    protected pieceSize: Size;
    protected pieceTextureSize: Size;

    pieces: PIXI.Sprite[] = [];

    get completed(): boolean {

        // @todo check if each piece is on its right place
        return false;
    }

    protected calculateSizes(): void {

        this.pieceSize = {
            width: safePixel(this.size.width / this.dimension.columns),
            height: safePixel(this.size.height / this.dimension.rows)
        };
        this.pieceTextureSize = {
            width: safePixel(this.texture.width / this.dimension.columns),
            height: safePixel(this.texture.height / this.dimension.rows)
        };
    }

    protected createPieceTexture(cell: PuzzleCell): PIXI.Texture {

        return new PIXI.Texture(this.texture.baseTexture, new PIXI.Rectangle(
            cell.column * this.pieceTextureSize.width,
            cell.row * this.pieceTextureSize.height,
            this.pieceTextureSize.width,
            this.pieceTextureSize.height
        ));
    }

    protected createPiece(cell: PuzzleCell): PIXI.Sprite {

        // @todo make them movable
        const piece = new PIXI.Sprite(this.createPieceTexture(cell));
        piece.width = this.pieceSize.width;
        piece.height = this.pieceSize.height;
        piece.x = cell.column * this.pieceSize.width;
        piece.y = cell.row * this.pieceSize.height;

        return piece;
    }

    protected createPieces(): void {

        for (let row = 0; row < this.dimension.rows; row++) {

            for (let column = 0; column < this.dimension.columns; column++) {

                this.pieces.push(this.createPiece({ row, column }));
            }
        }
    }

    constructor(
        protected texture: PIXI.Texture, protected size: Size, protected dimension: PuzzleDimension) {

        super();

        this.calculateSizes();
        this.createPieces();
    }

    shuffle() {

        for (let i = this.pieces.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (
                i + 1
            ));

            [ this.pieces[ i ].x, this.pieces[ j ].x ] = [ this.pieces[ j ].x, this.pieces[ i ].x ];
            [ this.pieces[ i ].y, this.pieces[ j ].y ] = [ this.pieces[ j ].y, this.pieces[ i ].y ];
        }
    }

    fill(): void {

        this.addChild(...this.pieces);
    }

    clear(): void {

        this.removeChildren();
    }

    complete(): void {

        // @todo fill puzzle with pieces, each on right place and make them unmovable
    }
}
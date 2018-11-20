import * as PIXI from 'pixi.js';
import { Point, PuzzleCell, PuzzleDimension, Size } from './types';
import { distance, safePixel } from './utils';
import { PuzzlePiece } from './puzzle-piece';

export class Puzzle extends PIXI.Container {

    protected pieceSize: Size;
    protected pieceTextureSize: Size;
    protected stickDistance: number = 15;

    pieces: PuzzlePiece[] = [];

    get completed(): boolean {

        return this.pieces.every((piece) => this.pieceIsInRightCell(piece));
    }

    protected forEachCell(cb: (cell: PuzzleCell) => void): void {

        for (let row = 0; row < this.dimension.rows; row++) {

            for (let column = 0; column < this.dimension.columns; column++) {

                cb({ row, column });
            }
        }
    }

    protected pieceIsInRightCell(piece: PuzzlePiece): boolean {

        const cellPoint = this.getCellPoint(piece.cell);

        return piece.x === cellPoint.x && piece.y === cellPoint.y;
    }

    protected pieceCanStickToCell(piece: PuzzlePiece, cell?: PuzzleCell): boolean {

        return this.getPieceCellDistance(piece, cell || piece.cell) <= this.stickDistance;
    }

    protected getPieceNearestCell(piece: PuzzlePiece): PuzzleCell {

        let nearest: PuzzleCell, lesserDistance: number = null;

        this.forEachCell((cell) => {

            const distance = this.getPieceCellDistance(piece, cell);
            if (lesserDistance === null || distance < lesserDistance) {

                lesserDistance = distance;
                nearest = cell;
            }
        });

        return nearest;
    }

    protected getCellPoint(cell: PuzzleCell): Point {

        return {
            x: cell.column * this.pieceSize.width,
            y: cell.row * this.pieceSize.height
        };
    }

    protected getPieceCellDistance(piece: PuzzlePiece, cell?: PuzzleCell): number {

        const cellPoint = this.getCellPoint(cell || piece.cell);

        return distance(piece, cellPoint);
    }

    protected movePieceToCell(piece: PuzzlePiece, cell?: PuzzleCell): void {

        const cellPoint = this.getCellPoint(cell || piece.cell);

        piece.x = cellPoint.x;
        piece.y = cellPoint.y;
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

    protected onPieceMove(piece: PuzzlePiece): void {

        const nearestCell = this.getPieceNearestCell(piece);

        if (this.pieceCanStickToCell(piece, nearestCell)) {

            this.movePieceToCell(piece, nearestCell);
        }

        if (this.completed) {

            this.emit('completed');
        }
    }

    protected createPiece(cell: PuzzleCell): PuzzlePiece {

        // @todo make them movable
        const piece = new PuzzlePiece(this.createPieceTexture(cell), cell);
        piece.width = this.pieceSize.width;
        piece.height = this.pieceSize.height;

        this.movePieceToCell(piece, cell);

        piece.enableDragging();

        piece.on('moved', () => this.onPieceMove(piece));

        return piece;
    }

    protected createPieces(): void {

        this.forEachCell((cell) => this.pieces.push(this.createPiece(cell)));
    }

    constructor(readonly texture: PIXI.Texture, readonly size: Size, protected dimension: PuzzleDimension) {

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

        this.pieces.forEach((piece) => this.movePieceToCell(piece));
    }

    enableDragging() {

        this.pieces.forEach((piece) => piece.enableDragging());
    }

    disableDragging() {

        this.pieces.forEach((piece) => piece.disableDragging());
    }
}
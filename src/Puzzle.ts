import * as PIXI from 'pixi.js';
import { PuzzlePiece } from './PuzzlePiece';
import { Size } from './types';

export class Puzzle extends PIXI.Application {

    protected container: PIXI.Container;
    protected sizes: {
        puzzle: Size;
        piece: Size;
        pieceTexture: Size;
    };
    protected image: PIXI.Texture;

    protected get pieces(): PuzzlePiece[] {

        return <PuzzlePiece[]>this.container.children;
    }

    get valid(): boolean {

        return this.pieces.every((piece) => piece.valid);
    }

    protected safePixel(value: number): number {

        return Math.floor(value * 10) / 10;
    }

    protected calculateSizes(screen: Size, image: Size): { puzzle: Size; piece: Size; pieceTexture: Size; } {

        const imageRatio = image.width / image.height;

        if (image.width < screen.width && image.height < screen.height) {

        }

        const puzzle = image.width < screen.width && image.height < screen.height
            ? {
                width: image.width,
                height: image.height
            }
            : (
                           screen.width / imageRatio > screen.height
                               ? {
                                   width: this.safePixel(screen.height * imageRatio),
                                   height: screen.height
                               }
                               : {
                                   width: screen.width,
                                   height: this.safePixel(screen.width / imageRatio)
                               }
                       ),
            piece = {
                width: this.safePixel(puzzle.width / this.dimension.columns),
                height: this.safePixel(puzzle.height / this.dimension.rows)
            },
            pieceTexture = {
                width: this.safePixel(image.width / this.dimension.columns),
                height: this.safePixel(image.height / this.dimension.rows)
            };

        return { puzzle, piece, pieceTexture };
    }

    protected createPieceTextureForCell(row: number, column: number): PIXI.Texture {

        return new PIXI.Texture(this.image.baseTexture, new PIXI.Rectangle(
            column * this.sizes.pieceTexture.width,
            row * this.sizes.pieceTexture.height,
            this.sizes.pieceTexture.width,
            this.sizes.pieceTexture.height
        ));
    }

    protected createPieceForCell(row: number, column: number): PuzzlePiece {

        const piece = new PuzzlePiece(
            new PIXI.Point(column * this.sizes.piece.width, row * this.sizes.piece.height),
            this.sizes.piece,
            this.createPieceTextureForCell(row, column));

        piece.on('dragend', () => {

            if (this.valid) {

                this.finish();
            }
        });

        return piece;
    }

    protected createContainer(): PIXI.Container {

        const container = new PIXI.Container();

        for (let r = 0; r < this.dimension.rows; r++) {

            for (let c = 0; c < this.dimension.columns; c++) {

                container.addChild(this.createPieceForCell(r, c));
            }
        }

        return container;
    }

    protected addContainerToStage() {

        this.container.x = (
                               this.screen.width - this.sizes.puzzle.width
                           ) / 2;
        this.container.y = (
                               this.screen.height - this.sizes.puzzle.height
                           ) / 2;

        this.stage.addChild(this.container);
    }

    protected onImageLoad(texture: PIXI.Texture) {

        this.image = texture;

        this.sizes = this.calculateSizes({
                                             width: this.screen.width,
                                             height: this.screen.height,
                                         },
                                         {
                                             width: this.image.width,
                                             height: this.image.height,
                                         });
        this.container = this.createContainer();
        this.shuffle();
        this.addContainerToStage();
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

    resize(width: number, height: number) {

        if (this.container) {

            const sizes = this.calculateSizes({
                                                  width: width,
                                                  height: height,
                                              },
                                              {
                                                  width: this.image.width,
                                                  height: this.image.height,
                                              });
            this.container.scale.set(sizes.puzzle.width / this.sizes.puzzle.width, sizes.puzzle.height
                                                                                   / this.sizes.puzzle.height);
            this.container.x = (
                                   width - sizes.puzzle.width
                               ) / 2;
            this.container.y = (
                                   height - sizes.puzzle.height
                               ) / 2;
        }

        this.renderer.resize(width, height);
    }

    toFullScreen() {

        this.resize(window.innerWidth, window.innerHeight);
    }

    shuffle() {

        const pieces = this.pieces;

        for (let i = pieces.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (
                i + 1
            ));

            this.container.swapChildren(pieces[ i ], pieces[ j ]);
            [ pieces[ i ].x, pieces[ j ].x ] = [ pieces[ j ].x, pieces[ i ].x ];
            [ pieces[ i ].y, pieces[ j ].y ] = [ pieces[ j ].y, pieces[ i ].y ];
        }
    }

    finish() {

        this.stage.removeChildren();
        const fullImage = new PIXI.Sprite(this.image);
        fullImage.width = this.screen.width;
        fullImage.height = this.screen.height;
        const text = new PIXI.Text('You did it!',
                                   { fontFamily: 'Arial', fontSize: 48, fill: 0xff1010, dropShadow: true });
        text.anchor.set(0.5);
        text.x = this.screen.width / 2;
        text.y = this.screen.height / 2;
        this.stage.addChild(fullImage);
        this.stage.addChild(text);
    }
}
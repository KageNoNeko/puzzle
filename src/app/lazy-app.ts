import * as PIXI from 'pixi.js';
import * as Sounds from 'pixi-sound';
import { Puzzle } from '../puzzle/puzzle';
import { PuzzleDimension, Size } from '../puzzle/types';
import { fitSize, percentageSize } from '../puzzle/utils';
import { App } from './app';
import { DropEffect } from '../puzzle/drop-effect';

export class LazyApp extends App {

    protected pieceInPlay: number;
    protected pieceInPlayMoveHandler: () => void;

    protected createPuzzle(texture: PIXI.Texture, difficult: PuzzleDimension) {

        this.puzzle = new Puzzle(texture, fitSize(texture, percentageSize(this.screen, 60)), difficult);
        this.puzzle.stickDistance = 60;
    }

    protected placePuzzle() {

        this.puzzle.x = (
                            this.screen.width - this.puzzle.width
                        ) / 2;
        this.puzzle.y = this.screen.height * 5 / 100;
    }

    protected scalePuzzle() {

        if (this.puzzle) {

            const size = fitSize(this.puzzle.texture, percentageSize(this.screen, 60));

            this.puzzle.scale.set(size.width / this.puzzle.size.width, size.height / this.puzzle.size.height);
            this.placePuzzle();
        }
    }

    protected onPieceInPlayMoved() {

        if (typeof this.pieceInPlay !== 'number') {

            return;
        }
        const piece = this.puzzle.pieces[ this.pieceInPlay ],
            nextIndex = this.pieceInPlay + 1;

        if (this.puzzle.pieceIsInRightCell(piece) && nextIndex < this.puzzle.pieces.length) {

            this.givePieceToPlayer(nextIndex);
        }
    }

    protected givePieceToPlayer(i: number): void {

        if (this.pieceInPlay) {

            this.puzzle.pieces[ this.pieceInPlay ].off('moved', this.pieceInPlayMoveHandler);
        }
        this.pieceInPlay = i;

        const piece = this.puzzle.pieces[ this.pieceInPlay ];
        piece.on('moved', this.pieceInPlayMoveHandler);

        const position = new PIXI.Point(
            (
                this.screen.width - piece.width
            ) / 2,
            this.screen.height - this.screen.height * 5 / 100 - piece.height
        );
        piece.position = this.puzzle.toLocal(position);
        this.puzzle.addChild(piece);
    }


    play(url: string): void {

        this.loader.add(url);
        this.loader.load((_: any, resources: { [key: string]: PIXI.loaders.Resource }) => {

            this.createPuzzle(resources[ url ].texture, this.difficulties.newbie);
            this.puzzle.once('completed', () => this.finish());
            this.puzzle.setDropEffect(
                new DropEffect(PIXI.Texture.fromImage('dropEffectImage'),
                               Sounds.Sound.from(resources.dropEffectSound)));
            this.showPuzzle();

            this.pieceInPlayMoveHandler = () => this.onPieceInPlayMoved();
            this.givePieceToPlayer(0);
        });
    }

    finish() {

        if (this.pieceInPlay) {

            this.puzzle.pieces[ this.pieceInPlay ].off('moved', this.pieceInPlayMoveHandler);
            this.pieceInPlay = null;
        }
        super.finish();
    }
}
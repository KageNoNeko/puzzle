import * as PIXI from 'pixi.js';
import { Puzzle } from '../puzzle/puzzle';
import { PuzzleDimension, Size } from '../puzzle/types';
import { fitSize } from '../puzzle/utils';

export class App extends PIXI.Application {

    protected puzzle: Puzzle;
    protected difficulties: { [key: string]: PuzzleDimension } = {
        newbie: { rows: 3, columns: 3 }
    };

    protected createPuzzle(texture: PIXI.Texture, difficult: PuzzleDimension) {

        this.puzzle = new Puzzle(texture, fitSize(texture, this.screen), difficult);
    }

    protected placePuzzle() {

        this.puzzle.x = (
                            this.screen.width - this.puzzle.width
                        ) / 2;
        this.puzzle.y = (
                            this.screen.height - this.puzzle.height
                        ) / 2;
    }

    protected scalePuzzle() {

        if (this.puzzle) {

            const size = fitSize(this.puzzle.texture, this.screen);

            this.puzzle.scale.set(size.width / this.puzzle.size.width, size.height / this.puzzle.size.height);
            this.placePuzzle();
        }
    }

    protected showPuzzle() {

        if (this.stage.children.indexOf(this.puzzle) === -1) {

            this.stage.addChild(this.puzzle);
            this.placePuzzle();
        }
    }

    protected hidePuzzle() {

        this.stage.removeChild(this.puzzle);
    }

    play(url: string): void {

        this.loader.add(url);
        this.loader.load((_: any, resources: { [key: string]: PIXI.loaders.Resource }) => {

            this.createPuzzle(resources[ url ].texture, this.difficulties.newbie);
            this.puzzle.shuffle();
            this.puzzle.fill();
            this.puzzle.once('completed', () => this.finish());
            this.showPuzzle();
        });
    }

    resize(width: number, height: number) {

        this.renderer.resize(width, height);
        this.scalePuzzle();
    }

    maximize() {

        this.resize(window.innerWidth, window.innerHeight);
    }

    finish() {

        this.puzzle.disableDragging();
        const text = new PIXI.Text('You did it!',
                                   { fontFamily: 'Arial', fontSize: 48, fill: 0xff1010, dropShadow: true });
        text.anchor.set(0.5);
        text.x = this.screen.width / 2;
        text.y = this.screen.height / 2;
        this.stage.addChild(text);
    }
}
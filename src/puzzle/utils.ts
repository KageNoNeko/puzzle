import { Point, Size } from './types';

export function safePixel(value: number): number {

    return Math.floor(value * 10) / 10;
}

export function fitSize(given: Size, available: Size): Size {

    if (given.width < available.width && given.height < available.height) {

        return { width: given.width, height: given.height };
    }

    const givenRatio = given.width / given.height;

    return available.width / givenRatio > available.height
        ? {
            width: safePixel(available.height * givenRatio),
            height: available.height
        }
        : {
            width: available.width,
            height: safePixel(available.width / givenRatio)
        };
}

export function percentageSize(size: Size, percentage: number | { width: number, height: number }): Size {

    if (typeof percentage === 'number') {

        percentage = {
            width: percentage,
            height: percentage
        };
    }

    return {
        width: size.width * percentage.width / 100,
        height: size.height * percentage.height / 100
    };
}

export function distance(from: Point, to: Point): number {

    return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
}
import { Size } from './types';

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
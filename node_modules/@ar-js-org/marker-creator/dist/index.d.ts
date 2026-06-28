/**
 * Utilities for creating AR.js/ARToolKit pattern markers from images.
 *
 * This module provides functions to generate marker pattern files and marker images
 * from user-supplied images, supporting customization of pattern ratio, image size, and border color.
 *
 * @module creator
 * @see https://github.com/AR-js-org/Marker-Creator
 */
export declare class ArPatternFile {
    /**
     * Version of the ArPatternFile class and pattern format, imported from package.json.
     * Update the version in package.json to change this value.
     */
    static version: string;
    private static sharedCanvas;
    private static sharedContext;
    constructor();
    /**
     * Converts a pattern file string to a canvas image. (Not yet implemented)
     * @param patternFileString The string content of the pattern file.
     * @param onComplete Callback function to receive the canvas image.
     */
    static toCanvas(patternFileString: string, onComplete: Function): void;
    /**
     * Encodes an image (provided as a DataURL) into a pattern file string.
     * @param imageURL The DataURL of the image to encode.
     * @param onComplete Callback function to receive the pattern file string.
     */
    static encodeImageURL(imageURL: string, onComplete: Function): void;
    /**
     * Encodes an image (CanvasImageSource) into a pattern file string.
     * @param image The image source to encode (HTMLImageElement, HTMLCanvasElement, etc.).
     * @returns The encoded pattern file string.
     */
    static encodeImage(image: CanvasImageSource): string;
    /**
     * Triggers a download of the pattern file string as a .patt file.
     * @param patternFileString The pattern file string to download.
     * @param fileName The name of the file to save (default: 'pattern-marker.patt').
     */
    static triggerDownload(patternFileString: string, fileName?: string): void;
    /**
     * Builds a full marker image (PNG) with the specified parameters and returns it as a DataURL.
     * @param innerImageURL The DataURL of the inner image to embed in the marker.
     * @param pattRatio The ratio of the inner image to the marker size (0.1 - 0.9 recommended).
     * @param size The size (in pixels) of the output marker image.
     * @param color The border color (CSS color string or hex code).
     * @param onComplete Callback function to receive the marker image DataURL.
     */
    static buildFullMarker(innerImageURL: string, pattRatio: number, size: number, color: string, onComplete: Function): void;
}

export { }

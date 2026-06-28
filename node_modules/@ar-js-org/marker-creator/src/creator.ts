/**
 * Utilities for creating AR.js/ARToolKit pattern markers from images.
 *
 * This module provides functions to generate marker pattern files and marker images
 * from user-supplied images, supporting customization of pattern ratio, image size, and border color.
 *
 * @module creator
 * @see https://github.com/AR-js-org/Marker-Creator
 */

import pkg from '../package.json';

export class ArPatternFile {
    /**
     * Version of the ArPatternFile class and pattern format, imported from package.json.
     * Update the version in package.json to change this value.
     */
    static version = pkg.version;

    private static sharedCanvas: HTMLCanvasElement = document.createElement('canvas');
    private static sharedContext: CanvasRenderingContext2D | null = ArPatternFile.sharedCanvas.getContext('2d');

    constructor() {}

    /**
     * Converts a pattern file string to a canvas image. (Not yet implemented)
     * @param patternFileString The string content of the pattern file.
     * @param onComplete Callback function to receive the canvas image.
     */
    static toCanvas(patternFileString: string, onComplete: Function) {
        console.assert(false, 'not yet implemented')
    }

    /**
     * Encodes an image (provided as a DataURL) into a pattern file string.
     * @param imageURL The DataURL of the image to encode.
     * @param onComplete Callback function to receive the pattern file string.
     */
    static encodeImageURL(imageURL: string, onComplete: Function) {
        const image = new Image;
        image.onload = function(){
            const patternFileString = ArPatternFile.encodeImage(image);
            onComplete(patternFileString)
        }
        image.src = imageURL;
    }

    /**
     * Encodes an image (CanvasImageSource) into a pattern file string.
     * @param image The image source to encode (HTMLImageElement, HTMLCanvasElement, etc.).
     * @returns The encoded pattern file string.
     */
    static encodeImage(image: CanvasImageSource) {
        const canvas = ArPatternFile.sharedCanvas;
        const context = ArPatternFile.sharedContext;
        if (!context) return '';
        
        canvas.width = 16;
        canvas.height = 16;

        let patternFileString = '';
        for(let orientation = 0; orientation > -2*Math.PI; orientation -= Math.PI/2){
            context.save();
            context.clearRect(0,0,canvas.width,canvas.height);
            context.translate(canvas.width/2,canvas.height/2);
            context.rotate(orientation);
            context.drawImage(image, -canvas.width/2,-canvas.height/2, canvas.width, canvas.height);
            context.restore();

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            if( orientation !== 0 )	patternFileString += '\n'
            for(let channelOffset = 2; channelOffset >= 0; channelOffset--){
                for(let y = 0; y < imageData.height; y++){
                    for(let x = 0; x < imageData.width; x++){

                        if( x !== 0 ) patternFileString += ' '

                        const offset = (y * imageData.width * 4) + (x * 4) + channelOffset;
                        const value = imageData.data[offset];

                        patternFileString += String(value).padStart(3);
                    }
                    patternFileString += '\n'
                }
            }
        }

        return patternFileString
    }

    /**
     * Triggers a download of the pattern file string as a .patt file.
     * @param patternFileString The pattern file string to download.
     * @param fileName The name of the file to save (default: 'pattern-marker.patt').
     */
    static triggerDownload(patternFileString: string, fileName = 'pattern-marker.patt') {
        const domElement = window.document.createElement('a');
        domElement.href = window.URL.createObjectURL(new Blob([patternFileString], {type: 'text/plain'}));
        domElement.download = fileName;
        document.body.appendChild(domElement)
        domElement.click();
        document.body.removeChild(domElement)
    }

    /**
     * Builds a full marker image (PNG) with the specified parameters and returns it as a DataURL.
     * @param innerImageURL The DataURL of the inner image to embed in the marker.
     * @param pattRatio The ratio of the inner image to the marker size (0.1 - 0.9 recommended).
     * @param size The size (in pixels) of the output marker image.
     * @param color The border color (CSS color string or hex code).
     * @param onComplete Callback function to receive the marker image DataURL.
     */
    static buildFullMarker(innerImageURL: string, pattRatio: number, size: number, color: string, onComplete: Function) {
        const whiteMargin = 0.1;
        const blackMargin = (1 - 2 * whiteMargin) * ((1 - pattRatio) / 2);
        const innerMargin = whiteMargin + blackMargin;

        const canvas = ArPatternFile.sharedCanvas;
        const context = ArPatternFile.sharedContext;
        if (!context) return;
        
        canvas.width = canvas.height = size

        context.fillStyle = 'white';
        context.fillRect(0,0,canvas.width, canvas.height)

        context.fillStyle = color;
        context.fillRect(
            whiteMargin * canvas.width,
            whiteMargin * canvas.height,
            canvas.width * (1-2*whiteMargin),
            canvas.height * (1-2*whiteMargin)
        );

        context.fillStyle = 'white';
        context.fillRect(
            innerMargin * canvas.width,
            innerMargin * canvas.height,
            canvas.width * (1-2*innerMargin),
            canvas.height * (1-2*innerMargin)
        );

        const innerImage = document.createElement('img');
        innerImage.addEventListener('load', function(){
            context.drawImage(innerImage,
                innerMargin * canvas.width,
                innerMargin * canvas.height,
                canvas.width * (1-2*innerMargin),
                canvas.height * (1-2*innerMargin)
            );

            const imageUrl = canvas.toDataURL();
            onComplete(imageUrl)
        })
        innerImage.src = innerImageURL
    }

}
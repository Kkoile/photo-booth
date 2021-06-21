/*
 * This file is part of "photo-booth"
 * Copyright (c) 2018 Philipp Trenz
 *
 * For more information on the project go to
 * <https://github.com/philipptrenz/photo-booth>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import sharp from 'sharp';
import NodeWebcam from 'node-webcam';

import utils from "./utils.js";

class Camera {

	constructor() {
	}

	/*
	* Detect and configure camera
	*/
	initialize(callback) {
        var opts = {
            width: 3840,
            height: 2160,
            quality: 100,
            delay: 0,
            saveShots: true,
            output: "jpeg",
            device: false,
            callbackReturn: "buffer",
            verbose: false
        };
        this.camera = NodeWebcam.create( opts );

        callback(true);
	}



	isInitialized(){
		return (this.camera !== undefined);
	}

	isConnected(callback) {
		if (callback) callback(true);
	}

	takePicture(callback) {
		var self = this;

		if (self.camera === undefined) {
			callback(-1, 'camera not initialized', null);
			return;
		}

		const filepath = utils.getPhotosDirectory() + "img_" + utils.getTimestamp() + ".jpg";
		const webFilepath = utils.getWebAppPhotosDirectory() + "img_" + utils.getTimestamp() + ".jpg";
		const maxImageSize = utils.getConfig().maxImageSize ? utils.getConfig().maxImageSize : 1500;

        self.camera.capture( "test_picture", function( err, data ) {
			if (err) {
				self.camera = undefined;	// needs to be reinitialized
				callback(-2, 'connection to camera failed', err);
				return;
			}

			sharp(data) // resize image to given maxSize
				.toFile(filepath, function(err) {

				if (err) {
					callback(-3, 'resizing image failed', err)
				} else {
					callback(0, filepath, webFilepath);
				}
			});

		});

	}

}

/*
 * Module exports for connection
 */
let camera = new Camera();
export { camera as default };

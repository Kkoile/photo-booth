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
import PiCamera from 'pi-camera';

import utils from "./utils.js";

class Camera {

	constructor() {
	}

	/*
	* Detect and configure camera
	*/
	initialize(callback) {
        this.camera = new PiCamera({
            mode: 'photo',
			nopreview: true
        });

		callback(true);
	}

	

	isInitialized(){
		return (this.camera !== undefined);
	}

	isConnected(callback) {
        callback(true); //TODO: more sufficient check if camera is connected
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

		myCamera.setOutput(filepath);
        myCamera.snap()
            .then(() => {
                sharp(filepath) // resize image to given maxSize
                    .resize(Number(maxImageSize)) // scale width to 1500
                    .toFile(filepath, function(err) {

                        if (err) {
                            callback(-3, 'resizing image failed', err)
                        } else {
                            callback(0, filepath, webFilepath);
                        }
                    });
            })
            .catch((err) => {
                self.camera = undefined;	// needs to be reinitialized
                callback(-2, 'connection to camera failed', err);
                return;
            });

	}

}

/*
 * Module exports for connection
 */
let camera = new Camera();
export { camera as default };
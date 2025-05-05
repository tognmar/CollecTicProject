import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import {getCroppedImg} from "../../utilities/CropImage/index.js";

export default function CropperModal({ image, onCropComplete, onCancel }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleDone = async () => {
        const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
        onCropComplete(croppedBlob);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-[90vw] max-w-lg">
                <div className="relative aspect-square w-full h-64 bg-black">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={handleCropComplete}
                    />
                </div>
                <div className="mt-4 flex justify-between">
                    <button className="btn btn-error" onClick={onCancel}>Cancel</button>
                    <button className="btn btn-success" onClick={handleDone}>Crop</button>
                </div>
            </div>
        </div>
    );
}
import React, {useEffect, useRef, useState} from 'react';
import Cropper from 'react-easy-crop';
import useFetchPost from "../../../utilities/CustomHooks/UseFetchPost.jsx";
import {useNavigate} from "react-router";
import {getCroppedImg} from "../../../utilities/CropImage/index.js";
import {pdfjs} from 'react-pdf';
import useFetchDelete from "../../../utilities/CustomHooks/useFetchDelete.jsx";
import {useDispatch} from "react-redux";
import {deleteTicket} from "../../../store/Slices/Tickets/index.js";

// Configure the worker for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.js';


const NativePhotoInput = () => {
    const [photo, setPhoto] = useState(null);
    const [croppedPhoto, setCroppedPhoto] = useState(null);
    const [cropping, setCropping] = useState(false);
    const [fileType, setFileType] = useState(null);
    const [rawFile, setRawFile] = useState(null);
    const [useCamera, setUseCamera] = useState(false);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [localError, setLocalError] = useState(null);
    const [isTicket, setIsTicket] = useState(false);

    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const {postData, isFetching, error, data, resetData} = useFetchPost('/tickets/extraction/');
    const {deleteResource, isDeleting, errorDelete, success,} = useFetchDelete();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (photo) setCrop({x: 0, y: 0});
    }, [photo]);

    useEffect(() => {
        setCrop({x: 0, y: 0});
    }, [zoom]);

    const extractFirstError = (errorData) => {

        if (!errorData) return {file: ["An unknown error occurred."]};

        // String case
        if (typeof errorData === 'string') {
            return {file: [errorData]};
        }

        // JSON object
        if (typeof errorData === 'object') {
            // Common DRF top-level error fields
            if (typeof errorData.error === 'string') {
                return {file: [errorData.error]};
            }
            if (typeof errorData.detail === 'string') {
                return {file: [errorData.detail]};
            }

            // Field-specific errors
            for (const key in errorData) {
                const value = errorData[key];
                if (Array.isArray(value)) {
                    return {[key]: value};
                }
                if (typeof value === 'string') {
                    return {[key]: [value]};
                }
            }
        }

        // Fallback
        return {file: ["An unknown error occurred."]};
    };

    const handleFileChange = (e) => {
        const MAX_FILE_SIZE = 20.0 * 1024 * 1024;
        const MIN_WIDTH = 100;
        const MIN_HEIGHT = 100;
        const MAX_WIDTH = 5000;
        const MAX_HEIGHT = 5000;

        const file = e.target.files[0];
        if (!file) return;

        const isPDF = file.type === 'application/pdf';
        const isImage = file.type === 'image/jpeg' || file.type === 'image/png';

        // ✨ Validate file type first
        if (!isPDF && !isImage) {
            setLocalError({file: ["Unsupported file format. Please upload a JPG, PNG, or PDF."]});
            return;
        }

        // ✨ Validate file size
        if (file.size > MAX_FILE_SIZE) {
            const sizeInMB = MAX_FILE_SIZE / (1024 * 1024);
            setLocalError({file: [`File size must be smaller than ${sizeInMB}MB.`]});
            return;
        }

        const url = URL.createObjectURL(file);

        // ✨ If it's an image, validate dimensions
        if (isImage) {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                if (
                    img.width < MIN_WIDTH || img.height < MIN_HEIGHT ||
                    img.width > MAX_WIDTH || img.height > MAX_HEIGHT
                ) {
                    setLocalError({file: [`Image dimensions must be between ${MIN_WIDTH}x${MIN_HEIGHT} and ${MAX_WIDTH}x${MAX_HEIGHT} pixels.`]});
                    return;
                }

                setLocalError(null);
                setFileType('image');
                setRawFile(file);
                setPhoto(url);
                setCropping(true);
            };
            img.onerror = () => {
                setLocalError({file: ["Invalid image file."]});
            };
        } else if (isPDF) {
            // ✨ For PDFs, skip dimension check
            setLocalError(null);
            setFileType('pdf');
            setRawFile(file);
            renderPdf(url);
        }
    };

    // Render PDF

    const renderPdf = async (url) => {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        // Render the first page of the PDF
        const page = await pdf.getPage(1);
        const scale = 1.5;
        const viewport = page.getViewport({scale});

        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Canvas element not found");
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            console.error("Canvas context not available");
            return;
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport: viewport,
        }).promise;

        // Once rendered, set the canvas image to be cropped
        const imageUrl = canvas.toDataURL();
        setPhoto(imageUrl);
        setCropping(true);
    };

    const triggerFileSelect = (camera = false) => {
        setUseCamera(camera);
        setTimeout(() => fileInputRef.current?.click(), 0);
    };

    const handleCropComplete = (_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const resizeImage = (blob, maxWidth, maxHeight) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);

        const isPng = blob.type === 'image/png';

        img.onload = () => {
            let { width, height } = img;

            const scale = Math.min(maxWidth / width, maxHeight / height, 1);
            width *= scale;
            height *= scale;

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (resizedBlob) => {
                    if (resizedBlob) {
                        resolve(resizedBlob);
                    } else {
                        reject(new Error("Image resize failed."));
                    }
                },
                isPng ? 'image/png' : 'image/jpeg',
                isPng ? undefined : 0.8 // quality only for jpeg
            );
        };

        img.onerror = () => reject(new Error("Failed to load image for resizing."));
        img.src = url;
    });
};

    const handleCropDone = async () => {
        try {
            const cropped = await getCroppedImg(photo, croppedAreaPixels);

            // Resize the cropped image before converting it to a File
            const resizedBlob = await resizeImage(cropped , 1024, 1024); // max 1024x1024 px
            console.log('Cropped file size (KB):', (resizedBlob.size / 1024).toFixed(2), 'KB');

            const previewUrl = URL.createObjectURL(resizedBlob);
            setCroppedPhoto(previewUrl);

            const resizedFile = new File([resizedBlob], 'ticket.jpg', { type: 'image/jpeg' });
            setRawFile(resizedFile);
            setCropping(false);
        } catch (err) {
           setLocalError({ file: ["Failed to crop or resize image."] });
        }
    };

    const resetState = () => {
        setPhoto(null);
        setCroppedPhoto(null);
        setCroppedAreaPixels(null);
        setCrop({x: 0, y: 0});
        setZoom(1);
        setCropping(false);
        setFileType(null);
        setRawFile(null);
    };

    const handleSaveToBackend = async () => {
        resetData();

        const formData = new FormData();
        formData.append('file', rawFile);

        let response;

        try {
            response = await postData(formData);
        } catch (error) {
            setIsTicket(false);
            const errorData = error.response?.data || error;
            const extracted = extractFirstError(errorData);
            setLocalError(extracted);
            return;
        }

        const looksLikeTicket = !(response?.title_artist === "Unnamed Event" && response?.venue === "Unknown Venue");

        if (response?.id && looksLikeTicket) {
            resetState();
            navigate(`/profile/${response.user_profile.id}`);
            setIsTicket(true);
        } else if (response?.id && !looksLikeTicket) {
            setIsTicket(false);
            try {
                await deleteResource(`/tickets/${response.id}/`);
                dispatch(deleteTicket(response.id));
            } catch (deleteError) {
                const extracted = extractFirstError(deleteError.response?.data || deleteError);
                setLocalError(extracted);
                return;
            }
            setLocalError({file: ["This doesn't look like a valid ticket."]});
        } else {
            setIsTicket(false);
            const errorData = typeof response === "object" ? response : {error: "Image does not appear to be a valid ticket."};
            const extracted = extractFirstError(errorData);
            setLocalError(extracted);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-base-200 px-4 py-8">
            {/* Title */}
            <div className="-mt-16 w-full flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-2 text-center">
                    Upload Your Ticket
                </h2>
                <p className="text-center text-base text-gray-700 mb-10 leading-relaxed max-w-md mx-auto">
                    Our AI will automatically extract event details for you.
                    Just upload and relax!
                </p>

                {/* Buttons, stacked vertically */}
                <div className="flex flex-col gap-4 w-full max-w-xs mb-8">
                    <button
                        className="btn btn-primary w-full"
                        type="button"
                        onClick={() => triggerFileSelect(false)}
                    >
                        Upload from Gallery
                    </button>
                    <button
                        className="btn btn-success w-full"
                        type="button"
                        onClick={() => triggerFileSelect(true)}
                    >
                        Use Camera
                    </button>
                </div>
                <p className="text-center text-sm text-gray-500 max-w-xs mx-auto">
                    Supported formats: <span className="font-medium">JPG, PNG, PDF</span>.<br/>
                    Maximum file size: <span className="font-medium">20MB</span>.<br/>
                    Minimum image dimensions: <span className="font-medium">50x50</span> pixels.
                </p>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                capture={useCamera ? 'environment' : undefined}
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Canvas element (for rendering PDFs) */}
            <canvas ref={canvasRef} className="hidden"/>

            {/* Cropper */}
            {cropping && (
                <div className="relative w-full max-w-md h-96 bg-base-200 rounded-lg overflow-hidden mb-8">
                    <Cropper
                        image={photo}
                        crop={crop}
                        zoom={zoom}
                        minZoom={0.4}
                        zoomSpeed={0.1}
                        aspect={2.5}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={handleCropComplete}
                    />
                    <div className="absolute bottom-4 w-full flex justify-center gap-4">
                        <button
                            onClick={handleCropDone}
                            className="btn btn-success"
                        >
                            ✅ Crop
                        </button>
                        <button
                            onClick={() => setCropping(false)}
                            className="btn btn-neutral"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Cropped preview and save */}
            {croppedPhoto && (
                <div className="mt-8 w-full max-w-md">
                    <h3 className="text-base-content font-medium mb-3">
                        {fileType === 'pdf' ? 'PDF Preview:' : 'Cropped Image Preview:'}
                    </h3>
                    <img
                        src={croppedPhoto}
                        alt="Cropped"
                        className="rounded-lg shadow border max-w-full"
                    />
                    <button
                        onClick={handleSaveToBackend}
                        disabled={isFetching}
                        className={`btn btn-secondary mt-6 w-full ${isFetching ? 'btn-disabled' : ''}`}
                    >
                        {isFetching ? 'Saving...' : 'Save Ticket'}
                    </button>
                </div>
            )}

            {localError?.file && (
                <div className="alert alert-error mt-3">
                    <span>{localError.file[0]}</span>
                </div>
            )}

        </div>
    );
};

export default NativePhotoInput;

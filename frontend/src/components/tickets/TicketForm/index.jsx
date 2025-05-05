import React, {useEffect, useState} from 'react';
import useFetchPatch from "../../../utilities/CustomHooks/UseFetchPatch.jsx";
import {useDispatch, useSelector} from "react-redux";
import {update_ticket} from "../../../store/Slices/Tickets/index.js";

const TicketForm = ({ticketId, onClose}) => {
    const [formData, setFormData] = useState({
        title_artist: '',
        location: '',
        venue: '',
        date: '',
        text: '',
        ticket_image: null,
        event_image: null,
    });

    const tickets = useSelector(state => state.UserTickets.tickets);
    const ticket = tickets.find(ticket => ticket.id === ticketId);
    const dispatch = useDispatch();

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const {patchData, errorPatch, isPatchFetching, dataPatch} = useFetchPatch();

    // Only set formData from ticketData on initial load
    useEffect(() => {
        if (ticket) {
            setFormData(prev => {
                if (
                    prev.title_artist === '' &&
                    prev.location === '' &&
                    prev.venue === '' &&
                    prev.date === '' &&
                    prev.text === ''
                ) {
                    return {
                        title_artist: ticket.title_artist || '',
                        location: ticket.location || '',
                        venue: ticket.venue || '',
                        date: ticket.date || '',
                        text: ticket.text || '',
                        ticket_image: null,
                        event_image: null,
                    };
                }
                return prev;
            });
        } else {
            setError("There is no ticket with this id. Please check again");
        }
    }, [ticket]);

    useEffect(() => {
        if (dataPatch) {
            console.log("Are we here")
            setSuccess('Ticket updated successfully!');
            setError('');
            dispatch(update_ticket(dataPatch));
            console.log("This is the storage tickets", tickets)
            if (onClose) {
                onClose();
            }
        }

        if (errorPatch) {
            setError(errorPatch);
            setSuccess('');
        }
    }, [dataPatch, errorPatch]);

    const resizeImage = (file, maxWidth = 1024, maxHeight = 1024) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            const isPng = file.type === 'image/png';

            img.onload = () => {
                let {width, height} = img;
                const scale = Math.min(maxWidth / width, maxHeight / height, 1);
                width *= scale;
                height *= scale;

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) return reject("Resize failed.");
                        const resizedFile = new File([blob], file.name, {
                            type: isPng ? 'image/png' : 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(resizedFile);
                    },
                    isPng ? 'image/png' : 'image/jpeg',
                    isPng ? undefined : 0.8
                );
            };

            img.onerror = () => reject("Could not load image.");
            img.src = url;
        });
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleFileChange = async (e) => {
        const {name, files} = e.target;
        if (!files || files.length === 0) return;

        const file = files[0];
        const MAX_FILE_SIZE = 20 * 1024 * 1024; // 5MB before resize
        const isImage = file.type === 'image/jpeg' || file.type === 'image/png';

        if (!isImage) {
            setError("Unsupported file format. Only JPG or PNG allowed.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("Image too large. Please choose a smaller file.");
            return;
        }

        try {
            const resized = await resizeImage(file, 1024, 1024);
            setFormData((prev) => ({...prev, [name]: resized}));
            setError('');
        } catch (err) {
            setError("Failed to resize image. Please try another file.");
        }
    };

    const handleSave = async () => {
        try {
            const form = new FormData();
            for (const key in formData) {
                if (formData[key]) {
                    form.append(key, formData[key]);
                }
            }

            await patchData(`tickets`, ticketId, form);

            if (errorPatch) {
                throw new Error(errorPatch);
            }
            setSuccess('Ticket updated successfully!');
            setError('');
        } catch (err) {
            setError(err.message);
            setSuccess('');
        }
    };

    useEffect(() => {
        if (dataPatch) {
            setSuccess('Ticket updated successfully!');
        }
        if (errorPatch) {
            setError(errorPatch);
        }
    }, [dataPatch, errorPatch]);

    if (!ticketId) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
                <p className="text-red-600 font-bold">No ticket selected for editing.</p>
            </div>
        );
    }

    return (
        <form className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md relative flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Edit Ticket</h2>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300 transition"
                >
                    Close
                </button>
            )}


            <>
                <div className="space-y-4 flex-1">
                    <input
                        name="title_artist"
                        placeholder="Title / Artist"
                        value={formData.title_artist}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                    />

                    <input
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                    />

                    <input
                        name="venue"
                        placeholder="Venue (optional)"
                        value={formData.venue}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                    />

                    <input
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                    />

                    <textarea
                        name="text"
                        placeholder="Description"
                        value={formData.text}
                        onChange={(e) => {
                            if (e.target.value.length <= 250) {
                                handleChange(e);
                            }
                        }}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                    />
                    <div className="text-right text-sm text-gray-500">
                        {formData.text.length}/250
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Event Image</label>
                        <input
                            type="file"
                            name="event_image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file-input file-input-primary border-none file:normal-case w-full"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Accepted formats: JPG, PNG. Max size: 20MB.
                    </p>

                    {error && <p className="text-red-600 font-medium text-center">{error}</p>}
                    {success && <p className="text-green-600 font-medium text-center">{success}</p>}
                </div>
                {/* Save button at the bottom right */}
                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition"
                        disabled={isPatchFetching}
                    >
                        Save
                    </button>
                </div>
            </>

        </form>
    );
};

export default TicketForm;

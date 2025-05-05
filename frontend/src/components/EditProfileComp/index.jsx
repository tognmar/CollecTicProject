import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import useFetchPatchWithoutId from "../../utilities/CustomHooks/UseFetchPatchWithoutId.jsx";
import CropperModal from "../CropperModal/index.jsx";
import {load_profile} from "../../store/Slices/Profile/index.jsx";

export default function EditProfileComponent({ onSuccess }) {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile.userProfile);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");

    const {dataPatch, errorPatch, isPatchFetching, patchData} = useFetchPatchWithoutId("profile/");
    const [avatar, setAvatar] = useState(null);
    const [resetAvatar, setResetAvatar] = useState(false);

    const [showCropper, setShowCropper] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);


    useEffect(() => {
        if (profile) {
            setName(profile.name || "");
            setLocation(profile.location || "");
        }
    }, [profile]);

    // Dispatch to Redux when patch is done
    useEffect(() => {
        if (dataPatch) {
            dispatch(load_profile(dataPatch));

            // Call the onSuccess callback to close the modal
            if (onSuccess) {
                onSuccess();
            }

            setAvatar(null);
            setResetAvatar(false);
            setImageSrc(null);
        }
    }, [dataPatch, dispatch, onSuccess]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
           const reader = new FileReader();
           reader.onloadend = () => {
               setImageSrc(reader.result);
               setShowCropper(true);
           };
           reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedBlob) => {
       const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
       setAvatar(file);
       setShowCropper(false);
    };

    const handleCancelCrop = () => {
       setImageSrc(null);
       setShowCropper(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("location", location);

        if (resetAvatar) {
            formData.append("avatar", "");
        } else if (avatar) {
            formData.append("avatar", avatar);
        }

        patchData(formData);
    };

    return (<>
        {showCropper && (
               <CropperModal
                 image={imageSrc}
                 onCropComplete={handleCropComplete}
                 onCancel={handleCancelCrop}
               />
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name Input */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">Name</span>
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered text-base-content"
                    placeholder="Enter your name"
                />
            </div>

            {/* Name Input */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">City</span>
                </label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input input-bordered text-base-content"
                    placeholder="Enter in which city you live"
                />
            </div>

            {(avatar || (profile.avatar && !profile.avatar.includes("default-avatar"))) && (
                <div className="flex flex-col gap-4">
                    <label className="label">
                        <span className="label-text font-semibold">Current Avatar</span>
                    </label>
                    <div className="flex justify-center mb-2">
                      <img
                        src={
                          avatar
                            ? URL.createObjectURL(avatar)
                            : profile.avatar
                              ? `${profile.avatar}?${profile.last_updated || Date.now()}`
                              : avatar // fallback if you want to show a default avatar
                        }
                        alt="Selected or current avatar"
                        className="w-24 h-24 rounded-full border shadow"
                      />
                    </div>
                </div>
            )}

            {/* Avatar Input */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">Update Avatar</span>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full"
                    disabled={resetAvatar}
                />
            </div>

            {/* Reset Avatar Option */}
            <div className="form-control">
                <label className="label justify-between cursor-pointer">
                    <span className="label-text font-semibold">Or reset to Default Avatar</span>
                    <input
                        type="checkbox"
                        className="checkbox checkbox-error"
                        checked={resetAvatar}
                        onChange={() => setResetAvatar(!resetAvatar)}
                    />
                </label>
            </div>

            {/* Submit Button */}
            <div className="form-control">
                <button
                    type="submit"
                    className="btn btn-primary small-caps"
                    disabled={isPatchFetching}
                >
                    {isPatchFetching ? "Updating..." : "Update"}
                </button>
            </div>

            {/* Feedback */}
            {errorPatch && (
                <div className="alert alert-error text-sm shadow">{errorPatch}</div>
            )}
        </form>
    </>);
}
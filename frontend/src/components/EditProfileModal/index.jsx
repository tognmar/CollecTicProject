import { createPortal } from "react-dom";
import EditProfileComponent from "../EditProfileComp/index.jsx";

export default function EditProfileModal({ onClose }) {
  // Create a portal that renders the modal at the root level
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-box relative max-w-md w-full">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
        <EditProfileComponent onSuccess={onClose} />
      </div>
    </div>,
    document.body // This renders the modal directly in the body, not inside any component
  );
}
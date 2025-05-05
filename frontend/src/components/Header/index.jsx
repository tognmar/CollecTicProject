import { useNavigate } from "react-router";
import { LogOut, Settings } from "lucide-react";
import { logout_user } from "../../store/Slices/User/index.js";
import { useDispatch } from "react-redux";

export default function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout_user()); // Dispatch the logout action
        navigate("/sign-in"); // Navigate to the sign-in page
    };

    return (
        <div className="h-[10vh] w-full flex items-center justify-end px-4 gap-x-4">
            <Settings
                className="cursor-pointer"
                onClick={() => navigate("/settings")}
                size={24}
            />
            <LogOut
                className="cursor-pointer"
                onClick={handleLogout}
                size={24}
            />
        </div>
    );
}

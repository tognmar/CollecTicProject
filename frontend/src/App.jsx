import Router from "./routes/index.jsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login_user, logout_user } from "./store/Slices/User";
import { TokenValidation } from "./utilities/CustomHooks/Authorization.jsx";

function App() {
    const accessToken = useSelector((state) => state.user.access_token);
    const [isLoading, setIsLoading] = useState(true);
    const { postData, error, isFetching} = TokenValidation();
    const dispatch = useDispatch();
    const currentTheme = useSelector(state => state.themes.theme)

    useEffect(() => {
        const validateToken = async () => {
            // If we already have a token in Redux state, no need to validate
            if (accessToken) {
                setIsLoading(false);
                return;
            }

            // Otherwise check localStorage
            const localToken = localStorage.getItem("accessToken");

            if (localToken) {
                try {
                    // Use the hook's postData function to validate the token
                    const result = await postData({ token: localToken });

                    // If validation successful, dispatch login with the token
                    if (result.valid) {
                        dispatch(login_user(localToken));
                    }
                } catch (err) {
                    // Remove invalid token from localStorage
                    localStorage.removeItem("accessToken");
                    dispatch(logout_user());
                }
            } else {
                dispatch(logout_user());
            }

            setIsLoading(false);
        };

        validateToken();
    }, []);

    //Apply theme to HTML document
    useEffect(() => {
        // This is the key line that needs to be correct
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, [currentTheme]);

    // Use isFetching from the hook for loading state
    if (isLoading || isFetching) {
        return <>Loading...</>;
    }

    // You could handle error state from the hook here if needed
    if (error && !isLoading) {
        // Optional: Display error message or handle token validation failure
        console.log("Token validation error:", error);
    }

    return (
        // No need to set data-theme here since we're setting it on documentElement
        <div>
            <Router />
        </div>
    );
}

export default App;
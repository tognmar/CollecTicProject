import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ActivateUser } from "../../utilities/CustomHooks/Authorization.jsx";
import Logo from "../../assets/SVGs/damy-logo.svg";

export default function UserActivation() {
    const { postData, error, isFetching, data } = ActivateUser();
    const [paramError, setParamError] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const uid = searchParams.get("uid");
        const token = searchParams.get("token");

        if (!uid || !token) {
            setParamError(true);
            return;
        }

        postData({ uid, token }).then(() => {});
    }, []);


   return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-400 p-4">
            <div className="w-full max-w-md p-6 shadow-l rounded-box">
                <div className="flex justify-center mb-8">
                    <img src={Logo} alt="CollecTic Logo" className="w-40 h-auto" />
                </div>

                <div className="flex flex-col gap-6 text-center">
                    <h2 className="text-2xl font-bold">Account Activation</h2>

                    {paramError && (
                        <div className="text-red-500">
                            <p>Invalid activation link.</p>
                            <button
                                onClick={() => navigate("/sign-up")}
                                className="btn btn-primary w-full mt-4"
                            >
                                Register Again
                            </button>
                        </div>
                    )}

                    {isFetching && (
                        <div>
                            <span className="loading loading-spinner"></span>
                            <p className="mt-4">Activating your account...</p>
                        </div>
                    )}

                    {data && (
                        <>
                            <h3 className="text-green-600 text-xl font-semibold">Success!</h3>
                            <p>Your account has been successfully activated.</p>
                            <button
                                onClick={() => navigate("/sign-in")}
                                className="btn btn-primary w-full mt-6"
                            >
                                Sign In Now
                            </button>
                        </>
                    )}

                    {error && !isFetching && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-red-600 text-xl font-semibold">Activation Failed</h3>
                            <p className="text-red-500">{error}. Please try again.</p>

                            <button
                                onClick={() => navigate("/sign-up")}
                                className="btn btn-primary w-full"
                            >
                                Register Again
                            </button>
                            <button
                                onClick={() => navigate("/sign-in")}
                                className="btn btn-secondary w-full"
                            >
                                Back to Sign In
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

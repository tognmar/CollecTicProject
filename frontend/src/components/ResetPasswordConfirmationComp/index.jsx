import { ResetPasswordConfirmation } from "../../utilities/CustomHooks/Authorization.jsx";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Logo from "../../assets/SVGs/damy-logo.svg";

export default function ResetPasswordConfirmationComp() {
    const { postData, error, isFetching, data } = ResetPasswordConfirmation();
    const [paramError, setParamError] = useState(false);
    const [new_password, setPassword] = useState("");
    const [re_new_password, setRePassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [dataSend, setDataSend] = useState(true);
    const [uid, setUid] = useState("");
    const [token, setToken] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const uid = searchParams.get("uid");
        const token = searchParams.get("token");

        if (!uid || !token) {
            setParamError(true);
        } else {
            setUid(uid);
            setToken(token);
        }
    }, [location.search]);

    const handleResetPassword = (e) => {
        e.preventDefault();

        if (new_password !== re_new_password) {
            setPasswordError("Passwords do not match");
            return;
        }

        setPasswordError("");
        setDataSend(false);
        postData({ uid, token, new_password, re_new_password }).catch(() => {
            setDataSend(true); // Allow retry
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-400 p-4">
            <div className="w-full max-w-md p-6 shadow-l rounded-box">
                <div className="flex justify-center mb-6">
                    <img src={Logo} alt="CollecTic Logo" className="w-40 h-auto" />
                </div>

                <h2 className="text-2xl font-bold text-center mb-4">Password Reset</h2>

                {paramError && (
                    <div className="alert alert-error mb-4">
                        <span>Invalid or expired reset link.</span>
                    </div>
                )}

                {passwordError && (
                    <div className="alert alert-error mb-4">
                        <span>{passwordError}</span>
                    </div>
                )}

                {dataSend && !paramError && (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
                        <label className="input input-bordered w-full flex items-center gap-x-2">
                            <svg className="h-[1em] flex-shrink-0 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="flex-1 w-full focus:outline-none"
                                value={new_password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>

                        <label className="input input-bordered w-full flex items-center gap-x-2">
                            <svg className="h-[1em] flex-shrink-0 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>
                            <input
                                type="password"
                                placeholder="Repeat New Password"
                                className="flex-1 w-full focus:outline-none"
                                value={re_new_password}
                                onChange={(e) => setRePassword(e.target.value)}
                                required
                            />
                        </label>
                        <button
                            type="submit"
                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                            disabled={isFetching}
                        >
                            {isFetching && <span className="loading loading-spinner"></span>}
                            {isFetching ? "Processing..." : "Reset Password"}
                        </button>
                    </form>
                )}

                {data && (
                    <div className="alert alert-success mb-4">
                        <span>Your password has been successfully reset.</span>
                    </div>
                )}

                {data && (
                    <button className="btn btn-primary w-full mt-4" onClick={() => navigate("/sign-in")}>
                        Sign In Now
                    </button>
                )}

                {error && (
                    <div className="mt-4 flex flex-col gap-2">
                        <div className="alert alert-error">
                            <span>{error}.</span>
                        </div>
                        <button className="btn btn-outline" onClick={() => navigate("/sign-up")}>
                            Register Again
                        </button>
                        <button className="btn btn-outline" onClick={() => navigate("/reset-password")}>
                            Try Resetting Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

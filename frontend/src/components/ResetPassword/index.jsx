import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {ResetPassword} from "../../utilities/CustomHooks/Authorization.jsx";
import Logo from "../../assets/SVGs/damy-logo.svg";

export default function ResetPasswordComp() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const {postData, error, isFetching, data} = ResetPassword();


    const handleSubmit = (e) => {
        e.preventDefault();
        postData({email})
            .then(() => {
                setEmail(""); // Clear form on success
            })
            .catch(() => {
                // Error is already handled by the hook's error state
            });
    };

    useEffect(() => {
    }, [postData]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-400 p-4">
            <div className="w-full max-w-md p-6 shadow-l  rounded-box">
                <div className="flex justify-center mb-6">
                    <img src={Logo} alt="CollecTic Logo" className="w-40 h-auto"/>
                </div>

                {data ? (
                    <div className="mb-4 text-center">
                        <span className="text-green-700">
                            We've sent password reset instructions to your email.
                        </span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <label className="input input-bordered w-full flex items-center gap-x-2">
                            <svg className="h-[1em] flex-shrink-0 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                            </svg>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="flex-1 w-full focus:outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isFetching}
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

                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error}. Please try again.</span>
                    </div>
                )}

            </div>
        </div>
    );
}

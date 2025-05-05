import { useState } from "react";
import { useNavigate } from "react-router";
import { CreateUser } from "../../utilities/CustomHooks/Authorization.jsx";
import Logo from "../../assets/SVGs/damy-logo.svg";

export default function SignUpComp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [re_password, setRePassword] = useState("");
    const [name, setName] = useState("");
    const [passwordError, setPasswordError] = useState(""); // New state for password error
    const navigate = useNavigate();
    const { postData, error, isFetching, data } = CreateUser();

    const handleSignUp = (e) => {
        e.preventDefault();

        // Check if passwords match and set an error message if they don't
        if (password !== re_password) {
            setPasswordError("Passwords do not match.");
            return;
        } else {
            setPasswordError(""); // Clear error if passwords match
        }

        postData({ email, name, password, re_password })
            .then(() => {
                setEmail("");
                setPassword("");
                setRePassword("");
                setName("");
            })
            .catch(() => {});
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-400 p-4">
            <div className="w-full max-w-md p-6 shadow-l rounded-box">
                <div className="flex justify-center mb-6">
                    <img src={Logo} alt="CollecTic Logo" className="w-40 h-auto" />
                </div>

                {data ? (
                    <div className="alert-success mb-4 text-center text-green-700">
                        <span>Thank you! We've sent an activation email.</span>
                    </div>
                ) : (
                    <form onSubmit={handleSignUp} className="flex flex-col gap-6">
                        <label className="input input-bordered validator w-full flex items-center gap-x-2">
                            <svg className="h-[1em] flex-shrink-0 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                            </svg>
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                disabled={isFetching}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 w-full focus:outline-none"
                            />
                        </label>

                        <label className="input input-bordered validator w-full flex items-center gap-x-2">
                            <svg className="h-[1em] flex-shrink-0 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </g>
                            </svg>
                            <input
                                type="text"
                                required
                                placeholder="Username"
                                pattern="[A-Za-z][A-Za-z0-9\-]*"
                                minLength="3"
                                maxLength="30"
                                title="Only letters, numbers or dash"
                                value={name}
                                disabled={isFetching}
                                onChange={(e) => setName(e.target.value)}
                                className="flex-1 w-full focus:outline-none"
                            />
                        </label>

                        <label className="input input-bordered validator w-full flex items-center gap-x-2">
                            <svg className="h-[1em] flex-shrink-0 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                                </g>
                            </svg>
                            <input
                                type="password"
                                required
                                placeholder="Password"
                                minLength="8"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                                value={password}
                                disabled={isFetching}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex-1 w-full focus:outline-none"
                            />
                        </label>

                        <p className="validator-hint hidden">
                            Must be more than 8 characters, including
                            <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
                        </p>
                        <label className="input input-bordered validator w-full flex items-center gap-x-2">
                            <svg className="h-[1em] flex-shrink-0 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                                </g>
                            </svg>
                            <input
                                type="password"
                                name="re_password"
                                placeholder="Repeat Password"
                                className="flex-1 w-full focus:outline-none"
                                value={re_password}
                                onChange={(e) => setRePassword(e.target.value)}
                                required
                                disabled={isFetching}
                            />
                        </label>

                        {passwordError && (
                            <div className="alert-error text-red-500 text-center">
                                <span>{passwordError}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isFetching}
                        >
                            {isFetching && <span className="loading loading-spinner"></span>}
                            {isFetching ? "Signing up..." : "Sign Up"}
                        </button>

                        <div className="flex justify-center text-sm">
                            <a onClick={() => navigate("/sign-in")} className="link link-hover">
                                Already have an account?
                            </a>
                        </div>
                    </form>
                )}

                {error && (
                    <div className="alert-error mt-7 text-red-500 text-center">
                        <span>{error}. Please try again.</span>
                    </div>
                )}
            </div>
        </div>
    );
}

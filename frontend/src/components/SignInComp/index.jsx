import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login_user, load_user } from "../../store/Slices/User";
import { useNavigate } from "react-router";
import { Login } from "../../utilities/CustomHooks/Authorization.jsx";
import useFetchGet from "../../utilities/CustomHooks/UseFetchGet.jsx";
import Logo from "../../assets/SVGs/damy-logo.svg";

export default function SignInComp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { postData, error, isFetching } = Login();

    const { data: userData } = useFetchGet(loginSuccess ? "auth/users/me/" : null);

    useEffect(() => {
        if (userData) {
            dispatch(load_user(userData));
            navigate(`/profile/${userData.id}`);
        }
    }, [userData, dispatch, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        postData({ email, password })
            .then(({ access }) => {
                dispatch(login_user(access));
                setLoginSuccess(true);
            })
            .catch(() => {});
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-400 p-4">
            <div className="w-full max-w-md p-6 shadow-l rounded-box">
                <div className="flex justify-center mb-8">
                    <img src={Logo} alt="CollecTic Logo" className="w-40 h-auto" />
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                            disabled={isFetching || loginSuccess}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 w-full focus:outline-none"
                        />
                    </label>

                    <div className="validator-hint hidden">Enter valid email address</div>

                    <label className="input input-bordered w-full flex items-center gap-x-2">
                        <svg className="h-[1em] flex-shrink-0 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                            </g>
                        </svg>
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            disabled={isFetching || loginSuccess}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex-1 w-full focus:outline-none"
                        />
                    </label>

                    <button
                        type="submit"
                        className={`btn btn-primary w-full`}
                        disabled={isFetching || loginSuccess}
                    >
                        {(isFetching || loginSuccess) && <span className="loading loading-spinner"></span>}
                        {isFetching ? "Signing in..." : loginSuccess ? "Loading profile..." : "Sign In"}
                    </button>

                    <div className="flex justify-center text-sm">
                        <a onClick={() => navigate("/sign-up")} className="link link-hover">
                            Create new account
                        </a>
                    </div>
                    <div className="flex justify-center text-sm">
                        <a href="/reset-password" className="link link-hover">
                            Forgot password?
                        </a>
                    </div>
                </form>

                {error && (
                    <div className="alert-error mt-7">
                        <span className="text-red-500">{error}. Please try again.</span>
                    </div>
                )}
            </div>
        </div>
    );
}

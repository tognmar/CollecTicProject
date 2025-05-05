import {Navigate, Outlet} from "react-router";
import Header from "../components/Header";
import {useSelector} from "react-redux";
import Footer from "../components/Footer/index.jsx";

export default function ProtectedRoutes() {
    const signedIn = useSelector(state => state.user.access_token)

    if (signedIn) {
        return (
            <>
                <Outlet/>
                <Footer/>
            </>
        );
    } else {
        return <Navigate to="/home"/>;
    }
}

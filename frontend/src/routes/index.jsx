import {BrowserRouter, Route, Routes} from "react-router";
import Profile from "./Pages/Profile/index.jsx";
import SignIn from "./Pages/SignIn/index.jsx";
import SignUp from "./Pages/SignUp/index.jsx";
import ResetPassword from "./Pages/ResetPassword/index.jsx";
import ActivationConfirmation from "./Pages/ActivationConfirmation/index.jsx";
import ResetPasswordConfirmation from "./Pages/ResetPasswordConfirmation/index.jsx";
import DefaultLayout from "../layouts/DefaultLayout.jsx";
import ProtectedRoutes from "../layouts/ProtectedRoutes.jsx";
import ThemeRoute from "./Pages/Themes/index.jsx";
import TicketForm from "../components/tickets/TicketForm/index.jsx";
import TicketsUpload from "./Pages/Tickets/index.jsx";
import OtherUsers from "./Pages/OtherUsers/index.jsx";
import Home from "./Pages/Home/index.jsx";
import TicketsDetails from "./Pages/TicketDetails/index.jsx";
import Themes from "../components/Themes/index.jsx";
import SearchTicket from "./Pages/SearchTicket/index.jsx";
import ScoreboardRoute from "./Pages/Scoreboard/index.jsx";
import Map from "./Pages/Map/index.jsx";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<DefaultLayout/>}>
                    <Route element={<ProtectedRoutes/>}>
                        <Route path="/profile/:userId" element={<Profile/> }/>
                        <Route path="/themes" element={<ThemeRoute/>}/>
                        <Route path="/tickets" element={<TicketsUpload/>}/>
                        <Route path="/ticket/:ticketId" element={<TicketsDetails />} />
                        <Route path="/tickets/latest" element={<TicketForm/>}/>
                        <Route path="/users" element={<OtherUsers/>}/>
                        <Route path="/settings" element={<Themes/>}/>
                        <Route path="/search" element={<SearchTicket/>}/>
                        <Route path="/scoreboard" element={<ScoreboardRoute/>}/>
                        <Route path="/map" element={<Map/>}/>
                    </Route>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/sign-in" element={<SignIn/>}/>
                    <Route path="/sign-up" element={<SignUp/>}/>
                    <Route path="/reset-password" element={<ResetPassword/>}/>
                    <Route path="/reset-password/confirmation" element={<ResetPasswordConfirmation/>}/>
                    <Route path="/activation" element={<ActivationConfirmation/>}/>
                    <Route path="*" element={<>Page not found</>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

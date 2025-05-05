import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useLocation} from "react-router";
import useFetchGet from "../../utilities/CustomHooks/UseFetchGet.jsx";
import {useEffect, useState} from "react";
import {load_user} from "../../store/Slices/User/index.js";
import AddTicketIcon from "../../assets/SVGs/add.svg"
import {CircleUserRound, CirclePlus, Earth, Users, LucideTrophy, Map, TicketPlus} from "lucide-react";



export default function Footer() {
    const dispatch = useDispatch();
    const { data } = useFetchGet("auth/users/me/");
    const loggedInUser = useSelector(state => state.user.details);
    const navigate = useNavigate();
    const location = useLocation();

    // Determine which tab is active based on the current pathname
    const getActiveTab = () => {
        const { pathname } = location;
        if (pathname.startsWith('/profile/')) return 'profile';
        if (pathname === '/tickets') return 'tickets';
        if (pathname === '/users') return 'users';
        if (pathname === '/map') return 'map';
        return '';
    };

    const [activeTab, setActiveTab] = useState(getActiveTab());

    // Update active tab when location changes
    useEffect(() => {
        setActiveTab(getActiveTab());
    }, [location]);

    useEffect(() => {
        if (data) {
            dispatch(load_user(data));
        }
    }, [data, dispatch]);

    // Navigation handler that also updates the active tab
    const handleNavigation = (path, tabName) => {
        navigate(path);
        setActiveTab(tabName);
    };

    return (
        <div className="btm-nav fixed bottom-0 w-full flex z-50">
          <button
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => handleNavigation("/users", 'users')}>
            <Users size={24} color="currentColor" />
          </button>
          <button
              className={activeTab === 'map' ? 'active' : ''}
              onClick={() => handleNavigation("/map", 'map')}>
            <Map size={24} color="currentColor" />
          </button>
          <button
              className={activeTab === 'tickets' ? 'active' : ''}
              onClick={() => handleNavigation("/tickets", 'tickets')}>
            <TicketPlus size={48} className="text-primary" />
          </button>
          <button
              className={activeTab === 'scoreboard' ? 'active' : ''}
              onClick={() => handleNavigation("/scoreboard", 'scoreboard')}>
            <LucideTrophy size={24} color="currentColor" />
          </button>
            <button
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => handleNavigation(`/profile/${loggedInUser?.id || ''}`, 'profile')}>
              <CircleUserRound size={24} color="currentColor" />
          </button>
        </div>
    );
}
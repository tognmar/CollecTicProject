import { useDispatch, useSelector } from "react-redux";
import useFetchGet from "../../utilities/CustomHooks/UseFetchGet.jsx";
import { useEffect, useRef, useState } from "react";
import { load_other_users, reset_other_user } from "../../store/Slices/Users/index.jsx";
import ProfileCard from "../UserProfileCard/index.jsx";
import StatCardBox from "../StatCard/index.jsx";


export default function OtherUsersComp({ url, headerHeight = 0, footerHeight = '5vh', userIdPass }) {
    const dispatch = useDispatch();
    const [endpoint, setEndpoint] = useState('');

    useEffect(() => {
        let newEndpoint = '';
        if (url === 'following' || url === 'followers') {
            newEndpoint = `follow/${url}/${userIdPass}/`;
        } else if (url === 'scoreboard') {
            newEndpoint = 'users/scoreboard/';
        } else if (url === 'users') {
            newEndpoint = 'users/';
        }

        setEndpoint(newEndpoint);
        dispatch(reset_other_user());
    }, [url, dispatch]);

    const { data, error, isFetching } = useFetchGet(endpoint);
    const users = useSelector(state => state.otherUsers.otherUsers);
    const loggedInUser = useSelector(state => state.user.details);

    const userRefs = useRef([]);
    const [activeUser, setActiveUser] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);
    const [footerHeightPx, setFooterHeightPx] = useState(0);

    useEffect(() => {
        const calculateFooterHeight = () => {
            const vh = window.innerHeight / 100;
            if (footerHeight.endsWith('vh')) {
                const vhValue = parseFloat(footerHeight);
                return vh * vhValue;
            }
            return parseFloat(footerHeight) || 0;
        };

        const updateSizes = () => {
            setViewportHeight(window.innerHeight);
            setFooterHeightPx(calculateFooterHeight());
        };

        updateSizes();
        window.addEventListener('resize', updateSizes);

        return () => window.removeEventListener('resize', updateSizes);
    }, [footerHeight]);

    useEffect(() => {
        if (data) {
            dispatch(load_other_users(data));
        }
    }, [data, dispatch, url]);

    useEffect(() => {
        if (users && users.length > 0) {
            userRefs.current = userRefs.current.slice(0, users.length);
        }
    }, [users]);

    useEffect(() => {
        const handleScroll = () => {
            if (!userRefs.current.length) return;

            let mostVisibleIndex = 0;
            let maxVisibility = 0;

            userRefs.current.forEach((ref, index) => {
                if (!ref) return;

                const rect = ref.getBoundingClientRect();
                const viewportTop = headerHeight;
                const viewportHeight = window.innerHeight - headerHeight - footerHeightPx;
                const viewportBottom = viewportTop + viewportHeight;

                const visibleTop = Math.max(viewportTop, rect.top);
                const visibleBottom = Math.min(viewportBottom, rect.bottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                const percentVisible = (visibleHeight / rect.height) * 100;

                if (percentVisible > maxVisibility) {
                    maxVisibility = percentVisible;
                    mostVisibleIndex = index;
                }
            });

            setActiveUser(mostVisibleIndex);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [headerHeight, footerHeightPx, users]);

    // Function to scroll to a user - similar to the scrollToTicket function in MyTickets
    const scrollToUser = (index) => {
        if (!userRefs.current[index]) return;

        const userElement = userRefs.current[index];
        const userRect = userElement.getBoundingClientRect();

        // Calculate the optimal position
        // We want the top of the user card to be just below the header
        const targetScrollY = window.scrollY + userRect.top - headerHeight - 16; // 16px buffer

        // Smooth scroll to that position
        window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
        });
    };

    // Changed to match MyTickets component - use 50% of viewport height
    const extraPadding = viewportHeight * 0.5;

    // Filter out logged-in user for followers/following, but not for scoreboard
    const userId = loggedInUser?.id;
    const filteredUsers = (url === "scoreboard")
        ? (Array.isArray(users) ? users.filter(Boolean) : [])
        : (Array.isArray(users) ? users.filter(user => user && user.id !== userId) : []);

    if (isFetching) {
        return (
            <div className="flex justify-center p-6">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }
    if (error) {
        return (
            // <div className="p-4 text-error">
            //     Error fetching users: {error.message}
            // </div>
            <div className="mt-4 px-4 text-center text-error">
                <div className="card bg-base-200 p-8">
                    <h3 className="text-lg font-bold mb-2">{error.message}</h3>
                </div>
            </div>
        );
    }
    if (filteredUsers.length > 0) {
        return (
            <div className="mt-4 px-4 pb-4">
                <div className="space-y-4">
                    {filteredUsers.map((user, index) => {
                        if (!user) return null;

                        // Check if this item is within the active range (current + next 2)
                        const isInActiveRange = index >= activeUser && index <= activeUser + 3;

                        // Calculate distance and visual properties
                        const distance = Math.abs(index - activeUser);
                        const opacity = 1 - Math.min(distance * 0.18, 0.6);

                        return (
                            <div
                                key={user.id || user.user_id || index}
                                ref={el => userRefs.current[index] = el}
                                className="transition-all duration-700 ease-in-out relative"
                                style={{ opacity }}
                                onClick={() => {
                                    if (!isInActiveRange) {
                                        scrollToUser(index);
                                    }
                                }}
                            >
                                <div
                                    className={`transition-all duration-300 ${"scale-100"}`}
                                    style={{
                                        zIndex: filteredUsers.length - distance,
                                        transitionProperty: "transform, box-shadow, opacity"
                                    }}
                                >
                                    {url !== "scoreboard" ? (
                                        <StatCardBox
                                            scoreBoard={true}
                                            userProfile={user}
                                            index={index}
                                            isActive={true}
                                            place={false}
                                        />
                                    ) : (
                                        <StatCardBox
                                            scoreBoard={true}
                                            userProfile={user}
                                            index={index}
                                            isActive={true}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div style={{ height: `${extraPadding}px` }} className="w-full"></div>
                </div>
            </div>
        );
    }

    return <div className="mt-4 px-4 text-center">
                <div className="card bg-base-200 p-8">
                    <h3 className="text-lg font-bold mb-2">No Users Found</h3>
                </div>
            </div>;
}
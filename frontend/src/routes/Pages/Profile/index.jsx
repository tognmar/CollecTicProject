import {useEffect, useState, useRef} from "react";
import ProfileComp from "../../../components/ProfileComp/index.jsx";
import MyTickets from "../../../components/MyTickets/index.jsx";
import {useDispatch, useSelector} from "react-redux";
import OtherUsersComp from "../../../components/OtherUsersComp/index.jsx";
import {useParams} from "react-router";
import {load_tickets} from "../../../store/Slices/Tickets/index.js";
import useFetchGet from "../../../utilities/CustomHooks/UseFetchGet.jsx";

export default function Profile() {
    const [isCompact, setIsCompact] = useState(false);
    const {userId} = useParams();
    const [headerHeight, setHeaderHeight] = useState(0);
    const headerRef = useRef(null);
    const scrollListenerActive = useRef(true);
    const footerHeight = '5vh';
    const activeFetch = useSelector(state => state.filter.filter)
    const dispatch = useDispatch();
    const {data, error, isFetching} = useFetchGet(`tickets/users/${userId}/`);

    useEffect(() => {
        if (data) {
            dispatch(load_tickets(data));
        }
    }, [data, dispatch]);

    useEffect(() => {
      // This will run every time activeFetch changes
    }, [activeFetch]);


    // Define transition duration for consistency
    const TRANSITION_DURATION = 400; // ms

    useEffect(() => {
        // Initially measure the header in its full state
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }

        const handleScroll = () => {
            // Prevent scroll handling during transitions
            if (!scrollListenerActive.current) return;

            const scrollPosition = window.scrollY;

            // Threshold to switch to compact mode
            const COMPACT_THRESHOLD = 100;

            // Only switch back to full mode when at the very top
            const FULL_THRESHOLD = 0;

            if (scrollPosition > COMPACT_THRESHOLD && !isCompact) {
                // Temporarily disable scroll listener to prevent feedback loop
                scrollListenerActive.current = false;
                setIsCompact(true);
                setTimeout(() => {
                    scrollListenerActive.current = true;
                }, TRANSITION_DURATION + 50); // Add a small buffer
            } else if (scrollPosition <= FULL_THRESHOLD && isCompact) {
                // Only switch back to full when at the top (position 0)
                scrollListenerActive.current = false;
                setIsCompact(false);
                setTimeout(() => {
                    scrollListenerActive.current = true;
                }, TRANSITION_DURATION + 50);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isCompact]);

    // Update header height when compact state changes
    useEffect(() => {
        if (headerRef.current) {
            // Small delay to ensure transition is complete
            const timeoutId = setTimeout(() => {
                setHeaderHeight(headerRef.current.offsetHeight);
            }, TRANSITION_DURATION + 60);
            return () => clearTimeout(timeoutId);
        }
    }, [isCompact]);

    return (
        <div className="min-h-screen pb-[5vh] relative">
            <div
                ref={headerRef}
                className={`sticky top-0 z-50 bg-base-100 transition-all duration-500 ease-in-out transform ${
                    isCompact ? 'shadow-md' : ''
                }`}
                style={{
                    transition: `all ${TRANSITION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
                }}
            >
                <ProfileComp isCompact={isCompact} />
            </div>

                <div
                    className="content-container"
                    style={{
                        transition: `all ${TRANSITION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                        transform: isCompact ? 'translateY(-8px)' : 'translateY(0)',
                        opacity: isCompact ? '0.99' : '1'
                    }}
                >
                    {activeFetch === "My Tickets" && (
                  <MyTickets headerHeight={headerHeight} footerHeight={footerHeight} error={error} isFetching={isFetching}/>
                )}
                    { (activeFetch === "following" || activeFetch === "followers") && (
                  <OtherUsersComp url={activeFetch} userIdPass={userId}/>
                )}

            </div>
        </div>
    );
}
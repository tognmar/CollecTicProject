import useFetchGet from "../../utilities/CustomHooks/UseFetchGet.jsx";
import {load_profile} from "../../store/Slices/Profile/index.jsx";
import ProfileCard from "../UserProfileCard/index.jsx";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";


export default function ProfileComp({isCompact = false}) {
    const dispatch = useDispatch();
    const { userId } = useParams();

    const { data, error, isFetching } = useFetchGet(`users/${userId}/`);
    const profile = useSelector(state => state.profile.userProfile);

    useEffect(() => {
        if (data) {
            dispatch(load_profile(data));
        }
    }, [data, dispatch]);

    if (isFetching) {
        return <div className="flex justify-center p-6"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (error) {
        return <div className="p-4 text-error">Error fetching Profile: {error.message}</div>;
    }

    if (!profile) return null;
    return (
        <ProfileCard userProfile={profile} isCompact={isCompact}/>
    );
}
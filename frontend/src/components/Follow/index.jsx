import { useState } from "react";
import useFetchPost from "../../utilities/CustomHooks/UseFetchPost.jsx";
import { UserRoundCheck, UserRoundPlus, Loader } from "lucide-react";

export default function FollowButton({ user }) {
    const [isFollowing, setIsFollowing] = useState(user.logged_in_user_is_following);
    const { postData, postFetching } = useFetchPost(`follow/toggle-follow/${user.id}/`);

    // Handle follow/unfollow button click
    const handleFollowing = () => {
        postData();
        setIsFollowing((prevState) => !prevState);
    };

    return (
        <div
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={handleFollowing}
            title={isFollowing ? "Unfollow" : "Follow"}
        >
            {postFetching ? (
                <Loader size={24} className="animate-spin" />
            ) : isFollowing ? (
                <UserRoundCheck size={24} className="text-success"/>
            ) : (
                <UserRoundPlus size={24} />
            )}
        </div>
    );
}
import { useSelector } from "react-redux";
import StatCardBox from "../StatCard/index.jsx";

export default function Dashboard() {
  const profile = useSelector((state) => state.profile.userProfile);

  if (!profile) return null;

  return (
    <div className="p-6">
            <div className="p-6 flex flex-col items-center justify-center space-y-6">
                <StatCardBox label="Tickets" value={profile.ticket_count} color="secondary" />
                <StatCardBox label="Followers" value={profile.follower_count} color="secondary" />
                <StatCardBox label="Following" value={profile.following_count} color="secondary" />
            </div>
    </div>
  );
}

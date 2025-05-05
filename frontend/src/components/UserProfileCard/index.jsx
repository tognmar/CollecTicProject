import Avatar from "../../assets/SVGs/avatar.svg";
import { useLocation, useNavigate } from "react-router";
import FollowButton from "../Follow/index.jsx";
import { logout_user } from "../../store/Slices/User/index.js";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import EditProfileModal from "../EditProfileModal/index.jsx";
import { LogOut, PencilIcon, Search, Settings } from "lucide-react";
import StatCardBox from "../StatCard/index.jsx";
import {load_filter, reset_filter} from "../../store/Slices/FilterProfileFetch/index.jsx";

export default function ProfileCard({ userProfile, isCompact = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isFansRoute = location.pathname.includes("users");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loggedInUser = useSelector((state) => state.user.details.id) === userProfile.id;

  const handleLogout = () => {
    dispatch(logout_user());
    navigate("/sign-in");
  };

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  if (isCompact) {
    return (
      <>
        <div className="transition-all duration-500 ease-in-out transform scale-100 opacity-100 bg-base-100 w-full">
          <div
            className={`bg-gradient-to-r from-orange-600 to-orange-400 text-primary-content shadow-md p-3 flex items-center gap-2 ${
              isFansRoute ? "rounded-lg" : ""
            }`}
          >
            <div
              className="avatar"
              onClick={() => {
                navigate(`/profile/${userProfile.id}/`);
                dispatch(reset_filter());
              }}
            >
              <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                <img
                  src={
                    userProfile.avatar
                      ? `${userProfile.avatar}?${userProfile.last_updated || Date.now()}`
                      : Avatar
                  }
                  alt={`${userProfile.name}'s avatar`}
                />
              </div>
            </div>

            <h2 className="text-sm font-bold">{userProfile.name}</h2>
            {loggedInUser ? (
              <div className="flex items-center justify-center gap-1 absolute top-4 right-2">
                <Search
                  className="cursor-pointer p-1 hover:text-accent"
                  size={28}
                  onClick={() => navigate("/search")}
                />
                <PencilIcon
                  className="cursor-pointer p-1 hover:text-accent"
                  size={28}
                  onClick={openEditModal}
                />
                <LogOut
                  className="cursor-pointer p-1 hover:text-accent"
                  size={28}
                  onClick={handleLogout}
                />
              </div>
            ) : (
              <div className="flex gap-2 items-end absolute right-10">
                <FollowButton user={userProfile} />
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Modal is now managed by state, not by the checkbox */}
        {isEditModalOpen && <EditProfileModal onClose={closeEditModal} />}
      </>
    );
  }

  return (
    <>
      <div className="transition-all duration-500 ease-in-out transform scale-100 opacity-100 w-full bg-base-100">
        <div className="bg-gradient-to-b from-orange-600 to-orange-400 y text-primary-content shadow-xl p-6 flex flex-col items-center relative overflow-visible">
          {loggedInUser ? (
            <div className="flex items-center justify-end gap-1 absolute top-5 right-2">
              <Search
                className="cursor-pointer p-1 hover:text-accent"
                size={28}
                onClick={() => navigate("/search")}
              />
              <Settings
                className="cursor-pointer p-1 hover:text-accent"
                size={28}
                onClick={() => navigate("/settings")}
              />
              <LogOut
                className="cursor-pointer p-1 hover:text-accent"
                size={28}
                onClick={handleLogout}
              />
            </div>
          ) : (
            <Search
              className="cursor-pointer hover:scale-110 transition-transform flex items-center justify-end gap-1 absolute top-5 right-2"
              size={24}
              onClick={() => navigate("/search")}
            />
          )}

          {/* Avatar with floating icons */}
          <div className="relative flex flex-col items-center w-fit">
            {/* Avatar */}
            <div className="avatar mb-4 mt-6">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={
                    userProfile.avatar
                      ? `${userProfile.avatar}?${userProfile.last_updated || Date.now()}`
                      : Avatar
                  }
                  alt={`${userProfile.name}'s avatar`}
                />
              </div>
            </div>
          </div>

          {/* Username */}
          <div className="flex flex-col items-center justify-center gap-1">
            <h2 className="text-2xl font-bold mb-1">{userProfile.name}
            </h2>
              <h2 className="text-sm ">{userProfile.location}</h2>

            {loggedInUser ? (
              <div
                onClick={openEditModal}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <PencilIcon size={15} />
              </div>
            ) : (
              <FollowButton user={userProfile} />
            )}
          </div>

          {/* Stats Row */}
          <div className="flex  justify-between gap-3 mt-4 w-full px-4">
              <div
              onClick={() => {
                    dispatch(load_filter("My Tickets"));
                  }}>
                <StatCardBox
                  label="Tickets"
                  value={userProfile.ticket_count}
                />
              </div>
              <div
              onClick={() => {
                dispatch(load_filter("followers"));
              }}>
            <StatCardBox
              label="Followers"
              value={userProfile.follower_count}
            />
                  </div>
              <div
              onClick={() => {
                dispatch(load_filter("following"));
              }}>
            <StatCardBox
              label="Following"
              value={userProfile.following_count}
            />
                  </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal is now managed by state, not by the checkbox */}
      {isEditModalOpen && <EditProfileModal onClose={closeEditModal} />}
    </>
  );
}

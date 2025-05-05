import React from 'react';
import AvatarDefault from "../../assets/SVGs/avatar.svg";
import {useDispatch, useSelector} from "react-redux";
import FollowButton from "../Follow/index.jsx";
import {useNavigate} from "react-router";
import {reset_filter} from "../../store/Slices/FilterProfileFetch/index.jsx";
import {reset_tickets} from "../../store/Slices/Tickets/index.js";

export default function StatCardBox({
  label,
  value,
  scoreBoard = false,
  userProfile,
  index,
  isActive = true,
    place = true
}) {
  const loggedInUserId = useSelector(state => state.user.details.id);
  const isLoggedInUser = loggedInUserId === userProfile?.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- INACTIVE CARD ---
  if (scoreBoard && userProfile && !isActive) {
    return (
      <div className="flex items-center justify-between py-2 px-4 border rounded-lg bg-gray-100 shadow-sm relative w-full ">
        {/* Place */}
        {place && (
          <span className="text-2xl font-extrabold text-primary mr-3">{index + 1}</span>
        )}
        {/* Username */}
        <span className="font-semibold flex-1">{userProfile.name}</span>
        {/* Stats */}
          <div className="flex-1">
            <span className="text-sm font-bold">{userProfile.ticket_count}</span>
            <span className="text-[10px] text-gray-500 uppercase"> Tickets</span>
          </div>
        {/* Follow button */}
        {!isLoggedInUser && (
          <div className="absolute top-2 right-2">
            <FollowButton user={userProfile} />
          </div>
        )}
      </div>
    );
  }

  // --- ACTIVE CARD ---
  if (scoreBoard && userProfile) {
    const borderStyle = "border-2 border-dashed border-base-300";
    const cardShadow = isActive ? "shadow-lg" : "shadow";
    const cardOpacity = isActive ? "opacity-100" : "opacity-70";
    const cardBg = isLoggedInUser ? "bg-primary bg-opacity-30" : "bg-base-100";
    return (
      <div
        className={`relative flex flex-col rounded-2xl p-4 mb-2 w-full ${borderStyle} ${cardShadow} ${cardOpacity} ${cardBg} transition-all duration-300`}
        style={{
          transitionProperty: "box-shadow, opacity"
        }}
      >
        {/* Decorative dots */}
        <div className="absolute left-0 top-1/4 w-3 h-3 bg-base-100 border-2 border-base-300 rounded-full -translate-x-1/2 z-10"></div>
        <div className="absolute left-0 bottom-1/4 w-3 h-3 bg-base-100 border-2 border-base-300 rounded-full -translate-x-1/2 z-10"></div>
        <div className="absolute right-0 top-1/4 w-3 h-3 bg-base-100 border-2 border-base-300 rounded-full translate-x-1/2 z-10"></div>
        <div className="absolute right-0 bottom-1/4 w-3 h-3 bg-base-100 border-2 border-base-300 rounded-full translate-x-1/2 z-10"></div>

        {/* Top row: Avatar | Place + Username | Follow */}
        <div className="w-full flex flex-row items-center justify-between mb-2">
          {/* Avatar */}
          <div className="flex flex-col items-center w-20">
            <div
              className="avatar"
              onClick={() => {
                navigate(`/profile/${userProfile.id}/`);
                dispatch(reset_filter());
                dispatch(reset_tickets());
              }}
            >
              <div className="w-16 h-16 rounded-full  ">
                <img
                  src={
                    userProfile.avatar
                      ? `${userProfile.avatar}?${userProfile.last_updated || Date.now()}`
                      : AvatarDefault
                  }
                  alt={`${userProfile.name}'s avatar`}
                />
              </div>
            </div>
          </div>
          {/* Place + Username */}
          <div className="flex flex-col items-center flex-1">
            {place && (
                <span className="flex text-2xl font-extrabold text-primary mr-3 items-center">{index + 1} Place</span>
            )}
            <span className="mt-1 text-center font-semibold">{userProfile.name}</span>
          </div>
          {/* FollowButton */}
          <div className="flex flex-col items-center w-20">
            {!isLoggedInUser && (
              <FollowButton user={userProfile} />
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="w-full grid grid-cols-3 gap-4 mt-2 text-base-content">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{userProfile.ticket_count}</span>
            <span className="text-xs text-gray-500 uppercase">Tickets</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{userProfile.follower_count}</span>
            <span className="text-xs text-gray-500 uppercase">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{userProfile.following_count}</span>
            <span className="text-xs text-gray-500 uppercase">Following</span>
          </div>
        </div>
      </div>
    );
  }

  // Default stat card for dashboard etc. - WITH UPDATED COLORS
  return (
    <div
    className="relative flex flex-1 justify-between rounded-lg border border-primary shadow-md h-16 overflow-hidden bg-secondary"
    >
      {/* Decorative dots - PRIMARY COLORED */}
      <div className="absolute left-0 top-1/4 w-2 h-2 border border-primary bg-primary rounded-full -translate-x-1/2 z-10"></div>
      <div className="absolute left-0 bottom-1/4 w-2 h-2 bg-primary border border-primary rounded-full -translate-x-1/2 z-10"></div>
      <div className="absolute right-0 top-1/4 w-2 h-2 bg-primary border border-primary rounded-full translate-x-1/2 z-10"></div>
      <div className="absolute right-0 bottom-1/4 w-2 h-2 bg-primary border border-primary rounded-full translate-x-1/2 z-10"></div>

      <div className="relative z-10 px-4 py-2 flex flex-col items-center justify-between w-full">
        <div className="text-xl font-extrabold">{value}</div>
        <div className="text-xs font-semibold uppercase">{label}</div>
      </div>
    </div>
  );
}
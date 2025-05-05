import OtherUsersComp from "../../../components/OtherUsersComp/index.jsx";
import React from "react";

export default function ScoreboardRoute () {

    return(
        <>
         <div className="bg-gradient-to-b from-orange-600 to-orange-400 p-6 shadow-md text-center">
  <h2 className="text-2xl font-bold mb-2 text-center text-white">
    Leaderboard
  </h2>
</div>
        <OtherUsersComp url="scoreboard"/>
        </>
    )
}
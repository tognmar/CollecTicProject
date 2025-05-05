import React from "react"
import MapComp from "../../../components/MapComp/openMap.jsx";
import {useSelector} from "react-redux";



export default function Map() {
	const tickets = useSelector(state => state.UserTickets.tickets);

	return (
		<div className="flex flex-col min-h-screen">
				<MapComp mapStyle={"positron"} tickets={tickets} startingPosition={"current"} />
		</div>
	)
}

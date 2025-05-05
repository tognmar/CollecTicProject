import {useNavigate, useParams} from "react-router";
import {useSelector} from "react-redux";

export default function NoTicketsAvailable () {
    const { userId } = useParams();
    const navigate = useNavigate()
    const loggedInUser = useSelector(state => state.user.details.id) === userId


    if (loggedInUser)
        return(
        <div className="mt-4 px-4 text-center">
                <div className="card bg-base-200 p-8">
                    <h3 className="text-lg font-bold mb-2">No Tickets Found</h3>
                    <p>Add your first concert ticket to get started!</p>
                    <button className="btn btn-primary mt-4"
                    onClick={()=> navigate("/tickets")}>Add Ticket</button>
                </div>
            </div>
        )
    return(
        <div className="mt-4 px-4 text-center">
                <div className="card bg-base-200 p-8">
                    <h3 className="text-lg font-bold mb-2">No Tickets Found</h3>
                    <p>You haven't uploaded any tickets yet!</p>
                </div>
            </div>
        )
}
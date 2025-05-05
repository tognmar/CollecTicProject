import { useState } from "react";
import OtherUsersComp from "../../../components/OtherUsersComp/index.jsx";

export default function OtherUsers() {
    const [activeTab, setActiveTab] = useState("users");

    return (
        <>
            <div role="tablist" className="tabs tabs-boxed mb-4">
                <button
                    role="tab"
                    className={`tab ${activeTab === "tickets" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("tickets")}
                >
                    Tickets
                </button>
                <button
                    role="tab"
                    className={`tab ${activeTab === "users" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("users")}
                >
                    Users
                </button>
            </div>

            {/* Pass activeTab to component if needed */}
            {activeTab=== "users" && (
                <OtherUsersComp url={activeTab}/>
            )}
            {activeTab=== "tickets" && (
                <p>NEW COMPONENT FOR ALL TICKETS</p>
            )}
        </>
    );
}
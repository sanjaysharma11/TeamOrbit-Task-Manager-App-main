import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const UserJoinMeeting = () => {
    const [roomName, setRoomName] = useState("");
    const navigate = useNavigate();

    const handleJoin = () => {
        if (roomName.trim()) {
            navigate(`/user/video-call/${roomName}`);
        }
    };

    return (
        <DashboardLayout activeMenu="Join Meeting">
            <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
                <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">Join a Meeting</h1>
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter meeting room name"
                    className="w-full px-4 py-2 border rounded mb-4"
                />
                <button
                    onClick={handleJoin}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Join Meeting
                </button>
            </div>
        </DashboardLayout>
    );
};

export default UserJoinMeeting;

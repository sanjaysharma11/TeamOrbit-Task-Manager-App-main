import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
// import DashboardLayout from "../../components/layouts/DashboardLayout";

const JoinMeeting = () => {
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomName.trim() !== "") {
      navigate(`/admin/video-call/${roomName.trim()}`);
    }
  };

  return (
    <DashboardLayout activeMenu="Video Call">
      <div className="flex flex-col items-center justify-center mt-20">
        <h1 className="text-3xl font-bold mb-4">Join a Video Call</h1>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter Room Name"
          className="border border-gray-300 px-4 py-2 rounded w-80"
        />
        <button
          onClick={handleJoin}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Join Meeting
        </button>
      </div>
    </DashboardLayout>
  );
};

export default JoinMeeting;

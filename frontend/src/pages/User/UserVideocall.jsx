import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JitsiMeeting } from "@jitsi/react-sdk";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const UserVideoCall = () => {
  const { roomName } = useParams();
  const navigate = useNavigate();

  if (!roomName) {
    return (
      <DashboardLayout activeMenu="Join Meeting">
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold text-red-600">Room name is missing!</h1>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Join Meeting">
      <h1 className="text-xl text-blue-700 font-bold text-center p-4">Join Meeting</h1>
      <div style={{ height: 600, width: "100%" }}>
        <JitsiMeeting
          roomName={roomName}
          configOverwrite={{ startWithAudioMuted: true, startWithVideoMuted: true }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "600px";
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default UserVideoCall;

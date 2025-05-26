import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JitsiMeeting } from "@jitsi/react-sdk";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const VideoCall = () => {
  const { roomName } = useParams();
  const navigate = useNavigate();

  if (!roomName) {
    return (
      <DashboardLayout activeMenu="Join Meeting">
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold text-red-600">Room name is missing!</h1>
          <p className="text-gray-600 mt-2">
            Please provide a valid meeting room URL like: <br />
            <code className="bg-gray-100 px-2 py-1 rounded">/admin/video-call/my-meeting-room</code>
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => navigate("/admin/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Join Meeting">
      <h1 className="text-xl text-blue-700 font-bold text-center p-4">Join Meeting as Admin</h1>
      <div style={{ height: 600, width: "100%" }}>
        <JitsiMeeting
          roomName={roomName}
          configOverwrite={{
            startWithAudioMuted: true,
            startWithVideoMuted: true,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
          }}
          userInfo={{
            displayName: "Admin",
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "600px";
          }}
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-center mt-5">Video Call</h1>
        <p className="text-center text-gray-600">
          You are connected to: <code>{roomName}</code>
        </p>
        <a
          href={`https://meet.jit.si/${roomName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-blue-500 underline mt-2 mb-2.5"
        >
          Open in Jitsi
        </a>
      </div>
    </DashboardLayout>
  );
};

export default VideoCall;

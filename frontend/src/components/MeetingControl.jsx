import React, { useState } from 'react';

function MeetingControls() {
  const [meetingStarted, setMeetingStarted] = useState(false);

  const handleStartMeeting = () => {
    console.log('Meeting started');
    setMeetingStarted(true);
    // Add your start meeting logic here, e.g., API call or signaling
  };

  const handleEndMeeting = () => {
    console.log('Meeting ended');
    setMeetingStarted(false);
    // Add your end meeting logic here, e.g., API call or cleanup
  };

  return (
    <div>
      {!meetingStarted ? (
        <button onClick={handleStartMeeting}>Join Meeting</button>
      ) : (
        <button onClick={handleEndMeeting}>End Meeting</button>
      )}
    </div>
  );
}

export default MeetingControls;




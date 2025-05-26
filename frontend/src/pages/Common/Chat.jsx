import { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apipaths';
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';

const socket = io("http://localhost:8000"); // use address of the server

const Chat = () => {
  const { user: me } = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showUserList, setShowUserList] = useState(false);

  const bottomRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg = { from: me._id, to: selectedUser._id, text: input };
    socket.emit("send_message", msg);
    setInput("");
  };

  const selectUser = (user) => {
    setSelectedUser(user);
  };

  const toggleUserList = () => {
    setShowUserList(!showUserList);
  };

  useEffect(() => {
    setSelectedUser(me);
    const getAllUsers = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
        if (response.data?.length > 0) {
          setAllUsers(response.data);
        }
      } catch (error) {
        console.error("Error Fetching users:", error);
      }
    };
    getAllUsers();
  }, [me]);

  useEffect(() => {
    // Load initial messages from backend
    const fetchMessages = async () => {
      if (!selectedUser?._id) return;
      try {
        const res = await axiosInstance.get(API_PATHS.MESSAGES.GET_MESSAGES(selectedUser._id));
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      if (
        (msg.from === selectedUser?._id && msg.to === me?._id) ||
        (msg.from === me?._id && msg.to === selectedUser?._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off("receive_message");
  }, [selectedUser, me]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <DashboardLayout activeMenu="Live Chat">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden flex flex-col h-full min-h-0 pb-14">
          {/* Users Section - Mobile */}
          <div className="bg-white border-b border-gray-200 p-3 flex-shrink-0">
            <h3 className="text-sm font-semibold mb-2 text-gray-700">Users ({allUsers.length})</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allUsers.map((user) => (
                <div
                  key={user?._id}
                  className={`flex flex-col items-center px-2 py-2 rounded-xl cursor-pointer transition-colors flex-shrink-0 border
                    ${user?._id === selectedUser?._id
                      ? "bg-blue-100 border-blue-400 shadow text-blue-700"
                      : "bg-gray-50 border-gray-200 hover:bg-blue-50"
                    }`}
                  onClick={() => selectUser(user)}
                  style={{ minWidth: 64 }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 font-semibold text-lg
                    ${user?._id === selectedUser?._id ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}
                  `}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-center truncate max-w-[56px]">{user?.name}</span>
                  {user?._id === me?._id && (
                    <span className="text-[10px] text-blue-400 mt-0.5">(You)</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Header - Mobile */}
          <div className="bg-white border-b border-gray-200 p-3 flex-shrink-0 mt-3">
            <h2 className="text-lg font-semibold">
              {selectedUser?.name ? `Chat with ${selectedUser.name}` : 'Select a user to start chatting'}
            </h2>
          </div>

          {/* Messages Container - Mobile */}
          <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
            <div className="p-3 space-y-3 min-h-full">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  {selectedUser?.name ? 'No messages yet. Start the conversation!' : 'Select a user to view messages'}
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.from === me._id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg break-words ${
                        msg.from === me?._id
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : "bg-white text-black shadow-sm border rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input Area - Mobile */}
          <div className="p-3 bg-white border-t border-gray-200 flex-shrink-0 mt-auto">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                disabled={!selectedUser?._id}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                onClick={handleSend}
                disabled={!selectedUser?._id || !input.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:flex flex-1 flex-col min-h-0">
          {/* Desktop Header */}
          <div className="p-4 pb-2 flex-shrink-0">
            <h2 className="text-xl font-semibold">
              {selectedUser?.name ? `Chat with ${selectedUser.name}` : 'Select a user to start chatting'}
            </h2>
          </div>

          {/* Messages Container - Desktop */}
          <div className="flex-1 overflow-y-auto bg-white mx-4 mb-2 rounded shadow-sm border min-h-0">
            <div className="p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  {selectedUser?.name ? 'No messages yet. Start the conversation!' : 'Select a user to view messages'}
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.from === me._id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md lg:max-w-lg xl:max-w-xl px-3 py-2 rounded-lg break-words ${
                        msg.from === me?._id
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : "bg-gray-200 text-black rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input Area - Desktop */}
          <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                disabled={!selectedUser?._id}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSend}
                disabled={!selectedUser?._id || !input.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* User List - Desktop Only */}
        <div className="hidden lg:block w-64 xl:w-72 bg-white border-l border-gray-200 flex-shrink-0">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Users</h3>
            <p className="text-sm text-gray-600 mt-1">{allUsers.length} online</p>
          </div>
          <div className="overflow-y-auto max-h-full">
            <ul className="p-2">
              {allUsers.map((user) => (
                <li
                  key={user?._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                    user?._id === selectedUser?._id
                      ? "bg-blue-100 border border-blue-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => selectUser(user)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${
                        user?._id === selectedUser?._id ? "font-semibold text-blue-700" : "font-medium"
                      }`}>
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">Online</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Desktop Footer - Only visible on desktop */}
         </div>
        </div>
      
    </DashboardLayout>
  );
}

export default Chat;
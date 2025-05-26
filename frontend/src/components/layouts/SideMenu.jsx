import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const [sideMenuData, setSideMenuData] = useState([]);

    const navigate = useNavigate();

    const handleClick = (route) => {
        if (route === "logout") {
            handelLogout();
            return;
        }
        navigate(route);
    };

    const handelLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    useEffect(() => {
        if (user) {
            setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA)
        }
        return () => { };
    }, [user]);

    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky shadow-lg shadow-slate-500 rounded-tr-xl rounded-b-md top-[61px] mt-2  z-20">
            {/* <div className="flex items-center justify-center bg-slate-600 border-b- border-gray-200/50 rounded-2xl " /> */}
              
            
            <div className="flex flex-col items-center justify-center mb-7 pt-5">
                <div className="relative ">
                    <img
                        src={user?.profileImageUrl || null}
                        alt="Profile Image"
                        className="w-20 h-20 bg-gray-400 rounded-full border-gray-200/50 border-2"
                    />
                </div>

                {user?.role === "admin" && (
                    <div className="text-[12px] font-medium text-white bg-blue-500 px-2.5 py-0.5 rounded mt-1 ">
                        Admin
                    </div>
                )}
                <h5 className="text-gray-950 font-medium text-md leading-6 mt-3">
                    {user?.name || ""}
                </h5>

                <p className="text-[12px] text-gray-500 text-xl ">{user?.email || ""}</p>
            </div>
            {sideMenuData.map((item, index) => (
                <button
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] hover:cursor-pointer hover:bg-gray-300 ${activeMenu == item.label
                            ? " br-linear-to-r border-r-indigo-500   bg-blue-400 text-white font-mono from-blue-50/40 to-blue-100/50 border-r-3"
                            : ""
                        } py-3 px-6 mb3 cursor-pointer`}
                    onClick={() => handleClick(item.path)}
                >
                    <item.icon className="text-xl " />
                    {item.label}
                </button>
            ))}
        </div>
    )
}

export default SideMenu
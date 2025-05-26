import {
    LuLayoutDashboard, LuUser, LuClipboardCheck, LuSquarePlus, LuLogOut
} from "react-icons/lu";

import { RiChat3Line, RiVideoAddLine } from "react-icons/ri";


export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/admin/dashboard",
    },
    {
        id: "02",
        label: "Manage Tasks",
        icon: LuClipboardCheck,
        path: "/admin/tasks",
    },
    {
        id: "03",
        label: "Create Task",
        icon: LuSquarePlus,
        path: "/admin/create-task",
    },
    {
        id: "04",
        label: "Team Members",
        icon: LuUser,
        path: "/admin/users",
    },

    ,
    {
        id: "05",
        label: "Join Meeting",
        icon: RiVideoAddLine,
        path: "/admin/video-call/team-meeting",

    },
    {
        id: "06",
        label: "Live Chat",
        icon: RiChat3Line, // or any other icon from react-icons/ri
        path: "/admin/messages"
    },
    {
        id: "07",
        label: "Logout",
        icon: LuLogOut,
        path: "logout",
    }
];

export const SIDE_MENU_USER_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/user/dashboard",
    },
    {
        id: "02",
        label: "My Tasks",
        icon: LuClipboardCheck,
        path: "/user/tasks",
    },
    {
        id: "04",
        label: "Join Meeting",
        icon: RiVideoAddLine,
        path: "/user/video-call/team-meeting",

    },
    {
        id: "05",
        label: "Live Chat",
        icon: RiChat3Line, // or any other icon from react-icons/ri
        path: "/user/messages"
    },
    {
        id: "06",
        label: "Logout",
        icon: LuLogOut,
        path: "logout",
    },
    

];

export const PRIORITY_DATA = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
]

export const STATUS_DATA = [
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
]

import React, { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"
import SideMenu from './SideMenu';
import logo from '../../assets/images/loog1.png';
import orbit from '../../assets/images/orbit.png';



const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false)
    return (
        <div className="flex gap-5 bg-slate-100 border border-b border-gray-200/50 backdrop-blur-[2x] py-4 px-7 sticky top-0 z-30">

            <button
                className="block lg:hidden text-black"
                onClick={() => {
                    setOpenSideMenu(!openSideMenu);
                }}
            >
                {openSideMenu ? (
                    <HiOutlineX className="text-2xl" />

                ) : (
                    <HiOutlineMenu className="text-2xl" />
                )}
            </button>
            <div className="items-center flex gap-2">
                <img
                    src={logo}
                    alt="logo"
                    className="object-fill w-14 h-14  ">
                </img>
                <h2 className="text-3xl font-medium text-black text-right ">TeamOrbit-Task Manager App</h2>
            </div>
            {
                openSideMenu && (
                    <div className="fixed top-[61px] -ml-4 bg-white">
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                )
            }
            <div className="hidden lg:flex items-center ml-auto space-x-1">
                <img
                    src={logo}
                    alt="logo"
                    className="object-fill w-15 h-15"
                />
                <div className="leading-tight">
                    <h1 className="text-3xl font-semibold">TeamOrbit</h1>
                    <p className="text-sm">Keep Your Team in Orbit.</p>
                </div>
            </div>


        </div >
    )
}

export default Navbar
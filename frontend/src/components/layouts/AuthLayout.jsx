import React from 'react'
import UI_IMG from '../../assets/images/img.png'
import logo from '../../assets/images/loog1.png';
const AuthLayout = ({ children }) => {
    return (
        <div className="flex">
            <div className="w-screen h-screen md:w-[60vw] px-12 pt-5 pb-12">
                {/* <h2 className="text-3xl font-medium text-black text-center ">TeamOrbit-Task Manager App</h2> */}
                <div className=" items-center justify-center  flex gap-2">
                    <img
                        src={logo}
                        alt="logo"
                        className="object-fill w-14 h-14  ">
                    </img>
                    <h2 className="text-3xl text-center font-medium text-black ">TeamOrbit-Task Manager App</h2>
                </div>
                {children}
            </div>

            <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-[url('/bg-pattern.png')] bg-cover bg-no-repeat overflow-hidden ">
                <img src={UI_IMG} className="w-64 lg:w-[90%]" />
            </div>
        </div>
    )
}

export default AuthLayout;
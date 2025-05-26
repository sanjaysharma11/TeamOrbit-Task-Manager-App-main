import React from 'react'

const Footer = () => {
    return (
        <div>
            <div className="mt-8 p-3 ml-5 mr-5 border-t border-gray-500 text-center">
                <p className="text-gray-600">Done by 👩‍💻
                    <a
                        href="https://www.linkedin.com/in/sanjay-kumar-sharma121"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className=" font-semibold transition-colors duration-200 hover:text-indigo-600 hover:cursor-pointer">Sanjay Sharma</span>.
                        All rights reserved.
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Footer
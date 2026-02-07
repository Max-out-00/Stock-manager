import React from 'react'
import Sidebar from './Sidebar'

export const Navbar = () => {
    return (
        <>
            {/* Navbar */}
            <div className="navbar bg-base-300 w-full">
            <div className='text-white flex items-center gap-2'>
                <span>Home</span>
                <Sidebar />
                </div>
            <div className="mx-2 flex-1 px-2"></div>
            <div className="hidden flex-none lg:block">
                <ul className="menu menu-horizontal text-white">
                    {/* Navbar menu content here */}
                    <li><a>Dashboard</a></li>
                    <li><a>WatchList</a></li>
                    {/* <li><a>Portfolio</a></li> */}
                </ul>
            </div>
        </div>
        
        </>
)
}

export default Navbar
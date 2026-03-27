import React from 'react'
import Sidebar from './Sidebar'
import { Navigate, useNavigate } from "react-router-dom";
import financeIcon from '../../assets/icons/finance-svgrepo-com.svg';


export const Navbar = () => {
    const navigate = useNavigate();
    const handleNav = (choice) => {
        switch (choice) {
            case 1:
                navigate('/dashboard');
                break;
            case 2:
                navigate('/portfolio');
                break;
        }
    }
    return (
        <>
            {/* Navbar */}
            <div className="navbar bg-base-300 w-full">
                <div className='text-white flex items-center gap-2'>
                    <span><img src={financeIcon} alt="Finance" className="h-15 w-15" /></span>
                    <Sidebar />
                </div>
                <div className="mx-2 flex-1 px-2"></div>
                <div className="hidden flex-none lg:block">
                    <ul className="menu menu-horizontal text-white">
                        {/* Navbar menu content here */}
                        <li><button className="btn btn-ghost w-full justify-start" onClick={() => handleNav(1)}>Dashboard</button></li>
                        <li><button className="btn btn-ghost w-full justify-start" onClick={() => handleNav(2)}>Portfolio</button></li>
                        {/* <li><a>Portfolio</a></li> */}
                    </ul>
                </div>
            </div>

        </>
    )
}

export default Navbar
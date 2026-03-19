import React from 'react'
import { Navigate, useNavigate } from "react-router-dom";


const Sidebar = () => {
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
        <div className="drawer">
            <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Page content here */}
                <label htmlFor="my-drawer-1" className="btn drawer-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                </label>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li><button className="btn btn-ghost w-full justify-start" onClick={() => handleNav(1)}>Dashboard</button></li>
                    <li><button className="btn btn-ghost w-full justify-start" onClick={() => handleNav(2)}>Portfolio</button></li>
                    <li><button className="btn btn-ghost w-full justify-start">Prediction</button></li>
                    <li><button className="btn btn-ghost w-full justify-start">Report</button></li>
                    <li><button className="btn btn-ghost w-full justify-start">Setting</button></li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar

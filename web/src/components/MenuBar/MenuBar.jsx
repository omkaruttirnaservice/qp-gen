import { CgProfile } from 'react-icons/cg';

import { FaList, FaRegArrowAltCircleRight } from 'react-icons/fa';
import { FaChartLine } from 'react-icons/fa6';
import { FiFilePlus } from 'react-icons/fi';
import { LuBookPlus } from 'react-icons/lu';
import { NavLink, useLocation } from 'react-router-dom';

import { GrTest } from 'react-icons/gr';

import { useSelector } from 'react-redux';

import { MdLogout, MdOutlineChecklist, MdOutlineMenuBook } from 'react-icons/md';

import { MdDashboard } from 'react-icons/md';

import { useState } from 'react';
import { PiStudentBold } from 'react-icons/pi';
import { H3 } from '../UI/Headings.jsx';
import './MenuBar.css';

function MenuBar({ isSidebarOpen }) {
    const auth = useSelector((state) => state.auth);

    const [showTestArea, setShowTestArea] = useState(false);
    const [showMockArea, setShowMockArea] = useState(true);
    const [showStudentArea, setShowStudentArea] = useState(true);
    const [showReportsArea, setShowReportsArea] = useState(true);

    const location = useLocation();

    return (
        <>
            <div className="flex flex-col p-2 gap-2 justify-start container mx-auto">
                <div className="flex items-center gap-2 justify-center">
                    {auth?.username && (
                        <>
                            <CgProfile className="w-6 h-6 text-white" />
                            {isSidebarOpen && (
                                <div className="flex flex-col items-start">
                                    <span className="text-xs text-white  font-medium">
                                        Welcome,
                                    </span>
                                    <span className="text-white text-sm text-ellipsis">
                                        {auth.username}
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <NavLink
                    to={'/dashboard'}
                    className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}>
                    <div className="flex justify-center items-center gap-3">
                        <MdDashboard className="text-xl text-[#333]" />
                        {isSidebarOpen && <span className="text-[#333] font-bold">Dashboard</span>}
                    </div>
                </NavLink>

                <div
                    className="flex justify-between items-center cursor-pointer select-none bg-lime-200 px-3 py-2"
                    onClick={() => setShowTestArea(!showTestArea)}>
                    <div className="flex items-center gap-1">
                        <GrTest />
                        {isSidebarOpen && <H3 className={'mb-0 '}>Test Area</H3>}
                    </div>
                    <FaRegArrowAltCircleRight
                        className={`${
                            !showTestArea ? 'rotate-90' : 'rotate-0'
                        } transition-all duration-300 `}
                    />
                </div>
                <div className="overflow-hidden">
                    <div
                        className={`${
                            showTestArea ? '-translate-y-full h-0' : '-translate-y-0 h-full'
                        } transition-all overflow-hidden bg-cyan-800`}>
                        <NavLink
                            to={'/tests-list'}
                            className={({ isActive }) =>
                                isActive ? 'menu-item active' : 'menu-item'
                            }>
                            <FaList className="text-xl" />
                            {isSidebarOpen && <span>Tests List</span>}
                        </NavLink>

                        <NavLink
                            to={'/published-test'}
                            className={({ isActive }) =>
                                isActive ? 'menu-item active' : 'menu-item'
                            }>
                            <MdOutlineChecklist className="text-xl" />
                            {isSidebarOpen && <span>Published Tests List</span>}
                        </NavLink>

                        <NavLink
                            to={'/create-test/manual'}
                            className={({ isActive }) =>
                                isActive ? 'menu-item active' : 'menu-item'
                            }>
                            <LuBookPlus className="text-xl" />
                            {isSidebarOpen && <span>Create Test (Manual)</span>}
                        </NavLink>

                        <NavLink
                            to={'/create-test/auto'}
                            className={({ isActive }) =>
                                isActive ? 'menu-item active' : 'menu-item'
                            }>
                            <FiFilePlus className="text-xl" />
                            {isSidebarOpen && <span>Create Test (Auto)</span>}
                        </NavLink>
                    </div>
                </div>

                <div
                    className="flex justify-between items-center cursor-pointer select-none bg-lime-200 px-3 py-2"
                    onClick={() => setShowMockArea(!showMockArea)}>
                    <div className="flex items-center gap-1">
                        <GrTest />
                        {isSidebarOpen && <H3 className={'mb-0 '}>Mock Area</H3>}
                    </div>
                    <FaRegArrowAltCircleRight
                        className={`${
                            !showMockArea ? 'rotate-90' : 'rotate-0'
                        } transition-all duration-300 `}
                    />
                </div>

                <div className="overflow-hidden">
                    <div
                        className={`${
                            showMockArea ? '-translate-y-full h-0' : '-translate-y-0 h-full'
                        } transition-all overflow-hidden bg-cyan-800`}>
                        <NavLink
                            to={'/mock-list'}
                            className={({ isActive }) =>
                                isActive ? 'menu-item active' : 'menu-item'
                            }>
                            <MdOutlineChecklist className="text-xl" />
                            {isSidebarOpen && <span>Tests List</span>}
                        </NavLink>

                        <NavLink
                            to={'/mock-test'}
                            className={({ isActive }) =>
                                location.pathname.startsWith('/mock-test')
                                    ? 'menu-item active'
                                    : 'menu-item'
                            }>
                            <FiFilePlus className="text-xl" />
                            {isSidebarOpen && <span>Mock Test</span>}
                        </NavLink>
                    </div>
                </div>

                <div
                    className="flex justify-between items-center cursor-pointer select-none bg-lime-200 px-3 py-2"
                    onClick={() => setShowStudentArea(!showStudentArea)}>
                    <div className="flex items-center gap-1">
                        <PiStudentBold />
                        {isSidebarOpen && <H3 className={'mb-0 '}>Student Area</H3>}
                    </div>
                    <FaRegArrowAltCircleRight
                        className={`${
                            !showStudentArea ? 'rotate-90' : 'rotate-0'
                        } transition-all duration-300 `}
                    />
                </div>
                <div className="overflow-hidden">
                    <div
                        className={`${
                            showStudentArea ? '-translate-y-full h-0' : '-translate-y-0 h-full'
                        } transition-all overflow-hidden bg-cyan-800`}>
                        <NavLink
                            to={'/add-new-student'}
                            className={({ isActive }) =>
                                isActive ? 'menu-item active' : 'menu-item'
                            }>
                            <FaList className="text-xl" />
                            {isSidebarOpen && <span>Add New Student</span>}
                        </NavLink>

                        <NavLink
                            to={'/students-list'}
                            className={({ isActive }) =>
                                isActive ? 'menu-item active' : 'menu-item'
                            }>
                            <MdOutlineChecklist className="text-xl" />
                            {isSidebarOpen && <span> Students List</span>}
                        </NavLink>

                        <NavLink
                            to={'/students-list-by-center'}
                            className={({ isActive }) =>
                                isActive ? 'menu-item active' : 'menu-item'
                            }>
                            <MdOutlineChecklist className="text-xl" />
                            {isSidebarOpen && <span> Students List By Center</span>}
                        </NavLink>
                    </div>
                </div>

                <div
                    className="flex justify-between items-center cursor-pointer select-none bg-lime-200 px-3 py-2"
                    onClick={() => setShowReportsArea(!showReportsArea)}>
                    <div className="flex items-center gap-1">
                        <FaChartLine />
                        {isSidebarOpen && <H3 className={'mb-0 '}> Reports </H3>}
                    </div>
                    <FaRegArrowAltCircleRight
                        className={`${
                            !showReportsArea ? 'rotate-90' : 'rotate-0'
                        } transition-all duration-300 `}
                    />
                </div>
                <div className="overflow-hidden">
                    <div
                        className={`${
                            showReportsArea ? '-translate-y-full h-0' : '-translate-y-0 h-full'
                        } transition-all overflow-hidden bg-cyan-800`}>
                        <NavLink
                            to={'/gen-reports'}
                            className={({ isActive }) =>
                                isActive ? 'menu-item active' : 'menu-item'
                            }>
                            <MdOutlineMenuBook className="text-xl" />
                            {isSidebarOpen && <span>Gen Reports</span>}
                        </NavLink>
                        <NavLink
                            to={'/reports'}
                            className={({ isActive }) =>
                                isActive ? 'menu-item active' : 'menu-item'
                            }>
                            <MdOutlineMenuBook className="text-xl" />
                            {isSidebarOpen && <span>View Result</span>}
                        </NavLink>
                    </div>
                </div>

                <div>
                    <NavLink
                        to={'/logout'}
                        className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}>
                        <MdLogout className="text-xl" />
                        {isSidebarOpen && <span>Logout</span>}
                    </NavLink>
                </div>
            </div>
        </>
    );
}

export default MenuBar;

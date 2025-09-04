import { CgProfile } from 'react-icons/cg';

import { FaList, FaRegArrowAltCircleRight } from 'react-icons/fa';
import { FiFilePlus } from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router-dom';

import { GrTest } from 'react-icons/gr';

import { useSelector } from 'react-redux';

import { MdLogout, MdOutlineChecklist, MdOutlineMenuBook } from 'react-icons/md';

import { MdDashboard } from 'react-icons/md';

import { useEffect, useState } from 'react';
import { H3 } from '../UI/Headings.jsx';
import './MenuBar.css';

function MenuBar({ isSidebarOpen }) {
    const auth = useSelector((state) => state.auth);

    const [showTestArea, setShowTestArea] = useState(true);
    const [showMockArea, setShowMockArea] = useState(true);
    const [showStudentArea, setShowStudentArea] = useState(true);
    const [showReportsArea, setShowReportsArea] = useState(true);

    // const [showAreaMap, setShowAreaMap] = useState({
    //     mockArea: false,
    //     testArea: false,
    //     studentArea: false,
    //     reportArea: false,
    // });

    const navigation = [
        {
            title: 'Test Area',
            url: '/tests',
            key: 'testArea',
            isChildrensOpen: false,
            childrens: [
                {
                    childrenTitle: 'Create Test',
                    _url: '/tests/create/form',
                    icon: <FiFilePlus className="text-xl" />,
                },
                {
                    childrenTitle: 'Tests List',
                    _url: '/tests/list',
                    icon: <FaList className="text-xl" />,
                },
                {
                    childrenTitle: 'Published Tests List',
                    _url: '/tests/published',
                    icon: <MdOutlineChecklist className="text-xl" />,
                },
                // {
                //     childrenTitle: 'Create Test (Manual)',
                //     _url: '/tests/create/manual',
                //     icon: <LuBookPlus className="text-xl" />,
                // },
                // {
                //     childrenTitle: 'Create Test (Auto)',
                //     _url: '/tests/create/auto',
                //     icon: <FiFilePlus className="text-xl" />,
                // },
            ],
        },
        {
            title: 'Mock Area',
            url: '/mock',
            key: 'mockArea',
            isChildrensOpen: false,
            childrens: [
                {
                    childrenTitle: 'Tests List',
                    _url: '/mock/list',
                    icon: <MdOutlineChecklist className="text-xl" />,
                },
                {
                    childrenTitle: 'Mock Test',
                    _url: '/mock/create',
                    icon: <FiFilePlus className="text-xl" />,
                },
            ],
        },
        {
            title: 'Student Area',
            url: '/students',
            key: 'studentArea',
            isChildrensOpen: false,
            childrens: [
                {
                    childrenTitle: 'Add New Student',
                    _url: '/students/add',
                    icon: <FaList className="text-xl" />,
                },
                {
                    childrenTitle: 'Students List',
                    _url: '/students/list',
                    icon: <MdOutlineChecklist className="text-xl" />,
                },
            ],
        },
        {
            title: 'Reports',
            url: '/reports',
            key: 'reportsArea',
            isChildrensOpen: false,
            childrens: [
                {
                    childrenTitle: 'Gen Reports',
                    _url: '/reports/generate',
                    icon: <MdOutlineMenuBook className="text-xl" />,
                },
                {
                    childrenTitle: 'View Result',
                    _url: '/reports/list',
                    icon: <MdOutlineMenuBook className="text-xl" />,
                },
            ],
        },
    ];

    const [_navigation, _setNavigation] = useState(navigation);

    const handleAreaToggle = (itemKey) => {
        _setNavigation((prev) =>
            prev.map((navItem) =>
                navItem.key === itemKey
                    ? { ...navItem, isChildrensOpen: !navItem.isChildrensOpen }
                    : navItem
            )
        );
    };

    const location = useLocation();
    useEffect(() => {
        let updated = [..._navigation];
        updated.forEach((_el) => {
            if (location.pathname.startsWith(_el.url)) {
                _el.isChildrensOpen = true;
            }
        });
        _setNavigation(updated);
    }, []);

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

                {_navigation.map((_el, _idx) => {
                    return (
                        <div key={_idx + 1}>
                            <div
                                className="flex justify-between items-center cursor-pointer select-none bg-lime-200 px-3 py-2"
                                onClick={() => {
                                    handleAreaToggle(_el.key);
                                }}>
                                <div className="flex items-center gap-1">
                                    <GrTest />
                                    {isSidebarOpen && <H3 className={'mb-0 '}>{_el.title}</H3>}
                                </div>
                                <FaRegArrowAltCircleRight
                                    className={`${
                                        // showAreaMap[_el.key] ? 'rotate-90' : 'rotate-0'
                                        _el.isChildrensOpen ? 'rotate-90' : 'rotate-0'
                                    } transition-all duration-300 `}
                                />
                            </div>
                            <div className="overflow-hidden">
                                {_el.childrens.map((children, idx) => {
                                    return (
                                        <div
                                            key={idx + 1}
                                            className={`${
                                                _el.isChildrensOpen
                                                    ? '-translate-y-0 h-full'
                                                    : '-translate-y-full h-0'
                                            } transition-all overflow-hidden bg-cyan-800`}>
                                            <NavLink
                                                to={children._url}
                                                className={({ isActive }) =>
                                                    isActive ? 'menu-item active' : 'menu-item'
                                                }>
                                                {children.icon}
                                                {isSidebarOpen && (
                                                    <span>{children.childrenTitle}</span>
                                                )}
                                            </NavLink>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

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

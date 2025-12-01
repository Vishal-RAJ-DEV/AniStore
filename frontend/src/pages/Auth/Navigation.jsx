import React, { useRef, useEffect } from 'react'
import "./Navigation.css"
import { useState } from 'react'
import {
    AiOutlineHome,
    AiOutlineShopping,
    AiOutlineLogin,
    AiOutlineUserAdd,
    AiOutlineShoppingCart,
    AiOutlineHeart,
    AiOutlineUser,
    AiOutlineDashboard,
    AiOutlineUnorderedList,
    AiOutlineLogout,
    AiOutlineSetting,
    AiOutlineProfile,
} from "react-icons/ai"
import { FaCaretDown } from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useLogoutMutation } from '../../redux/api/userApiSlice'
import { logout } from '../../redux/features/auth/authslice'
import FavoritesCount from '../Products/FavoritesCount'

const Navigation = () => {
    const { userInfo } = useSelector((state) => state.auth)

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const dropdownRef = useRef(null)
    const navContainerRef = useRef(null)

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
    }
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar)
    }
    const closeSidebar = () => {
        setShowSidebar(false)
    }

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
            setDropdownOpen(false);
        } catch (error) {
            console.error(error)
        }
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    // Close dropdown when navigation hover ends
    useEffect(() => {
        if (!isHovering && dropdownOpen) {
            setDropdownOpen(false);
        }
    }, [isHovering, dropdownOpen]);

    return (
        <div
            ref={navContainerRef}
            style={{ zIndex: 9999 }}
            className={`${showSidebar ? "flex" : "hidden"} xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-black w-[4%] hover:w-[15%] h-[100vh] fixed`}
            id="navigation-container"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="flex flex-col justify-center space-y-4">
                <Link
                    to="/"
                    className='flex items-center transition-transform transform hover:translate-x-2'
                >
                    <div className="min-w-[26px] flex-shrink-0">
                        <AiOutlineHome className="mr-2 mt-[2rem]" size={26} />
                    </div>
                    <span className="hidden nav-item-name mt-[2rem]">Home</span>{" "}
                </Link>

                <Link
                    to="/shop"
                    className='flex items-center transition-transform transform hover:translate-x-2'
                >
                    <div className="min-w-[26px] flex-shrink-0">
                        <AiOutlineShopping className="mr-2 mt-[2rem]" size={26} />
                    </div>
                    <span className="hidden nav-item-name mt-[2rem]">Shop</span>{" "}
                </Link>

                <Link
                    to="/cart"
                    className='flex items-center transition-transform transform hover:translate-x-2'
                >
                    <div className="min-w-[26px] flex-shrink-0">
                        <AiOutlineShoppingCart className="mr-2 mt-[2rem]" size={26} />
                    </div>
                    <span className="hidden nav-item-name mt-[2rem]">Cart</span>{" "}
                </Link>

                <Link
                    to="/favorites"
                    className='flex items-center transition-transform transform hover:translate-x-2'
                >
                    <div className="min-w-[26px] flex-shrink-0 relative">
                        <AiOutlineHeart className="mr-2 mt-[2rem]" size={26} />
                        <FavoritesCount />
                    </div>
                    <span className="hidden nav-item-name mt-[2rem]">Favorites</span>{" "}
                </Link>
            </div>

            {/* User info and dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className="flex items-center text-white focus:outline-none"
                >
                    {userInfo ? (
                        <div className="flex gap-1 items-center">
                            <div className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] rounded-full p-1.5 mr-1">
                                <AiOutlineUser className="text-white" size={16} />
                            </div>
                            <span className="text-white hidden font-medium nav-item-name mr-1">{userInfo.username}</span>
                            <FaCaretDown 
                                className={`hidden nav-item-name text-[#ff6b9d] transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} 
                                size={16}
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                </button>

                {dropdownOpen && userInfo && (
                    <ul
                        className={`absolute left-0 mt-2 mr-14 w-48 rounded-lg shadow-lg text-white  ${!userInfo.isAdmin ? "-top-20" : "-top-80"} transition-opacity duration-200`}
                    >
                        {userInfo.isAdmin && (
                            <>
                                <li>
                                    <Link
                                        to="/admin/dashboard"
                                        className="flex items-center px-4 py-2 hover:bg-[#2a2a2a] border-l-2 border-transparent hover:border-l-[#ff6b9d] transition-all"
                                    >
                                        <AiOutlineDashboard className="mr-3 text-[#ff6b9d]" size={18} />
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/admin/productlist"
                                        className="flex items-center px-4 py-2 hover:bg-[#2a2a2a] border-l-2 border-transparent hover:border-l-[#ff6b9d] transition-all"
                                    >
                                        <AiOutlineUnorderedList className="mr-3 text-[#ff6b9d]" size={18} />
                                        Products
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/admin/categorylist"
                                        className="flex items-center px-4 py-2 hover:bg-[#2a2a2a] border-l-2 border-transparent hover:border-l-[#ff6b9d] transition-all"
                                    >
                                        <AiOutlineUnorderedList className="mr-3 text-[#ff6b9d]" size={18} />
                                        Category
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/admin/orderlist"
                                        className="flex items-center px-4 py-2 hover:bg-[#2a2a2a] border-l-2 border-transparent hover:border-l-[#ff6b9d] transition-all"
                                    >
                                        <AiOutlineUnorderedList className="mr-3 text-[#ff6b9d]" size={18} />
                                        Orders
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/admin/userlist"
                                        className="flex items-center px-4 py-2 hover:bg-[#2a2a2a] border-l-2 border-transparent hover:border-l-[#ff6b9d] transition-all"
                                    >
                                        <AiOutlineUnorderedList className="mr-3 text-[#ff6b9d]" size={18} />
                                        Users
                                    </Link>
                                </li>
                                <div className="border-t border-[#333] my-1"></div>
                            </>
                        )}

                        <li>
                            <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-[#2a2a2a] border-l-2 border-transparent hover:border-l-[#ff6b9d] transition-all">
                                <AiOutlineProfile className="mr-3 text-[#ff6b9d]" size={18} />
                                Profile
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={logoutHandler}
                                className="flex items-center w-full text-left px-4 py-2 hover:bg-[#2a2a2a] border-l-2 border-transparent hover:border-l-[#ff6b9d] transition-all"
                            >
                                <AiOutlineLogout className="mr-3 text-[#ff6b9d]" size={18} />
                                Logout
                            </button>
                        </li>
                    </ul>
                )}
                {!userInfo && (
                    <ul>
                        <li>
                            <Link
                                to="/login"
                                className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
                            >
                                <AiOutlineLogin className="mr-2 mt-[4px]" size={26} />
                                <span className="hidden nav-item-name">LOGIN</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/register"
                                className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
                            >
                                <AiOutlineUserAdd size={26} />
                                <span className="hidden nav-item-name">REGISTER</span>
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Navigation
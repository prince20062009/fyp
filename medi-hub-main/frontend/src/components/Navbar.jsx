import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const handleLogIn = async () => {
    console.log("working");
  };

  // state to manage drop down menu
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Nav items
  const navItems = [];

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold relative cursor-pointer before:block before:absolute before:bottom-[-4px] before:left-0 before:w-0 before:h-0.5 before:rounded-full before:bg-text before:transition-all before:delay-150 before:ease-in-out hover:before:w-full hover:text-dark_theme ${
      isActive ? "text-dark_theme" : "text-main_theme"
    } `;

  // mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Dropdown menus
  const dropdownMenus = [
    { to: "/profile", label: "My Profile" },
    { to: "/logout", label: "Logout" },
  ];

  // mouse events on drop down menu
  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  const socialLinks = [
    {
      to: "https://github.com/itsmohit097/medi-hub",
      label: "github",
    },
    {
      to: "https://www.linkedin.com/in/itsmohit097/",
      label: "linkedin",
    },
    { to: "https://discord.gg/krQd2Fss", label: "discord" },
  ];

  return (
    <div className="w-full h-[8vh] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 md:px-4 h-full">
        {/* logo */}
        <NavLink to="/">
          <h1 className="text-3xl text-dark_theme tracking-wide font-bold">
            MediHub
          </h1>
        </NavLink>

        {/* Nav Menus */}
        <div className="hidden lg:flex items-center justify-between gap-8">
          <ul className="flex gap-8 items-center">
            {navItems.map((navItem, index) => (
              <li key={index}>
                <NavLink to={navItem.to} className={navLinkClass}>
                  {navItem.label}
                </NavLink>
              </li>
            ))}
            <li
              className="relative hover:scale-105"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink
                to="/login"
                className="text-md font-semibold relative cursor-pointer rounded flex items-center border border-dark_theme text-dark_theme px-4 py-2 gap-2 max-w-[150px]"
                onClick={handleLogIn}
              >
                <span className="truncate">Login</span>
              </NavLink>

              {/* Dropdown Menus */}
              {isDropdownOpen && (
                <div
                  className="absolute left-0 mt-0 w-56 bg-light_theme border border-dark_theme rounded shadow-lg z-50"
                  onMouseEnter={handleMouseEnter}
                >
                  {/* Drop down menu items */}
                  {dropdownMenus.map((menu, index) => (
                    <NavLink
                      key={index}
                      to={menu.to}
                      className="flex items-center px-4 py-3 gap-2 text-sm font-medium text-dark_theme hover:bg-main_theme/10"
                    >
                      {menu.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </div>

        {/* Mobile Menu Toggle button */}
        <div className="lg:hidden inline-flex">
          <button onClick={toggleMobileMenu} className="text-dark_theme px-2 py-1 border border-dark_theme rounded">
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Social Links (desktop) */}
        <div className="hidden lg:flex gap-3 items-center relative">
          {socialLinks.map((socialLink, index) => (
            <NavLink key={index} to={socialLink.to} target="_blank" className="text-dark_theme/90 hover:text-dark_theme text-sm font-medium">
              {socialLink.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleMobileMenu}
          ></div>
          <div className="lg:hidden bg-gray-200 w-2/3 md:w-3/5 min-h-screen absolute right-0 z-50 px-4 py-4">
            <ul className="w-full flex flex-col items-start px-4 py-4">
              {navItems.map((navItem, index) => (
                <li key={index} className="mb-4">
                  <NavLink
                    to={navItem.to}
                    className={navLinkClass}
                    onClick={toggleMobileMenu}
                  >
                    {navItem.label}
                  </NavLink>
                </li>
              ))}
              <li className="relative  mb-4">
                <NavLink
                  to="/login"
                  className="text-md font-semibold relative cursor-pointer rounded flex items-center border border-dark_theme text-dark_theme px-4 py-2 gap-2"
                  onClick={toggleMobileMenu}
                >
                  <span className="truncate">Login</span>
                </NavLink>

                {/* Dropdown Menus */}
                {isDropdownOpen && (
                  <div className="w-full bg-light_theme border border-dark_theme rounded shadow-lg z-50 mt-2">
                    {dropdownMenus.map((menu, index) => (
                      <NavLink
                        key={index}
                        to={menu.to}
                        className="flex items-center px-4 py-3 gap-2 text-sm font-medium text-dark_theme hover:bg-main_theme/10"
                        onClick={toggleMobileMenu}
                      >
                        {menu.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>

              {/* Social Links (mobile) */}
              <div className="flex gap-3 items-center justify-center">
                {socialLinks.map((socialLink, index) => (
                  <NavLink key={index} to={socialLink.to} target="_blank" className="text-dark_theme/90 hover:text-dark_theme text-sm font-medium">
                    {socialLink.label}
                  </NavLink>
                ))}
              </div>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;

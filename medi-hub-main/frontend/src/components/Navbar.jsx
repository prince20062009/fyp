import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  // state to manage drop down menu
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Nav items
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/aboutus", label: "About" }
  ];

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold relative cursor-pointer before:block before:absolute before:bottom-[-4px] before:left-0 before:w-0 before:h-0.5 before:rounded-full before:bg-text before:transition-all before:delay-150 before:ease-in-out hover:before:w-full hover:text-dark_theme ${
      isActive ? "text-dark_theme" : "text-main_theme"
    } `;

  // mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const socialLinks = [
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
          </ul>
        </div>

        {/* Mobile Menu Toggle button */}
        <div className="lg:hidden inline-flex">
          <button onClick={toggleMobileMenu} className="text-dark_theme px-2 py-1 border border-dark_theme rounded">
            {isMobileMenuOpen ? "Close" : "Menu"}
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

import React from "react";
// import { useAuth } from "./AuthContext";
import { NavLink } from "react-router-dom";

function Header() {
  // const { isLoggedIn, logout } = useAuth(); // 전역 상태 사용

  // const handleLogout = () => {
  //   logout();
  // };

  return (
    <div className="header-container">
      <h1 className="th">
        <a href="/">TH</a>
      </h1>
      <div className="menu">
        <nav>
          <ul className="header-nav">
            <li>
              <button>
                <NavLink className={'home'} exact="true" to="/">
                  홈
                </NavLink>
              </button>
            </li>
              <li>
                <button>로그아웃</button>
              </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Header;

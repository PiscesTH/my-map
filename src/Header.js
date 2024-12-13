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
                <NavLink className={'menu__button'} exact="true" to="/">
                  지도
                </NavLink>
              </button>
            </li>
            <li>
                <button>
                  <NavLink to="/login">로그인</NavLink>
                </button>
              </li>
            {/* {isLoggedIn ? (
              <li>
                <button onClick={handleLogout}>로그아웃</button>
              </li>
            ) : (
              <li>
                <button>
                  <NavLink to="/login">로그인</NavLink>
                </button>
              </li>
            )} */}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Header;

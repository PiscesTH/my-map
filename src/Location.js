import React from 'react';
import { NavLink } from 'react-router-dom';

function Location(props) {
  return (
    <div className="location-container">
      <div className="info-header">
        <span className="title">카카오 스페이스닷원</span>
        <NavLink to={"/"}>X</NavLink>
      </div>
      <div className="info-content">사진 영역
        {/* <img 
          src="your-image-url-here" 
          alt="building"
          className="info-image"
        /> */}
        <div className="info-details">
          <p>제주특별자치도 제주시 첨단로 242</p>
          <p>(우) 63309 (지번) 영평동 2181</p>
          <a href="/" className="homepage-link">홈페이지</a>
        </div>
      </div>
    </div>
  );
};

export default Location;
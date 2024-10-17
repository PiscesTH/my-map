import React from 'react';

const Info = (props) => {
  return (
    <div className="info-container">
      <div className="info-header">
        <span className="title">카카오 스페이스닷원</span>
        <button className="close-btn" onClick={() => props.setIsOpen(false)}>X</button>
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

export default Info;
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MapMarker } from "react-kakao-maps-sdk";
import moment from "moment";

const MyMapMaker = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const dateFormatting = (date) => {
      return moment(date).format("YYYY-MM-DD")
    }

    return (
      <MapMarker // 인포윈도우를 생성하고 지도에 표시합니다
        position={props.position}
        clickable={true} // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* MapMarker의 자식을 넣어줌으로 해당 자식이 InfoWindow로 만들어지게 합니다 */}
        {/* 인포윈도우에 표출될 내용으로 HTML 문자열이나 React Component가 가능합니다 */}
        {isOpen && (
          <div style={{ minWidth: "150px" }}>
            <img
              alt="close"
              width="14"
              height="13"
              src="https://t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/bt_close.gif"
              style={{
                position: "absolute",
                right: "5px",
                top: "5px",
                cursor: "pointer",
              }}
              onClick={() => setIsOpen(false)}
            />
            <div>{dateFormatting(props.date)}</div>
            <div style={{ padding: "5px", color: "#000" }}>
              {props.title === "등록하기" ? (
                <NavLink to="/record" state={props.position} >{props.title}</NavLink>
              ) : (
                <NavLink to="/location" state={props.ilocation}>{props.title}</NavLink>
              )}
              {/*               {props.title === "등록하기" ? (
                <p onClick={setRecordOpen(true)}>{props.title}</p>
              ) : (
                <p onClick={setLocationOpen(true)}>{props.title}</p>
              )} */}
            </div>
          </div>
        )}
      </MapMarker>
    );
  };

export default MyMapMaker;
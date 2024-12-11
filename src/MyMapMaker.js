import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MapMarker } from "react-kakao-maps-sdk";
import moment from "moment";
import icon from "./icon/location-icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCamera } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAppContext } from "./AppContext";
import ModalForDel from "./ModalForDel";

const MyMapMaker = (props) => {
  const { isModalOpen, openModal, openMarkerId, openInfo, closeInfo} = useAppContext();

  const dateFormatting = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const deleteLocation = async (pk) => {
    console.log('삭제함수 실행됨');
    try {
      const res = await axios.delete("http://localhost:8080/api/location", {
        params: {
          ilocation: pk,
        },
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MapMarker // 인포윈도우를 생성하고 지도에 표시합니다
      position={props.position}
      clickable={true} // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
      onClick={() => openInfo(props.ilocation)}
      image={{
        src: icon, // 마커이미지
        size: {
          width: 38,
          height: 43,
        },
      }} // 마커이미지의 크기
    >
      {/* MapMarker의 자식을 넣어줌으로 해당 자식이 InfoWindow로 만들어지게 합니다 */}
      {/* 인포윈도우에 표출될 내용으로 HTML 문자열이나 React Component가 가능합니다 */}
      {openMarkerId === props.ilocation && (
        <div className="location-info">
          <img
            className="location-info-close"
            alt="close"
            width="14"
            height="13"
            src="https://t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/bt_close.gif"
            onClick={() => closeInfo()}
          />
          {props.title !== "등록하기" && (
            <div className="location-info-data info-date">
              {dateFormatting(props.date)}
            </div>
          )}
          {props.title !== "등록하기" && (
            <span
              className="info-delete-button hover-red"
              data-pk={props.ilocation}
              // onClick={(event) => deleteLocation(event)}
              onClick={() => openModal()}
            >
              <FontAwesomeIcon icon={faTrash} />
            </span>
          )}
          {isModalOpen && <ModalForDel deleteFunction={() => deleteLocation(props.ilocation)}></ModalForDel>}
          <div className="location-info-data info-title">
            {props.title === "등록하기" ? (
              <NavLink to="/record" state={props.position}>
                {props.title}
              </NavLink>
            ) : (
              <NavLink to="/location" state={props.ilocation}>
                {props.title} <FontAwesomeIcon icon={faCamera} />
              </NavLink>
            )}
          </div>
        </div>
      )}
    </MapMarker>
  );
};

export default MyMapMaker;

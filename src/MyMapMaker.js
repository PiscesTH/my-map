import React from "react";
import { Link} from "react-router-dom";
import { MapMarker } from "react-kakao-maps-sdk";
import moment from "moment";
import icon from "./icon/location-icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCamera, faPen } from "@fortawesome/free-solid-svg-icons";
import axios from "./axios";
import { useAppContext } from "./AppContext";
import ModalForDel from "./ModalForDel";

const MyMapMaker = ({position, title, date, ilocation, popPositions}) => {
  const { isModalOpen, openModal, openMarkerId, openInfo, closeInfo} = useAppContext();

  const dateFormatting = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const deleteLocation = async (pk) => {
    console.log('삭제함수 실행됨');
    try {
      const res = await axios.delete("/location", {
        params: {
          ilocation: pk,
        },
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const pop = () => {
    popPositions();
    closeInfo();
  }

  return (
    <MapMarker // 인포윈도우를 생성하고 지도에 표시합니다
      position={position}
      clickable={true} // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
      onClick={() => openInfo(ilocation)}
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
      {openMarkerId === ilocation && (
        <div className="location-info">
          <img
            className="location-info-close"
            alt="close"
            width="14"
            height="13"
            src="https://t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/bt_close.gif"
            onClick={title !== "등록하기" ? closeInfo : pop}
          />
          {title !== "등록하기" && (
            <div className="location-info-data info-date">
              {dateFormatting(date)}
            </div>
          )}
          {title !== "등록하기" && (
            <span
              className="info-delete-button hover-red"
              data-pk={ilocation}
              onClick={openModal}
            >
              <FontAwesomeIcon icon={faTrash} />
            </span>
          )}
          {isModalOpen && <ModalForDel deleteFunction={() => deleteLocation(ilocation)}></ModalForDel>}
          <div className="location-info-data info-title">
            {title === "등록하기" ? (
              <Link to={sessionStorage.getItem('accessToken')? '/record' : ''} state={position}>
                {title} <FontAwesomeIcon icon={faPen} />
              </Link>
            ) : (
              <Link to={sessionStorage.getItem('accessToken')? '/location' : ''} state={ilocation}>
                {title} <FontAwesomeIcon icon={faCamera} />
              </Link>
            )}
          </div>
        </div>
      )}
    </MapMarker>
  );
};

export default MyMapMaker;

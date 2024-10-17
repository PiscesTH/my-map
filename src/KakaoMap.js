import React from "react";
import { Map, MapTypeControl, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import { useState, useRef } from "react";
import Info from "./Info";

function KakaoMap(props) {
  const [coordinate, setCoordinate] = useState({
    // 지도의 초기 위치
    center: { lat: 33.450701, lng: 126.570667 },
    // 지도 위치 변경시 panto를 이용할지에 대해서 정의
    isPanto: false,
  });

  const [isOpen, setIsOpen] = useState(false)
  const mapRef = useRef(null)
  const [info, setInfo] = useState("")

  const getInfo = () => {
    const map = mapRef.current
    console.log(mapRef);
    console.log(map);
    if (!map) return

    const center = map.getCenter()

    // 지도의 현재 레벨을 얻어옵니다
    const level = map.getLevel()

    // 지도타입을 얻어옵니다
    const mapTypeId = map.getMapTypeId()

    // 지도의 현재 영역을 얻어옵니다
    const bounds = map.getBounds()

    // 영역의 남서쪽 좌표를 얻어옵니다
    const swLatLng = bounds.getSouthWest()

    // 영역의 북동쪽 좌표를 얻어옵니다
    const neLatLng = bounds.getNorthEast()

    // 영역정보를 문자열로 얻어옵니다. ((남,서), (북,동)) 형식입니다
    // const boundsStr = bounds.toString()

    let message = "지도 중심좌표는 위도 " + center.getLat() + ", <br>"
    message += "경도 " + center.getLng() + " 이고 <br>"
    message += "지도 레벨은 " + level + " 입니다 <br> <br>"
    message += "지도 타입은 " + mapTypeId + " 이고 <br> "
    message +=
      "지도의 남서쪽 좌표는 " +
      swLatLng.getLat() +
      ", " +
      swLatLng.getLng() +
      " 이고 <br>"
    message +=
      "북동쪽 좌표는 " +
      neLatLng.getLat() +
      ", " +
      neLatLng.getLng() +
      " 입니다"
    setInfo(message)
    console.log(info);
    console.log(message);
  }

  const positions = [
    {
      title: "카카오",
      latlng: { lat: 33.450705, lng: 126.570677 },
    },
    {
      title: "생태연못",
      latlng: { lat: 33.450936, lng: 126.569477 },
    },
    {
      title: "텃밭",
      latlng: { lat: 33.450879, lng: 126.56994 },
    },
    {
      title: "근린공원",
      latlng: { lat: 33.451393, lng: 126.570738 },
    },
  ]

  return (
      <Map
        center={coordinate.center}
        style={{ width: "100%", height: "600px" }}
        level={3}
        ref={mapRef}
      >
      <MapTypeControl position={"TOPRIGHT"} />
      {positions.map((position, index) => (
        <MapMarker
          key={`${position.title}-${position.latlng}`}
          position={position.latlng} // 마커를 표시할 위치
          image={{
            src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 마커이미지의 주소입니다
            size: {
              width: 24,
              height: 35
            }, // 마커이미지의 크기입니다
          }}
          title={position.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          onClick={() => setIsOpen(true)}
        />
      ))}
      {isOpen && (<Info setIsOpen={setIsOpen}/>)}
      <button
        onClick={() =>
          setCoordinate({
            center: { lat: 35.8735226465432, lng: 128.810197036642 },
            isPanto: false,
          })
        }
      >
        지정된 좌표로 이동
      </button>
      <button id="getInfoBtn" onClick={getInfo}>
        맵정보 가져오기
      </button>
      <p
        id="info"
        dangerouslySetInnerHTML={{
          __html: info,
        }}
      />
      </Map>
  );
}

export default KakaoMap;

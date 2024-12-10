import React, { useEffect, useState, useRef } from "react";
import {
  Map,
  MapTypeControl,
  ZoomControl,
  MarkerClusterer,
} from "react-kakao-maps-sdk";
import axios from "axios";
import MyMapMaker from "./MyMapMaker";
import { useAppContext } from "./AppContext";

function KakaoMap(props) {
  const { coordinate, setCoordinate } = useAppContext();
  const [mapKey, setMapKey] = useState(0);
  const [positionsOrigin, setPositionsOrigin] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api");
        const data = res.data.data;
        console.log(data);
        setPositionsOrigin(data);
        setPositions(data);
      } catch (err) {
        console.log(err);
        alert("서버에 문제가 발생했습니다. 페이지를 새로고침해주세요.");
      }
    };
    fetchData();
  }, []);

  const mapRef = useRef(null);
  const [info, setInfo] = useState("");

  const getInfo = () => {
    const map = mapRef.current;
    console.log(mapRef);
    console.log(map);
    if (!map) return;

    const center = map.getCenter();

    // 지도의 현재 레벨을 얻어옵니다
    const level = map.getLevel();

    // 지도타입을 얻어옵니다
    const mapTypeId = map.getMapTypeId();

    // 지도의 현재 영역을 얻어옵니다
    const bounds = map.getBounds();

    // 영역의 남서쪽 좌표를 얻어옵니다
    const swLatLng = bounds.getSouthWest();

    // 영역의 북동쪽 좌표를 얻어옵니다
    const neLatLng = bounds.getNorthEast();

    // 영역정보를 문자열로 얻어옵니다. ((남,서), (북,동)) 형식입니다
    // const boundsStr = bounds.toString()

    let message = "지도 중심좌표는 위도 " + center.getLat() + ", <br>";
    message += "경도 " + center.getLng() + " 이고 <br>";
    message += "지도 레벨은 " + level + " 입니다 <br> <br>";
    message += "지도 타입은 " + mapTypeId + " 이고 <br> ";
    message +=
      "지도의 남서쪽 좌표는 " +
      swLatLng.getLat() +
      ", " +
      swLatLng.getLng() +
      " 이고 <br>";
    message +=
      "북동쪽 좌표는 " +
      neLatLng.getLat() +
      ", " +
      neLatLng.getLng() +
      " 입니다";
    setInfo(message);
    console.log(info);
    console.log(message);
  };

  const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드 상태 추가
  const searchPlaces = () => {
    if (!searchKeyword.trim()) {
      alert("검색어를 입력하세요!");
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        /*         const newPositions = data.map((place) => ({
          title: place.place_name,
          latlng: { lat: parseFloat(place.y), lng: parseFloat(place.x) },
        }));
        const totalLat = newPositions.reduce((sum, pos) => sum + pos.latlng.lat, 0);
        const totalLng = newPositions.reduce((sum, pos) => sum + pos.latlng.lng, 0);
        const centerLat = totalLat / newPositions.length;
        const centerLng = totalLng / newPositions.length; */
        setCoordinate((prev) => ({
          center: {
            lat: prev.center.lat + 0.00001,
            lng: prev.center.lng + 0.00001,
          },
          isPanto: true,
        }));

        const timer = setTimeout(() => {
          setCoordinate({
            center: { lat: parseFloat(data[0].y), lng: parseFloat(data[0].x) },
            isPanto: true,
          });
        }, 0);
        clearTimeout(timer);
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchPlaces(); // 엔터 키가 눌리면 검색 실행
    }
  };

  const [isHide, setishide] = useState(true);
  const hideMarker = () => {
    if (isHide) {
      setPositions([]);
    } else {
      setPositions(positionsOrigin);
    }
    setishide((prev) => !prev);
    setCenter();
    setMapKey((prevKey) => prevKey + 1);
    console.log("visible value", isHide);
  };

  const mapClickEvent = (_target, mouseEvent) => {
    const latlng = mouseEvent.latLng;
    setPositions([
      ...positionsOrigin,
      {
        title: "등록하기",
        latlng: { lat: latlng.getLat(), lng: latlng.getLng() },
      },
    ]);
    setCenter();
    setMapKey((prevKey) => prevKey + 1);
  };

  const setCenter = () => {
    const map = mapRef.current;
    if (!map) return;
    const center = map.getCenter();

    setCoordinate({
      center: { lat: center.getLat(), lng: center.getLng() },
      isPanto: true,
    });
  };

  return (
    <>
      <Map
        key={mapKey}
        center={coordinate.center}
        // style={{ width: "100%", height: "600px"}}
        level={3}
        ref={mapRef}
        onClick={(_target, mouseEvent) => mapClickEvent(_target, mouseEvent)}
      >
        <ZoomControl />
        <MapTypeControl position={"TOPRIGHT"} />
        <MarkerClusterer
          averageCenter={true} // 클러스터 중심을 데이터의 평균값으로 설정
          minLevel={8} // 클러스터가 생성되는 최소 레벨 (확대 정도)
        >
          {positions.map((item) => (
            <MyMapMaker
              key={`${item.title}-${item.ilocation}`}
              position={item.latlng} // 마커를 표시할 위치
              title={item.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
              date={item.date}
              ilocation={item.ilocation}
            />
          ))}
        </MarkerClusterer>
        <button onClick={hideMarker}>기존 마커 숨기기</button>
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
      <div className="search">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <button onClick={searchPlaces}>검색</button>
      </div>
    </>
  );
}

export default KakaoMap;

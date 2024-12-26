import React, { useEffect, useState, useRef } from "react";
import {
  Map,
  MapTypeControl,
  ZoomControl,
  MarkerClusterer,
} from "react-kakao-maps-sdk";
import axios from "./axios";
import MyMapMaker from "./MyMapMarker";
import { useAppContext } from "./AppContext";

function KakaoMap(props) {
  const { coordinate, setCoordinate, openInfo } = useAppContext();
  const [mapKey, setMapKey] = useState(0);
  const [positionsOrigin, setPositionsOrigin] = useState([]);
  const [positions, setPositions] = useState([]);
  const [mapLevel, setMapLevel] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (sessionStorage.getItem("accessToken")) {
          const res = await axios.get("/location");
          const res2 = await axios.get("/user/coordinate");
          const data = res.data.data;
          if (data) {
            setPositionsOrigin(data);
            setPositions(data);
          }
          const data2 = res2.data.data;
          setCoordinate({
            center: { lat: data2.lat, lng: data2.lng },
            isPanto: false,
          });
        } else {
          const res = await axios.get("/location/dummy");
          const data = res.data.data;
          if (data) {
            setPositionsOrigin(data);
            setPositions(data);
          }
        }
      } catch (err) {
        alert("서버에 문제가 발생했습니다. 페이지를 새로고침해주세요.");
      }
    };
    fetchData();
  }, []);

  const mapRef = useRef(null);

  const changeCenter = async () => {
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();
    const formData = { lat: center.getLat(), lng: center.getLng() };
    try {
      const res = await axios.patch("/user/coordinate", formData);
      setCoordinate({ center: formData, isPanto: false });
    } catch (err) {
      console.log(err);
    }
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
        setCoordinate((prev) => ({
          center: { lat: parseFloat(data[0].y), lng: parseFloat(data[0].x) },
          isPanto: true,
        }));
        setMapKey((prev) => prev + 1);
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

  const [isHide, setishide] = useState(false);
  const hideMarker = () => {
    setishide((prev) => !prev);
    if (!isHide) {
      setPositions([]);
    } else {
      setPositions(positionsOrigin);
    }
    setCenter();
    setMapKey((prev) => prev + 1);
  };

  const mapClickEvent = (_target, mouseEvent) => {
    const latlng = mouseEvent.latLng;
    setPositions([
      ...positionsOrigin,
      {
        ilocation: -1,
        title: "등록하기",
        latlng: { lat: latlng.getLat(), lng: latlng.getLng() },
      },
    ]);
    openInfo(-1);
    setishide(false);
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
    onMapLoad(map);
  };

  const onMapLoad = (map) => {
    if (map.getLevel() !== mapLevel) {
      setMapLevel(map.getLevel());
      map.setLevel(mapLevel);  // 맵이 로딩될 때 level이 이미 설정된 값으로 변경되지 않도록 처리
    }
  };

  return (
    <>
      <Map
        key={mapKey}
        center={coordinate.center}
        // style={{ width: "100%", height: "600px"}}
        level={mapLevel}
        ref={mapRef}
        onClick={(_target, mouseEvent) => mapClickEvent(_target, mouseEvent)}
        onLoad={onMapLoad}
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
              popPositions={()=> setPositions(positionsOrigin)}
            />
          ))}
        </MarkerClusterer>
      </Map>
      <div className="map__button-container">
        <div>
          <button onClick={hideMarker}>기존 마커 숨기기</button>
          {sessionStorage.getItem("accessToken") && (
            <button id="getInfoBtn" onClick={changeCenter}>
              현재 지도를 중심으로 설정
            </button>
          )}
        </div>
        <div className="map__button__search">
          <input
            type="text"
            placeholder="지도 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={searchPlaces}>검색</button>
        </div>
      </div>
    </>
  );
}

export default KakaoMap;

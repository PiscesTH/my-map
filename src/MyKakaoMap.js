import React, { useEffect, useState, useRef } from "react";
import {
  Map,
  MapTypeControl,
  ZoomControl,
  MarkerClusterer,
} from "react-kakao-maps-sdk";
import axios from "./axios";
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
        if (sessionStorage.getItem("accessToken")) {
          const [res, res2] = await Promise.all([
            axios.get("/location"),
            axios.get("/user/coordinate"),
          ]);
          const data = res.data.data;
          const data2 = res2.data.data;
          setCoordinate({
            center: { lat: data2.lat, lng: data2.lng },
          isPanto: false,
        })
          if (data) {
            setPositionsOrigin(data);
            setPositions(data);
          }
        } else {
          const res = await axios.get("/location/dummy");
          const data = res.data.data;
          setPositionsOrigin(data);
          setPositions(data);
          console.log("비로그인");
        }
      } catch (err) {
        console.log(err);
        alert("서버에 문제가 발생했습니다. 페이지를 새로고침해주세요.");
      }
    };
    fetchData();
  }, []);

  const mapRef = useRef(null);
  const [info, setInfo] = useState("");

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
    console.log(searchKeyword);
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

  const [isHide, setishide] = useState(true);
  const hideMarker = () => {
    if (isHide) {
      setPositions([]);
    } else {
      setPositions(positionsOrigin);
    }
    setishide((prev) => !prev);
    setCenter();
    setMapKey((prev) => prev + 1);
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
        <button
          id="getInfoBtn"
          onClick={changeCenter}
          disabled={!sessionStorage.getItem("accessToken")}
        >
          지도 중앙 설정
        </button>
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

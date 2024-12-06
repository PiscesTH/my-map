import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

function Location(props) {
  const [ilocation, setIlocation] = useState();
  const [title, setTitle] = useState();
  const [date, setDate] = useState();
  const [pictures, setPictures] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // 모달 열기
  const openModal = (image) => {
    const str = JSON.stringify(image.thumbnails);
    setSelectedImage(str.slice(3, str.indexOf('&quot')));
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/location", {
          params: {
            ilocation: 5,
          },
        });
        console.log("data", res.data);
        setIlocation(res.data.data.ilocation);
        setTitle(res.data.data.title);
        setDate(res.data.data.date);
        setPictures(res.data.data.pictures);
      } catch (err) {
        console.log(err);
        alert("서버에 문제가 발생했습니다. 페이지를 새로고침해주세요.");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="location-container">
      <h2>제목 : {title}</h2>
      <div>{date}</div>
      <h3>사진 미리보기</h3>
      {pictures.map((thumbnail, index) => (
        <img
          key={index}
          src={`http://localhost:8080/location/${ilocation}/${thumbnail.thumbnails}`}
          alt={thumbnail.thumbnails}
          className="thumbnails"
          onClick={() => openModal(thumbnail)}
        />
      ))}
      {/* 모달 */}
      {selectedImage && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <img
              src={`http://localhost:8080/location/${ilocation}/${selectedImage}`}
              alt={selectedImage}
              style={{ maxWidth: "90%", maxHeight: "90%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Location;

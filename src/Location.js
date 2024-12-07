import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

function Location(props) {
  const [ilocation, setIlocation] = useState();
  const [title, setTitle] = useState();
  const [date, setDate] = useState();
  const [pictures, setPictures] = useState([]);
  const [ipicture, setIpicture] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  // 모달 열기
  const openModal = (image, event) => {
    const str = JSON.stringify(image.thumbnails);
    setSelectedImage(str.slice(3, str.indexOf("&quot")));
    setIpicture(event.currentTarget.dataset.pk);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedImage(null);
    setIpicture(0);
  };

  const deletePicture = async (event) => {
    const pk = event.currentTarget.dataset.pk;
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/location/${pk}`
      );
      const timer = setTimeout(() => closeModal(), 1000);
      clearTimeout(timer);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/location", {
          params: {
            ilocation: 6,
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
      <NavLink className="return-button hover-red" to={"/"}>
      <FontAwesomeIcon icon={faMapLocationDot} />
      </NavLink>
      <h2>제목 : {title}</h2>
      <div>{date}</div>
      <h3>사진 미리보기</h3>
      {pictures.map((thumbnail, index) => (
        <img
          key={index}
          data-pk={thumbnail.ipicture}
          src={`http://localhost:8080/location/${ilocation}/${thumbnail.thumbnails}`}
          alt={thumbnail.thumbnails}
          className="thumbnails"
          onClick={(event) => openModal(thumbnail, event)}
        />
      ))}
      {/* 모달 */}
      {selectedImage && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button hover-red" onClick={closeModal}>
              &times;
            </span>
            <span
              className="delete-button hover-red"
              data-pk={ipicture}
              onClick={(event) => deletePicture(event)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </span>
            <img
              src={`http://localhost:8080/location/${ilocation}/${selectedImage}`}
              alt={selectedImage}
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Location;

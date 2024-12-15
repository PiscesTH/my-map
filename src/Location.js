import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "./axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faMapLocationDot,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import ModalForDel from "./ModalForDel";
import { useAppContext } from "./AppContext";

function Location(props) {
  const location = useLocation();
  const ilocation = location.state;

  const [title, setTitle] = useState();
  const [date, setDate] = useState();
  const [pictures, setPictures] = useState([]);
  const [ipicture, setIpicture] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isModalOpen, openModal, closeModal } = useAppContext();

  // 모달 열기
  const openImageModal = (image, event) => {
    const str = JSON.stringify(image.thumbnails);
    setSelectedImage(str.slice(3, str.indexOf("&quot")));
    setIpicture(event.currentTarget.dataset.pk);
  };

  // 모달 닫기
  const closeImageModal = () => {
    setSelectedImage(null);
    setIpicture(0);
  };

  const deletePicture = async (pk) => {
    try {
      const res = await axios.delete("/location/pic", {
        params: {
          ipicture: ipicture,
        },
      });
      closeModal(false);
      const timer = setTimeout(() => closeImageModal(), 1000);
      clearTimeout(timer);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const downloadImage = async () => {
    const imageName = selectedImage; // 다운로드할 이미지 이름
    try {
      const response = await axios.get(`/location/pic/${imageName}`, {
        params: {ilocation: ilocation},
        responseType: 'blob',
      });

      const imageBlob = response.data;
      const imageUrl = window.URL.createObjectURL(imageBlob);

      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = imageName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(imageUrl);
    } catch (error) {
      console.error("Failed to download image", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `/location/${ilocation}`
        );
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
          onClick={(event) => openImageModal(thumbnail, event)}
        />
      ))}
      {/* 모달 */}
      {selectedImage && (
        <div className="image-modal">
          <div className={`image-modal__content ${isModalOpen ? "" : "scrollable"}`}>
            <span
              className="image-modal__close-button hover-red"
              onClick={() => closeImageModal()}
            >
              &times;
            </span>
            <span
              className="image-modal__download-button hover-red"
              onClick={downloadImage}
            >
              <FontAwesomeIcon icon={faDownload} />
            </span>
            <span
              className="image-modal__delete-button hover-red"
              data-pk={ipicture}
              onClick={() => openModal()}
              // onClick={(event) => deletePicture(event)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </span>
            <img
              src={`http://localhost:8080/location/${ilocation}/${selectedImage}`}
              alt={selectedImage}
              className="image-modal__image"
            />
            {isModalOpen && (
              <div className="modal-overlay">
                <ModalForDel deleteFunction={() => deletePicture(ipicture)} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Location;

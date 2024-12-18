import React, { useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { useLocation, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import MyForm from "./MyForm";

function ImageUploader() {
  const [originals, setOriginals] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);

  const location = useLocation();
  const receivedState = location.state;

  return (
    <div className="location-container">
      <MyForm
        originals={originals}
        thumbnails={thumbnails}
        setOriginals={setOriginals}
        setThumbnails={setThumbnails}
        receivedState={receivedState}
      />
      <NavLink className="return-button hover-red" to={"/"}>
        <FontAwesomeIcon icon={faMapLocationDot} />
      </NavLink>
      <h2 style={{ paddingLeft: '15px' }}>사진 미리보기</h2>
      <div className="thumbnail-container">
        {thumbnails.map((thumbnail, index) => (
          <img
            key={index}
            src={URL.createObjectURL(thumbnail)}
            alt={`Thumbnail ${index + 1}`}
            className="thumbnails"
          />
        ))}
      </div>
    </div>
  );
}

export default ImageUploader;

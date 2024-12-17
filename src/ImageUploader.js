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
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(moment(new Date()));

  const location = useLocation();
  const receivedState = location.state;

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleDateChange = (date) => {
    // Calendar에서 날짜 선택 시 호출되는 함수
    const formattedDate = moment(date).format("YYYY-MM-DD"); // 날짜 포맷팅
    setDate(formattedDate);
  };

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
      <h2>사진 미리보기</h2>
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
      <button id="calendar-switch" onClick={handleIsOpen}></button>
      <label htmlFor="calendar-switch" className="calendar-switch">
        날짜 선택
      </label>
      {isOpen && (
        <div className="calendar-container">
          <Calendar
            onChange={handleDateChange}
            value={date}
            formatDay={(locale, date) => moment(date).format("D")}
            formatYear={(locale, date) => moment(date).format("YYYY")}
            formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
            calendarType="gregory"
            showNeighboringMonth={false}
            next2Label={null}
            prev2Label={null}
            minDetail="year"
          ></Calendar>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;

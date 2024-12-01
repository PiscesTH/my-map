import React, { useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { useEffect } from "react";
import axios from "axios";

function ImageUploader() {
  const [images, setImages] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [date, setDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const locationDto = {"title": "임시제목",
    "lat": 35.8735226465432, 
    "lng": 128.810197036642, 
    "date": new Date()};

  // 이미지 업로드 핸들러
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    console.log("Uploaded files:", files);
    
  
    setImages(files);
  
    const thumbnailPromises = files.map((file) => createThumbnail(file));
    Promise.all(thumbnailPromises)
      .then((thumbnails) => {
        console.log("Generated Thumbnails:", thumbnails);
        setThumbnails(thumbnails);
      })
      .catch((err) => console.error("Error generating thumbnails:", err));
  };
  
  useEffect(() => {
    console.log("Updated Thumbnails State:", thumbnails);

    setFormData({
      "dto": new Blob([JSON.stringify(locationDto)], { type: "application/json" }),
      'originals': images,
      'thumbnails': thumbnails
    });
    console.log("formData", formData);
  }, [thumbnails]);

  // 썸네일 생성 함수
  const createThumbnail = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const maxWidth = 150; // 썸네일 너비
          const maxHeight = 150; // 썸네일 높이
          let width = img.width;
          let height = img.height;

          // 이미지 비율 유지
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // 썸네일 Blob 생성
          canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  }

  const handleDateChange = (date) => {
    // Calendar에서 날짜 선택 시 호출되는 함수
    const formattedDate = moment(date).format("YYYY-MM-DD"); // 날짜 포맷팅
    setDate(formattedDate);
  };

  // 이미지와 썸네일 전송 함수
  const handleUpload = async () => {
    try {
      console.log(formData);
      axios.post("http://localhost:8080/api/record", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  return (
    <div>
      <h1>이미지 업로드 및 썸네일 생성</h1>
      <input
        type="file"
        id="fileInput"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
      />
      <label for="fileInput" class="custom-file-label">
        사진 선택
      </label>
      <button id="fileUpload" onClick={handleUpload}></button>
      <label for="fileUpload" className="custom-file-label">
        이미지 업로드
      </label>

      <div>
        <h2>사진 미리보기</h2>
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
      <label for="calendar-switch" className="calendar-switch">날짜 선택</label>
      {isOpen && <div className="calendar-container">
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
      </div>}
    </div>
  );
}

export default ImageUploader;

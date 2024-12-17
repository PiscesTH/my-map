import axios from "./axios";
import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import moment from "moment";

const MyForm = ({ originals, thumbnails, setOriginals, setThumbnails, receivedState }) => {
  const [date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD")); // 날짜 상태
  const [title, setTitle] = useState(""); // 제목 상태

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    handleUpload();
    console.log("제출버튼 클릭됨");
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setOriginals(files);

    const thumbnailPromises = files.map((file) => createThumbnail(file));
    Promise.all(thumbnailPromises)
      .then((thumbnails) => {
        setThumbnails(thumbnails);
      })
      .catch((err) => console.error("Error generating thumbnails:", err));
  };

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

  // 이미지와 썸네일 전송 함수
  const handleUpload = async () => {
    const locationDto = {
      title: title,
      lat: receivedState.lat,
      lng: receivedState.lng,
      date: new Date(date),
    };
    try {
      const formData = new FormData();
      formData.append(
        "dto",
        new Blob([JSON.stringify(locationDto)], { type: "application/json" })
      );
      // originals 배열의 각 파일을 개별적으로 추가
      originals.forEach((original, index) => {
        formData.append(`originals`, original);
      });

      // thumbnails 배열의 각 파일을 개별적으로 추가
      thumbnails.forEach((thumbnail, index) => {
        formData.append(`thumbnails`, thumbnail);
      });

      const response = await axios.post("/location", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const ilocation = response.data.data.result;
      navigate("/location", { state: ilocation });
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-container">
        <label htmlFor="date">날짜</label>
        <input
          type="date"
          id="date"
          name="date"
          className="form-date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)} // 상태 업데이트
        />

        <label htmlFor="title">제목</label>
        <input
          type="text"
          className="form-title"
          id="title"
          name="title"
          placeholder="제목"
          required
          autoComplete="off"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // 상태 업데이트
        />

        <input
          type="file"
          id="file-input"
          className="invisible"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />
        <label htmlFor="file-input" className="custom-file-label">
          사진 선택
        </label>
        <button id="file-upload" className="invisible" type="submit"></button>
        <label
          htmlFor={thumbnails.length ? "file-upload" : undefined}
          className={`custom-file-label ${
            thumbnails.length ? "" : "disabled-label"
          }`}
        >
          등록하기
        </label>
      </div>
    </form>
  );
};

export default MyForm;

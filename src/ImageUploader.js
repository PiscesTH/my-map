import React, { useState } from "react";
import MyCalendar from "./MyCalendar";

function ImageUploader() {
  const [images, setImages] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);


  // 이미지 업로드 핸들러
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);

    // 썸네일 생성
    const thumbnailPromises = files.map((file) => createThumbnail(file));
    Promise.all(thumbnailPromises).then(setThumbnails);
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
    const formData = new FormData();
    console.log("작동중");
    images.forEach((image, index) => {
      formData.append("originals", image); // 원본 이미지
      formData.append("thumbnails", thumbnails[index]); // 썸네일
    });

    try {
      const response = await fetch("https://your-backend-api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("이미지 업로드 성공!");
      } else {
        console.error("업로드 실패!");
      }
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
      <label for="fileInput" class="custom-file-label">사진 선택</label>
      <button id="fileUpload" onClick={handleUpload}></button>
      <label for="fileUpload" className="custom-file-label">이미지 업로드</label>

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
      <MyCalendar></MyCalendar>
    </div>
  );
}

export default ImageUploader;

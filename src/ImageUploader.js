import React, { useState } from "react";

function ImageUploader() {
  // 파일과 미리보기 URL을 저장할 상태
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // 파일 선택 시 처리 함수
  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files); // 여러 파일을 배열로 변환
    setImages(selectedFiles);

    // 각 파일의 URL을 만들어 미리보기로 보여주기
    const imageUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(imageUrls);
  };

  // 파일 업로드 함수
  const handleUpload = async () => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      // const response = await fetch("/api/upload", {
      //   method: "POST",
      //   body: formData,
      // });

      // if (response.ok) {
      //   alert("업로드 성공!");
      //   setImages([]);
      //   setPreviewUrls([]);
      // } else {
      //   alert("업로드 실패");
      // }
    } catch (error) {
      console.error("업로드 오류:", error);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1>이미지 업로드</h1>
      <input type="file" multiple onChange={handleImageChange} />
      
      <div className="image-container">
        {previewUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`preview-${index}`}
            className="images"
            // style={{ width: "150px", height: "150px", objectFit: "cover", margin: "5px" }}
          />
        ))}
      </div>
      
      <button onClick={handleUpload}>업로드</button>
    </div>
  );
}

export default ImageUploader;

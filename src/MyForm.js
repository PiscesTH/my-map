import axios from "./axios";
import { useState } from "react";

const MyForm = ({handleImageUpload, handleUpload, }) => {
  const [date, setDate] = useState(""); // 날짜 상태
  const [title, setTitle] = useState(""); // 제목 상태

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    console.log("제출버튼 클릭됨");

    // try {
    //   const response = await axios.post("/api/submit", {
    //     date: selectedDate,
    //     category: selectedCategory,
    //     title,
    //   });
    //   console.log("응답 성공:", response.data);
    // } catch (error) {
    //   console.error("에러 발생:", error);
    // }
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

        <button className="form-submit" type="submit">
          등록하기
        </button>
      </div>
    </form>
  );
};

export default MyForm;

import axios from "./axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  // 입력 필드 상태 관리
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [passwordForConfirm, setPasswordForConfirm] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  let navigate = useNavigate();

  // 회원가입 버튼 클릭 시 호출되는 함수
  const handleSignup = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지

    if (!uid || !password || !passwordForConfirm || !name || !email) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (uid.length < 6 || uid.length > 12) {
      setError("아이디는 6자 ~ 12자이어야 합니다.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    if (password.length < 8 || password.length > 20) {
      setError("비밀번호는 8자 ~ 20자이어야 합니다.");
      return;
    }

    if (password !== passwordForConfirm) {
      setError("비밀번호가 다릅니다.");
      return;
    }
    const formData = { uid: uid, upw: password, nm: name, email: email };
    setError("");

    try {
      await axios.post("/user/sign-up", formData);
      alert("회원가입 완료 !");
      navigate("/login");
    } catch (error) {
      setError(error.response.data.validErrorList[0].message);
      alert("회원가입 실패...");
    }
  };

  return (
    <div style={styles.container}>
      <h2>회원가입</h2>
      <form onSubmit={handleSignup} style={styles.form}>
        <div style={styles.inputContainer}>
          <label htmlFor="uid">아이디</label>
          <input
            type="text"
            id="uid"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="아이디 입력(6~12자)"
            style={styles.input}
            autoComplete="off"
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력(문자, 숫자, 특수문자 포함 8~20자)"
            style={styles.input}
            autoComplete="off"
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="password">비밀번호 확인</label>
          <input
            type="password"
            id="passwordForConfirm"
            value={passwordForConfirm}
            onChange={(e) => setPasswordForConfirm(e.target.value)}
            placeholder="비밀번호를 다시 입력하세요"
            style={styles.input}
            autoComplete="off"
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            style={styles.input}
            autoComplete="off"
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            style={styles.input}
            autoComplete="off"
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>
          회원가입
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputContainer: {
    marginBottom: "15px",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 0",
    backgroundColor: "#6698cb",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "15px",
    fontSize: "16px",
  },
};

export default SignupPage;

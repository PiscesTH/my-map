import React from "react";
import { useAppContext } from "./AppContext";

const ModalForDel = () => {
  const { closeModal } = useAppContext();

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>삭제하시겠습니까?</h2>
        <div className="buttons">
          <button className="confirm" >
            삭제
          </button>
          <button className="cancel" onClick={closeModal}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

/* <div className="modal-container">
<button onClick={openModal}>
  <FontAwesomeIcon icon={faTrash} />
</button>
<ReactModal isOpen={isModalOpen} onRequestClose={closeModal}>
  <h2>모달 제목</h2>
  <p>모달 내용</p>
  <button >삭제</button>
  <button onClick={closeModal}>취소</button>
</ReactModal>
</div> */

export default ModalForDel;

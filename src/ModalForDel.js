import React from "react";
import { useAppContext } from "./AppContext";

const ModalForDel = ({deleteFunction}) => {
  const { closeModal } = useAppContext();

  return (
    <div className="delete-modal__backdrop">
      <div className="delete-modal">
        <h2>삭제하시겠습니까?</h2>
        <div className="delete-modal__buttons">
          <button className="delete-modal__confirm" onClick={deleteFunction}>
            삭제
          </button>
          <button className="delete-modal__cancel" onClick={() => closeModal()}>
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

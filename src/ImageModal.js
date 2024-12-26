import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "./AppContext";

const ImageModal = () => {
  const { isModalOpen, openModal, closeModal } = useAppContext();

  return (
    <div className="image-modal">
      <div
        className={`image-modal__content ${isModalOpen ? "" : "scrollable"}`}
      >
        <span
          className="image-modal__close-button hover-red"
          onClick={() => closeImageModal()}
        >
          &times;
        </span>
        <span
          className="image-modal__download-button hover-red"
          onClick={downloadImage}
        >
          <FontAwesomeIcon icon={faDownload} />
        </span>
        <span
          className="image-modal__delete-button hover-red"
          data-pk={ipicture}
          onClick={() => openModal()}
          // onClick={(event) => deletePicture(event)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </span>
        <img
          src={`http://localhost:8080/location/${ilocation}/${selectedImage}`}
          alt={selectedImage}
          className="image-modal__image"
        />
        {isModalOpen && (
          <div className="modal-overlay">
            <ModalForDel deleteFunction={() => deletePicture(ipicture)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;

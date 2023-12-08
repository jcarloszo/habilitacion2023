import React, { useEffect, useState } from "react";
import './Modal.css'

const Modal = (props) => {

  const closeModal = () => {
    props.setModalVisible(false);
  }

  return (<>
    {
      props.visible ?
        <>
          <div className="containerModal">
            <div>
              <button
                className="bg-red-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={closeModal}
              >
                <h1 className="text-white">Cerrar</h1>
              </button>
              {props.children}
            </div>
          </div>
        </>
        : <></>
    }
  </>)
};

export default Modal;

import React from "react";
import { Link } from "react-router-dom";

import "./row.css";

const ImageTextRow = ({
  h3,
  h1,
  p,
  buttonText,
  img,
  buttonDestination,
  rowDirection,
}) => {
  return (
    <div className="">
      <div
        className={
          rowDirection === "backward"
            ? "row_container backward_row"
            : "row_container"
        }
      >
        <div className="row_item">
          <h3>{h3}</h3>
          <h1>{h1}</h1>
          <p>{p}</p>
          <Link className="cta" to={buttonDestination}>
            <button>{buttonText}</button>
          </Link>
        </div>
        <div className="row_item">
          <img src={img} alt="" />
        </div>
      </div>
    </div>
  );
};

export default ImageTextRow;

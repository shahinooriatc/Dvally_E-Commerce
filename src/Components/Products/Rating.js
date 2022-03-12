import React from "react";
import { Badge } from "react-bootstrap";

const Rating = (props) => {
  const { rating, totalrating } = props;
  return (
    <>
      <i
        className={
          rating >= 1
            ? "fas fa-star"
            : rating >= 0.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
        }
      ></i>
      <i
        className={
          rating >= 2
            ? "fas fa-star"
            : rating >= 1.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
        }
      ></i>
      <i
        className={
          rating >= 3
            ? "fas fa-star"
            : rating >= 2.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
        }
      ></i>
      <i
        className={
          rating >= 4
            ? "fas fa-star"
            : rating >= 3.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
        }
      ></i>
      <i
        className={
          rating >= 5
            ? "fas fa-star"
            : rating >= 4.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
        }
      ></i>
      <Badge bg="secondary">Based on : {totalrating} Rating</Badge>
    </>
  );
};

export default Rating;

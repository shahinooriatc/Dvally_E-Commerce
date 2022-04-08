import React from "react";
import  './CheackoutStep.css';
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const CheckoutStep = (props) => {
  return (
    <>
      <Container className="mt-5 steps">
        <Row>
          <Col>
          <Link to="/login">

            <h3 className={props.step1 ? "stepactive" : ""}>SignIn
              {/* <Button variant="info"> Sign In </Button> */}
            </h3>
          </Link>
          </Col>

          <Col>
          <Link to="/shipping">

            <h3 className={props.step2 ? "stepactive" : ""}>Shipping Address
              {/* <Button variant="info"> Shipping Address</Button> */}
            </h3>
          </Link>
          </Col>

          <Col>
          <Link to="/">

            <h3 className={props.step3 ? "stepactive" : ""}>Payment
              {/* <Button variant="info"> Payment </Button> */}
            </h3>
          </Link>
          </Col>

          <Col><Link to="/placeorder">

            <h3 className={props.step4 ? "stepactive" : ""}> Place Order
              {/* <Button variant="info"> Place Order</Button> */}
            </h3>
          </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CheckoutStep;

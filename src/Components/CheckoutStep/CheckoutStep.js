import React from "react";
import  './CheackoutStep.css';
import { Button, Col, Container, Row } from "react-bootstrap";

const CheckoutStep = (props) => {
  return (
    <>
      <Container className="mt-5 steps">
        <Row>
          <Col>
            <h3 className={props.step1 ? "stepactive" : ""}>SignIn
              {/* <Button variant="info"> Sign In </Button> */}
            </h3>
          </Col>

          <Col>
            <h3 className={props.step2 ? "stepactive" : ""}>Shipping Address
              {/* <Button variant="info"> Shipping Address</Button> */}
            </h3>
          </Col>

          <Col>
            <h3 className={props.step3 ? "stepactive" : ""}>Payment
              {/* <Button variant="info"> Payment </Button> */}
            </h3>
          </Col>

          <Col>
            <h3 className={props.step4 ? "stepactive" : ""}> Place Order
              {/* <Button variant="info"> Place Order</Button> */}
            </h3>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CheckoutStep;

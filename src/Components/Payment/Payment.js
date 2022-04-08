import React, { useContext, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import CheckoutStep from "../CheckoutStep/CheckoutStep";

const Payment = () => {
    const { statePaymentMethod, dispatchPaymentMethod } = useContext(Store);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(statePaymentMethod.paymentMethod?statePaymentMethod.paymentMethod:"");
  
  const handlePaymentMethod = (e) => {
    e.preventDefault();
    dispatchPaymentMethod({
      type: "PAYMENT_METHOD",
      payload: paymentMethod,
    });
    localStorage.setItem("paymentMethod", JSON.stringify(paymentMethod));
    navigate("/placeorder");
  };
  return (
    <>
      <CheckoutStep step1="true" step2="true" step3="true" />
      <Container className="w-25 text-center border">
        <Row border="primary">
          <Link to="/shipping">
            <Button className="w-100">Back To Shipping Address</Button>
          </Link>
          <Col>
            <Alert className="paymentMethod text-center mt-2">
              <h2> Please Select Payment Method</h2>
            </Alert>
            <Form>
              <h5>
                <Form.Check
                  type="radio"
                  id="paypal"
                  label="PayPal"
                  value="paypal"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  checked={paymentMethod === "paypal"}
                />
              </h5>

              <h5>
                <Form.Check
                  type="radio"
                  id="sslcommerce"
                  label="Sslcommerce"
                  value="sslcommerce"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  checked={paymentMethod === "sslcommerce"}
                />
              </h5>
              <h5>
                <Form.Check
                  type="radio"
                  id="strip"
                  label="Strip"
                  value="strip"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  checked={paymentMethod === "strip"}
                />
              </h5>
            </Form>
          </Col>
          <Button className="btn btn-info mt-3" onClick={handlePaymentMethod}>
            Continue Payment
          </Button>
        </Row>
      </Container>
    </>
  );
};

export default Payment;

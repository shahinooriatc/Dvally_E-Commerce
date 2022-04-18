import axios from "axios";
import { Toast } from "bootstrap";
import React, { useContext, useReducer, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../../Store";
import CartPage from "../CartPage/CartPage";
import CheckoutStep from "../CheckoutStep/CheckoutStep";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return { state };
  }
};

const PlaceOrder = () => {
  const navigate = useNavigate();

  const {
    state,
    dispatch: contDispatch,
    stateUserSignIn,
    stateShipping,
    dispatchShipping,
    statePaymentMethod,
    dispatchPaymentMethod,
  } = useContext(Store);

  const { shippingaddress } = stateShipping;
  const { cartItems } = state.cart;
  // Modal Button Show Hide & Close states.......
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);

  const handleShow = () => setShow(true);
  const handleShow2 = () => setShow2(true);

  const { userInfo } = stateUserSignIn;
  const [fullName, setFullName] = useState(
    stateShipping.shippingaddress.fullName || ""
  );
  const [address, setAddress] = useState(
    stateShipping.shippingaddress.address || ""
  );
  const [city, setCity] = useState(stateShipping.shippingaddress.city || "");
  const [postalcode, setPostalcode] = useState(
    stateShipping.shippingaddress.postalcode || ""
  );
  const [country, setCountry] = useState(
    stateShipping.shippingaddress.country || ""
  );

  let totalOrders = cartItems.reduce(
    (accumulator, current) => accumulator + current.quantity,
    0
  );
  let totalAmount = cartItems.reduce(
    (accumulator, current) => accumulator + current.price * current.quantity,
    0
  );
  let totalTax = totalAmount > 300 ? (totalAmount * 10) / 100 : 10;
  let shippingCharge = totalAmount > 300 ? (totalAmount * 5) / 100 : 25;
  let grandTotal = (totalAmount + totalTax + shippingCharge).toFixed(2);

  const handleContinuePayment = (e) => {
    e.preventDefault();
    if (fullName && address && city && postalcode && country) {
      if (fullName !== address && city !== country) {
        dispatchShipping({
          type: "SHIPPING_ADDRESS",
          payload: {
            fullName,
            address,
            city,
            postalcode,
            country,
          },
        });
        localStorage.setItem(
          "shippingaddress",
          JSON.stringify({
            fullName,
            address,
            city,
            postalcode,
            country,
          })
        );
        setShow(false);
      } else {
        toast.error("Please Enter Valid Name & Address ");
      }
    } else {
      toast.error("All Input Fields are required!");
    }
  };

  const [paymentMethod, setPaymentMethod] = useState(
    statePaymentMethod.paymentMethod ? statePaymentMethod.paymentMethod : ""
  );

  const handlePaymentMethod = (e) => {
    e.preventDefault();
    dispatchPaymentMethod({
      type: "PAYMENT_METHOD",
      payload: paymentMethod,
    });
    localStorage.setItem("paymentMethod", JSON.stringify(paymentMethod));
    setShow2(false);
  };

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const handlePlaceOrder = async () => {
    try {
      const { data } = await axios.post(
        "api/orders",
        {
          orderItems: state.cart.cartItems,
          shippingAddress: shippingaddress,
          paymentMethod: paymentMethod,
          productPrice: totalAmount,
          shippingPrice: shippingCharge,
          taxAmount: totalTax,
          totalPrice: grandTotal,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      contDispatch({ type: "CLEAR_CART" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(err);
    }
  };

  return (
    <>
      <CheckoutStep step1="true" step2="true" step3="true" step4="true" />
      <Container className="mt-3">
        <Row>
          <Col lg={8}>
            <CartPage placeOrderPage={true} />
          </Col>

          <Col lg={4}>
            <Row>
              <Col lg={12}>
                <Alert className="">
                  <h4>Shipping Addresses</h4>
                </Alert>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <b>Full Name -: </b> {shippingaddress.fullName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <b>Address -: </b> {shippingaddress.address}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <b>City -: </b> {shippingaddress.city}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <b>Postal Code -: </b> {shippingaddress.postalcode}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <b>Country -: </b> {shippingaddress.country}
                    </ListGroup.Item>
                  </ListGroup>
                </Card>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Change Shipping Address</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Full Name"
                          name="Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="address"
                          placeholder="Enter Your Address"
                          name="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="city"
                          placeholder="Enter City"
                          name="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Postal Code </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Postal Code"
                          name="postalcode"
                          value={postalcode}
                          onChange={(e) => setPostalcode(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Country </Form.Label>
                        <Form.Control
                          type="country"
                          placeholder="Country"
                          name="country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleContinuePayment}>
                      Save Shipping Address
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Button
                  variant="info"
                  className="my-3 w-100"
                  onClick={handleShow}
                >
                  Edit Shipping Information{" "}
                </Button>
              </Col>
              <hr />
              <Col lg={12}>
                <Alert className="">
                  <h4>Payment Method</h4>
                </Alert>
                <Card.Header as="h5">
                  Payment Method : {statePaymentMethod.paymentMethod}
                </Card.Header>

                <Modal show={show2} onHide={handleClose2}>
                  <Modal.Header closeButton>
                    <Modal.Title>Please Select Payment Method</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Row>
                      <Col>
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
                    </Row>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose2}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handlePaymentMethod}>
                      Save Payment Method
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Button
                  variant="info"
                  className="my-3 w-100"
                  onClick={handleShow2}
                >
                  Edit Payment Method
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Button className="mt-1 py-3 w-100" onClick={handlePlaceOrder}>
          Place Order
        </Button>
      </Container>
    </>
  );
};

export default PlaceOrder;

import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  ListGroup,
  Row,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Store } from "../../Store";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import StripeCheckout from "react-stripe-checkout";

import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };

    default:
      return state;
  }
}

const Order = () => {
  const navigate = useNavigate();

  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: false,
      error: "",
      order: {},
      successPay: false,
      loadingPay: false,
    });

  const { stateUserSignIn } = useContext(Store);
  const { userInfo } = stateUserSignIn;

  const params = useParams();
  const { id: orderID } = params;

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  };
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAYPAL_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PAYPAL_SUCCESS", payload: data });
        toast.success("Payment Successfully Done");
      } catch (error) {
        dispatch({ type: "PAY_FAIL", payload: error.message });
        toast.error(error.message);
      }
    });
  };
  const onError = (error) => {
    toast.error(error.message);
  };

  useEffect(() => {
    if (!order._id || successPay || (order._id && order._id !== orderID)) {
      const fetchOrder = async () => {
        try {
          dispatch({ type: "FETCH_REQUEST" });
          const { data } = await axios.get(`/api/orders/${orderID}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });

          dispatch({ type: "FETCH_SUCCESS", payload: data });
        } catch (error) {
          dispatch({ type: "FETCH_FAIL", payload: error });
        }
      };
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: "pending",
        });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderID, navigate, paypalDispatch, successPay]);


  // ---------------Strips Payment HandleFunction------------
  const handleStripToken = async ()=>{
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axios.get(`/api/orders/${orderID}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });

      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: error });
    }
  }


  return (
    <React.Fragment>
      <Container>
        {loading ? (
          <h2>Loading Order..........</h2>
        ) : error ? (
          <Alert>{error}</Alert>
        ) : (
          <div>
            <Alert>
              <h3>This Is Customer Order Number : {orderID} </h3>
            </Alert>
            <Row>
              <Col lg={8}>
                <Card>
                  <Card.Body>
                    <Card.Title>Shipping</Card.Title>
                    <Card.Text>
                      <b>Name : </b>{" "}
                      {order.shippingAddress && order.shippingAddress.fullName}{" "}
                      <br />
                      <b>Address : </b>{" "}
                      {order.shippingAddress && order.shippingAddress.address}{" "}
                      <br />
                      <b>City : </b>{" "}
                      {order.shippingAddress && order.shippingAddress.city}{" "}
                      <br />
                      <b>Country : </b>{" "}
                      {order.shippingAddress && order.shippingAddress.country}{" "}
                      <br />
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Body>
                    <Card.Title>Payment Method</Card.Title>
                    <Card.Text>{order && order.paymentMethod}</Card.Text>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <Card.Title>Ordered Items</Card.Title>
                    <Card.Text>
                      <ListGroup>
                        {order.orderItems &&
                          order.orderItems.map((item, index) => (
                            <ListGroup.Item key={index}>
                              <Row>
                                <Col lg={3}>
                                  <Link to={`/products/${item.slug}`}>
                                    <img
                                      className="w-50"
                                      src={item.img}
                                      alt=""
                                    />
                                    {item.name}
                                  </Link>
                                </Col>

                                <Col lg={3}>{item.price}</Col>
                              </Row>
                            </ListGroup.Item>
                          ))}
                      </ListGroup>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>
                      <h3>Order Summery</h3>
                    </Card.Title>
                    <Card.Text>
                      <Row>
                        <Col>Products Price</Col>
                        <Col>$ {order.productPrice}</Col>
                      </Row>
                      <Row>
                        <Col>Shipping Charges</Col>
                        <Col>$ {order.shippingPrice}</Col>
                      </Row>
                      <Row>
                        <Col>Tax Amount</Col>
                        <Col>$ {order.taxAmount}</Col>
                      </Row>
                      <Dropdown.Divider />
                      <Row>
                        <Col>
                          {" "}
                          <b>Total Price</b>
                        </Col>
                        <Col>$ {order.totalPrice}</Col>
                      </Row>
                      <Row>
                        <h3>Payment Gateway</h3>
                        {!order.isPaid && isPending ? (
                          <h3>Loading.........</h3>
                        ) : (
                          <Col>
                          {order.paymentMethod === 'paypal' && 
                            <PayPalButtons
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}
                            ></PayPalButtons>
                          }
                          {order.paymentMethod ==='strip' &&
                            <StripeCheckout
                            token={handleStripToken}
                            stripeKey='pk_test_51KrIb8BTuoT2QIWoqn6nsqlRbWAGh53EBwsoVcEWPC9Rj95NFsbSopQXGj5KKauFF0YHzi8ch1gZ9GHlRQAdjkpG00Yye305Th'
                            panelLabel='Payment'
                            currency='USD'
                            amount={order.totalPrice* 100}
                            />
                          }
                          </Col>
                        )}
                        {loadingPay && <h3>Payment Loading...</h3>}
                      </Row>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </React.Fragment>
  );
};

export default Order;

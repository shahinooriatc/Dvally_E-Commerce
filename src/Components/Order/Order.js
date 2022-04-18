import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Store } from "../../Store";

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

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    order: {},
  });

  const { stateUserSignIn } = useContext(Store);
  const { userInfo } = stateUserSignIn;

  const params = useParams();
  const { id: orderID } = params;

  useEffect(() => {
    if (!order._id || (order._id && order._id !== orderID)) {
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
    }
  }, [order, userInfo, orderID, navigate]);

  console.log(order);

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
                    <Button variant="primary">Go somewhere</Button>
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
                    <Card.Title>Orderd Items</Card.Title>
                    <Card.Text>
                      <ListGroup>
                        {order.orderItems &&
                          order.orderItems.map((item) => (
                            <ListGroup.Item>
                              <Row>
                                <Col lg={3}>
                                  <img className="w-50" src={item.img} alt="" />
                                </Col>
                                <Col lg={6}>
                                  <Link to={`/products/${item.slug}`}>
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

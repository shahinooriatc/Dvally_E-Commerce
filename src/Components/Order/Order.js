import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Alert, Button, Card, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../../Store";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return { state };
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
  console.log(params);
  console.log(orderID);

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


  return (
    <React.Fragment>
      <Container>
        {loading ? (
          <h2>Loading Order..........</h2>
        ) : error ? (
          <Alert>{error}</Alert>
        ) : (
          <div>
            <h3>Order{orderID} </h3>
            <Card>
              <Card.Body>
                <Card.Title>Shipping</Card.Title>
                <Card.Text>order.shippingAddress.fullName</Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>
    </React.Fragment>
  );
};

export default Order;

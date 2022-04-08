import React, { useContext } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Row,
  Table,
} from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";

const CartPage = (props) => {
  
  let navigate = useNavigate();

  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  let handleUpdateCartItem = (item, quantity) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, quantity },
    });
  };

  let handleRemoveItem = (item) => {
    dispatch({
      type: "REMOVE_ITEM_FROM_CART",
      payload: item,
    });
  };

  const handleCheckOut = () => {
    navigate("/login?redirect=/shipping");
  };


  let totalOrders =  cartItems.reduce((accumulator, current) => accumulator + current.quantity,    0  )
  let totalAmount = cartItems.reduce((accumulator, current) =>accumulator + current.price * current.quantity,0);
  let totalTax = totalAmount> 300 ? ((totalAmount*10)/100):10;
  let shippingCharge = totalAmount> 300 ? ((totalAmount*5)/100):25;
  let grandTotal = (totalAmount+totalTax+shippingCharge).toFixed(2)
  return (
    <>
      <Helmet title="Shopping Cart" />

      <Container>
        {cartItems.length <= 0 ? (
          <Alert className="text-center p-5 mt-3" variant="danger">
            Your Cart is empty
          </Alert>
        ) : (
          <Row>
            <Col lg={props.placeOrderPage ? 12 : 8}>
             {props.placeOrderPage?
              <Alert className="text-center">
                <h3>Preview Order</h3>
              </Alert>
                         :
              <Alert className="text-center">
                <h3>Your Ordered Cart</h3>
              </Alert>
            
             }
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th></th>
                  </tr>
                </thead>
                {cartItems.map((item) => (
                  <tbody key={item._id}>
                    <tr>
                      <td>
                        <Link to={`/products/${item.slug}`}>
                          <img src={item.img} style={{ height: "50px" }} />{" "}
                          <Badge>${item.price}/-</Badge>
                        </Link>
                      </td>
                      <td>
                        <Link to={`/products/${item.slug}`}>{item.name}</Link>
                      </td>
                      <td>
                        <Button
                          onClick={() =>
                            handleUpdateCartItem(item, item.quantity - 1)
                          }
                          variant="outline-danger"
                          disabled={item.quantity === 1}
                        >
                          <BsFillCaretLeftFill />
                        </Button>
                        <span>
                          {" "}
                          <Badge size="lg" className="p-2 mx-2">
                            {item.quantity}
                          </Badge>
                        </span>
                        <Button
                          onClick={() =>
                            handleUpdateCartItem(item, item.quantity + 1)
                          }
                          variant="outline-success"
                          disabled={item.quantity === item.stock}
                        >
                          <BsFillCaretRightFill />
                        </Button>
                      </td>
                      <td>
                        <Button
                          onClick={() => handleRemoveItem(item)}
                          variant="danger"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </Table>
            </Col>

            <Col lg={4}>
              
              <Alert>
              <h3>Order Details</h3>
              </Alert>
              <h5>Product Order :{cartItems.length} </h5>
              <h5>
                Total Order : {totalOrders}
              </h5>
              <h5>
                Total Amount : $   {totalAmount}/-                
              </h5>
              <p>Tax(Vat) : {totalTax} </p>
              <p>Shipping Charge : {shippingCharge} </p>
              <hr />
              <h4>Grand Total : ${grandTotal} /-</h4>
              <Button
                onClick={handleCheckOut}
                className={
                  props.placeOrderPage ? "d-none" : "btn btn-info w-100"
                }
                size="lg"
              >
                Process To CheckOut
              </Button>
            </Col>
            <Col></Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default CartPage;

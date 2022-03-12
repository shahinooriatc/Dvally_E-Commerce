import React from "react";
import "./ProductDetails.css";
import { Alert, Badge, Button, Card, Col, Container, Form, ListGroup, ListGroupItem, Row, } from "react-bootstrap";
import { useEffect, useReducer, useContext, useState } from "react";
import axios from "axios";
import Rating from "../Products/Rating";
import { Link, useNavigate, useParams } from "react-router-dom";
// import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
// import InnerImageZoom from 'react-inner-image-zoom';
import { Helmet } from 'react-helmet-async';
import { Store } from "../../Store";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const ProductDetails = () => {
  const navigate = useNavigate()
  let params = useParams()

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    product: [],
  });
  const [similerProduct, setSimilerProduct] = useState([])

  useEffect(() => {
    const loadSingleProduct = async () => {
      dispatch({ type: "FETCH_REQUEST" })
      try {
        const products = await axios.get(`/products/${params.slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: products.data })
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    }
    loadSingleProduct()
  }, [params.slug])

  useEffect(() => {
    const sameProduct = async () => {
      const allProducts = await axios.get("/products")
      let similerItem = allProducts.data.filter((sameItem) => sameItem.category == product.category && sameItem.name !== product.name)
      setSimilerProduct(similerItem);
    }
    sameProduct()
  }, [product])

  //Product Cart Here.........
  const { state, dispatch: contDispatch } = useContext(Store)
  const { cart } = state

  let handleAddToCart = async () => {
    const existingItem = cart.cartItems.find((item) => item._id == product._id)
    const quantity = existingItem ? existingItem.quantity + 1 : 1
    const { data } = await axios.get(`/productcart/${product._id}`)
    if (data.stock < quantity) {
      window.alert(`${product.name} out of stock`)
      return
    }
    contDispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, price: afterCouponCodePrice ? afterCouponCodePrice : product.price, quantity }
    })
    navigate(`/productcart`)
  }

  const [couponCode, setCouponCode] = useState('')
  const [errCouponCode, setErrCouponCode] = useState('')
  const [afterCouponCodePrice, setAfterCouponCodePrice] = useState('')
  const handleCouponMatch = (e) => {
    setCouponCode(e.target.value);
    setErrCouponCode('')
  }

  const handleApplyCoupon = () => {
    if (couponCode == product.coupon) {
      let discountValue = (product.price * product.discount) / 100
      let afterDiscountValue = product.price - discountValue
      if (product.discountlimit > 40) {
        setErrCouponCode('Please Coupon Code Are Not Available For This Product')
      } else {
        setAfterCouponCodePrice(afterDiscountValue)
      }
    } else {
      setErrCouponCode('Please Enter Valid Coupon Code')
    }

  }

  return (
    <>
      <Container>
        <Helmet title={product.name} />
        {
          product ?
            <Row className="mt-3">
              <Col md={5}>
                {product.img && <img src={product.img} alt="" />
                  // <InnerImageZoom src={product.img} zoomSrc={product.img} zoomType="hover" zoomScale={5} width='100%' />
                }
              </Col>
              <Col md={5}>

                <Card className="text-center">
                  <Card.Header>
                    <h4>{product.name}
                    </h4>
                    {product.stock <= 0 ?
                      <Badge bg="danger">Available : {product.stock}</Badge>
                      :
                      <Badge>Available : {product.stock}</Badge>
                    }
                  </Card.Header>
                  <Card.Body>
                    <Card.Header>
                      <h5>Price : $
                        {afterCouponCodePrice ?
                          <del style={{ textDecoration: 'line-through' }}>{product.price}</del>
                          :
                          <span>{product.price}</span>
                        }
                        <br />
                        After Discount : $
                        {afterCouponCodePrice}/-
                      </h5></Card.Header>
                    <ListGroupItem>
                      Rating :
                      <small>
                        <Rating rating={product.rating} totalrating={product.totalrating} />
                      </small>
                    </ListGroupItem>
                    <Card.Text>{product.available}</Card.Text>
                    <Card.Text>{product.description}</Card.Text>

                    <Link to={""}>
                      {product.stock == 0 ?
                        <Button disabled variant="danger">Out Of Stock</Button>
                        :
                        <Button onClick={handleAddToCart} variant="primary">Add to cart</Button>
                      }
                    </Link>
                  </Card.Body>
                  <Form>
                    <Form.Group >
                      <Form.Control onChange={handleCouponMatch} type="text" placeholder="Apply Coupon Code" />
                      {couponCode ?
                        errCouponCode ?
                          <Button className='my-2' variant='danger' disabled>{errCouponCode}</Button>
                          : afterCouponCodePrice ?
                            <Button className='my-2' variant='success' disabled>Coupon Code Applied Successfully</Button>
                            :
                            <Button className='my-2' onClick={handleApplyCoupon}>Apply Coupon</Button>
                        :
                        ''
                      }
                    </Form.Group>

                  </Form>

                </Card>
              </Col>

              <Col md={2}>
                <Card style={{ width: "18rem" }}>
                  <Card.Body>
                    <Card.Title>Product Cart</Card.Title>
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroupItem>
                      Total Product : <span>12</span>
                    </ListGroupItem>
                    <ListGroupItem>
                      Sub-Total  : <span>1122</span>/-
                    </ListGroupItem>
                    <ListGroupItem>
                      Vat (5%) :  <span>10</span>/-
                    </ListGroupItem>
                    <Card.Title>Total Price : <span>18521</span>/-</Card.Title>
                  </ListGroup>
                  <Card.Body>
                    <Link to="/">
                      <Button> Place Order</Button>
                    </Link>
                    <Link to="/">
                      <Button>Continue Shopping </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            :
            <Alert className="text-center mt-3" variant='danger'>
              There is no product available
            </Alert>
        }
        <hr />
        <Row>
          <h3>Similar Products</h3>
          {
            similerProduct.length > 0 ?
              similerProduct.map(item => (
                <Col key={item._id} md={2} style={{ textAlign: 'center' }}>
                  <img src={item.img} />
                  <h4> Price :{item.price}</h4>
                  <Link to={`/products/${item.slug}`}>
                    <h5>{item.name}</h5>
                  </Link>
                </Col>

              ))
              :
              <Alert className="text-center mt-3" variant='danger'>
                There is no Similer Product  available
              </Alert>

          }

        </Row>
      </Container>
    </>
  );
};

export default ProductDetails;

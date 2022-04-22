import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Badge,
  Table,
  Modal,
  ListGroupItem,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import "./Products.css";
import Rating from "./Rating";
import { Helmet } from "react-helmet-async";
import { Store } from "../../Store";
// import InnerImageZoom from "react-inner-image-zoom";
import { BsFillHeartFill } from "react-icons/bs";

function loadProducts(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const Products = () => {
  const [{ loading, error, products }, dispatch] = useReducer(loadProducts, {
    loading: false,
    error: "",
    products: [],
  });

  useEffect(() => {
    const loadProducts = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const products = await axios.get("/products");
        dispatch({ type: "FETCH_SUCCESS", payload: products.data });
      } catch (error) {
        dispatch({ type: "FETCH_SUCCESS", payload: error.message });
      }
    };
    loadProducts();
  }, []);

  //Product Cart Here.........
  const {
    state,
    dispatch: contDispatch,
    stateWish,
    dispatchWish,
  } = useContext(Store);
  const { cart } = state;


  let handleAddToCart = async (product) => {
    const existingItem = cart.cartItems.find((item) => item._id === product._id);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    const { data } = await axios.get(`/productcart/${product._id}`);
    if (data.stock < quantity) {
      window.alert(`${product.name} out of stock`);
      return;
    }

    contDispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity },
    });
    handleRemoveItemFromWish(product);
  };

  //Product Details Modal Here............
  const [details, setDetails] = useState({});
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDetails = async (detail) => {
    handleShow(true);
    const detailProduct = await axios.get(`/products/${detail}`);
    setDetails(detailProduct.data);
  };

  //Product WishList Here.........
  const handleAddToWish = (product) => {
    
    dispatchWish({
      type: "ADD_TO_WISH",
      payload: { ...product },
    });
  };

  //Product Cart Increase & Decrease Here.........
  let handleUpdateCartItem = (item, quantity) => {
    contDispatch({
      type: "ADD_TO_CART",
      payload: { ...item, quantity },
    });
  };

  let handleRemoveItem = (items) => {
    contDispatch({
      type: "REMOVE_ITEM_FROM_CART",
      payload: items,
    });
  };

  let handleRemoveItemFromWish = (product) => {
    dispatchWish({
      type: "REMOVE_ITEM_FROM_WISH",
      payload: product,
    });
  };

  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <>
      <Helmet title="Products"></Helmet>
      <Container>
        <Form>
          <Form.Group className="my-1">
            <Form.Control
              onChange={handleSearch}
              bg="info"
              type="text"
              placeholder="Search Product"
            />
          </Form.Group>
        </Form>
        <Row>
          {loading ? (
            <div className="loader">
              <Spinner animation="grow" />
            </div>
          ) : (
            products
              .filter((item) => {
                if (searchText === "") {
                  return item;
                } else if (
                  item.name.toLowerCase().includes(searchText.toLowerCase())
                ) {
                  return item;
                } else if (
                  item.category.toLowerCase().includes(searchText.toLowerCase())
                ) {
                  return item;
                } else if (
                  item.description
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                ) {
                  return item;
                }
              })
              .map((item) => (
                <Col
                  key={item._id}
                  lg={3}
                  style={{ marginTop: "10px", height: "505px" }}
                >
                  <Card>
                    <Card.Img
                      className="productImg"
                      variant="top"
                      src={item.img}
                    />

                    <Card.Body className="text-center">
                      <Link
                        to={`/products/${item.slug}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Card.Header>
                          {item.name}
                          {item.totalsale > 75 ? (
                            <Badge bg="danger"> Best Seller</Badge>
                          ) : (
                            ""
                          )}
                        </Card.Header>
                      </Link>

                      <Card.Title style={{ color: "goldenRod" }}>
                        <Rating
                          rating={item.rating}
                          totalrating={item.totalrating}
                        />
                      </Card.Title>
                      <Card.Title>
                        <h5>$ {item.price}/-</h5>
                      </Card.Title>

                      <Table striped bordered hover>
                        {cart.cartItems.map((items) =>
                          items._id === item._id ? (
                            <tbody key={items._id}>
                              <tr>
                                <td>
                                  <Button
                                    onClick={() =>
                                      handleUpdateCartItem(
                                        items,
                                        items.quantity - 1
                                      )
                                    }
                                    variant="outline-danger"
                                    disabled={items.quantity === 1}
                                  >
                                    -
                                  </Button>
                                  <Badge>
                                    <span style={{ margin: "5px" }}>
                                      {items.quantity}
                                    </span>
                                  </Badge>
                                  <Button
                                    onClick={() =>
                                      handleUpdateCartItem(
                                        items,
                                        items.quantity + 1
                                      )
                                    }
                                    variant="outline-success"
                                    disabled={items.quantity === item.stock}
                                  >
                                    +
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    onClick={() => handleRemoveItem(items)}
                                    variant="danger"
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          ) : (
                            ""
                          )
                        )}
                      </Table>

                      {item.stock <= 0 ? (
                        <>
                          <Button
                            variant="danger"
                            disabled
                            className="mt-1 w-50"
                          >
                            Out Of Stock
                          </Button>
                          <Button
                            onClick={() => handleDetails(item.slug)}
                            variant="outline-info"
                            className="mt-1 "
                          >
                            Details
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={() => handleAddToWish(item)}
                          >
                            <BsFillHeartFill />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => handleAddToCart(item)}
                            className="mt-1 w-50"
                          >
                            Add to Cart
                          </Button>
                          <Button
                            onClick={() => handleDetails(item.slug)}
                            variant="outline-info"
                            className="mt-1"
                          >
                            Details
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={() => handleAddToWish(item)}
                          >
                            <BsFillHeartFill />
                          </Button>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))
          )}
        </Row>

        {/* // THis is Modal section................ */}
        {details ? (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{details.name}</Modal.Title>
              <Card.Header>
                {details.stock <= 0 ? (
                  <Badge bg="danger">Available : {details.stock}</Badge>
                ) : (
                  <Badge>Available : {details.stock}</Badge>
                )}
              </Card.Header>
            </Modal.Header>
            <Modal.Body>
              <Row className="mt-3">
                <Col md={6} className="w-100">
                  <img src={details.img} alt="" />

                  {/* <InnerImageZoom src={details.img} zoomSrc={details.img} zoomType="hover" zoomScale={4} width="100%" /> */}
                </Col>
                <Col md={12}>
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Header>
                        <h5>Price : ${details.price}/-</h5>
                      </Card.Header>
                      <ListGroupItem>
                        Rating :
                        <small>
                          <Rating
                            rating={details.rating}
                            totalrating={details.totalrating}
                          />
                        </small>
                      </ListGroupItem>
                      <Card.Text>{details.available}</Card.Text>
                      <Card.Text>{details.description}</Card.Text>

                      <Link to={""}>
                        {details.stock <= 0 ? (
                          <>
                            <Button variant="danger" disabled className="mt-1">
                              Out Of Stock
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleAddToCart(details)}
                            variant="primary"
                          >
                            Add to cart
                          </Button>
                        )}
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={12}>
                  <Card>
                    <Card.Body>
                      <Link to="/">
                        <Button variant="info" className="w-50">
                          Continue Shopping{" "}
                        </Button>
                      </Link>
                      <Link to="/" className="w-100">
                        <Button variant="outline-primary" className="w-50">
                       
                          Place Order
                        </Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        ) : (
          <h1>Product Details Are Not Available</h1>
        )}
      </Container>
    </>
  );
};

export default Products;

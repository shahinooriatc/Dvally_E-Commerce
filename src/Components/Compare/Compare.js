import React, { useState } from 'react';
import { Container, Row, Col, DropdownButton, Dropdown, Card, Form } from 'react-bootstrap';
import { Alert, Badge, Button, ListGroupItem, } from "react-bootstrap";
import { useEffect, useReducer, useContext } from "react";
import axios from "axios";
import Rating from "../Products/Rating";
import { Link, useNavigate, useParams } from "react-router-dom";
// import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
// import InnerImageZoom from 'react-inner-image-zoom';
import { Helmet } from 'react-helmet-async';
import { Store } from "../../Store";
import { BsFillHeartFill } from 'react-icons/bs';
import Compare from './Compare';

function reducer(state, action) {
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

const CompareProducts = () => {
    // let params = useParams()

    const [{ loading, error, products }, dispatch] = useReducer(reducer, {
        loading: false,
        error: "",
        products: [],
    });

    useEffect(async () => {
        dispatch({ type: "FETCH_REQUEST" });
        try {
            const products = await axios.get("/products");
            dispatch({ type: "FETCH_SUCCESS", payload: products.data });
        } catch (error) {
            dispatch({ type: "FETCH_SUCCESS", payload: error.message });
        }
    }, []);

    const [bestProduct, setBestProduct] = useState('')

    const [compare, setCompare] = useState({})
    let handleCompare = (item) => {
        setCompare(item)
    }

    const [compare2, setCompare2] = useState({})
    let handleCompare2 = (itm2) => {
        setCompare2(itm2)
    }



    // Product Cart Here.........
    //Product Cart Here.........
    const { state, dispatch: contDispatch } = useContext(Store)
    const { cart } = state

    let handleAddToCart = async (products) => {
        const existingItem = cart.cartItems.find((item) => item._id == products._id)
        const quantity = existingItem ? existingItem.quantity + 1 : 1
        const { data } = await axios.get(`/productcart/${products._id}`)
        if (data.stock < quantity) {
            window.alert(`${products.name} out of stock`)
            return
        }

        contDispatch({
            type: 'ADD_TO_CART',
            payload: { ...products, quantity }
        })
    }
    // searchProduct........................
    const [searchProduct, setSearchProduct] = useState('')
    const handleSearchProduct = (e) => {
        setSearchProduct(e.target.value)
    }
    const [searchProduct2, setSearchProduct2] = useState('')
    const handleSearchProduct2 = (e) => {
        setSearchProduct2(e.target.value)
    }



    return (
        <>
            <Helmet title={products.name} />
            <Container>
                <div>
                    <h3>Compare Between Two Or More Product</h3><hr />
                </div>
                <Row>
                    <Col lg={6}>
                        <Form>
                            <Form.Group className="my-1">
                                <Form.Control onChange={handleSearchProduct} bg='info' type="text" placeholder="Search Product" />
                            </Form.Group>
                        </Form>
                        <DropdownButton id="dropdown-basic-button" title="First Short List">
                            <Dropdown.Menu href="#/action-1" title="Dropdown" >
                                {products.filter((item) => {
                                    if (searchProduct == '') {
                                        return item
                                    } else if (item.name.toLowerCase().includes(searchProduct.toLowerCase())) {
                                        return item
                                    } else if (item.category.toLowerCase().includes(searchProduct.toLowerCase())) {
                                        return item
                                    }
                                    else if (item.description.toLowerCase().includes(searchProduct.toLowerCase())) {
                                        return item
                                    }
                                }).map((item) => (
                                    <Dropdown.Item key={item._id} onClick={() => handleCompare(item)}>
                                        <img src={item.img} style={{ width: 50 }} />
                                        {item.name} </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </DropdownButton>

                        {compare ?

                            <Row className="mt-3">
                                <Col md={7}>
                                    <img src={compare.img} alt="" />
                                    {/* <InnerImageZoom src={compare.img} zoomSrc={compare.img} zoomType="hover" zoomScale={4} width="100%" /> */}
                                </Col>
                                <Col md={11}>
                                    {compare.name ?
                                        <Card className="text-center">
                                            <Card.Header>
                                                <h4>{compare.name}
                                                </h4>
                                                {compare.stock <= 0 ?
                                                    <Badge bg="danger">Available : {compare.stock}</Badge>
                                                    :
                                                    <Badge>Available : {compare.stock}</Badge>
                                                }
                                            </Card.Header>

                                            <Card.Body>
                                                <Card.Header>
                                                    <h5>
                                                        Price : ${compare.price}/-
                                                    </h5></Card.Header>
                                                <ListGroupItem>
                                                    Rating :
                                                    <small>
                                                        <Rating rating={compare.rating} totalrating={compare.totalrating} />
                                                    </small>
                                                </ListGroupItem>
                                                <Card.Text>{compare.available}</Card.Text>
                                                <Card.Text>{compare.description}</Card.Text>

                                                <Link to={""}>
                                                    {compare.stock <= 0 ?
                                                        <>
                                                            <Button variant='danger' disabled className='mt-1 w-50'>Out Of Stock</Button>
                                                        </>
                                                        :
                                                        <>
                                                            <Button onClick={() => handleAddToCart(compare)} className='mt-1 w-50'>Add to Cart</Button>
                                                        </>
                                                    }
                                                </Link>
                                            </Card.Body>
                                            {compare && compare2 ?
                                                compare.price > compare2.price || compare.rating > compare2.rating ?
                                                    compare.price > compare2.price && compare.rating > compare2.rating ?
                                                        <h4>
                                                            <Badge bg='info'>{compare.name} is Best Deal for You</Badge>
                                                        </h4>
                                                        : ''
                                                    : ''
                                                :
                                                ""
                                            }
                                        </Card>
                                        :
                                        <Alert className="text-center mt-3" variant='danger'>
                                            There is no product Selected for Compare
                                        </Alert>
                                    }
                                </Col>
                            </Row>
                            :
                            <Alert className="text-center mt-3" variant='danger'>
                                There is no product available
                            </Alert>
                        }
                    </Col>

                    <Col lg={6}>
                        <Form>
                            <Form.Group className="my-1">
                                <Form.Control onChange={handleSearchProduct2} bg='info' type="text" placeholder="Search Product" />
                            </Form.Group>
                        </Form>
                        <DropdownButton id="dropdown-basic-button" title="Second Short List">
                            <Dropdown.Menu href="#/action-2">
                                {products.filter((item) => {
                                    if (searchProduct2 == '') {
                                        return item
                                    } else if (item.name.toLowerCase().includes(searchProduct2.toLowerCase())) {
                                        return item
                                    } else if (item.category.toLowerCase().includes(searchProduct2.toLowerCase())) {
                                        return item
                                    }
                                    else if (item.description.toLowerCase().includes(searchProduct2.toLowerCase())) {
                                        return item
                                    }
                                }).map((itm2) => (
                                    <Dropdown.Item key={itm2._id} onClick={() => handleCompare2(itm2)}>
                                        <img src={itm2.img} style={{ width: '50px' }} />
                                        {itm2.name} </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </DropdownButton>

                        {compare2 ?
                            <Row className="mt-3">
                                <Col md={7}>
                                    <img src={compare2.img} alt="" />
                                    {/* <InnerImageZoom src={compare2.img} zoomSrc={compare2.img} zoomType="hover" zoomScale={4} width="100%" /> */}
                                </Col>
                                <Col md={11}>
                                    {compare2.name ?
                                        <Card className="text-center">
                                            <Card.Header>
                                                <h4>{compare2.name}
                                                </h4>
                                                {compare2.stock <= 0 ?
                                                    <Badge bg="danger">Available : {compare2.stock}</Badge>
                                                    :
                                                    <Badge>Available : {compare2.stock}</Badge>
                                                }
                                            </Card.Header>

                                            <Card.Body>
                                                <Card.Header>
                                                    <h5>
                                                        Price : ${compare2.price}/-
                                                    </h5></Card.Header>
                                                <ListGroupItem>
                                                    Rating :
                                                    <small>
                                                        <Rating rating={compare2.rating} totalrating={compare2.totalrating} />
                                                    </small>
                                                </ListGroupItem>
                                                <Card.Text>{compare2.available}</Card.Text>
                                                <Card.Text>{compare2.description}</Card.Text>

                                                <Link to={""}>
                                                    {/* <Button onClick={handleAddToCart} variant="primary">Add to cart</Button> */}

                                                    {compare2.stock <= 0 ?
                                                        <>
                                                            <Button variant='danger' disabled className='mt-1 w-50'>Out Of Stock</Button>
                                                        </>
                                                        :
                                                        <>
                                                            <Button onClick={() => handleAddToCart(compare2)} className='mt-1 w-50'>Add to Cart</Button>
                                                        </>
                                                    }
                                                </Link>
                                            </Card.Body>
                                            {compare && compare2 ?
                                                compare.rating < compare2.rating || compare.price < compare2.price ?
                                                    compare2.price < compare.price && compare2.rating > compare.rating ?
                                                        <h4>
                                                            <Badge bg='info'>{compare2.name} is Best Deal for You</Badge>
                                                        </h4>
                                                        : ''
                                                    : ''
                                                :
                                                ""
                                            }

                                        </Card>
                                        :
                                        <Alert className="text-center mt-3" variant='danger'>
                                            There is no product Selected for Compare
                                        </Alert>
                                    }
                                </Col>
                            </Row>
                            :
                            <Alert className="text-center mt-3" variant='danger'>
                                There is no product available
                            </Alert>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default CompareProducts;
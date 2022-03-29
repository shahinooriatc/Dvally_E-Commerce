import axios from 'axios';
import React, { useContext } from 'react';
import { Alert, Badge, Button, Col, Container, Row, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, } from 'react-router-dom';
import { Store } from '../../Store';


const WishList = () => {
    //Product Cart Here.........
    const { stateWish, dispatchWish } = useContext(Store)
    const { wish: { wishItems } } = stateWish;

    //Product Cart Here.........
    const { state, dispatch: contDispatch } = useContext(Store)
    const { cart } = state

    let handleAddToCartFromWish = async (product) => {
        handleRemoveItem(product)
        const existingItem = cart.cartItems.find((item) => item._id === product._id)
        const quantity = existingItem ? existingItem.quantity + 1 : 1
        // const { data } = await axios.get(`/productcart/${product._id}`)
        // if (data.stock < quantity) {
        //     window.alert(`${product.name} out of stock`)
        //     return
        // }
        contDispatch({
            type: 'ADD_TO_CART',
            payload: { ...product, quantity }
        })
    }

    let handleRemoveItem = (item) => {
        dispatchWish({
            type: 'REMOVE_ITEM_FROM_WISH',
            payload: item
        })
    }

    return (
        <>
            <Helmet title="Shopping Cart" />

            <Container>
                {wishItems.length <= 0 ?
                    <Alert className='text-center p-5 mt-3' variant='danger'>
                        Your WishList is empty
                    </Alert>
                    :

                    <Row>
                        <Col lg={8}>
                            <h3>Your Added WishList</h3><hr />
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                        <th>Operation</th>
                                    </tr>
                                </thead>
                                {wishItems.map(item => (
                                    <tbody key={item._id}>
                                        <tr>
                                            <td>
                                                <Link to={`/products/${item.slug}`}>
                                                    <img src={item.img} style={{ height: '50px' }} /> <Badge >${item.price}/-</Badge>
                                                </Link>
                                            </td>
                                            <td>
                                                <Link to={`/products/${item.slug}`}>{item.name}</Link>
                                            </td>
                                            <td>
                                                <Button onClick={() => handleRemoveItem(item)} variant="danger">Delete</Button>
                                            </td>
                                            <td>
                                                <span> <Badge size="lg" className='p-2 mx-2' >{item.quantity}</Badge></span>
                                                <Button onClick={() => handleAddToCartFromWish(item)} variant="outline-primary" >Add to cart</Button>
                                            </td>

                                        </tr>
                                    </tbody>
                                ))}
                            </Table>

                        </Col>

                        {/* <Col lg={4}>
                            <h3>Total Cart</h3><hr />
                            <h5>Product Order :{cartItems.length} </h5>
                            <h5>Total Order :({cartItems.reduce((accumulator, current) => accumulator + current.quantity, 0)}) </h5>
                            <h5>Total Amount :({cartItems.reduce((accumulator, current) => accumulator + current.price * current.quantity, 0)}) </h5>
                            <p>Tax(Vat) : </p>
                            <p>Shipping Charge : </p>
                            <hr />
                            <h4>Grand Total : </h4>
                           
                        </Col> */}
                        <Col>


                        </Col>
                    </Row>
                }

            </Container>
        </>
    );
};

export default WishList;
import { useContext, useState } from 'react';
import { Badge, Container, Dropdown, Nav, Navbar, NavDropdown, Offcanvas, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavSection.css';
import { Store } from '../../Store';
import { Button } from 'react-bootstrap';
import { BsCart4, BsFillCaretLeftFill, BsFillCaretRightFill, BsXLg, } from "react-icons/bs";


const NavSection = () => {
    const { state, dispatch, stateWish, dispatchWish } = useContext(Store)
    const { cart } = state;
    const { cart: { cartItems } } = state;
    const { wish: { wishItems } } = stateWish;

    let handleUpdateCartItem = (item, quantity) => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: { ...item, quantity }
        })
    }

    let handleRemoveItem = (item) => {
        dispatch({
            type: 'REMOVE_ITEM_FROM_CART',
            payload: item
        })
    }

    let handleRemoveItemWish = (item) => {
        dispatchWish({
            type: 'REMOVE_ITEM_FROM_WISH',
            payload: item
        })
    }

    const handleAddToCartFromWish = (product) => {
        handleRemoveItemWish(product)
        const existingItem = cart.cartItems.find((item) => item._id == product._id)
        const quantity = existingItem ? existingItem.quantity + 1 : 1

        dispatch({
            type: 'ADD_TO_CART',
            payload: { ...product, quantity }
        })
    }

    // SideCart Functions.......................
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    return (
        <>
            <Navbar bg="dark" variant="dark" >
                <Container>
                    <Navbar.Brand href="/">Dvally</Navbar.Brand>
                    <Nav className="ms-auto navmenu">
                        <Navbar to="">
                            <Link to="/">Home</Link>
                            <Link to="/products">Products</Link>
                            <Link to="/compare">Compare</Link>
                        </Navbar>
                        <NavDropdown title='Cart' id='basic-nav-dropdown'>

                            {cartItems.map(item => (
                                <tbody key={item._id}>
                                    <tr>
                                        <td>
                                            <Link to={`/products/${item.slug}`}>
                                                <img src={item.img} style={{ height: '30px' }} />
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/products/${item.slug}`} style={{ color: 'blue' }}>{item.name}</Link>
                                        </td>
                                        <td className="td-buttons">
                                            <Button onClick={() => handleUpdateCartItem(item, item.quantity - 1)} variant="outline-danger" disabled={item.quantity === 1} >-</Button>
                                            <span> <Badge size="lg" className='p-1 mx-0' >{item.quantity}</Badge></span>
                                            <Button onClick={() => handleUpdateCartItem(item, item.quantity + 1)} variant="outline-success" disabled={item.quantity == item.stock}>+</Button>
                                        </td>
                                        <td>
                                            <Button onClick={() => handleRemoveItem(item)} variant="danger"><BsXLg size='1em' /></Button>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                            <Dropdown.Divider />
                            <Link to={"/productcart"}>
                                <Button className="btn btn-info w-100">Go to Cart</Button>
                            </Link>
                        </NavDropdown>
                        <Link to="/productcart">
                            {state.cart.cartItems.length > 0 &&
                                (<Badge style={{ borderRadius: '50%', }} bg='danger'>{state.cart.cartItems.length}</Badge>)
                            }
                        </Link>

                        {/* //======================WishList=============================== */}

                        <NavDropdown title='WishList' id='basic-nav-dropdown'>
                            {wishItems.map(item => (
                                <tbody key={item._id}>
                                    <tr>
                                        <td>
                                            <Link to={`/products/${item.slug}`}>
                                                <img src={item.img} style={{ height: '30px' }} />
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/products/${item.slug}`} style={{ color: 'blue' }}>{item.name}</Link>
                                        </td>
                                        <td className="td-buttons">
                                            <span> <Badge size="lg" className='p-1 mx-0' >{item.quantity}</Badge></span>
                                        </td>
                                        <td>
                                            <Button onClick={() => handleRemoveItemWish(item)} variant="danger" className='mt-1'><BsXLg size='1em' /></Button>
                                            <Button onClick={() => handleAddToCartFromWish(item)} variant="info" className='ms-2'>Add to cart</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                            <Dropdown.Divider />
                            <Link to={"/wishlist"}>
                                <Button className="btn btn-info w-100">Go to WishList</Button>
                            </Link>
                        </NavDropdown>
                        <Link to="/wishlist">
                            {stateWish.wish.wishItems.length > 0 &&
                                (<Badge style={{ borderRadius: '50%', }} bg='danger'>{stateWish.wish.wishItems.length}</Badge>)
                            }
                        </Link>
                    </Nav>
                </Container>
            </Navbar>


            {/* ----------------------Side Cart----------------------  */}
            <Button variant="outline-warning" onClick={handleShow} className="me-2 sidecart">
                <BsCart4 size='2em'/>
            </Button>
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>All Products In Cart</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Table striped bordered hover>
                        {cartItems.map(item => (
                            <tbody key={item._id}>
                                <tr>
                                    <td>
                                        <Link to={`/products/${item.slug}`}>
                                            <img src={item.img} style={{ height: '50px' }} />
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/products/${item.slug}`} >{item.name}</Link>
                                    </td>
                                    <td>
                                        <Button onClick={() => handleUpdateCartItem(item, item.quantity - 1)} variant="outline-danger" disabled={item.quantity === 1} ><BsFillCaretLeftFill /></Button>
                                        <span style={{ margin: '2px' }}>
                                            <Badge>{item.quantity}</Badge>
                                        </span>
                                        <Button onClick={() => handleUpdateCartItem(item, item.quantity + 1)} variant="outline-success" disabled={item.quantity == item.stock}><BsFillCaretRightFill /></Button>
                                    </td>
                                    <td>
                                        <Button onClick={() => handleRemoveItem(item)} variant="danger"><BsXLg size='1em' /></Button>
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </Table>
                    <Dropdown.Divider />
                    <Link to={"/productcart"}>
                        <Button className="btn btn-info w-100">Go to Cart</Button>
                    </Link>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default NavSection;
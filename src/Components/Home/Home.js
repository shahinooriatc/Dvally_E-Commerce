import React from 'react';
import './Home.css'
import offerimg from '../../offer.jpg'
import { Helmet } from 'react-helmet-async';
import { BsArrowRight } from 'react-icons/bs';

import { Container, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { ListGroup, Modal } from 'react-bootstrap';
import axios from 'axios';
import CategoryWishProduct from './CategoryWishProduct.js';

const Home = () => {

    const [show, setShow] = useState(false);
    const [showDiscount, setShowDiscount] = useState('');
    const [allCategory, setAllCategory] = useState([]);
    const [separateCategory, setseparateCategory] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(() => {
        const handleCategoryMatch = async () => {
            const { data } = await axios.get('/discount')
            setShowDiscount(data);
            setShow(true)

            const allProduct = await axios.get('/products')
            let categoryArr = []
            allProduct.data.map((item) => {

                if (categoryArr.indexOf(item.category) == -1) {
                    categoryArr.push(item.category)
                }
            })
            setAllCategory(categoryArr)
            setseparateCategory(allProduct)
        }
        handleCategoryMatch()
    }, [])

    const handleLoadCategory = async (category) => {
        const categoryData = await axios.get(`/categories/${category}`)
        setseparateCategory(categoryData);
    }

    return (
        <>
            <Helmet title="Dvally" />
            <div className="banner" >

                <Container>
                    <div className='category' style={{ width: '300px', minHeigth: '500px' }}>
                        {allCategory.map((item, primary) => (
                            <ListGroup key={primary}>
                                <ListGroup.Item onClick={() => handleLoadCategory(item)}>{item}<BsArrowRight size='2em' /></ListGroup.Item>
                            </ListGroup>
                        ))
                        }
                    </div>


                    <Modal show={show} onHide={handleClose} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>BIGGEST OFFER</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <img src={offerimg} alt="" style={{ width: '100%' }} />
                        </Modal.Body>
                    </Modal>
                </Container>
            </div>
            <Container>
                <CategoryWishProduct category={separateCategory} />
            </Container>
        </>
    );
};

export default Home;
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { BsCurrencyDollar } from "react-icons/bs";
import registration from "../../registration.png";
import { Store } from "../../Store";
import CheckoutStep from "../CheckoutStep/CheckoutStep";
import { toast } from "react-toastify";
const Shipping = () => {
  const { stateUserSignIn, stateShipping, dispatchShipping } =
    useContext(Store);
  const navigate = useNavigate();
  const { userInfo } = stateUserSignIn;
  const [fullName, setFullName] = useState(
    stateShipping.shippingaddress.fullName || ""
  );
  const [address, setAddress] = useState(
    stateShipping.shippingaddress.address || ""
  );
  const [city, setCity] = useState(stateShipping.shippingaddress.city || "");
  const [postalcode, setPostalcode] = useState(
    stateShipping.shippingaddress.postalcode || ""
  );
  const [country, setCountry] = useState(
    stateShipping.shippingaddress.country || ""
  );

  const handleContinuePayment = (e) => {
    e.preventDefault();
    if (fullName && address && city && postalcode && country) {
      if (fullName !== address && city !== country) {
        dispatchShipping({
          type: "SHIPPING_ADDRESS",
          payload: {
            fullName,
            address,
            city,
            postalcode,
            country,
          },
        });
        localStorage.setItem(
          "shippingaddress",
          JSON.stringify({
            fullName,
            address,
            city,
            postalcode,
            country,
          })
        );
        navigate("/payment");
      } else {
        toast.error("Please Enter Valid Name & Address ");
      }
    } else {
      toast.error("All Input Fields are required!");
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=/shipping");
    }
  }, []);

  return (
    <>
      <Helmet title="Shipping" />
      <div style={{ height: "100vh", marginTop: "25px" }}>
        <CheckoutStep step1="true" step2="true" />
        <Container className="shadow" style={{ padding: "15px" }}>
          <Row>
            <Col xs={6}>
              <div style={{ textAlign: "center" }}>
                <Link to="/productcart">
                  <Button className="w-100">Back To Cart</Button>
                </Link>
                <h1 style={{ textAlign: "center", marginTop: "25px" }}>
                  User Shipping Address
                </h1>
              </div>
              {/* {errorMsg ?
                             <div className="alert alert-danger text-center" role="alert">
                                 {errorMsg}
                            </div>
                             :
                           ''
                         } */}
              {/* {successMsg ?
                             <div className="alert alert-success text-center" role="alert">
                                 {successMsg}
                             </div>
                             :
                             ''
                         } */}

              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Full Name"
                    name="Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="address"
                    placeholder="Enter Your Address"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="city"
                    placeholder="Enter City"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Postal Code </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Postal Code"
                    name="postalcode"
                    value={postalcode}
                    onChange={(e) => setPostalcode(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Country </Form.Label>
                  <Form.Control
                    type="country"
                    placeholder="Country"
                    name="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </Form.Group>

                <Button
                  style={{ width: "100%", padding: "10px" }}
                  type="submit"
                  onClick={handleContinuePayment}
                >
                  Continue
                  {/* {loading ?
                                     <Spinner animation="border" variant="warning" /> :
                                     "SignUp"
                                 } */}
                </Button>

                <Button
                  style={{
                    width: "49%",
                    backgroundColor: "#11648C",
                    padding: "10px",
                  }}
                  variant="outline-warning"
                  type="submit"
                  onClick={handleContinuePayment}
                >
                  Payment With Bank
                </Button>

                <Button
                  style={{ width: "49%", margin: "15px 0", padding: "10px" }}
                  variant="outline-info"
                  type="submit"
                >
                  Payment With Card
                </Button>
                <div
                  className="text-center border border-info alert alert-success"
                  style={{}}
                >
                  <h6>
                    Try Another Way !
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      {" "}
                      All Payment Gateway
                    </Link>
                  </h6>
                </div>
              </Form>
            </Col>

            <Col xs={6}>
              <img
                className="h-75 mt-5"
                src={registration}
                alt="Register Images"
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Shipping;

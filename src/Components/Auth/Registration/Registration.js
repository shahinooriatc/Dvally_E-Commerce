import React, { useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  BsFillLockFill,
  BsFillUnlockFill,
  BsEnvelopeFill,
  BsFilePerson,
  BsPersonPlus,
} from "react-icons/bs";
import registration from "../../../../src/registration.png";
import { toast } from "react-toastify";
import axios from "axios";

const Registration = () => {

    const navigate = useNavigate()
  const [name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
        const { data } = await axios.post("/api/user/registration", {
            name,
            email,
            password})
        navigate('/login',{state:'Please Login With Your Registered Email'})
    } catch (error) {
      if (!email && !password) {
        toast.error("Please Enter User name & Password");
      }
    }
  };
  return (
    <>
      <div style={{ height: "100vh", marginTop: "25px" }}>
        <Container className="shadow" style={{ padding: "15px" }}>
          <Row>
            <Col xs={6}>
              <div style={{ textAlign: "center" }}>
                <BsPersonPlus color="blue" fontSize="4em" />
                <h1 style={{ textAlign: "center", marginTop: "25px" }}>
                  User Registration
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
                  <BsFilePerson />
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter User Name"
                    name="userName"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <BsEnvelopeFill />
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <BsFillUnlockFill />
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <BsFillLockFill />
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    onChange={(e) =>setConfirmPassword(e.target.value)}

                  />
                </Form.Group>
                <Button
                  style={{ width: "100%", padding: "10px" }}
                  type="submit"
                  onClick={handleRegistration}
                >
                  {" "}
                  Sign Up
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
                >
                  Login with Google
                </Button>

                <Button
                  style={{ width: "49%", margin: "15px 0", padding: "10px" }}
                  variant="outline-info"
                  type="submit"
                >
                  Login with Facebook
                </Button>
                <div
                  className="text-center border border-info alert alert-success"
                  style={{}}
                >
                  <h6>
                    Already have an account !
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      {" "}
                      Login
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

export default Registration;

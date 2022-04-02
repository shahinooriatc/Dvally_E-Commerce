import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsFillUnlockFill, BsEnvelopeFill, BsPersonPlus } from "react-icons/bs";
import registration from "../../../registration.png";
import axios from "axios";
import { Store } from "../../../Store";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { search, state } = useLocation();
  const redirectUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectUrl ? redirectUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { stateUserSignIn, dispatchUserSignIn } = useContext(Store);
  const { userInfo } = stateUserSignIn;

  if(state){
    toast.success(state)
  }else{
    toast.error('Please Try to Register first!!')
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/signin", {
        email,
        password,
      });
      dispatchUserSignIn({
        type: "USER_SIGNIN",
        payload: data,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
      toast.success("Logged In Successfully Done");
    } catch (error) {
      if (!email && !password) {
        toast.error("Please Enter User name & Password");
      } else {
        toast.error("Wrong User name or Password");
      }
    }
  };
  //Redirect after Login.........
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, []);

  return (
    <>
      <div style={{ height: "100vh", marginTop: "25px" }}>
        <Container className="shadow" style={{ padding: "15px" }}>
          <Row>
            <Col xs={6}>
              <div style={{ textAlign: "center" }}>
                <BsPersonPlus color="blue" fontSize="4em" />
                <h1 style={{ textAlign: "center", marginTop: "25px" }}>
                  User Login
                </h1>
              </div>
              {errorMsg ? (
                <div className="alert alert-danger text-center" role="alert">
                  {errorMsg}
                </div>
              ) : (
                ""
              )}
              {successMsg ? (
                <div className="alert alert-success text-center" role="alert">
                  {successMsg}
                </div>
              ) : (
                ""
              )}

              <Form onSubmit={handleLogin}>
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

                <Button
                  style={{ width: "100%", padding: "10px" }}
                  type="submit"
                >
                  {" "}
                  Login
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
                    Don't have any account !
                    <Link
                      to={`/registration?redirect=${redirect}`}
                      style={{ textDecoration: "none" }}
                    >
                      {" "}
                      Create a new account
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

export default Login;

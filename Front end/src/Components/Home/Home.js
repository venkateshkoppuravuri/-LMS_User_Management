import React from "react";
import { Button } from "react-bootstrap";
import { auth } from "../../backend/firebase";

const Home = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault();
    auth.signOut();
  };
  return (
    <>
      <h1> You are Logged in!...</h1>

      <Button variant="primary" type="submit" onClick={onSubmitHandler}>
        LOG OUT
      </Button>
    </>
  );
};

export default Home;

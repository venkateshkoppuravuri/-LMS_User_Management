import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { auth } from "../../backend/firebase";
import axios from "axios";

const LoginSecondFactor = ({ history, location }) => {
  const [answer, setAnswer] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = location?.state?.email || null;
  const password = location?.state?.password || null;
  const uid = location?.state?.uid || null;
  const question = location?.state?.question || null;

  const onChangeHandler = (e) => {
    setError("");
    const { name, value } = e.target;
    if (name === "answer") {
      setAnswer(value);
      value ? setAnswerError("") : setAnswerError("Value is Required");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!answer) {
      setLoading(false);
      setError("Please fill all mandatory fields");
      return false;
    }
    if (answerError) {
      setLoading(false);
      setError("Please check the error");
      return false;
    }

    const response = await axios.get(
      `https://dhrzvmfzw6.execute-api.us-east-1.amazonaws.com/dev/users?uid=${uid}&answer=${answer}`
    );

    if (response.data.body === "User Autheticated Successfully") {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          setLoading(false);
          history.push("/home");
        })
        .catch(function (error) {
          setLoading(false);
          var errorMessage = error.message;
          setError(errorMessage);
        });
    } else {
      setLoading(false);
      setError("Please enter the correct answer");
      return false;
    }
  };

  return (
    <>
      <Container>
        <br></br>
        <Row>
          <Col sm={6}>
            <h1>Answer the Security Question</h1>
            <Form>
              <Form.Group controlId="formQuestion">
                <Form.Label>Question</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Question"
                  name="question"
                  value={question}
                  onChange={onChangeHandler}
                  onBlur={onChangeHandler}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="formAnswer">
                <Form.Label>Answer*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Answer"
                  name="answer"
                  value={answer}
                  onChange={onChangeHandler}
                  onBlur={onChangeHandler}
                />
                <div>{answerError}</div>
              </Form.Group>
              <h4>{error}</h4>
              <Button
                variant="primary"
                onClick={onSubmitHandler}
                disabled={loading}
              >
                {loading && (
                  <i
                    className="fa fa-refresh fa-spin"
                    style={{ marginRight: "5px" }}
                  ></i>
                )}
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginSecondFactor;

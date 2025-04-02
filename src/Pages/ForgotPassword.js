import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaEnvelope, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const ForgotPasswordContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
`;

const Icon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(41, 128, 185, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Message = styled.p`
  margin-top: 1.5rem;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;

  &.success {
    background-color: rgba(46, 204, 113, 0.1);
    color: #27ae60;
  }

  &.error {
    background-color: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await axios.post("http://localhost:8080/user/forgot-password", { email });
      setMessage({ 
        text: "Password reset link has been sent to your email address.", 
        type: "success" 
      });
      setIsSubmitted(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      "Failed to send reset link. Please try again.";
      setMessage({ 
        text: errorMsg, 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      <Title>Forgot Password</Title>
      {!isSubmitted ? (
        <>
          <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#7f8c8d" }}>
            Enter your registered email address to receive a password reset link
          </p>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Icon>
                <FaEnvelope />
              </Icon>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? (
                "Sending..."
              ) : (
                <>
                  <FaPaperPlane /> Send Reset Link
                </>
              )}
            </SubmitButton>
          </Form>
        </>
      ) : null}
      
      {message.text && (
        <Message className={message.type}>
          {message.type === "success" ? (
            <FaCheckCircle />
          ) : (
            <FaExclamationCircle />
          )}
          {message.text}
        </Message>
      )}
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;
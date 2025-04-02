import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FaLock, FaCheck, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

const ResetPasswordContainer = styled.div`
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

const BackButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  font-size: 0.95rem;
  transition: color 0.2s;

  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const PasswordInput = styled.input`
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

const InputIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
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
    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
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

const Message = styled.div`
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

const PasswordRequirements = styled.div`
  margin-top: -0.5rem;
  font-size: 0.85rem;
  color: #7f8c8d;
  padding: 0.5rem;
`;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ text: "Password must be at least 8 characters", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await axios.post(`http://localhost:8080/user/reset-password/${token}`, {
        newPassword,
      });
      setMessage({ 
        text: "Password updated successfully! You can now login with your new password.", 
        type: "success" 
      });
      setIsSuccess(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      "Reset failed. The link may be invalid or expired.";
      setMessage({ 
        text: errorMsg, 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResetPasswordContainer>
      <BackButton onClick={() => navigate("/")}>
        <FaArrowLeft /> Back to login
      </BackButton>
      
      <Title>Reset Your Password</Title>
      
      {!isSuccess ? (
        <>
          <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#7f8c8d" }}>
            Please enter your new password below
          </p>
          
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <PasswordInput
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="8"
              />
            </InputGroup>
            
            <InputGroup>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <PasswordInput
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="8"
              />
            </InputGroup>
            
            <PasswordRequirements>
              Password must be at least 8 characters long
            </PasswordRequirements>
            
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : (
                <>
                  <FaCheck /> Reset Password
                </>
              )}
            </SubmitButton>
          </Form>
        </>
      ) : null}
      
      {message.text && (
        <Message className={message.type}>
          {message.type === "success" ? (
            <FaCheck />
          ) : (
            <FaExclamationTriangle />
          )}
          {message.text}
        </Message>
      )}
    </ResetPasswordContainer>
  );
};

export default ResetPassword;
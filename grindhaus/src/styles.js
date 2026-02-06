import styled from 'styled-components';

export const Container = styled.div`
  font-family: Arial, sans-serif;
  width: 100%;
  margin: 0 auto;
  header {
    text-align: center;
    background: #f4f4f4;
  }
  footer {
    text-align: left;
    margin-top: 20px;
    padding: 10px;
    background: #000000;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  input {
    padding: 10px;
    border: 1px solid #ccc;
  }
  button {
    padding: 10px;
    background: #333;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background: #555;
  }
`;

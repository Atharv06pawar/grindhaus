// QuoteRibbon.js
import React from "react";
import styled from "styled-components";

const Ribbon = styled.section`
  background: #ffffff;
  height: 180px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 2rem 1rem;
    text-align: center;
    gap: 1rem;
  }
`;

const LeftText = styled.div`
  flex: 1;
  font-family: 'Bangers', cursive;
  font-size: 52px;
  font-weight: 400;
  line-height: 1.3;
  color: #000000;
  white-space: pre-line; /* keeps line breaks */
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const RightText = styled.div`
  flex: 1;
  font-family: 'Bangers', cursive;
  font-size: 22px;
  font-weight: 400;
  line-height: 1.5;
  color: #000000;
  white-space: pre-line; /* keeps line breaks */
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const QuoteRibbon = () => {
  return (
    <Ribbon>
      <LeftText>{"Don't Just Dream It Do\nIt."}</LeftText>
      <RightText>
        {
          "take your first step towards a healthier \nlifestyle and sign up for free membership.\nLimited time offer!!"
        }
      </RightText>
    </Ribbon>
  );
};

export default QuoteRibbon;

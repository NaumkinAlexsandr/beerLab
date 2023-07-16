import React from "react";
import "../src/style/style.scss";
import { Container } from "react-bootstrap";
import Logo from "./components/Logo";
import Card from "./components/Card";

function App() {
  return (
    <>
      <Container>
        <Logo />
        <Card />
      </Container>
    </>
  );
}

export default App;

import type {FC} from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";
import { Button, Col, Container, Row } from "react-bootstrap";

export const HomePage: FC = () => {
  return (
    <Container>
      <Row>
        <Col md={6}>
          <h1>Itunes Music</h1>
          <p>
            Добро пожаловать в Itunes Music! Здесь вы можете найти музыку на
            любой вкус.
          </p>
          {/* Измените эту ссылку - с ROUTES.ALBUMS на /itunes */}
          <Link to="/itunes">
            <Button variant="primary">Посмотреть музыку</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};
import { Outlet, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

function Homepage() {
  return (
    <div>
      <Container bg="dark" variant="dark" className="mt-8 mb-4">
        <div>
          <p>
            Sono la <span className="font-semibold">homepage</span>
          </p>
          <div className="mt-4">
            <Button as={Link} to="/student" variant="outline-success">
              Studente
            </Button>{" "}
            <Button as={Link} to="/agency" variant="outline-info">
              Azienda
            </Button>{" "}
          </div>
        </div>
        <Outlet />
      </Container>
    </div>
  );
}

export default Homepage;

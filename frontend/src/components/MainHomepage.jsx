import { useNavigate, Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

function Homepage() {
  const navigate = useNavigate();
  return (
    <div>
      <Container bg="dark" variant="dark" className="mt-8">
        <div>
          <p>
            Sono la <span className="font-semibold">homepage</span>
          </p>
          <div className="mt-4">
            <Button
              variant="outline-success"
              onClick={() => navigate("/student")}
            >
              Studente
            </Button>{" "}
            <Button variant="outline-info" onClick={() => navigate("/agency")}>
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

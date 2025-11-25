import Container from "react-bootstrap/Container";
import { Envelope } from "react-bootstrap-icons";

export default function Footer() {
  return (
    <footer className="bg-body-tertiary text-center text-lg-start border-top mt-5 py-3">
      <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="mb-2 mb-md-0">
          <strong>J&I Muebles</strong> &copy; 2025. Todos los derechos reservados.
        </div>
        <div>
          <a href="mailto:contacto@jimuebles.com" className="me-3 text-decoration-none text-dark">
            <Envelope className="me-2" /> contacto@jimuebles.com
          </a>
        </div>
      </Container>
    </footer>
  );
}

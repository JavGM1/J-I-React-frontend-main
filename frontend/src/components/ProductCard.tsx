import { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import { Cart } from "react-bootstrap-icons";
import type { Product } from "../data/db";

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
}

export default function ProductCard({ product, addToCart }: ProductCardProps) {
  const { name, image, price, specs } = product;
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Col className="mb-4">
        <Card className="h-100 mueble-card">
          <Card.Img 
            variant="top"
            src={`/img/${image}.webp`} 
            alt={name}
            className="mueble-img"
          />
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text className="precio-mueble">
              ${price.toLocaleString('es-CL')}
            </Card.Text>
            <Button
              variant="outline-primary"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                setShowModal(true);
                (e.currentTarget as HTMLButtonElement).blur();
              }}
              className="me-2"
            >
              Ver detalles
            </Button>
            <Button
              variant="dark"
              onClick={() => addToCart(product)}
              title="Agregar al carrito"
            >
              <Cart aria-hidden="true" />
            </Button>
          </Card.Body>
        </Card>
      </Col>

      {/* Modal de detalles */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img 
            src={`/img/${image}.webp`} 
            alt={name}
            className="mueble-img mb-3 modal-img-center"
          />
          <ul>
            <li>Material: {specs.materials.join(', ')}</li>
            <li>Color: {specs.color}</li>
            <li>Dimensiones: {specs.dimensions}</li>
            <li>Peso: {specs.weight}</li>
            <li>Garantía: {specs.warranty}</li>
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
}

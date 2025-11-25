import Carousel from 'react-bootstrap/Carousel';
import { useRef, useState } from 'react';

function Carrusel() {
  const [showControls, setShowControls] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleFocusOrHover = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setShowControls(true);
  };

  const handleBlurOrMouseLeave = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowControls(false), 1000);
  };

  return (
    <div
      className="custom-carousel-wrapper"
      tabIndex={0}
      onFocus={handleFocusOrHover}
      onBlur={handleBlurOrMouseLeave}
      onMouseEnter={handleFocusOrHover}
      onMouseLeave={handleBlurOrMouseLeave}
      style={{ outline: 'none' }}
    >
      <Carousel
        className="custom-carousel"
        interval={5000}
        controls={showControls}
        indicators={showControls}
        pause={false}
      >
        <Carousel.Item>
          <img
            className="imgCarousel d-block w-100"
            src="/img/living.jpg"
            alt="Living"
          />
          <Carousel.Caption className="d-none d-md-block">
            <h5>Bienvenidos a J&I Muebles</h5>
            <p>Descubre nuestra colección exclusiva de muebles para cada rincón de tu hogar.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="imgCarousel d-block w-100"
            src="/img/cocina.jpg"
            alt="Cocina"
          />
          <Carousel.Caption className="d-none d-md-block">
            <h5>Cocina</h5>
            <p>Diseños modernos y funcionales para tu cocina.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="imgCarousel d-block w-100"
            src="/img/baño.jpg"
            alt="Baño"
          />
          <Carousel.Caption className="d-none d-md-block">
            <h5>Baño</h5>
            <p>Renueva tu baño con estilo y calidad.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default Carrusel;

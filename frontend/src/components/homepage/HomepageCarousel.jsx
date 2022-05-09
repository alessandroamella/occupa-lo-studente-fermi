import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

/** @type {{src: string, alt: string, caption: string}[]} */
const images = [
  { src: "/img/fermi.png", alt: "Logo", caption: <h1>ciao sono il logo</h1> },
  { src: "https://picsum.photos/2000", alt: "img1", caption: "Img 1" },
  { src: "https://picsum.photos/3000", alt: "img2", caption: "Img 2" }
];

const HomepageCarousel = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <div>
      <Carousel activeIndex={index} variant="dark" onSelect={handleSelect}>
        {images.map((e, i) => (
          <Carousel.Item key={i}>
            <img
              loading="lazy"
              className="w-screen h-96 min-h-[60vh] max-h-screen object-contain"
              src={e.src}
              alt={e.caption}
            />
            <Carousel.Caption>{e.caption}</Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};
export default HomepageCarousel;

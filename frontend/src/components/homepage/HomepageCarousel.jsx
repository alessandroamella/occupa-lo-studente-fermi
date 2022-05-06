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
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {images.map((e, i) => (
        <Carousel.Item key={i}>
          <img
            className="w-screen h-screen object-contain"
            src={e.src}
            alt={e.caption}
          />
          <Carousel.Caption>{e.caption}</Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};
export default HomepageCarousel;

import React from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const brandLogos = [
  { name: "Brand 1", src: "/img/Becket.jpg" },
  { name: "Brand 2", src: "/img/Bell.jpg" },
  { name: "Brand 3", src: "/img/Carlin.jpg" },
  { name: "Brand 4", src: "/img/cleaver.jpg" },
  { name: "Brand 5", src: "/img/Crown.png" },
  { name: "Brand 6", src: "/img/Fulton.jpg" },
  { name: "Brand 7", src: "/img/Honeywell.jpg" },
  { name: "Brand 8", src: "/img/siemens.jpg" },
  { name: "Brand 9", src: "/img/United.jpg" },
  { name: "Brand 10", src: "/img/Warrick.jpg" },
  { name: "Brand 11", src: "/img/Webster.jpg" }
]

export default function BrandsCarousel() {
    const settings = {
        dots: false,
        infinite: true,
        speed: 700,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 200,
        responsive: [

          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      }
    
      return (
        <div className="bg-white py-16 border-t border-b border-gray-200">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-blue-800">Nuestras Marcas</h2>
            <div className="max-w-5xl mx-auto">
              <Slider {...settings} className="brand-logo-slider">
                {brandLogos.map((brand, index) => (
                  <div key={index} className="px-4">
                    <div className="flex items-center justify-center h-48 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <img
                        src={brand.src || "/placeholder.svg"}
                        alt={brand.name}
                        className="max-h-40 max-w-[80%] object-contain transition-opacity duration-300 ease-in-out hover:opacity-80"
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      )
    }
    
    
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import hero1 from "@/../public/images/hero1.jpg";
import hero2 from "@/../public/images/hero2.jpg";
import hero3 from "@/../public/images/hero3.jpg";
import hero4 from "@/../public/images/hero4.jpg";
import { Card, CardContent } from "../ui/card";

const carouselImages = [hero1, hero2, hero3, hero4];

function HeroCarousel() {
  return (
    <div className="hidden lg:block">
      <Carousel opts={{ loop: true, duration: 20 }}>
        <CarouselContent>
          {carouselImages.map((image, index) => {
            return (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="p-2">
                    <Image
                      src={image}
                      alt="hero"
                      priority={index === 0}
                      className="rounded-md w-full h-96 object-cover"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-4 h-12 w-12 bg-white/60 hover:bg-white text-primary border-none shadow-md transition-all" />
        <CarouselNext className="right-4 h-12 w-12 bg-white/60 hover:bg-white text-primary border-none shadow-md transition-all" />
      </Carousel>
    </div>
  );
}
export default HeroCarousel;

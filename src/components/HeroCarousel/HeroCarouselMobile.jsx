// src/components/HeroCarousel/HeroCarouselMobile.jsx
import './HeroCarouselMobile.css'; // ولا استعمل HeroCarousel.css اللي عندك

export default function HeroCarouselMobile() {
  return (
    <div className="d-block d-lg-none hero-banner mx-2">
      <img
        className="hero-img"
        src="/banners/mobile_carousel.png"   // الصورة ديال الموبايل اللي عندك
        alt="Back to school banner"
        loading="eager"
      />
    </div>
  );
}

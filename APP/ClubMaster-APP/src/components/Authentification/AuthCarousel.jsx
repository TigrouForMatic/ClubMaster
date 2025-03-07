import React, { useState, useEffect } from 'react';
import ClubMasterLogo from '../../assets/photos/logo_ClubMaster.jpg';
import CarouselAuthPlanning from '../../assets/photos/carousel-auth-planning.webp';
import CarouselAuthMultiSupport from '../../assets/photos/carousel-auth-multi-support.webp';
import CarouselAuthCommunication from '../../assets/photos/carousel-auth-communication.webp';
import CarouselAuthProfilPersonnel from '../../assets/photos/carousel-auth-profil-personnel.webp';

function AuthCarousel() {

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        (prevIndex + 1) % testimonials.length
      );
    }, 5000); // Change de témoignage toutes les 5 secondes

    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      text: "Gérez votre planning sportif en toute simplicité. Inscrivez-vous aux événements et suivez vos activités en temps réel.",
      author: "Planning Interactif",
      role: "Organisation simplifiée",
      image: CarouselAuthPlanning
    },
    {
      text: "Une interface intuitive accessible sur tous vos appareils. Restez connecté à votre club où que vous soyez.",
      author: "Multi-support",
      role: "Mobile, tablette, ordinateur",
      image: CarouselAuthMultiSupport
    },
    {
      text: "Communiquez facilement avec votre équipe et vos coachs. Messagerie intégrée et notifications en temps réel.",
      author: "Communication",
      role: "Restez connecté",
      image: CarouselAuthCommunication
    },
    {
      text: "Gérez votre profil, vos licences et vos informations personnelles. Tout est centralisé au même endroit.",
      author: "Profil Personnel",
      role: "Gestion simplifiée",
      image: CarouselAuthProfilPersonnel
    }
  ];

  return (
    <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex">
    <div className="absolute inset-0 bg-zinc-900" />
    <div className="relative z-20 flex items-center text-lg font-medium">
        <img src={ClubMasterLogo} alt="ClubMaster" className="h-10 w-10 mr-2 rounded" />
        ClubMaster
    </div>
    <div className="relative z-20 flex-1 flex items-center justify-center">
        <div className="space-y-4">
        <div className="flex flex-col items-center space-y-6">
            <div className="w-full overflow-hidden rounded-lg mb-8">
            <img 
                src={testimonials[currentTestimonialIndex].image}
                alt={testimonials[currentTestimonialIndex].author}
                className="w-full h-[600px] object-cover transition-opacity duration-300"
            />
            </div>
            
            <blockquote className="space-y-2 transition-opacity duration-300 text-center mt-8">
            <p className="text-lg">
                "{testimonials[currentTestimonialIndex].text}"
            </p>
            <footer className="text-sm">
                <p className="font-semibold">{testimonials[currentTestimonialIndex].author}</p>
                <p className="text-zinc-400">{testimonials[currentTestimonialIndex].role}</p>
            </footer>
            </blockquote>
        </div>
        
        <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
            <button
                key={index}
                onClick={() => setCurrentTestimonialIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                currentTestimonialIndex === index ? 'bg-white' : 'bg-zinc-600'
                }`}
                aria-label={`Témoignage ${index + 1}`}
            />
            ))}
        </div>
        </div>
    </div>
    </div>
  );
}

export default AuthCarousel;
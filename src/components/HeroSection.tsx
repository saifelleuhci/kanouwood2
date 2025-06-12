import { ArrowDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchTextContent } from '@/utils/textContent';

const HeroSection = () => {
  const [textContent, setTextContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTextContent = async () => {
      try {
        const content = await fetchTextContent();
        setTextContent(content);
      } catch (error) {
        console.error('Error loading text content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTextContent();
  }, []);

  // Catalogue path stored in public/files.
  const catalogPath = "https://download1323.mediafire.com/kpafoqnslqhgD5n104HUBfKksYB5IQYRZIRj56RHP1P798nHsTBteY3Pge5F-kZhssrQCi0zpoTIW9eQ6iziTlhl5q7sOt1v-PjKI0pl3ICfq2LxotoQO18NUNFD1CogX-tcYSs7XXGFg-uEBGyNXtctyDhqa2AClSTTHJtl9P5-AA/q873a3qqlyd0of3/CATALOGUE+SOCRATE+WOOD+%282%29.pdf";

  const scrollToAtelier = () => {
    const atelierSection = document.getElementById('atelier');
    if (atelierSection) {
      atelierSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return null;
  }

  return (
    <section className="relative min-h-screen w-full">
      {/* Background with multiple images */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://www.agacookshop.co.uk/media/catalog/product/cache/fbc3ef200b4c6b13583c962634965a73/s/q/square_olive_wood_set_2lr_9.jpg)',
          }}
        />
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://www.deskera.com/blog/content/images/2023/04/adam-patterson-v13x0qU4afA-unsplash.jpg)',
          }}
        />
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1714638206752-045d10571604?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29vZCUyMHByb2R1Y3RzfGVufDB8fDB8fHww)',
          }}
        />
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1714702846875-ca3a149c0592?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3V0dGluZyUyMGJvYXJkfGVufDB8fDB8fHww)',
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-4 animate-fade-in text-white drop-shadow-lg">
            {textContent?.hero.title || 'OBJETS EN BOIS D\'OLIVIER'}
          </h1>
          <h2 className="text-lg md:text-xl font-normal mb-8 tracking-wider uppercase animate-slide-up text-white drop-shadow-md">
            {textContent?.hero.subtitle || 'PRODUITS ARTISANAUX 100% NATURELS'}
          </h2>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <a
              href={catalogPath}
              download
              className="btn-primary bg-white bg-opacity-20 text-white hover:bg-olive hover:border-olive text-center"
            >
              {textContent?.hero.ctaCatalog || 'Télécharger le Catalogue'}
            </a>
            
            <button onClick={scrollToAtelier} className="text-white flex items-center justify-center gap-2 hover:text-olive transition-colors py-2">
              {textContent?.hero.ctaWorkshop || 'Découvrir notre atelier'} <ArrowDown size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

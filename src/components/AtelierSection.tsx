import { useState, useEffect } from 'react';
import { fetchTextContent } from '@/utils/textContent';

const AtelierSection = () => {
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

  if (loading) {
    return null;
  }

  return (
    <section id="atelier" className="py-20 bg-earth-light">
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="section-title">{textContent?.workshop.title || 'ATELIER EN LIGNE'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {/* Quality */}
          <div className="flex flex-col space-y-6 items-center md:items-end">
            <div className="relative w-full max-w-md overflow-hidden rounded-lg shadow-lg">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10"></div>
                <img 
                  src="/files/WhatsApp%20Image%202025-06-07%20at%2020.40.28.jpeg" 
                  alt="Qualité de fabrication" 
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              </div>
            </div>
            <div className="text-center md:text-right max-w-md">
              <h3 className="text-2xl font-playfair text-olive-dark mb-3">
                {textContent?.workshop.qualityTitle || 'QUALITÉ DE FABRICATION'}
              </h3>
              <p className="text-base text-gray-700 leading-relaxed">
                {textContent?.workshop.qualityContent || 'Nos produits sont travaillés à l\'unité avec une exigence de qualité, fait-main, un savoir-faire unique transmis de génération en génération.'}
              </p>
            </div>
          </div>
          
          {/* Price */}
          <div className="flex flex-col space-y-6 items-center md:items-start">
            <div className="relative w-full max-w-md overflow-hidden rounded-lg shadow-lg">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10"></div>
                <img 
                  src="/files/WhatsApp%20Image%202025-06-07%20at%2020.40.31.jpeg" 
                  alt="Prix d'atelier" 
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              </div>
            </div>
            <div className="text-center md:text-left max-w-md">
              <h3 className="text-2xl font-playfair text-olive-dark mb-3">
                {textContent?.workshop.priceTitle || 'PRIX D\'ATELIER'}
              </h3>
              <p className="text-base text-gray-700 leading-relaxed">
                {textContent?.workshop.priceContent || 'Nos prix sont réfléchis et étudiés selon la pièce, ses dimensions et la complexité de sa réalisation dans notre atelier artisanal.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AtelierSection;

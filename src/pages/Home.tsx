import React, { useEffect, useState } from 'react';
import { Phone, Download, ArrowRight } from 'lucide-react';
import { fetchTextContent } from '@/utils/textContent';

const Home: React.FC = () => {
  const [textContent, setTextContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTextContent = async () => {
      try {
        const content = await fetchTextContent();
        setTextContent(content);
        setError(null);
      } catch (error) {
        console.error('Error loading text content:', error);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadTextContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-olive">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center"></div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4">
            {textContent?.hero?.title || 'OBJETS EN BOIS D\'OLIVIER'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            {textContent?.hero?.subtitle || 'PRODUITS ARTISANAUX 100% NATURELS'}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a 
              href="/CATALOGUE SOCRATE WOOD.pdf"
              className="inline-flex items-center gap-2 bg-olive text-white px-6 py-3 rounded-full text-lg hover:bg-olive-dark transition-colors"
            >
              <Download size={24} />
              {textContent?.hero?.ctaCatalog || 'Télécharger le Catalogue'}
            </a>
            <a 
              href="#workshop"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-full text-lg hover:bg-white hover:text-olive transition-colors"
            >
              {textContent?.hero?.ctaWorkshop || 'Découvrir notre atelier'}
              <ArrowRight size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-playfair font-bold mb-6 text-center">
            {textContent?.about?.title || 'Notre Histoire'}
          </h2>
          <p className="text-gray-700 text-center max-w-2xl mx-auto">
            {textContent?.about?.content || 'Depuis plus de 10 ans, nous créons des pièces uniques en bois, alliant tradition et modernité.'}
          </p>
        </div>
      </section>

      {/* Workshop Section */}
      <section id="workshop" className="py-20 bg-earth-light">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-playfair font-bold mb-12 text-center">
            {textContent?.workshop?.title || 'ATELIER EN LIGNE'}
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <h3 className="text-2xl font-playfair font-bold mb-4">
                {textContent?.workshop?.qualityTitle || 'QUALITÉ DE FABRICATION'}
              </h3>
              <p className="text-gray-700">
                {textContent?.workshop?.qualityContent || 'Nos produits sont travaillés à l\'unité avec une exigence de qualité, fait-main.'}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-playfair font-bold mb-4">
                {textContent?.workshop?.priceTitle || 'PRIX D\'ATELIER'}
              </h3>
              <p className="text-gray-700">
                {textContent?.workshop?.priceContent || 'Nos prix sont réfléchis et étudiés selon la pièce, ses dimensions et la complexité de sa réalisation.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-playfair font-bold mb-6 text-center">
            {textContent?.products?.title || 'Nos Créations'}
          </h2>
          <p className="text-gray-700 text-center max-w-2xl mx-auto mb-12">
            {textContent?.products?.content || 'Explorez notre collection de meubles et objets en bois, chacun fabriqué à la main avec le plus grand soin.'}
          </p>
          {/* Products grid will be added here */}
        </div>
      </section>

      {/* Natural Section */}
      <section className="py-20 bg-earth-light">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-playfair font-bold mb-4 text-center">
            {textContent?.natural?.title || 'SIMPLEMENT NATUREL'}
          </h2>
          <h3 className="text-xl text-center mb-8">
            {textContent?.natural?.subtitle || 'Bois d\'olivier naturel'}
          </h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <p className="text-gray-700 max-w-3xl mx-auto text-center md:text-left">
              {textContent?.natural?.content || 'Le bois d\'olivier est une matière naturelle, un bois très compact et très résistant.'}
            </p>
            <img
              src="/files/logo.jpeg"
              alt="Socrate Wood"
              className="w-60 mx-auto md:mx-0 rounded-full object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <blockquote className="text-center">
            <p className="text-2xl font-playfair italic mb-4">
              {textContent?.testimonial?.content || '"Merci naturolive, vos pièces sont magnifiques..."'}
            </p>
            <footer className="text-gray-600">
              {textContent?.testimonial?.author || 'LAETITIA, FRANCE'}
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-olive-light">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-playfair font-bold mb-6">
              {textContent?.contact?.title || 'Contactez-nous'}
            </h2>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
              {textContent?.contact?.content || 'Pour toute question ou commande spéciale, n\'hésitez pas à nous contacter.'}
            </p>
            <a 
              href={`tel:${textContent?.contactInfo?.phone || '+216 58 415 520'}`}
              className="inline-flex items-center gap-2 bg-olive text-white px-6 py-3 rounded-full text-lg hover:bg-olive-dark transition-colors"
            >
              <Phone size={24} />
              {textContent?.cta?.text || 'Appelez-nous pour un devis gratuit'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
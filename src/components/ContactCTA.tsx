import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { fetchTextContent } from '@/utils/textContent';

const ContactCTA = () => {
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
    <section className="py-20 bg-earth-light">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-playfair font-bold mb-6 text-olive-dark">
            {textContent?.cta.title || 'Intéressé par nos produits ?'}
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {textContent?.cta.content || 'Contactez-nous pour plus d\'informations sur nos produits en bois d\'olivier. Notre équipe est à votre disposition pour répondre à toutes vos questions.'}
          </p>
          <a 
            href={`tel:${textContent?.cta.phone || '+216 96 794 242'}`}
            className="inline-flex items-center gap-2 bg-olive text-white px-6 py-3 rounded-full text-lg hover:bg-olive-dark transition-colors"
          >
            <Phone size={24} />
            {textContent?.cta.button || 'Appelez-nous maintenant'}
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA; 
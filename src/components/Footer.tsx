import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { fetchTextContent } from '@/utils/textContent';

const Footer: React.FC = () => {
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
    <footer className="bg-olive-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-playfair font-bold mb-4 text-white">
              {textContent?.footer.aboutTitle || 'À propos'}
            </h3>
            <p className="text-white">
              {textContent?.footer.aboutContent || 'Votre spécialiste en artisanat de bois de qualité.'}
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-playfair font-bold mb-4 text-white">
              {textContent?.footer.contactTitle || 'Contact'}
            </h3>
            <p className="text-white mb-4">
              {textContent?.footer.contactContent || 'Besoin d\'informations ? Contactez-nous !'}
            </p>
            <div className="space-y-2">
                            <a href={`tel:${textContent?.contactInfo.phone}`} className="flex items-center justify-center md:justify-start gap-2 text-white hover:text-olive-light transition-colors">
                <Phone size={18} />
                {textContent?.contactInfo.phone || '+216 58 415 520'}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-playfair font-bold mb-4 text-white">
              {textContent?.footer.quickLinksTitle || 'Liens Rapides'}
            </h3>
                        <ul className="space-y-2 flex flex-col items-center md:items-start">
              <li>
                <Link to="/" className="text-white hover:text-olive-light transition-colors">
                  {textContent?.header.home || 'Accueil'}
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-white hover:text-olive-light transition-colors">
                  {textContent?.header.products || 'Produits'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-olive mt-8 pt-8 text-center text-white">
          <p>{textContent?.footer.rights || ' 2025 SOCRATE WOOD. Tous droits réservés.'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

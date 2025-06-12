import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { fetchTextContent } from '@/utils/textContent';

const NaturalSection = () => {
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
    <section className="py-20 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Image */}
          <div className="md:w-1/2">
            <div className="relative overflow-hidden rounded-lg shadow-xl">
              <img 
                src="/logo.jpeg" 
                alt="Socrate Wood Logo" 
                className="w-full h-auto object-contain transition-transform duration-700 hover:scale-105 bg-white"
              />
            </div>
          </div>
          
          {/* Text Content */}
          <div className="md:w-1/2">
            <h2 className="text-4xl font-playfair font-bold mb-4 text-olive-dark">
              {textContent?.natural.title || 'SIMPLEMENT NATUREL'}
            </h2>
            <h3 className="text-2xl font-playfair mb-6 text-olive">
              {textContent?.natural.subtitle || 'Bois d\'olivier naturel'}
            </h3>
            <p className="text-gray-600 mb-8">
              {textContent?.natural.content || 'Le bois d\'olivier est une matière naturelle, un bois très compact et très résistant. Il est plus ou moins clair, ses veines sont irrégulières et lui confèrent toute sa noblesse une fois fini et poli. C\'est un bois plus dense que le hêtre, ceci lui confère une plus grande résistance et des caractéristiques hygiéniques lui permettant d\'être utilisé en cuisine. Il ne se rompt pas et il n\'absorbe ni les liquides, ni les bactéries, ni les mauvaises odeurs.'}
            </p>
            <div className="text-center md:text-left">
              <a 
                href="https://download1323.mediafire.com/kpafoqnslqhgD5n104HUBfKksYB5IQYRZIRj56RHP1P798nHsTBteY3Pge5F-kZhssrQCi0zpoTIW9eQ6iziTlhl5q7sOt1v-PjKI0pl3ICfq2LxotoQO18NUNFD1CogX-tcYSs7XXGFg-uEBGyNXtctyDhqa2AClSTTHJtl9P5-AA/q873a3qqlyd0of3/CATALOGUE+SOCRATE+WOOD+%282%29.pdf"
                className="inline-flex items-center gap-2 bg-olive text-white px-6 py-3 rounded-full text-lg hover:bg-olive-dark transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={24} />
                {textContent?.natural.catalog_button || 'Télécharger le Catalogue'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NaturalSection;

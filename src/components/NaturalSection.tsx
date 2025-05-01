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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold mb-4 text-olive-dark">
            {textContent?.natural.title || 'SIMPLEMENT NATUREL'}
          </h2>
          <h3 className="text-2xl font-playfair mb-6 text-olive">
            {textContent?.natural.subtitle || 'Bois d\'olivier naturel'}
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {textContent?.natural.content || 'Le bois d\'olivier est une matière naturelle, un bois très compact et très résistant. Il est plus ou moins clair, ses veines sont irrégulières et lui confèrent toute sa noblesse une fois fini et poli. C\'est un bois plus dense que le hêtre, ceci lui confère une plus grande résistance et des caractéristiques hygiéniques lui permettant d\'être utilisé en cuisine. Il ne se rompt pas et il n\'absorbe ni les liquides, ni les bactéries, ni les mauvaises odeurs.'}
          </p>
        </div>
        <div className="text-center">
          <a 
            href="/catalogue.pdf"
            className="inline-flex items-center gap-2 bg-olive text-white px-6 py-3 rounded-full text-lg hover:bg-olive-dark transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={24} />
            {textContent?.natural.catalog_button || 'Télécharger le Catalogue'}
          </a>
        </div>
      </div>
    </section>
  );
};

export default NaturalSection;

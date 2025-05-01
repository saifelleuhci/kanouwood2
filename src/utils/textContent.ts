type TextContent = {
  header: {
    logo: string;
    home: string;
    products: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaCatalog: string;
    ctaWorkshop: string;
  };
  workshop: {
    title: string;
    qualityTitle: string;
    qualityContent: string;
    priceTitle: string;
    priceContent: string;
  };
  natural: {
    title: string;
    subtitle: string;
    content: string;
  };
  testimonial: {
    content: string;
    author: string;
  };
  about: {
    title: string;
    content: string;
  };
  products: {
    title: string;
    content: string;
  };
  contact: {
    title: string;
    content: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  cta: {
    text: string;
    phone: string;
  };
  footer: {
    aboutTitle: string;
    aboutContent: string;
    contactTitle: string;
    contactContent: string;
    quickLinksTitle: string;
    rights: string;
  };
};

const createEmptyTextContent = (): TextContent => ({
  header: { logo: '', home: '', products: '' },
  hero: { title: '', subtitle: '', ctaCatalog: '', ctaWorkshop: '' },
  workshop: { title: '', qualityTitle: '', qualityContent: '', priceTitle: '', priceContent: '' },
  natural: { title: '', subtitle: '', content: '' },
  testimonial: { content: '', author: '' },
  about: { title: '', content: '' },
  products: { title: '', content: '' },
  contact: { title: '', content: '' },
  contactInfo: { phone: '', email: '', address: '', hours: '' },
  cta: { text: '', phone: '' },
  footer: { aboutTitle: '', aboutContent: '', contactTitle: '', contactContent: '', quickLinksTitle: '', rights: '' }
});

export const parseTextContent = (content: string): TextContent => {
  try {
    // Remove any HTML comments from the content
    const cleanContent = content.replace(/<!--[\s\S]*?-->/g, '');
    const lines = cleanContent.split('\n');
    const result = createEmptyTextContent();
    let currentSection = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) continue;
      
      // Handle section headers
      if (trimmedLine.startsWith('# ')) {
        currentSection = trimmedLine.replace('# ', '').toLowerCase().replace(' section', '');
        if (currentSection === 'contact information') {
          currentSection = 'contactInfo';
        }
        continue;
      }

      // Handle content lines
      if (!trimmedLine.startsWith('#')) {
        const colonIndex = trimmedLine.indexOf(':');
        if (colonIndex === -1) continue;

        const key = trimmedLine.substring(0, colonIndex).trim();
        const value = trimmedLine.substring(colonIndex + 1).trim();
        
        if (key && value) {
          const sectionKey = key.split('_')[0];
          
          try {
            switch (currentSection) {
              case 'contactInfo':
                if (result.contactInfo) {
                  (result.contactInfo as any)[sectionKey] = value;
                }
                break;
              case 'cta':
                if (result.cta) {
                  (result.cta as any)[sectionKey] = value;
                }
                break;
              case 'footer':
                if (result.footer) {
                  const footerKey = key.replace('footer_', '');
                  (result.footer as any)[footerKey] = value;
                }
                break;
              case 'hero':
                if (result.hero) {
                  const heroKey = key.replace('hero_', '');
                  (result.hero as any)[heroKey] = value;
                }
                break;
              case 'workshop':
                if (result.workshop) {
                  const workshopKey = key.replace('workshop_', '');
                  (result.workshop as any)[workshopKey] = value;
                }
                break;
              case 'natural':
                if (result.natural) {
                  const naturalKey = key.replace('natural_', '');
                  (result.natural as any)[naturalKey] = value;
                }
                break;
              case 'testimonial':
                if (result.testimonial) {
                  const testimonialKey = key.replace('testimonial_', '');
                  (result.testimonial as any)[testimonialKey] = value;
                }
                break;
              default:
                if (result[currentSection as keyof TextContent]) {
                  (result[currentSection as keyof TextContent] as any)[sectionKey] = value;
                }
            }
          } catch (error) {
            console.warn(`Error parsing line: ${trimmedLine}`, error);
          }
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error parsing text content:', error);
    return createEmptyTextContent();
  }
};

export const fetchTextContent = async (): Promise<TextContent> => {
  try {
    const response = await fetch('/data/text-content.txt');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    return parseTextContent(content);
  } catch (error) {
    console.error('Error fetching text content:', error);
    return createEmptyTextContent();
  }
}; 
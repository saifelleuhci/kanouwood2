import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import AtelierSection from '@/components/AtelierSection';
import NaturalSection from '@/components/NaturalSection';
import ProductShowcase from '@/components/ProductShowcase';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <HeroSection />
      <AtelierSection />
      <NaturalSection />
      <ProductShowcase />
      <ContactCTA />
      <Footer />
    </div>
  );
};

export default Index;

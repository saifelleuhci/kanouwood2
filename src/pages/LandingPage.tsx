import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

interface Details {
  phone_number: string;
  catalog_url: string;
  hero_images: string[];
}

const LandingPage: React.FC = () => {
  const [details, setDetails] = useState<Details | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('details')
        .select('*')
        .single();

      if (error) throw error;
      setDetails(data);
    } catch (err) {
      setError('Failed to fetch details');
      console.error('Error fetching details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (details?.phone_number) {
      window.location.href = `tel:${details.phone_number}`;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!details) return <div>No details found</div>;

  return (
    <div className="min-h-screen">
      <NavBar />
      <main>
        {/* Hero Section */}
        <section className="relative h-screen">
          <div className="absolute inset-0">
            <img
              src={details.hero_images[0]}
              alt="Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Welcome to Olivia Wood
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Discover our collection of handcrafted furniture
              </p>
              <button
                onClick={handleCall}
                className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Call Now
              </button>
            </div>
          </div>
        </section>

        {/* Other sections using hero_images */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {details.hero_images.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Section ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage; 
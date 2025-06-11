import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchTextContent } from '@/utils/textContent';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [textContent, setTextContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadTextContent();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const loadTextContent = async () => {
    try {
      const content = await fetchTextContent();
      setTextContent(content);
      setPhoneNumber(content.contactInfo.phone);
    } catch (error) {
      console.error('Error loading text content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-olive font-playfair font-bold text-xl">
            <img src="/logo-removebg-preview.png" alt="Socrate Wood" className="h-10 w-10 object-contain" />
            {textContent?.header.logo || 'SOCRATE WOOD'}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-olive transition-colors">
              {textContent?.header.home || 'Accueil'}
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-olive transition-colors">
              {textContent?.header.products || 'Produits'}
            </Link>
            {isAuthenticated && (
              <Link to="/admin" className="text-gray-700 hover:text-olive flex items-center gap-1">
                <Lock size={16} />
                Admin
              </Link>
            )}
            <a 
              href={`tel:${textContent?.contactInfo.phone}`}
              className="inline-flex items-center gap-2 bg-olive text-white px-4 py-2 rounded-full hover:bg-olive-dark transition-colors"
            >
              <Phone size={20} />
              {textContent?.contactInfo.phone || '+216 96 794 242'}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              to="/" 
              className="block text-gray-700 hover:text-olive"
              onClick={() => setIsMenuOpen(false)}
            >
              {textContent?.header.home || 'Accueil'}
            </Link>
            <Link 
              to="/products" 
              className="block text-gray-700 hover:text-olive"
              onClick={() => setIsMenuOpen(false)}
            >
              {textContent?.header.products || 'Produits'}
            </Link>
            {isAuthenticated && (
              <Link 
                to="/admin" 
                className="block text-gray-700 hover:text-olive flex items-center gap-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <Lock size={16} />
                Admin
              </Link>
            )}
            <a 
              href={`tel:${textContent?.contactInfo.phone}`}
              className="flex items-center gap-2 bg-olive text-white px-4 py-2 rounded-full hover:bg-olive-dark transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone size={18} />
              {textContent?.contactInfo.phone || '+216 96 794 242'}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type TextContent = {
  id: string;
  section: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

type TextContentManagementProps = {
  onSaveContent: (content: { section: string; title: string; content: string }) => Promise<void>;
};

const TextContentManagement = ({ onSaveContent }: TextContentManagementProps) => {
  const [textContents, setTextContents] = useState<TextContent[]>([]);
  const [editingContent, setEditingContent] = useState<TextContent | null>(null);
  const [formData, setFormData] = useState({
    section: '',
    title: '',
    content: '',
  });

  useEffect(() => {
    fetchTextContents();
  }, []);

  const fetchTextContents = async () => {
    try {
      const { data, error } = await supabase
        .from('text_content')
        .select('*')
        .order('section', { ascending: true });

      if (error) throw error;
      if (data) {
        setTextContents(data);
      }
    } catch (error) {
      console.error('Error fetching text contents:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSaveContent(formData);
      setFormData({
        section: '',
        title: '',
        content: '',
      });
      setEditingContent(null);
      fetchTextContents();
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleEdit = (content: TextContent) => {
    setEditingContent(content);
    setFormData({
      section: content.section,
      title: content.title,
      content: content.content,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        const { error } = await supabase
          .from('text_content')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchTextContents();
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  return (
    <div className="bg-earth-light p-6 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-playfair text-olive-dark">Gestion du Contenu</h3>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="section" className="block text-sm font-medium mb-1">Section</label>
            <select
              id="section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Sélectionner une section</option>
              <option value="hero">Hero</option>
              <option value="about">À propos</option>
              <option value="products">Produits</option>
              <option value="contact">Contact</option>
            </select>
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Titre</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">Contenu</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              rows={4}
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            type="button" 
            onClick={() => {
              setEditingContent(null);
              setFormData({
                section: '',
                title: '',
                content: '',
              });
            }}
            className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-olive text-white rounded-md hover:bg-olive-dark transition-colors"
          >
            {editingContent ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-playfair text-olive-dark mb-4">Contenu existant</h4>
        <div className="space-y-4">
          {textContents.map(content => (
            <div key={content.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-olive-dark">{content.section}</h5>
                  <h6 className="text-sm font-medium">{content.title}</h6>
                  <p className="text-sm mt-2">{content.content}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(content)}
                    className="p-1 text-olive hover:text-olive-dark transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(content.id)}
                    className="p-1 text-olive hover:text-olive transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextContentManagement; 
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useLogin } from '@/hooks/useLogin';
// import { useLoading } from '@/components/LoadingProvider';
import apiClient from '@/lib/api-client';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from '@/hooks/useLocale';
import RichTextEditor from '@/components/RichTextEditor';
import AuthGuard from '@/components/auth/AuthGuard';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

interface CreatePostForm {
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  status: string;
  is_published: boolean;
  category_id: string;
}

export default function CreatePostPage() {
  const { getStoredUser } = useLogin();
  // const { showLoading, hideLoading } = useLoading();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { currentLocale } = useLocale();

  const [formData, setFormData] = useState<CreatePostForm>({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft',
    is_published: false,
    category_id: ''
  });

  const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' }
  ];

  // Load user data when component mounts
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, [getStoredUser]);

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/v1/categories?limit=100');
      setCategories(response.categories || []);
    } catch (error: any) {
      console.error('Error loading categories:', error);
      
      // Handle authentication errors
      if (error.message.includes('Authentication required') || error.message.includes('401')) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Authentication Required',
          detail: 'Please log in to access admin features.',
          life: 5000
        });
        router.push(`/${currentLocale}/admin`);
        return;
      }
      
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to load categories',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreatePostForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // showLoading();

    try {
      const postData = {
        ...formData,
        category_id: formData.category_id || null
      };

      console.log('Sending post data:', postData);
      await apiClient.post('/api/v1/posts', postData);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Post criado com sucesso!',
        life: 3000
      });

      // Navigate back to posts list
      router.push(`/${currentLocale}/admin/posts`);
    } catch (error: any) {
      console.error('Error creating post:', error);
      
      // Handle authentication errors
      if (error.message.includes('Authentication required') || error.message.includes('401')) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Autenticação Necessária',
          detail: 'Por favor, faça login para acessar os recursos administrativos.',
          life: 5000
        });
        router.push(`/${currentLocale}/admin`);
        return;
      }
      
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: error.message || 'Falha ao criar post',
        life: 3000
      });
    } finally {
      setSubmitting(false);
      // hideLoading();
    }
  };

  const handleCancel = () => {
    // showLoading();
    router.push(`/${currentLocale}/admin/posts`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex align-items-center justify-content-center min-h-screen">
          <ProgressSpinner />
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-xl border-0">
              <div className="flex justify-content-between align-items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Novo Post</h1>
                  <p className="text-gray-600 text-lg">Crie conteúdo rico e profissional para sua plataforma</p>
                </div>
                <Button
                  label="← Voltar aos Posts"
                  icon="pi pi-arrow-left"
                  severity="secondary"
                  onClick={handleCancel}
                  className="px-6 py-3"
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title Section */}
                <div className="space-y-4">
                  <div className="field">
                    <label htmlFor="title" className="block text-gray-900 font-semibold text-lg mb-3">
                      Título do Post *
                    </label>
                    <InputText
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      placeholder="Digite o título do seu post..."
                      required
                    />
                  </div>
                </div>

                {/* Excerpt Section */}
                <div className="space-y-4">
                  <div className="field">
                    <label htmlFor="excerpt" className="block text-gray-900 font-semibold text-lg mb-3">
                      Resumo
                    </label>
                    <InputTextarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      className="w-full p-4 text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                      placeholder="Digite um breve resumo do seu post..."
                      rows={4}
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="space-y-4">
                  <div className="field">
                    <label htmlFor="content" className="block text-gray-900 font-semibold text-lg mb-3">
                      Conteúdo *
                    </label>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(value) => handleInputChange('content', value)}
                      placeholder="Comece a escrever seu conteúdo aqui..."
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Category */}
                  <div className="space-y-4">
                    <div className="field">
                      <label htmlFor="category" className="block text-gray-900 font-semibold text-lg mb-3">
                        Categoria
                      </label>
                      <Dropdown
                        id="category"
                        value={formData.category_id}
                        options={categories.map(cat => ({ label: cat.name, value: cat.id }))}
                        onChange={(e) => handleInputChange('category_id', e.value)}
                        placeholder="Selecione uma categoria"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-4">
                    <div className="field">
                      <label htmlFor="status" className="block text-gray-900 font-semibold text-lg mb-3">
                        Status
                      </label>
                      <Dropdown
                        id="status"
                        value={formData.status}
                        options={statusOptions}
                        onChange={(e) => handleInputChange('status', e.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div className="space-y-4">
                    <div className="field">
                      <label htmlFor="featured_image" className="block text-gray-900 font-semibold text-lg mb-3">
                        URL da Imagem de Destaque
                      </label>
                      <InputText
                        id="featured_image"
                        value={formData.featured_image}
                        onChange={(e) => handleInputChange('featured_image', e.target.value)}
                        className="w-full p-4 text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>
                  </div>

                  {/* Publication Settings */}
                  <div className="space-y-4">
                    <div className="field">
                      <label className="block text-gray-900 font-semibold text-lg mb-3">
                        Configurações de Publicação
                      </label>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <input
                          type="checkbox"
                          id="is_published"
                          checked={formData.is_published}
                          onChange={(e) => handleInputChange('is_published', e.target.checked)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor="is_published" className="text-gray-900 font-medium">
                          Publicar imediatamente
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-content-end gap-4 pt-8 border-t-2 border-gray-100">
                  <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    onClick={handleCancel}
                    disabled={submitting}
                    className="px-8 py-3 text-lg"
                  />
                  <Button
                    type="submit"
                    label="Criar Post"
                    icon="pi pi-check"
                    loading={submitting}
                    disabled={submitting}
                    className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700"
                  />
                </div>
              </form>
            </Card>
          </div>
        </div>

        <Toast ref={toast} />
      </div>
    </AuthGuard>
  );
} 
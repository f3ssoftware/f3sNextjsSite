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
import apiClient from '@/lib/api-client';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from '@/hooks/useLocale';

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
  const { isAuthenticated, getStoredUser } = useLogin();
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

  // Check authentication and load user
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Authentication Required',
        detail: 'Please log in to access admin features.',
        life: 3000
      });
      router.push(`/${currentLocale}/admin`);
      return;
    }
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, [isAuthenticated, getStoredUser, router, currentLocale]);

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
        // Redirect to login page
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

    try {
      const postData = {
        ...formData,
        category_id: formData.category_id || null
      };

      await apiClient.post('/api/v1/posts', postData);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Post created successfully',
        life: 3000
      });

      // Redirect to posts list
      setTimeout(() => {
        router.push(`/${currentLocale}/admin/posts`);
      }, 1000);

    } catch (error: any) {
      console.error('Error creating post:', error);
      
      // Handle authentication errors
      if (error.message.includes('Authentication required') || error.message.includes('401')) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Authentication Required',
          detail: 'Please log in to access admin features.',
          life: 5000
        });
        // Redirect to login page
        router.push(`/${currentLocale}/admin`);
        return;
      }
      
      const errorMessage = error.message || 'Failed to create post';
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 5000
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${currentLocale}/admin/posts`);
  };

  if (!isAuthenticated()) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="flex justify-content-between align-items-center mb-4">
              <h1 className="text-2xl font-bold text-900 m-0">Create New Post</h1>
              <Button
                label="Back to Posts"
                icon="pi pi-arrow-left"
                severity="secondary"
                onClick={handleCancel}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid">
                <div className="col-12">
                  <div className="field">
                    <label htmlFor="title" className="block text-900 font-medium mb-2">
                      Title *
                    </label>
                    <InputText
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full"
                      placeholder="Enter post title"
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="field">
                    <label htmlFor="excerpt" className="block text-900 font-medium mb-2">
                      Excerpt
                    </label>
                    <InputTextarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      className="w-full"
                      placeholder="Enter post excerpt"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="field">
                    <label htmlFor="content" className="block text-900 font-medium mb-2">
                      Content *
                    </label>
                    <InputTextarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      className="w-full"
                      placeholder="Enter post content"
                      rows={10}
                      required
                    />
                  </div>
                </div>

                <div className="col-12 md:col-6">
                  <div className="field">
                    <label htmlFor="category" className="block text-900 font-medium mb-2">
                      Category
                    </label>
                    <Dropdown
                      id="category"
                      value={formData.category_id}
                      options={categories.map(cat => ({ label: cat.name, value: cat.id }))}
                      onChange={(e) => handleInputChange('category_id', e.value)}
                      placeholder="Select a category"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="col-12 md:col-6">
                  <div className="field">
                    <label htmlFor="status" className="block text-900 font-medium mb-2">
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

                <div className="col-12 md:col-6">
                  <div className="field">
                    <label htmlFor="featured_image" className="block text-900 font-medium mb-2">
                      Featured Image URL
                    </label>
                    <InputText
                      id="featured_image"
                      value={formData.featured_image}
                      onChange={(e) => handleInputChange('featured_image', e.target.value)}
                      className="w-full"
                      placeholder="Enter image URL"
                    />
                  </div>
                </div>

                <div className="col-12 md:col-6">
                  <div className="field">
                    <label className="block text-900 font-medium mb-2">
                      Publication Settings
                    </label>
                    <div className="flex align-items-center gap-3">
                      <div className="flex align-items-center">
                        <input
                          type="checkbox"
                          id="is_published"
                          checked={formData.is_published}
                          onChange={(e) => handleInputChange('is_published', e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="is_published" className="text-900">
                          Publish immediately
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-content-end gap-3 pt-4">
                <Button
                  type="button"
                  label="Cancel"
                  severity="secondary"
                  onClick={handleCancel}
                  disabled={submitting}
                />
                <Button
                  type="submit"
                  label="Create Post"
                  icon="pi pi-check"
                  loading={submitting}
                  disabled={submitting}
                />
              </div>
            </form>
          </Card>
        </div>
      </div>

      <Toast ref={toast} />
    </div>
  );
} 
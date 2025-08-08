'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useLogin } from '@/hooks/useLogin';
import apiClient from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  status: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface EditPostForm {
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  status: string;
  is_published: boolean;
  category_id: string;
}

export default function EditPostPage() {
  const params = useParams();
  const postId = params.id as string;
  
  const { isAuthenticated, getStoredUser } = useLogin();
  const [categories, setCategories] = useState<Category[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const toast = useRef<Toast>(null);
  const router = useRouter();

  const [formData, setFormData] = useState<EditPostForm>({
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
      router.push('/admin');
      return;
    }
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, [isAuthenticated, getStoredUser, router]);

  // Load categories and post data
  const loadCategories = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/v1/categories?limit=100');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load categories',
        life: 3000
      });
    }
  }, []);

  const loadPost = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/v1/posts/${postId}`);
      const postData = response.data.post;
      setPost(postData);
      
      // Populate form with existing data
      setFormData({
        title: postData.title || '',
        content: postData.content || '',
        excerpt: postData.excerpt || '',
        featured_image: postData.featured_image || '',
        status: postData.status || 'draft',
        is_published: postData.is_published || false,
        category_id: postData.category?.id || ''
      });
    } catch (error) {
      console.error('Error loading post:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load post',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadCategories();
    loadPost();
  }, [loadCategories, loadPost]);

  const handleInputChange = (field: keyof EditPostForm, value: any) => {
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

      await apiClient.put(`/api/v1/posts/${postId}`, postData);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Post updated successfully',
        life: 3000
      });

      // Redirect to posts list
      setTimeout(() => {
        router.push('/admin/posts');
      }, 1000);

    } catch (error: any) {
      console.error('Error updating post:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update post';
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
    router.push('/admin/posts');
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

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex align-items-center justify-content-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-900 mb-2">Post Not Found</h2>
            <p className="text-600 mb-4">The post you&apos;re looking for doesn&apos;t exist.</p>
            <Button
              label="Back to Posts"
              icon="pi pi-arrow-left"
              onClick={handleCancel}
            />
          </div>
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
              <h1 className="text-2xl font-bold text-900 m-0">Edit Post</h1>
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
                    <RichTextEditor
                      value={formData.content}
                      onChange={(content) => handleInputChange('content', content)}
                      className="w-full"
                      placeholder="Enter post content"
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

                {/* Post Info */}
                <div className="col-12">
                  <div className="bg-gray-50 border-round p-3">
                    <h3 className="text-lg font-semibold text-900 mb-2">Post Information</h3>
                    <div className="grid">
                      <div className="col-12 md:col-4">
                        <p className="text-600 text-sm mb-1">Author</p>
                        <p className="text-900 font-medium">
                          {post.author.first_name} {post.author.last_name} ({post.author.username})
                        </p>
                      </div>
                      <div className="col-12 md:col-4">
                        <p className="text-600 text-sm mb-1">Created</p>
                        <p className="text-900">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="col-12 md:col-4">
                        <p className="text-600 text-sm mb-1">Last Updated</p>
                        <p className="text-900">
                          {new Date(post.updated_at).toLocaleDateString()}
                        </p>
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
                  label="Update Post"
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
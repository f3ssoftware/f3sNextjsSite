'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';
import { useLogin } from '@/hooks/useLogin';
// import { useLoading } from '@/components/LoadingProvider';
import apiClient from '@/lib/api-client';
import { useRouter, usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useLocale } from '@/hooks/useLocale';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Loading skeleton component
const PostsSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton height="2rem" width="200px" />
      <Skeleton height="2rem" width="120px" />
    </div>
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex space-x-4 p-4 border rounded">
          <Skeleton height="1rem" width="30%" />
          <Skeleton height="1rem" width="20%" />
          <Skeleton height="1rem" width="15%" />
          <Skeleton height="1rem" width="15%" />
          <Skeleton height="1rem" width="20%" />
        </div>
      ))}
    </div>
  </div>
);

export default function AdminPostsPage() {
  const { isAuthenticated, getStoredUser } = useLogin();
  // const { showLoading, hideLoading } = useLoading();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { currentLocale } = useLocale();

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

  // Load posts when filters change
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: rowsPerPage.toString(),
      });

      if (selectedCategory) {
        params.append('category_id', selectedCategory);
      }

      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await apiClient.get(`/api/v1/posts?${params.toString()}`);
      setPosts(response.posts || []);
      setTotalRecords(response.pagination?.total || 0);
    } catch (error: any) {
      console.error('Error loading posts:', error);
      
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
        detail: error.message || 'Failed to load posts',
        life: 3000
      });
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [currentPage, rowsPerPage, selectedCategory, statusFilter, currentLocale, router]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const loadCategories = async () => {
    try {
      const response = await apiClient.get('/api/v1/categories?limit=100');
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load categories',
        life: 3000
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await apiClient.delete(`/api/v1/posts/${postId}`);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Post deleted successfully',
        life: 3000
      });
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete post',
        life: 3000
      });
    }
  };

  const confirmDelete = (post: Post) => {
    confirmDialog({
      message: `Are you sure you want to delete "${post.title}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleDeletePost(post.id),
    });
  };

  const handleCreatePost = () => {
    // showLoading();
    router.push(`/${currentLocale}/admin/posts/create`);
  };

  const handleEditPost = (postId: string) => {
    // showLoading();
    router.push(`/${currentLocale}/admin/posts/${postId}/edit`);
  };

  const statusBodyTemplate = (rowData: Post) => {
    const getStatusSeverity = (status: string) => {
      switch (status) {
        case 'published':
          return 'success';
        case 'draft':
          return 'warning';
        case 'archived':
          return 'danger';
        default:
          return 'info';
      }
    };

    return (
      <Tag
        value={rowData.status}
        severity={getStatusSeverity(rowData.status)}
        className="text-sm"
      />
    );
  };

  const publishedBodyTemplate = (rowData: Post) => {
    return (
      <Tag
        value={rowData.is_published ? 'Published' : 'Draft'}
        severity={rowData.is_published ? 'success' : 'warning'}
        className="text-sm"
      />
    );
  };

  const categoryBodyTemplate = (rowData: Post) => {
    return rowData.category ? (
      <Tag value={rowData.category.name} severity="info" className="text-sm" />
    ) : (
      <span className="text-500 text-sm">No category</span>
    );
  };

  const authorBodyTemplate = (rowData: Post) => {
    return (
      <div className="flex flex-column">
        <span className="font-medium">{rowData.author.username}</span>
        <span className="text-500 text-sm">
          {rowData.author.first_name} {rowData.author.last_name}
        </span>
      </div>
    );
  };

  const dateBodyTemplate = (rowData: Post, field: string) => {
    const date = new Date(rowData[field as keyof Post] as string);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const actionsBodyTemplate = (rowData: Post) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          severity="info"
          size="small"
          tooltip="View Post"
          onClick={() => router.push(`/${currentLocale}/posts/${rowData.slug}`)}
        />
        <Button
          icon="pi pi-pencil"
          severity="secondary"
          size="small"
          tooltip="Edit Post"
          onClick={() => handleEditPost(rowData.id)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          size="small"
          tooltip="Delete Post"
          onClick={() => confirmDelete(rowData)}
        />
      </div>
    );
  };

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' }
  ];

  const categoryOptions = [
    { label: 'All Categories', value: '' },
    ...categories.map(cat => ({ label: cat.name, value: cat.id }))
  ];

  const onPageChange = (event: any) => {
    setCurrentPage(event.page + 1);
    setRowsPerPage(event.rows);
  };

  const onGlobalFilterChange = (event: any) => {
    setGlobalFilter(event.target.value);
  };

  const header = (
    <div className="flex flex-column gap-4">
      <div className="flex justify-content-between align-items-center">
        <h1 className="text-2xl font-bold text-900 m-0">Posts Management</h1>
        <Button
          label="Create New Post"
          icon="pi pi-plus"
          severity="success"
          onClick={handleCreatePost}
        />
      </div>
      
      <div className="flex flex-column md:flex-row gap-3">
        <div className="flex-1">
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search" />
            <InputText
              value={globalFilter}
              onChange={onGlobalFilterChange}
              placeholder="Search posts..."
              className="w-full"
            />
          </span>
        </div>
        
        <div className="flex gap-3">
          <Dropdown
            value={selectedCategory}
            options={categoryOptions}
            onChange={(e) => setSelectedCategory(e.value)}
            placeholder="Filter by Category"
            className="min-w-200px"
          />
          
          <Dropdown
            value={statusFilter}
            options={statusOptions}
            onChange={(e) => setStatusFilter(e.value)}
            placeholder="Filter by Status"
            className="min-w-200px"
          />
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated()) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="p-6">
        <PostsSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <Card>
            <DataTable
              value={posts}
              paginator
              rows={rowsPerPage}
              rowsPerPageOptions={[10, 20, 50]}
              totalRecords={totalRecords}
              lazy
              loading={loading}
              header={header}
              onPage={onPageChange}
              globalFilter={globalFilter}
              emptyMessage="No posts found."
              className="p-datatable-sm"
              stripedRows
              showGridlines
              responsiveLayout="scroll"
            >
              <Column field="title" header="Title" sortable style={{ minWidth: '200px' }} />
              <Column field="excerpt" header="Excerpt" style={{ minWidth: '250px' }} />
              <Column field="status" header="Status" body={statusBodyTemplate} style={{ width: '120px' }} />
              <Column field="is_published" header="Published" body={publishedBodyTemplate} style={{ width: '100px' }} />
              <Column field="category" header="Category" body={categoryBodyTemplate} style={{ width: '120px' }} />
              <Column field="author" header="Author" body={authorBodyTemplate} style={{ width: '150px' }} />
              <Column field="created_at" header="Created" body={(rowData) => dateBodyTemplate(rowData, 'created_at')} style={{ width: '150px' }} />
              <Column field="updated_at" header="Updated" body={(rowData) => dateBodyTemplate(rowData, 'updated_at')} style={{ width: '150px' }} />
              <Column header="Actions" body={actionsBodyTemplate} style={{ width: '120px' }} />
            </DataTable>
          </Card>
        </div>
      </div>

      <Toast ref={toast} />
      <ConfirmDialog />
    </div>
  );
} 
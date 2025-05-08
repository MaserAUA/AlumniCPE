import React, { useState, useCallback } from 'react';
import { FaTimes, FaTrashAlt, FaImage } from 'react-icons/fa';
import { useUpdatePost } from '../../hooks/usePost';
import { useUploadFile } from "../../hooks/useUploadFile";
import { Post } from '../../models/postType';
import BaseModal from '../common/BaseModal';
import { redirect } from 'react-router-dom';

const postTypeOptions = [
  { value: 'event', label: 'Event' },
  { value: 'story', label: 'Story' },
  { value: 'job', label: 'Job' },
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'showcase', label: 'Showcase' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'survey', label: 'Survey' },
]

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onClose }) => {
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
    redirect_link: post.redirect_link,
    post_type: post.post_type || '',
    start_date: post.start_date || '',
    end_date: post.end_date || '',
  });
  const [mediaUrls, setMediaUrls] = useState<string[]>(post.media_urls || []);
  const [images, setImages] = useState<File[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updatePostMutation = useUpdatePost();
  const uploadFileMutation = useUploadFile();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files);
      const newPreviews = newImages.map(file => URL.createObjectURL(file));

      setImages(prev => [...prev, ...newImages]);
      setMediaUrls(prev => [...prev, ...newPreviews]); // Combine preview with existing
    }
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    const removedUrl = mediaUrls[index];

    setMediaUrls(prev => prev.filter((_, i) => i !== index));

    if (removedUrl.startsWith("blob:")) {
      const previewBlobs = mediaUrls.filter(url => url.startsWith("blob:"));
      const blobIndex = previewBlobs.findIndex(url => url === removedUrl);
      if (blobIndex !== -1) {
        setImages(prev => prev.filter((_, i) => i !== blobIndex));
      }
    }
  }, [mediaUrls]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const previewBlobs = mediaUrls.filter(url => url.startsWith("blob:"));
        const existingUrls = mediaUrls.filter(url => !url.startsWith("blob:"));

        const uploadedResults = await Promise.all(
          images.map(file => uploadFileMutation.mutateAsync(file))
        );

        const uploadedUrls = uploadedResults.map(res => res.url);

        const finalMediaUrls = [...existingUrls, ...uploadedUrls];

        const updatedPost = {
          ...post,
          ...formData,
          media_urls: finalMediaUrls,
        };

        updatePostMutation.mutate(updatedPost);
        onClose();
      } catch (error) {
        console.error("Error saving post:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, mediaUrls, images, post]
  );

  return (
    <BaseModal isOpen={true} onClose={onClose} size="lg">
      <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Post</h2>
            <button onClick={onClose} disabled={isSubmitting} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField id="title" label="Title *" value={formData.title} onChange={handleInputChange} required />
            <TextAreaField id="content" label="Content *" value={formData.content} onChange={handleInputChange} required />
            <InputField id="redirect_link" label="Rediect Link" value={formData.redirect_link} onChange={handleInputChange} required />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField
                id="post_type"
                label="Post Type"
                value={formData.post_type}
                onChange={handleInputChange}
                options={postTypeOptions}
              />
              <InputField
                id="start_date"
                label="Start Date"
                type="date"
                value={formData.start_date ? formData.start_date.slice(0, 10) : ''}
                onChange={handleInputChange}
              />
              <InputField
              id="end_date"
              label="End Date"
              type="date"
              value={formData.end_date ? formData.end_date.slice(0, 10) : ''}
              onChange={handleInputChange} />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Images</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaUrls.map((url, idx) => (
                  <ImagePreview key={idx} src={url} onRemove={() => handleRemoveImage(idx)} />
                ))}
              </div>
              <label className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                <FaImage className="mr-2" /> Add Images
                <input type="file" accept="image/*" className="hidden" multiple onChange={handleImageUpload} />
              </label>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end space-x-3">
              <Button type="button" variant="cancel" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? <LoadingSpinner text="Saving..." /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
    </BaseModal>
  );
};

const SelectField  = ({ id, label, value, onChange, options }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-700 dark:text-white"
      >
        <option value="">Select a category</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const InputField = ({ id, label, type = "text", value, onChange, required = false }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-700 dark:text-white"
    />
  </div>
);

const TextAreaField = ({ id, label, value, onChange, required = false }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
    <textarea
      id={id}
      name={id}
      rows={6}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-700 dark:text-white"
    />
  </div>
);

const ImagePreview = ({ src, onRemove }: { src: string; onRemove: () => void }) => (
  <div className="relative group">
    <img src={src} alt="preview" className="w-full h-32 object-cover rounded-lg" />
    <button type="button" onClick={onRemove} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Remove image">
      <FaTrashAlt size={12} />
    </button>
  </div>
);

const Button = ({ children, type, variant, ...props }: any) => {
  const baseStyle = "px-4 py-2 rounded-lg transition-colors flex items-center";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    cancel: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600",
  };
  return (
    <button type={type} className={`${baseStyle} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};

const LoadingSpinner = ({ text }: { text: string }) => (
  <>
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
    {text}
  </>
);

export default EditPostModal;

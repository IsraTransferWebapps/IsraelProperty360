import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, AlertCircle, Upload, X, Video } from 'lucide-react';

export default function AdminSetupBlogPage() {
  const [experts, setExperts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [result, setResult] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'buying_guide',
    author_expert_id: '',
    tags: '',
    image_url: '',
    video_url: '',
    audio_url: '',
    featured: false,
    published: true
  });

  useEffect(() => {
    loadExperts();
  }, []);

  const loadExperts = async () => {
    try {
      const data = await base44.entities.Expert.list();
      setExperts(data);
    } catch (error) {
      console.error('Error loading experts:', error);
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      setResult({
        success: false,
        message: 'Video file must be less than 100MB'
      });
      return;
    }

    if (!file.type.startsWith('video/')) {
      setResult({
        success: false,
        message: 'Please upload a video file'
      });
      return;
    }

    setIsUploadingVideo(true);
    setResult(null);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, video_url: file_url }));
      setResult({
        success: true,
        message: 'Video uploaded successfully!'
      });
    } catch (err) {
      console.error('Video upload error:', err);
      setResult({
        success: false,
        message: 'Failed to upload video. Please try again.'
      });
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setResult({
        success: false,
        message: 'Audio file must be less than 50MB'
      });
      return;
    }

    if (!file.type.startsWith('audio/')) {
      setResult({
        success: false,
        message: 'Please upload an audio file'
      });
      return;
    }

    setIsUploadingAudio(true);
    setResult(null);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, audio_url: file_url }));
      setResult({
        success: true,
        message: 'Audio uploaded successfully!'
      });
    } catch (err) {
      console.error('Audio upload error:', err);
      setResult({
        success: false,
        message: 'Failed to upload audio. Please try again.'
      });
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setResult(null);

    try {
      const selectedExpert = experts.find(e => e.id === formData.author_expert_id);
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const postData = {
        title: formData.title,
        slug: slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        author_expert_id: formData.author_expert_id || null,
        author_name: selectedExpert ? selectedExpert.name : 'IsraelProperty360 Team',
        author_expertise: selectedExpert ? selectedExpert.expertise : null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        image_url: formData.image_url || undefined,
        video_url: formData.video_url || undefined,
        audio_url: formData.audio_url || undefined,
        featured: formData.featured,
        published: formData.published
      };

      await base44.entities.BlogPost.create(postData);

      setResult({
        success: true,
        message: 'Blog post created successfully!'
      });

      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'buying_guide',
        author_expert_id: '',
        tags: '',
        image_url: '',
        video_url: '',
        audio_url: '',
        featured: false,
        published: true
      });

    } catch (error) {
      console.error('Error creating blog post:', error);
      setResult({
        success: false,
        message: 'Error creating blog post: ' + error.message
      });
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Blog Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter blog post title"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Short summary of the post"
                />
              </div>

              <div>
                <Label htmlFor="content">Content (Markdown) *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={15}
                  placeholder="Write your blog post content here (supports markdown formatting)"
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="market_trends">Market Trends</SelectItem>
                      <SelectItem value="buying_guide">Buying Guide</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="author_expert_id">Author (Expert)</Label>
                  <Select value={formData.author_expert_id} onValueChange={(value) => setFormData(prev => ({ ...prev, author_expert_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expert or leave blank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>IsraelProperty360 Team</SelectItem>
                      {experts.map(expert => (
                        <SelectItem key={expert.id} value={expert.id}>
                          {expert.name} - {expert.expertise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., property law, buying guide, Tel Aviv"
                />
              </div>

              <div>
                <Label htmlFor="image_url">Featured Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="video">Featured Video</Label>
                <div className="space-y-3">
                  <Input
                    id="video_url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleChange}
                    placeholder="YouTube/Vimeo URL or upload a video below"
                  />
                  
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('video-upload').click()}
                      disabled={isUploadingVideo}
                    >
                      {isUploadingVideo ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Video
                        </>
                      )}
                    </Button>
                    
                    {formData.video_url && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, video_url: '' }))}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear Video
                      </Button>
                    )}
                  </div>
                  
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  
                  {formData.video_url && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                      <Video className="w-4 h-4" />
                      <span>Video set</span>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Upload a video (max 100MB) or paste a YouTube/Vimeo URL
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="audio">Audio Recording (Podcast)</Label>
                <div className="space-y-3">
                  <Input
                    id="audio_url"
                    name="audio_url"
                    value={formData.audio_url}
                    onChange={handleChange}
                    placeholder="Audio URL or upload an audio file below"
                  />
                  
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('audio-upload').click()}
                      disabled={isUploadingAudio}
                    >
                      {isUploadingAudio ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Audio
                        </>
                      )}
                    </Button>
                    
                    {formData.audio_url && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, audio_url: '' }))}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear Audio
                      </Button>
                    )}
                  </div>
                  
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                  
                  {formData.audio_url && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                      <span>Audio set</span>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Upload an audio file (max 50MB, MP3/WAV) or paste a direct audio URL
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">Featured Post</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="published" className="cursor-pointer">Publish Immediately</Label>
                </div>
              </div>

              {result && (
                <div className={`flex items-center gap-3 p-4 rounded-lg ${
                  result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  {result.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                  <p className={result.success ? 'text-green-900' : 'text-red-900'}>
                    {result.message}
                  </p>
                </div>
              )}

              <Button 
                type="submit"
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Post...
                  </>
                ) : (
                  'Create Blog Post'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
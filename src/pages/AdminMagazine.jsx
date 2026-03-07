import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  MAGAZINE_CATEGORIES,
  CATEGORY_ORDER,
  MONTH_NAMES,
  generateSlug,
} from "@/components/magazine/magazineConstants";

const emptyIssue = {
  title: "",
  description: "",
  month: "",
  year: new Date().getFullYear().toString(),
  cover_image_url: "",
  published: false,
  featured: false,
};

const emptyArticle = {
  issue_id: "",
  title: "",
  excerpt: "",
  content: "",
  category: "editorial",
  author_expert_id: "",
  author_name: "",
  image_url: "",
  display_order: 0,
  published: false,
};

export default function AdminMagazinePage() {
  const [issues, setIssues] = useState([]);
  const [experts, setExperts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedIssueId, setSelectedIssueId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [editingIssue, setEditingIssue] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const [issueForm, setIssueForm] = useState({ ...emptyIssue });
  const [articleForm, setArticleForm] = useState({ ...emptyArticle });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedIssueId) loadArticles(selectedIssueId);
  }, [selectedIssueId]);

  const loadData = async () => {
    try {
      const [issueData, expertData] = await Promise.all([
        base44.entities.MagazineIssue.list("-created_date"),
        base44.entities.Expert.list(),
      ]);
      issueData.sort((a, b) => b.year - a.year || b.month - a.month);
      setIssues(issueData);
      setExperts(expertData);
      if (issueData.length > 0 && !selectedIssueId) {
        setSelectedIssueId(issueData[0].id);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const loadArticles = async (issueId) => {
    try {
      const data = await base44.entities.MagazineArticle.filter(
        { issue_id: issueId },
        "display_order"
      );
      setArticles(data);
    } catch (error) {
      console.error("Error loading articles:", error);
      setArticles([]);
    }
  };

  // --- Issue CRUD ---
  const handleSaveIssue = async () => {
    setIsSaving(true);
    setResult(null);
    try {
      const slug =
        generateSlug(MONTH_NAMES[parseInt(issueForm.month)] + "-" + issueForm.year);
      const payload = {
        ...issueForm,
        slug,
        month: parseInt(issueForm.month),
        year: parseInt(issueForm.year),
      };

      if (editingIssue) {
        await base44.entities.MagazineIssue.update(editingIssue.id, payload);
        setResult({ success: true, message: "Issue updated successfully" });
      } else {
        await base44.entities.MagazineIssue.create(payload);
        setResult({ success: true, message: "Issue created successfully" });
      }
      setIssueForm({ ...emptyIssue });
      setEditingIssue(null);
      await loadData();
    } catch (error) {
      setResult({
        success: false,
        message: error.message || "Error saving issue",
      });
    }
    setIsSaving(false);
  };

  const handleEditIssue = (issue) => {
    setEditingIssue(issue);
    setIssueForm({
      title: issue.title,
      description: issue.description || "",
      month: issue.month.toString(),
      year: issue.year.toString(),
      cover_image_url: issue.cover_image_url || "",
      published: issue.published,
      featured: issue.featured,
    });
  };

  const handleDeleteIssue = async (issueId) => {
    if (!confirm("Delete this issue and all its articles?")) return;
    try {
      await base44.entities.MagazineIssue.delete(issueId);
      await loadData();
      if (selectedIssueId === issueId) {
        setSelectedIssueId("");
        setArticles([]);
      }
      setResult({ success: true, message: "Issue deleted" });
    } catch (error) {
      setResult({ success: false, message: "Error deleting issue" });
    }
  };

  // --- Article CRUD ---
  const handleSaveArticle = async () => {
    setIsSaving(true);
    setResult(null);
    try {
      const slug = generateSlug(articleForm.title);
      const expert = experts.find((e) => e.id === articleForm.author_expert_id);
      const payload = {
        ...articleForm,
        slug,
        issue_id: articleForm.issue_id || selectedIssueId,
        display_order: parseInt(articleForm.display_order) || 0,
        author_name: articleForm.author_name || expert?.name || "",
        author_expert_id: articleForm.author_expert_id || null,
      };

      if (editingArticle) {
        await base44.entities.MagazineArticle.update(editingArticle.id, payload);
        setResult({ success: true, message: "Article updated successfully" });
      } else {
        await base44.entities.MagazineArticle.create(payload);
        setResult({ success: true, message: "Article created successfully" });
      }
      setArticleForm({ ...emptyArticle, issue_id: selectedIssueId });
      setEditingArticle(null);
      await loadArticles(selectedIssueId);
    } catch (error) {
      setResult({
        success: false,
        message: error.message || "Error saving article",
      });
    }
    setIsSaving(false);
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setArticleForm({
      issue_id: article.issue_id,
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content || "",
      category: article.category,
      author_expert_id: article.author_expert_id || "",
      author_name: article.author_name || "",
      image_url: article.image_url || "",
      display_order: article.display_order || 0,
      published: article.published,
    });
  };

  const handleDeleteArticle = async (articleId) => {
    if (!confirm("Delete this article?")) return;
    try {
      await base44.entities.MagazineArticle.delete(articleId);
      await loadArticles(selectedIssueId);
      setResult({ success: true, message: "Article deleted" });
    } catch (error) {
      setResult({ success: false, message: "Error deleting article" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8 text-amber-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Magazine Manager</h1>
            <p className="text-gray-500">Create and manage magazine issues and articles</p>
          </div>
        </div>

        {/* Status Message */}
        {result && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              result.success
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {result.success ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {result.message}
          </div>
        )}

        <Tabs defaultValue="issues">
          <TabsList className="mb-6">
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>

          {/* ============ ISSUES TAB ============ */}
          <TabsContent value="issues">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Issue Form */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingIssue ? "Edit Issue" : "Create New Issue"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={issueForm.title}
                      onChange={(e) =>
                        setIssueForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="e.g. Spring Property Guide"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Month</Label>
                      <Select
                        value={issueForm.month}
                        onValueChange={(v) =>
                          setIssueForm((p) => ({ ...p, month: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTH_NAMES.slice(1).map((m, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        type="number"
                        value={issueForm.year}
                        onChange={(e) =>
                          setIssueForm((p) => ({ ...p, year: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={issueForm.description}
                      onChange={(e) =>
                        setIssueForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Brief description of this issue"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Cover Image URL</Label>
                    <Input
                      value={issueForm.cover_image_url}
                      onChange={(e) =>
                        setIssueForm((p) => ({
                          ...p,
                          cover_image_url: e.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                    {issueForm.cover_image_url && (
                      <img
                        src={issueForm.cover_image_url}
                        alt="Preview"
                        className="mt-2 h-32 w-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={issueForm.published}
                        onChange={(e) =>
                          setIssueForm((p) => ({
                            ...p,
                            published: e.target.checked,
                          }))
                        }
                        className="rounded"
                      />
                      <span className="text-sm">Published</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={issueForm.featured}
                        onChange={(e) =>
                          setIssueForm((p) => ({
                            ...p,
                            featured: e.target.checked,
                          }))
                        }
                        className="rounded"
                      />
                      <span className="text-sm">Featured</span>
                    </label>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleSaveIssue}
                      disabled={
                        isSaving || !issueForm.title || !issueForm.month || !issueForm.year
                      }
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingIssue ? "Update Issue" : "Create Issue"}
                    </Button>
                    {editingIssue && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingIssue(null);
                          setIssueForm({ ...emptyIssue });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Issues List */}
              <Card>
                <CardHeader>
                  <CardTitle>All Issues ({issues.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {issues.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No issues yet. Create your first one!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {issues.map((issue) => (
                        <div
                          key={issue.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          {issue.cover_image_url && (
                            <img
                              src={issue.cover_image_url}
                              alt=""
                              className="w-16 h-12 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {issue.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {MONTH_NAMES[issue.month]} {issue.year}
                            </p>
                          </div>
                          <Badge
                            variant={issue.published ? "default" : "secondary"}
                            className={
                              issue.published
                                ? "bg-green-100 text-green-700"
                                : ""
                            }
                          >
                            {issue.published ? (
                              <Eye className="w-3 h-3 mr-1" />
                            ) : (
                              <EyeOff className="w-3 h-3 mr-1" />
                            )}
                            {issue.published ? "Live" : "Draft"}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditIssue(issue)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteIssue(issue.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ============ ARTICLES TAB ============ */}
          <TabsContent value="articles">
            {/* Issue Selector */}
            <div className="mb-6">
              <Label>Select Issue</Label>
              <Select value={selectedIssueId} onValueChange={setSelectedIssueId}>
                <SelectTrigger className="w-full max-w-sm">
                  <SelectValue placeholder="Choose an issue" />
                </SelectTrigger>
                <SelectContent>
                  {issues.map((issue) => (
                    <SelectItem key={issue.id} value={issue.id}>
                      {MONTH_NAMES[issue.month]} {issue.year} — {issue.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedIssueId ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Article Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {editingArticle ? "Edit Article" : "Add New Article"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={articleForm.title}
                        onChange={(e) =>
                          setArticleForm((p) => ({ ...p, title: e.target.value }))
                        }
                        placeholder="Article title"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Category</Label>
                        <Select
                          value={articleForm.category}
                          onValueChange={(v) =>
                            setArticleForm((p) => ({ ...p, category: v }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORY_ORDER.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {MAGAZINE_CATEGORIES[cat].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Display Order</Label>
                        <Input
                          type="number"
                          value={articleForm.display_order}
                          onChange={(e) =>
                            setArticleForm((p) => ({
                              ...p,
                              display_order: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Author Expert</Label>
                      <Select
                        value={articleForm.author_expert_id}
                        onValueChange={(v) => {
                          const expert = experts.find((e) => e.id === v);
                          setArticleForm((p) => ({
                            ...p,
                            author_expert_id: v,
                            author_name: expert?.name || p.author_name,
                          }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select author (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {experts.map((expert) => (
                            <SelectItem key={expert.id} value={expert.id}>
                              {expert.name}{" "}
                              {expert.expertise && `(${expert.expertise})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Author Name (override)</Label>
                      <Input
                        value={articleForm.author_name}
                        onChange={(e) =>
                          setArticleForm((p) => ({
                            ...p,
                            author_name: e.target.value,
                          }))
                        }
                        placeholder="Overrides expert name if set"
                      />
                    </div>
                    <div>
                      <Label>Excerpt</Label>
                      <Textarea
                        value={articleForm.excerpt}
                        onChange={(e) =>
                          setArticleForm((p) => ({
                            ...p,
                            excerpt: e.target.value,
                          }))
                        }
                        placeholder="Short preview text"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Content (Markdown)</Label>
                      <Textarea
                        value={articleForm.content}
                        onChange={(e) =>
                          setArticleForm((p) => ({
                            ...p,
                            content: e.target.value,
                          }))
                        }
                        placeholder="Full article content in Markdown..."
                        rows={12}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <Label>Image URL</Label>
                      <Input
                        value={articleForm.image_url}
                        onChange={(e) =>
                          setArticleForm((p) => ({
                            ...p,
                            image_url: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                      />
                      {articleForm.image_url && (
                        <img
                          src={articleForm.image_url}
                          alt="Preview"
                          className="mt-2 h-24 w-full object-cover rounded"
                        />
                      )}
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={articleForm.published}
                        onChange={(e) =>
                          setArticleForm((p) => ({
                            ...p,
                            published: e.target.checked,
                          }))
                        }
                        className="rounded"
                      />
                      <span className="text-sm">Published</span>
                    </label>
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={handleSaveArticle}
                        disabled={isSaving || !articleForm.title || !articleForm.category}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        {isSaving && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        {editingArticle ? "Update Article" : "Add Article"}
                      </Button>
                      {editingArticle && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingArticle(null);
                            setArticleForm({
                              ...emptyArticle,
                              issue_id: selectedIssueId,
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Articles List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Articles in Issue ({articles.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {articles.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No articles yet. Add your first article!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {articles.map((article) => {
                          const catInfo =
                            MAGAZINE_CATEGORIES[article.category] ||
                            MAGAZINE_CATEGORIES.editorial;
                          return (
                            <div
                              key={article.id}
                              className={`p-3 bg-gray-50 rounded-lg border-l-4 ${catInfo.accent}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">
                                    {article.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      className={`${catInfo.color} text-xs`}
                                    >
                                      {catInfo.label}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      #{article.display_order} •{" "}
                                      {article.author_name || "No author"}
                                    </span>
                                  </div>
                                </div>
                                <Badge
                                  variant={
                                    article.published ? "default" : "secondary"
                                  }
                                  className={
                                    article.published
                                      ? "bg-green-100 text-green-700"
                                      : ""
                                  }
                                >
                                  {article.published ? "Live" : "Draft"}
                                </Badge>
                              </div>
                              <div className="flex gap-1 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditArticle(article)}
                                >
                                  <Pencil className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteArticle(article.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select an issue above to manage its articles.</p>
                  <p className="text-sm mt-1">
                    Create an issue first in the Issues tab if you haven't yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

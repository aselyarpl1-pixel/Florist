import { useState, useMemo, useEffect } from "react";
import { Plus, Pencil, Trash2, Star, Search, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  useTestimonials, 
  useCreateTestimonial, 
  useUpdateTestimonial, 
  useDeleteTestimonial,
  TESTIMONIALS_QUERY_KEY,
  useTestimonialsContent,
  useSaveTestimonialsContent
} from "@/hooks/useTestimonials";
import { Testimonial, testimonialsApi, TestimonialsContent } from "@/lib/api";
import { testimonials as defaultTestimonials } from "@/data/testimonials";
import { useQueryClient } from "@tanstack/react-query";

const Testimonials = () => {
  const queryClient = useQueryClient();
  const { data: testimonials = [], isLoading } = useTestimonials();
  const { data: serverContent, isLoading: isContentLoading } = useTestimonialsContent();
  const { mutate: saveContent, isPending: isSavingContent } = useSaveTestimonialsContent();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  // Content state
  const [heroContent, setHeroContent] = useState({
    subtitle: "Testimoni",
    title: "Kepuasan",
    titleHighlight: "Pelanggan",
    description: "Baca pengalaman nyata dari ribuan pelanggan yang telah mempercayakan momen spesial mereka kepada Florist.",
  });

  const [ctaContent, setCtaContent] = useState({
    title: "Ingin Menjadi Pelanggan",
    titleHighlight: "Berikutnya?",
    description: "Bergabunglah dengan ribuan pelanggan puas lainnya. Hubungi kami sekarang dan rasakan pelayanan terbaik dari Florist!",
    buttonText: "Hubungi Kami via WhatsApp",
  });

  useEffect(() => {
    if (serverContent) {
      if (serverContent.hero) setHeroContent(serverContent.hero);
      if (serverContent.cta) setCtaContent(serverContent.cta);
    }
  }, [serverContent]);

  const handleSaveContent = () => {
    const payload: TestimonialsContent = {
      hero: heroContent,
      cta: ctaContent,
    };
    
    saveContent(payload, {
      onSuccess: () => {
        toast.success("Konten halaman testimoni berhasil disimpan");
      },
      onError: (err) => {
        console.error(err);
        toast.error("Gagal menyimpan konten");
      }
    });
  };

  // Auto-sync default testimonials if list is empty
  useEffect(() => {
    if (!isLoading && testimonials.length === 0) {
      const syncDefaultTestimonials = async () => {
        try {
          let count = 0;
          for (const t of defaultTestimonials) {
            await testimonialsApi.create({
              name: t.name,
              role: t.role,
              content: t.content,
              rating: t.rating,
              product: t.product,
              is_approved: true,
            });
            count++;
          }
          
          if (count > 0) {
            toast.success(`Data testimoni berhasil diinisialisasi (${count} testimoni)`);
            queryClient.invalidateQueries({ queryKey: TESTIMONIALS_QUERY_KEY });
          }
        } catch (error) {
          console.error("Failed to auto-sync testimonials:", error);
        }
      };
      
      syncDefaultTestimonials();
    }
  }, [isLoading, testimonials.length, queryClient]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deletingTestimonial, setDeletingTestimonial] = useState<Testimonial | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTestimonials = useMemo(() => {
    return searchQuery
      ? testimonials.filter((t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.product && t.product.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : testimonials;
  }, [testimonials, searchQuery]);

  const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE);
  const paginatedTestimonials = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTestimonials.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTestimonials, currentPage]);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
    product: "",
  });

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        role: testimonial.role || "",
        content: testimonial.content,
        rating: testimonial.rating,
        product: testimonial.product || "",
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: "",
        role: "",
        content: "",
        rating: 5,
        product: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    // Validasi field wajib
    if (!formData.name) {
      toast.error("Nama pelanggan wajib diisi");
      return;
    }
    if (!formData.content) {
      toast.error("Isi testimoni wajib diisi");
      return;
    }

    try {
      if (editingTestimonial) {
        await updateMutation.mutateAsync({
          id: editingTestimonial.id,
          updates: formData,
        });
        toast.success("Testimoni berhasil diupdate");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Testimoni berhasil ditambahkan");
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
      console.error("Error saving testimonial:", error);
    }
  };

  const handleDelete = async () => {
    if (deletingTestimonial) {
      try {
        await deleteMutation.mutateAsync(deletingTestimonial.id);
        toast.success("Testimoni berhasil dihapus");
        setDeleteDialogOpen(false);
        setDeletingTestimonial(null);
      } catch (error) {
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
        console.error("Error deleting testimonial:", error);
      }
    }
  };

  if (isLoading || isContentLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Manajemen Testimoni
          </h1>
          <p className="text-muted-foreground mt-2">
            Kelola testimoni pelanggan dan konten halaman
          </p>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Daftar Testimoni</TabsTrigger>
          <TabsTrigger value="content">Konten Halaman</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari testimoni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Tambah Testimoni
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="max-w-md">Testimoni</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTestimonials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Tidak ada testimoni ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTestimonials.map((testimonial) => (
                      <TableRow key={testimonial.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{testimonial.product || "-"}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < testimonial.rating
                                    ? "fill-primary text-primary"
                                    : "fill-muted text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-sm line-clamp-2 italic">"{testimonial.content}"</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(testimonial)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setDeletingTestimonial(testimonial);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Menampilkan {paginatedTestimonials.length} dari {filteredTestimonials.length} testimoni
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className="w-8 h-8 p-0"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>
                  Edit judul dan deskripsi utama halaman testimoni
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={heroContent.subtitle}
                    onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul Utama</Label>
                    <Input
                      id="title"
                      value={heroContent.title}
                      onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="titleHighlight">Highlight</Label>
                    <Input
                      id="titleHighlight"
                      value={heroContent.titleHighlight}
                      onChange={(e) => setHeroContent({ ...heroContent, titleHighlight: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={heroContent.description}
                    onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card>
              <CardHeader>
                <CardTitle>CTA Section</CardTitle>
                <CardDescription>
                  Edit ajakan (Call to Action) di bagian bawah halaman
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ctaTitle">Judul CTA</Label>
                    <Input
                      id="ctaTitle"
                      value={ctaContent.title}
                      onChange={(e) => setCtaContent({ ...ctaContent, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaHighlight">Highlight</Label>
                    <Input
                      id="ctaHighlight"
                      value={ctaContent.titleHighlight}
                      onChange={(e) => setCtaContent({ ...ctaContent, titleHighlight: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaDesc">Deskripsi CTA</Label>
                  <Textarea
                    id="ctaDesc"
                    rows={4}
                    value={ctaContent.description}
                    onChange={(e) => setCtaContent({ ...ctaContent, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="btnText">Teks Tombol</Label>
                  <Input
                    id="btnText"
                    value={ctaContent.buttonText}
                    onChange={(e) => setCtaContent({ ...ctaContent, buttonText: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveContent} disabled={isSavingContent} className="gap-2">
              <Save className="w-4 h-4" />
              {isSavingContent ? "Menyimpan..." : "Simpan Konten Halaman"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? "Edit Testimoni" : "Tambah Testimoni Baru"}
            </DialogTitle>
            <DialogDescription>
              Isi formulir di bawah ini untuk {editingTestimonial ? "mengubah" : "menambahkan"} testimoni pelanggan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Pelanggan *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Sarah Wijaya"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role/Pekerjaan</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Contoh: Pengusaha"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Isi Testimoni *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Tulis testimoni pelanggan..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: value })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        value <= formData.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Nama Produk (Opsional)</Label>
              <Input
                id="product"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                placeholder="Contoh: Buket Mawar Merah Premium"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Testimoni</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus testimoni ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Apakah Anda yakin ingin menghapus testimoni dari{" "}
              <span className="font-medium text-foreground">
                {deletingTestimonial?.name}
              </span>
              ?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Testimonials;

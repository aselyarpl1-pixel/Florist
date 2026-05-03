import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Search, Loader2, Upload, X, ImageIcon } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { Product } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { getProductImageUrl } from "@/lib/imageUtils";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ================= TYPES ================= */

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
  is_best_seller: boolean;
  is_exclusive: boolean;
  is_premium: boolean;
}

const initialFormData: ProductForm = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  category: "",
  image_url: "",
  is_featured: false,
  is_active: true,
  is_best_seller: false,
  is_exclusive: false,
  is_premium: false,
};

export default function AdminProducts() {
  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductForm>(initialFormData);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  /* ================= HELPERS ================= */

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  /* ================= HANDLERS ================= */

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description ?? "",
        price: product.price || 0,
        category: product.category || "",
        image_url: product.image_url ?? "",
        is_featured: product.is_featured ?? false,
        is_active: product.is_active ?? true,
        is_best_seller: product.is_best_seller ?? false,
        is_exclusive: product.is_exclusive ?? false,
        is_premium: product.is_premium ?? false,
      });
    } else {
      setEditingProduct(null);
      setFormData(initialFormData);
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "Hanya file gambar yang diperbolehkan", variant: "destructive" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Error", description: "Ukuran gambar maksimal 2MB", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast({ title: "Berhasil", description: "Gambar berhasil diupload" });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ title: "Error", description: "Gagal upload gambar: " + error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("Submit triggered. isSubmitting:", isSubmitting);

    if (isSubmitting) return;

    const name = formData.name.trim();
    const category = formData.category.trim();

    if (!name || !category) {
      toast({
        title: "Validasi Gagal",
        description: "Nama dan Kategori produk wajib diisi",
        variant: "destructive",
      });
      return;
    }

    const payload: Partial<Product> = {
      name: name,
      slug: (formData.slug || generateSlug(name)).trim(),
      description: formData.description?.trim() || null,
      price: Number(formData.price) || 0,
      category: category,
      image_url: formData.image_url?.trim() || null,
      is_featured: !!formData.is_featured,
      is_active: !!formData.is_active,
      is_best_seller: !!formData.is_best_seller,
      is_exclusive: !!formData.is_exclusive,
      is_premium: !!formData.is_premium,
    };

    try {
      console.log("Attempting to save product:", payload);
      
      if (editingProduct) {
        await updateProduct.mutateAsync({ 
          id: editingProduct.id, 
          updates: payload 
        });
      } else {
        await createProduct.mutateAsync(payload);
      }

      toast({ title: "Berhasil", description: "Produk berhasil disimpan" });
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("Submit error detail:", err);
      toast({
        title: "Gagal Menyimpan",
        description: err.message || "Terjadi kesalahan saat menyimpan produk ke database",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      await deleteProduct.mutateAsync(id);
      toast({ title: "Berhasil", description: "Produk dihapus" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Gagal menghapus produk",
        variant: "destructive",
      });
    }
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending || isUploading;

  const filteredProducts = products.filter(
    (p) =>
      (p.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (p.category?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-heading">Manajemen Produk</h1>
            <p className="text-muted-foreground">Kelola katalog produk Florist Anda</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Nama Produk</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                          Tidak ada produk ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell className="capitalize">{product.category}</TableCell>
                          <TableCell className="font-heading text-primary font-semibold">
                            {formatPrice(product.price)}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                              product.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                              {product.is_active ? "Aktif" : "Nonaktif"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(product)}
                              className="hover:text-primary"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(product.id)}
                              className="hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle className="text-2xl font-heading">
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </DialogTitle>
              <DialogDescription>
                Lengkapi informasi produk di bawah ini
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-6 pb-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Produk</Label>
                      <Input
                        id="name"
                        placeholder="Contoh: Buket Mawar Merah"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                            slug: generateSlug(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori</Label>
                      <Input
                        id="category"
                        placeholder="Contoh: Buket Bunga"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Harga (IDR)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Contoh: 150000"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>

                  {/* Image Section */}
                  <div className="space-y-3">
                    <Label>Gambar Produk</Label>
                    
                    <div className="relative aspect-video rounded-lg border-2 border-dashed flex items-center justify-center bg-muted overflow-hidden group">
                      {formData.image_url ? (
                        <>
                          <img 
                            src={getProductImageUrl(formData.image_url)} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image_url: "" })}
                            className="absolute top-2 right-2 bg-destructive text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <ImageIcon className="w-10 h-10 opacity-20" />
                          <span className="text-xs font-medium">Klik tombol di bawah untuk upload</span>
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          <span className="text-xs font-medium">Sedang mengunggah...</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full gap-2 border-primary/20 hover:bg-primary/5"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4" />
                        Upload File (Butuh Supabase)
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-background px-2 text-muted-foreground tracking-widest">Atau</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image_url" className="text-xs">URL Gambar Manual</Label>
                      <Input
                        id="image_url"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image_url}
                        onChange={(e) =>
                          setFormData({ ...formData, image_url: e.target.value })
                        }
                      />
                      <p className="text-[10px] text-muted-foreground">Bisa gunakan link dari Unsplash, Pexels, atau CDN lainnya</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi Lengkap</Label>
                    <Textarea
                      id="description"
                      placeholder="Tuliskan detail produk, bahan, dan informasi lainnya..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="min-h-[120px]"
                    />
                  </div>

                  {/* Switches */}
                  <div className="grid grid-cols-1 gap-4 bg-muted/30 p-4 rounded-lg border border-primary/10">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="active" className="cursor-pointer">Status Aktif</Label>
                      <Switch
                        id="active"
                        checked={formData.is_active}
                        onCheckedChange={(v) =>
                          setFormData({ ...formData, is_active: v })
                        }
                      />
                    </div>

                    <div className="flex justify-between items-center border-t border-primary/5 pt-3">
                      <Label htmlFor="featured" className="cursor-pointer">Produk Unggulan</Label>
                      <Switch
                        id="featured"
                        checked={formData.is_featured}
                        onCheckedChange={(v) =>
                          setFormData({ ...formData, is_featured: v })
                        }
                      />
                    </div>

                    <div className="flex justify-between items-center border-t border-primary/5 pt-3">
                      <Label htmlFor="best-seller" className="cursor-pointer">Best Seller</Label>
                      <Switch
                        id="best-seller"
                        checked={formData.is_best_seller}
                        onCheckedChange={(v) =>
                          setFormData({ ...formData, is_best_seller: v })
                        }
                      />
                    </div>

                    <div className="flex justify-between items-center border-t border-primary/5 pt-3">
                      <Label htmlFor="exclusive" className="cursor-pointer">Eksklusif</Label>
                      <Switch
                        id="exclusive"
                        checked={formData.is_exclusive}
                        onCheckedChange={(v) =>
                          setFormData({ ...formData, is_exclusive: v })
                        }
                      />
                    </div>

                    <div className="flex justify-between items-center border-t border-primary/5 pt-3">
                      <Label htmlFor="premium" className="cursor-pointer">Premium</Label>
                      <Switch
                        id="premium"
                        checked={formData.is_premium}
                        onCheckedChange={(v) =>
                          setFormData({ ...formData, is_premium: v })
                        }
                      />
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="px-6 py-4 border-t bg-muted/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting} className="btn-primary min-w-[100px]">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Proses...
                    </>
                  ) : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

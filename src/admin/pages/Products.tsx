/**
 * FILE: Products.tsx (Admin)
 * KEGUNAAN: Halaman manajemen produk untuk Admin.
 * Memungkinkan admin untuk melihat daftar produk, menambah, mengedit, dan menghapus produk dari database.
 */
import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, Eye, Search, ChevronLeft, ChevronRight, RefreshCw, Loader2, Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { categories, products as defaultProducts } from "@/data/products";
import { toast } from "sonner";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  PRODUCTS_QUERY_KEY,
} from "@/hooks/useProducts";
import type { Product } from "@/lib/api";
import { productsApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { uploadProductImage } from "@/lib/storage";
import { getProductImageUrl } from "@/lib/imageUtils";

const Products = () => {
  const queryClient = useQueryClient();
  // Mengambil daftar produk dari database
  const { data: products = [], isLoading } = useProducts();
  // Hooks untuk operasi Create, Update, dan Delete (CRUD)
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  // Sinkronisasi otomatis: Jika database kosong, isi dengan data produk default (local data)
  useEffect(() => {
    if (!isLoading && products.length === 0) {
      const syncDefaultProducts = async () => {
        try {
          let count = 0;
          for (const p of defaultProducts) {
            await productsApi.upsert({
              slug: p.slug,
              name: p.name,
              price: p.price,
              original_price: p.originalPrice,
              category: p.category,
              description: p.description,
              image_url: p.images[0],
              is_active: p.isActive ?? true,
              is_featured: p.featured ?? false,
              is_best_seller: p.bestSeller ?? false,
              is_exclusive: p.exclusive ?? false,
              is_premium: p.premium ?? false,
            });
            count++;
          }
          if (count > 0) {
            toast.success(`Data produk berhasil diinisialisasi (${count} produk)`);
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
          }
        } catch (error) {
          console.error("Failed to auto-sync products:", error);
        }
      };

      syncDefaultProducts();
    }
  }, [isLoading, products.length, queryClient]);

  // State untuk pencarian, dialog, dan manajemen form
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  
  // State untuk upload gambar
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Struktur data form produk
  const [formData, setFormData] = useState({
    name: "",
    price: "" as string | number,
    original_price: "" as string | number,
    description: "",
    category: "",
    slug: "",
    image_url: "",
    product_url: "",
    is_active: true,
    is_featured: false,
    is_best_seller: false,
    is_exclusive: false,
    is_premium: false,
  });

  // Konfigurasi paginasi (halaman)
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Memfilter produk berdasarkan input pencarian admin
  const filteredProducts = useMemo(() => {
    return searchQuery
      ? products.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : products;
  }, [products, searchQuery]);

  // Menghitung total halaman dan membagi data per halaman
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Membuka modal form (untuk Tambah Baru atau Edit)
  const handleOpenDialog = (product?: Product) => {
    setSelectedFile(null);
    setImagePreview(null);
    if (product) {
      // Jika mode Edit, isi form dengan data produk yang dipilih
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        original_price: product.original_price || "",
        description: product.description || "",
        category: product.category,
        slug: product.slug,
        image_url: product.image_url || "",
        product_url: product.product_url || "",
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        is_best_seller: product.is_best_seller ?? false,
        is_exclusive: product.is_exclusive ?? false,
        is_premium: product.is_premium ?? false,
      });
    } else {
      // Jika mode Tambah Baru, kosongkan form
      setEditingProduct(null);
      setImagePreview(null);
      setFormData({
        name: "",
        price: "",
        original_price: "",
        description: "",
        category: "",
        slug: "",
        image_url: "",
        product_url: "",
        is_active: true,
        is_featured: false,
        is_best_seller: false,
        is_exclusive: false,
        is_premium: false,
      });
    }
    setDialogOpen(true);
  };

  // Menangani pemilihan file gambar oleh admin
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Membuat preview gambar agar langsung muncul di layar sebelum diupload
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fungsi utama untuk menyimpan data (Create atau Update)
  const handleSave = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Validasi input wajib
    if (!formData.name) {
      toast.error("Nama produk wajib diisi");
      return;
    }
    if (!formData.category) {
      toast.error("Kategori wajib dipilih");
      return;
    }
    
    const price = Number(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Harga produk harus lebih dari 0");
      return;
    }

    setIsUploading(true); // Memulai status proses simpan
    try {
      let finalImageUrl = formData.image_url;

      // 1. Proses upload gambar ke storage jika ada file baru yang dipilih
      if (selectedFile) {
        try {
          const uploadResult = await uploadProductImage(selectedFile);
          if (uploadResult.success && uploadResult.url) {
            finalImageUrl = uploadResult.url;
          } else {
            throw new Error(uploadResult.error || "Gagal mengupload gambar");
          }
        } catch (error: any) {
          toast.error("Gagal mengupload gambar: " + (error.message || "Terjadi kesalahan"));
          setIsUploading(false);
          return;
        }
      }

      // 2. Persiapkan objek data produk akhir
      const productData = {
        ...formData,
        price: price,
        original_price: formData.original_price ? Number(formData.original_price) : null,
        image_url: finalImageUrl,
        slug: (formData.slug || formData.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")).trim(),
      };

      // 3. Eksekusi simpan ke database (Update jika sedang edit, Create jika baru)
      if (editingProduct) {
        await updateMutation.mutateAsync({
          id: editingProduct.id,
          updates: productData,
        });
        toast.success("Produk berhasil diperbarui");
      } else {
        await createMutation.mutateAsync(productData);
        toast.success("Produk berhasil ditambahkan");
      }
      
      setDialogOpen(false); // Tutup modal setelah berhasil
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }); // Refresh data di layar
    } catch (error: any) {
      toast.error("Gagal menyimpan produk: " + (error.message || "Terjadi kesalahan database"));
    } finally {
      setIsUploading(false);
    }
  };

  // Menangani penghapusan produk
  const handleDelete = async () => {
    if (deletingProduct) {
      try {
        await deleteMutation.mutateAsync(deletingProduct.id);
        toast.success("Produk berhasil dihapus");
        setDeleteDialogOpen(false);
        setDeletingProduct(null);
      } catch (error) {
        toast.error("Terjadi kesalahan saat menghapus.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bagian Header Manajemen Produk */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Manajemen Produk
          </h1>
          <p className="text-muted-foreground mt-2">
            Kelola semua produk di katalog
          </p>
        </div>
        <div className="flex gap-2">
          {/* Tombol Sinkronisasi Data Default */}
          <Button 
            variant="outline" 
            onClick={() => {
              if (confirm("Sinkronisasi ulang akan memperbarui data produk dengan data default. Lanjutkan?")) {
                const sync = async () => {
                  try {
                    toast.loading("Menyinkronkan data...");
                    for (const p of defaultProducts) {
                      await productsApi.upsert({
                        slug: p.slug,
                        name: p.name,
                        price: p.price,
                        original_price: p.originalPrice,
                        category: p.category,
                        description: p.description,
                        image_url: p.images[0],
                        is_active: p.isActive ?? true,
                        is_featured: p.featured ?? false,
                        is_best_seller: p.bestSeller ?? false,
                        is_exclusive: p.exclusive ?? false,
                        is_premium: p.premium ?? false,
                      });
                    }
                    toast.dismiss();
                    toast.success("Data berhasil disinkronkan");
                    queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
                  } catch (error) {
                    toast.dismiss();
                    toast.error("Gagal menyinkronkan data");
                  }
                };
                sync();
              }
            }}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Sinkronkan Data
          </Button>
          {/* Tombol Tambah Produk Baru */}
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Produk
          </Button>
        </div>
      </div>

      {/* Input Pencarian */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari produk berdasarkan nama atau kategori..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabel Daftar Produk */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Nama Produk</TableHead>
                <TableHead className="w-[150px]">Kategori</TableHead>
                <TableHead className="w-[150px]">Harga</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="min-w-[200px]">Label</TableHead>
                <TableHead className="text-right w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                    Tidak ada produk ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="py-4">
                      <div className="font-medium text-base">{product.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {product.description}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {categories.find((c) => c.id === product.category)?.name ||
                          product.category}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-base text-primary">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground line-through decoration-red-500/50">
                              Rp {product.original_price.toLocaleString("id-ID")}
                            </span>
                            <span className="text-[10px] font-bold text-white bg-red-600 px-1 rounded shadow-sm">
                              -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {/* Badge Status Aktif/Nonaktif */}
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          product.is_active
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${product.is_active ? "bg-green-600" : "bg-red-600"}`}></span>
                        {product.is_active ? "Aktif" : "Nonaktif"}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {/* Kumpulan Badge Label (Featured, Best Seller, dll) */}
                      <div className="flex flex-wrap gap-2">
                        {product.is_featured && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
                            Unggulan
                          </Badge>
                        )}
                        {product.is_best_seller && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                            Best Seller
                          </Badge>
                        )}
                        {product.is_exclusive && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">
                            Exclusive
                          </Badge>
                        )}
                        {product.is_premium && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
                            Premium
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      {/* Tombol Navigasi Cepat (Lihat, Edit, Hapus) */}
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="Lihat Produk"
                        >
                          <a 
                            href={`/produk/${product.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingProduct(product);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Navigasi Paginasi */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-between mt-4 border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Menampilkan {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} dari {filteredProducts.length} produk
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Sebelumnya
                </Button>
                <div className="flex items-center px-2 text-sm font-medium">
                  Halaman {currentPage} dari {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Selanjutnya
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Dialog Form (Tambah/Edit) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>
              {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </DialogTitle>
            <DialogDescription>
              Isi form berikut untuk {editingProduct ? "mengedit" : "menambahkan"} produk.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="flex-1 overflow-hidden flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              <div className="space-y-6 pb-6">
                {/* Input Nama */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Produk *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Buket Mawar Merah Premium"
                    required
                  />
                </div>

                {/* Input Harga */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="350000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="original_price">Harga Sebelum Diskon (Coret)</Label>
                    <Input
                      id="original_price"
                      type="number"
                      value={formData.original_price}
                      onChange={(e) =>
                        setFormData({ ...formData, original_price: e.target.value })
                      }
                      placeholder="Contoh: 450000"
                    />
                  </div>
                </div>

                {/* Input Slug dan URL Eksternal */}
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="buket-mawar-merah"
                  />
                </div>

                {/* Pemilihan Kategori */}
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter((c) => c.id !== "all").map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bagian Upload Gambar */}
                <div className="space-y-2">
                  <Label htmlFor="image_url">Gambar Produk</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 border rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      {imagePreview || formData.image_url ? (
                        <img
                          src={imagePreview || getProductImageUrl(formData.image_url)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground text-xs text-center p-2">
                          No Image
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                          <Loader2 className="animate-spin h-6 w-6 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        id="image_upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => {
                          setFormData({ ...formData, image_url: e.target.value });
                          setImagePreview(null);
                          setSelectedFile(null);
                        }}
                        placeholder="Atau masukkan URL gambar langsung"
                      />
                    </div>
                  </div>
                </div>

                {/* Input Deskripsi */}
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Lengkap</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Deskripsi lengkap produk"
                    rows={4}
                  />
                </div>

                {/* Switch untuk Status dan Label Khusus */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">Status Aktif</Label>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({ ...formData, is_active: checked })
                      }
                    />
                  </div>
                  {/* ... switch lainnya (featured, best seller, dll) */}
                </div>
              </div>
            </div>
            {/* Tombol Footer Modal */}
            <DialogFooter className="px-6 py-4 border-t bg-muted/10">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isUploading || createMutation.isPending || updateMutation.isPending}
              >
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;

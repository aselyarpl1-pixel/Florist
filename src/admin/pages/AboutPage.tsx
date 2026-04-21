import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAboutContent, useSaveAboutContent } from "@/hooks/useAboutContent";
import { AboutContent } from "@/lib/api";

const AboutPage = () => {
  const { data: serverContent, isLoading } = useAboutContent();
  const { mutate: saveContent, isPending } = useSaveAboutContent();

  const [heroContent, setHeroContent] = useState({
    subtitle: "Tentang Kami",
    title: "Cerita di Balik",
    titleHighlight: "BloomGift",
    description: "Bermula dari passion terhadap keindahan dan keinginan untuk menyebarkan kebahagiaan melalui hadiah yang bermakna.",
  });

  const [storyContent, setStoryContent] = useState({
    year: "Since 2018",
    title: "Perjalanan Kami",
    paragraph1: "BloomGift didirikan pada tahun 2018 dengan visi sederhana namun kuat: membantu orang-orang mengekspresikan perasaan mereka melalui hadiah yang indah dan bermakna.",
    paragraph2: "Berawal dari usaha rumahan kecil, kini BloomGift telah berkembang menjadi salah satu toko bunga dan hadiah premium terpercaya di Jakarta. Kami melayani ribuan pelanggan setiap bulannya, dari individu hingga perusahaan besar.",
    paragraph3: "Setiap buket, hampers, dan dekorasi yang kami buat adalah hasil dari kerja sama tim yang solid, kreativitas tanpa batas, dan komitmen untuk selalu memberikan yang terbaik.",
    buttonText: "Hubungi Kami",
  });

  const [statsContent, setStatsContent] = useState({
    years: "6+",
    orders: "5000+",
    customers: "1000+",
    rating: "4.9",
  });

  useEffect(() => {
    if (serverContent) {
      if (serverContent.hero) setHeroContent(serverContent.hero);
      if (serverContent.story) setStoryContent(serverContent.story);
      if (serverContent.stats) setStatsContent(serverContent.stats);
    }
  }, [serverContent]);

  const handleSave = () => {
    const payload: AboutContent = {
      hero: heroContent,
      story: storyContent,
      stats: statsContent,
    };
    
    saveContent(payload, {
      onSuccess: () => {
        toast.success("Konten Tentang Kami berhasil disimpan");
      },
      onError: (err) => {
        console.error(err);
        toast.error("Gagal menyimpan konten");
      }
    });
  };

  if (isLoading) {
    return <div className="p-8">Memuat data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Manajemen Tentang Kami
        </h1>
        <p className="text-muted-foreground mt-2">
          Kelola konten halaman Tentang Kami
        </p>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="story">Cerita & Sejarah</TabsTrigger>
          <TabsTrigger value="stats">Statistik</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Edit konten utama di bagian atas halaman Tentang Kami
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={heroContent.subtitle}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, subtitle: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Utama</Label>
                  <Input
                    id="title"
                    value={heroContent.title}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleHighlight">Judul (Highlight)</Label>
                  <Input
                    id="titleHighlight"
                    value={heroContent.titleHighlight}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, titleHighlight: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={heroContent.description}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isPending} className="gap-2">
                  <Save className="w-4 h-4" />
                  {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Story Section */}
        <TabsContent value="story" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cerita & Sejarah</CardTitle>
              <CardDescription>
                Edit cerita perjalanan bisnis Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Tahun Berdiri (Teks di kotak gambar)</Label>
                  <Input
                    id="year"
                    value={storyContent.year}
                    onChange={(e) =>
                      setStoryContent({ ...storyContent, year: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storyTitle">Judul Bagian</Label>
                  <Input
                    id="storyTitle"
                    value={storyContent.title}
                    onChange={(e) =>
                      setStoryContent({ ...storyContent, title: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paragraph1">Paragraf 1</Label>
                <Textarea
                  id="paragraph1"
                  value={storyContent.paragraph1}
                  onChange={(e) =>
                    setStoryContent({ ...storyContent, paragraph1: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paragraph2">Paragraf 2</Label>
                <Textarea
                  id="paragraph2"
                  value={storyContent.paragraph2}
                  onChange={(e) =>
                    setStoryContent({ ...storyContent, paragraph2: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paragraph3">Paragraf 3</Label>
                <Textarea
                  id="paragraph3"
                  value={storyContent.paragraph3}
                  onChange={(e) =>
                    setStoryContent({ ...storyContent, paragraph3: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonText">Teks Tombol CTA</Label>
                <Input
                  id="buttonText"
                  value={storyContent.buttonText}
                  onChange={(e) =>
                    setStoryContent({ ...storyContent, buttonText: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isPending} className="gap-2">
                  <Save className="w-4 h-4" />
                  {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Section */}
        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistik Pencapaian</CardTitle>
              <CardDescription>
                Edit angka-angka statistik di bagian bawah
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="statsYears">Tahun Pengalaman</Label>
                  <Input
                    id="statsYears"
                    value={statsContent.years}
                    onChange={(e) =>
                      setStatsContent({ ...statsContent, years: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statsOrders">Pesanan Terkirim</Label>
                  <Input
                    id="statsOrders"
                    value={statsContent.orders}
                    onChange={(e) =>
                      setStatsContent({ ...statsContent, orders: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statsCustomers">Pelanggan Puas</Label>
                  <Input
                    id="statsCustomers"
                    value={statsContent.customers}
                    onChange={(e) =>
                      setStatsContent({ ...statsContent, customers: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statsRating">Rating Kepuasan</Label>
                  <Input
                    id="statsRating"
                    value={statsContent.rating}
                    onChange={(e) =>
                      setStatsContent({ ...statsContent, rating: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isPending} className="gap-2">
                  <Save className="w-4 h-4" />
                  {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AboutPage;

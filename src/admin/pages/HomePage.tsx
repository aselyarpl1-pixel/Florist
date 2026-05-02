import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useHomeContent, useSaveHomeContent } from "@/hooks/useHomeContent";
import { useFloatingMenu, useSaveFloatingMenu } from "@/hooks/useFloatingMenu";
import type { HomeContent, FloatingButton } from "@/lib/api";

const HomePage = () => {
  const { data: serverContent, isLoading } = useHomeContent();
  const { mutate: saveContent, isPending: isSavingContent } = useSaveHomeContent();
  const { data: floatingMenu, isLoading: isFloatingLoading } = useFloatingMenu();
  const { mutate: saveFloatingMenu, isPending: isSavingFloating } = useSaveFloatingMenu();

  const [heroContent, setHeroContent] = useState({
    subtitle: "Premium Gift & Flower Shop",
    title: "Hadirkan Kebahagiaan di",
    titleHighlight: "Setiap Momen",
    description:
      "Buket bunga segar, hampers eksklusif, dan dekorasi premium untuk momen spesial Anda. Pengiriman same-day untuk area Jakarta.",
    ctaPrimary: "Lihat Katalog",
    ctaSecondary: "Konsultasi Gratis",
    statsCustomers: "1000+",
    statsOrders: "5000+",
    statsRating: "4.9",
  });

  const [featuresContent, setFeaturesContent] = useState({
    sectionSubtitle: "Mengapa Kami",
    sectionTitle: "Keunggulan Florist",
    sectionDescription:
      "Kami berkomitmen memberikan pengalaman terbaik untuk setiap pelanggan.",
    feature1Title: "Kualitas Premium",
    feature1Desc: "Hanya bunga segar dan produk berkualitas tinggi yang kami pilih untuk Anda.",
    feature2Title: "Pengiriman Cepat",
    feature2Desc: "Same-day delivery untuk area Jakarta dan sekitarnya dengan pengemasan aman.",
    feature3Title: "Layanan 24/7",
    feature3Desc: "Tim customer service siap membantu Anda kapan saja melalui WhatsApp.",
    feature4Title: "Garansi Kepuasan",
    feature4Desc: "Tidak puas? Kami berikan garansi penggantian atau pengembalian dana.",
  });

  const [ctaContent, setCtaContent] = useState({
    title: "Butuh Bantuan Memilih",
    titleHighlight: "Hadiah Sempurna?",
    description:
      "Tim kami siap membantu Anda menemukan produk yang tepat untuk setiap momen spesial. Konsultasikan kebutuhan Anda secara gratis melalui WhatsApp!",
    buttonText: "Chat via WhatsApp",
  });

  const [testimonialsContent, setTestimonialsContent] = useState({
    sectionSubtitle: "Testimoni",
    sectionTitle: "Apa Kata Pelanggan Kami",
    sectionDescription: "Kepuasan pelanggan adalah prioritas utama kami. Lihat apa kata mereka tentang produk dan layanan Florist.",
  });

  const [floatingMenuConfig, setFloatingMenuConfig] = useState({
    whatsappText: "Kami Hadir 24 Jam",
    buttons: [
      { id: "1", label: "Papan Bunga", href: "/katalog?kategori=papan-bunga", color: "red", icon: "TreePine", visible: true },
      { id: "2", label: "Katalog Parsel Natal", href: "/katalog?kategori=parsel-natal", color: "red", icon: "Gift", visible: true },
    ] as FloatingButton[]
  });

  useEffect(() => {
    if (serverContent) {
      if (serverContent.hero) setHeroContent(serverContent.hero);
      if (serverContent.features) setFeaturesContent(serverContent.features);
      if (serverContent.cta) setCtaContent(serverContent.cta);
      if (serverContent.testimonials) setTestimonialsContent(serverContent.testimonials);
    }
    if (floatingMenu) {
      setFloatingMenuConfig(floatingMenu);
    }
  }, [serverContent, floatingMenu]);

  const handleSave = () => {
    const payload: HomeContent = {
      hero: heroContent,
      features: featuresContent,
      cta: ctaContent,
      testimonials: testimonialsContent,
    };
    
    saveContent(payload, {
      onSuccess: () => toast.success("Konten berhasil disimpan"),
      onError: (err: any) => toast.error("Gagal menyimpan konten: " + err.message),
    });
  };

  const handleSaveHero = () => handleSave();
  const handleSaveFeatures = () => handleSave();
  const handleSaveCTA = () => handleSave();

  const handleSaveFloatingMenu = () => {
    saveFloatingMenu(floatingMenuConfig, {
      onSuccess: () => toast.success("Menu WhatsApp berhasil disimpan"),
      onError: (err: any) => toast.error("Gagal menyimpan menu WhatsApp: " + err.message),
    });
  };

  const addFloatingButton = () => {
    const newButton: FloatingButton = {
      id: Date.now().toString(),
      label: "Tombol Baru",
      href: "/",
      color: "red",
      icon: "Gift",
      visible: true
    };
    setFloatingMenuConfig({
      ...floatingMenuConfig,
      buttons: [...floatingMenuConfig.buttons, newButton]
    });
  };

  const removeFloatingButton = (id: string) => {
    setFloatingMenuConfig({
      ...floatingMenuConfig,
      buttons: floatingMenuConfig.buttons.filter(b => b.id !== id)
    });
  };

  const updateFloatingButton = (id: string, updates: Partial<FloatingButton>) => {
    setFloatingMenuConfig({
      ...floatingMenuConfig,
      buttons: floatingMenuConfig.buttons.map(b => 
        b.id === id ? { ...b, ...updates } : b
      )
    });
  };

  if (isLoading || isFloatingLoading) {
    return <div className="p-8">Memuat data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Manajemen Home Page
          </h1>
          <p className="text-muted-foreground mt-2">
            Kelola konten halaman beranda dan menu melayang
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSavingContent} className="gap-2">
          <Save className="w-4 h-4" />
          {isSavingContent ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="features">Keunggulan</TabsTrigger>
          <TabsTrigger value="testimonials">Testimoni</TabsTrigger>
          <TabsTrigger value="cta">CTA Section</TabsTrigger>
          <TabsTrigger value="floating">Menu Melayang</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Edit konten utama di bagian atas halaman beranda
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaPrimary">Tombol Utama</Label>
                  <Input
                    id="ctaPrimary"
                    value={heroContent.ctaPrimary}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, ctaPrimary: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaSecondary">Tombol Sekunder</Label>
                  <Input
                    id="ctaSecondary"
                    value={heroContent.ctaSecondary}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, ctaSecondary: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-4">Statistik</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="statsCustomers">Pelanggan</Label>
                    <Input
                      id="statsCustomers"
                      value={heroContent.statsCustomers}
                      onChange={(e) =>
                        setHeroContent({ ...heroContent, statsCustomers: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="statsOrders">Pesanan</Label>
                    <Input
                      id="statsOrders"
                      value={heroContent.statsOrders}
                      onChange={(e) =>
                        setHeroContent({ ...heroContent, statsOrders: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="statsRating">Rating</Label>
                    <Input
                      id="statsRating"
                      value={heroContent.statsRating}
                      onChange={(e) =>
                        setHeroContent({ ...heroContent, statsRating: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveHero} disabled={isSavingContent} className="gap-2">
                  <Save className="w-4 h-4" />
                  {isSavingContent ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Section */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Keunggulan</CardTitle>
              <CardDescription>
                Edit konten "Mengapa Memilih Florist"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="featureSubtitle">Subtitle Section</Label>
                <Input
                  id="featureSubtitle"
                  value={featuresContent.sectionSubtitle}
                  onChange={(e) =>
                    setFeaturesContent({
                      ...featuresContent,
                      sectionSubtitle: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featureTitle">Judul Section</Label>
                <Input
                  id="featureTitle"
                  value={featuresContent.sectionTitle}
                  onChange={(e) =>
                    setFeaturesContent({
                      ...featuresContent,
                      sectionTitle: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featureDesc">Deskripsi Section</Label>
                <Textarea
                  id="featureDesc"
                  value={featuresContent.sectionDescription}
                  onChange={(e) =>
                    setFeaturesContent({
                      ...featuresContent,
                      sectionDescription: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="pt-4 border-t space-y-6">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="space-y-3">
                    <h3 className="text-sm font-medium">Keunggulan {num}</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`feature${num}Title`}>Judul</Label>
                        <Input
                          id={`feature${num}Title`}
                          value={
                            featuresContent[
                              `feature${num}Title` as keyof typeof featuresContent
                            ]
                          }
                          onChange={(e) =>
                            setFeaturesContent({
                              ...featuresContent,
                              [`feature${num}Title`]: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`feature${num}Desc`}>Deskripsi</Label>
                        <Textarea
                          id={`feature${num}Desc`}
                          value={
                            featuresContent[
                              `feature${num}Desc` as keyof typeof featuresContent
                            ]
                          }
                          onChange={(e) =>
                            setFeaturesContent({
                              ...featuresContent,
                              [`feature${num}Desc`]: e.target.value,
                            })
                          }
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveFeatures} disabled={isSavingContent} className="gap-2">
                  <Save className="w-4 h-4" />
                  {isSavingContent ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Section */}
        <TabsContent value="testimonials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Testimoni</CardTitle>
              <CardDescription>
                Edit teks pembuka untuk bagian testimoni di beranda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testiSubtitle">Subtitle Section</Label>
                <Input
                  id="testiSubtitle"
                  value={testimonialsContent.sectionSubtitle}
                  onChange={(e) =>
                    setTestimonialsContent({
                      ...testimonialsContent,
                      sectionSubtitle: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="testiTitle">Judul Section</Label>
                <Input
                  id="testiTitle"
                  value={testimonialsContent.sectionTitle}
                  onChange={(e) =>
                    setTestimonialsContent({
                      ...testimonialsContent,
                      sectionTitle: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="testiDesc">Deskripsi Section</Label>
                <Textarea
                  id="testiDesc"
                  value={testimonialsContent.sectionDescription}
                  onChange={(e) =>
                    setTestimonialsContent({
                      ...testimonialsContent,
                      sectionDescription: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isSavingContent} className="gap-2">
                  <Save className="w-4 h-4" />
                  {isSavingContent ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Floating Menu Section */}
        <TabsContent value="floating" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Menu Melayang (Floating Menu)</CardTitle>
              <CardDescription>
                Kelola tombol-tombol yang melayang di pojok kanan bawah
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* WhatsApp Text */}
              <div className="space-y-2">
                <Label htmlFor="whatsappText">Teks Tombol WhatsApp (Hijau)</Label>
                <Input
                  id="whatsappText"
                  value={floatingMenuConfig.whatsappText}
                  onChange={(e) => setFloatingMenuConfig({ ...floatingMenuConfig, whatsappText: e.target.value })}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Tombol Aksi (Merah)</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addFloatingButton} className="gap-1">
                    <Plus className="w-4 h-4" />
                    Tambah Tombol
                  </Button>
                </div>

                <div className="space-y-4">
                  {floatingMenuConfig.buttons.map((button) => (
                    <div key={button.id} className="p-4 border rounded-lg bg-accent/30 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Switch 
                            id={`visible-${button.id}`}
                            checked={button.visible} 
                            onCheckedChange={(checked: boolean) => updateFloatingButton(button.id, { visible: checked })}
                          />
                          <Label htmlFor={`visible-${button.id}`} className="text-sm font-medium cursor-pointer">
                            {button.label || "Tanpa Label"}
                          </Label>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => removeFloatingButton(button.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Label Tombol</Label>
                          <Input 
                            value={button.label}
                            onChange={(e) => updateFloatingButton(button.id, { label: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Link (URL)</Label>
                          <Input 
                            value={button.href}
                            onChange={(e) => updateFloatingButton(button.id, { href: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon (Lucide)</Label>
                          <Input 
                            value={button.icon}
                            onChange={(e) => updateFloatingButton(button.id, { icon: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Warna</Label>
                          <Input 
                            value={button.color}
                            onChange={(e) => updateFloatingButton(button.id, { color: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveFloatingMenu} disabled={isSavingFloating} className="gap-2">
                  <Save className="w-4 h-4" />
                  {isSavingFloating ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CTA Section */}
        <TabsContent value="cta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CTA Section</CardTitle>
              <CardDescription>
                Edit konten section call-to-action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaTitle">Judul</Label>
                  <Input
                    id="ctaTitle"
                    value={ctaContent.title}
                    onChange={(e) =>
                      setCtaContent({ ...ctaContent, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaTitleHighlight">Judul (Highlight)</Label>
                  <Input
                    id="ctaTitleHighlight"
                    value={ctaContent.titleHighlight}
                    onChange={(e) =>
                      setCtaContent({ ...ctaContent, titleHighlight: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaDescription">Deskripsi</Label>
                <Textarea
                  id="ctaDescription"
                  value={ctaContent.description}
                  onChange={(e) =>
                    setCtaContent({ ...ctaContent, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaButton">Teks Tombol</Label>
                <Input
                  id="ctaButton"
                  value={ctaContent.buttonText}
                  onChange={(e) =>
                    setCtaContent({ ...ctaContent, buttonText: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveCTA} disabled={isSavingContent} className="gap-2">
                  <Save className="w-4 h-4" />
                  {isSavingContent ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;

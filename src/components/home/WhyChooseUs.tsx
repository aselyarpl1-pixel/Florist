import { Truck, Award, Clock, HeartHandshake } from "lucide-react";
import { useHomeContent } from "@/hooks/useHomeContent";

const WhyChooseUs = () => {
  const { data: content } = useHomeContent();
  
  const featuresContent = content?.features || {
    sectionSubtitle: "Mengapa Kami",
    sectionTitle: "Keunggulan Florist",
    sectionDescription: "Kami berkomitmen memberikan pengalaman terbaik untuk setiap pelanggan.",
    feature1Title: "Kualitas Premium",
    feature1Desc: "Hanya bunga segar dan produk berkualitas tinggi yang kami pilih untuk Anda.",
    feature2Title: "Pengiriman Cepat",
    feature2Desc: "Same-day delivery untuk area Jakarta dan sekitarnya dengan pengemasan aman.",
    feature3Title: "Layanan 24/7",
    feature3Desc: "Tim customer service siap membantu Anda kapan saja melalui WhatsApp.",
    feature4Title: "Garansi Kepuasan",
    feature4Desc: "Tidak puas? Kami berikan garansi penggantian atau pengembalian dana.",
  };

  const features = [
    {
      icon: Award,
      title: featuresContent.feature1Title,
      description: featuresContent.feature1Desc,
    },
    {
      icon: Truck,
      title: featuresContent.feature2Title,
      description: featuresContent.feature2Desc,
    },
    {
      icon: Clock,
      title: featuresContent.feature3Title,
      description: featuresContent.feature3Desc,
    },
    {
      icon: HeartHandshake,
      title: featuresContent.feature4Title,
      description: featuresContent.feature4Desc,
    },
  ];

  return (
    <section className="section-padding bg-secondary/50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <p className="text-primary font-medium tracking-wider uppercase text-sm">
            {featuresContent.sectionSubtitle}
          </p>
          <h2 className="heading-section text-foreground">
            {featuresContent.sectionTitle}
          </h2>
          <p className="text-muted-foreground">
            {featuresContent.sectionDescription}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-xl text-center space-y-4 shadow-soft hover:shadow-card transition-all duration-300 group"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-heading text-xl font-medium text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Music, Users, BookOpen } from "lucide-react";

const HeroSection = () => {
  const features = [
    {
      icon: <Music className="h-6 w-6" />,
      title: "Müzik İlanları",
      description: "Müzisyen ve grup arayışlarınız için"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Topluluk",
      description: "Müzikseverlerle buluşun"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Eğitim",
      description: "Müzik dersleri ve eğitimler"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              YENİ BİR İLAN VER
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Yeni bir ilan verirken kendini en iyi şekilde ifade etmeyi unutma
            </p>
          </div>

          {/* CTA Button */}
          <div className="mb-16">
            <Button size="lg" className="text-lg px-8 py-6">
              <Plus className="h-5 w-5 mr-2" />
              İlan Ver
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg bg-background/50 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

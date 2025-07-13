import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Zap, Palette, MousePointer, Eye } from "lucide-react";
import heroImage from "@/assets/hero-formkit.jpg";

const Index = () => {
  const features = [
    {
      icon: MousePointer,
      title: "Drag & Drop",
      description: "Intuitive drag-and-drop interface for building forms effortlessly"
    },
    {
      icon: Eye,
      title: "Live Preview",
      description: "See your forms come to life with real-time preview functionality"
    },
    {
      icon: Palette,
      title: "Beautiful Design",
      description: "Modern, responsive forms that look great on any device"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with smooth animations and interactions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-accent-foreground mb-6 animate-fade-in">
            <Zap className="w-4 h-4" />
            Visual Form Builder
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-slide-up">
            Build Beautiful Forms
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Without Code
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-200">
            Create stunning, responsive forms with our intuitive drag-and-drop builder. 
            No coding required – just pure visual design.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-400">
            <Button asChild size="lg" variant="hero" className="text-lg px-8 py-6">
              <Link to="/builder">
                <PlusCircle className="w-5 h-5" />
                Start Building
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
              <a href="#features">
                Learn More
              </a>
            </Button>
          </div>
        </div>

        {/* Hero Image Showcase */}
        <div className="max-w-5xl mx-auto mb-16 animate-fade-in animation-delay-600">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-3xl opacity-20 scale-110"></div>
            <img 
              src={heroImage} 
              alt="FormKit Interface Preview" 
              className="relative w-full rounded-2xl shadow-2xl border border-border/50"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="p-6 text-center bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-glow">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="inline-block p-8 bg-gradient-card rounded-2xl border border-border/50 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Join thousands of creators building beautiful forms with FormKit
            </p>
            <Button asChild variant="default" size="lg">
              <Link to="/builder">
                Start Building for Free
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

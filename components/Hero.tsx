import { Button } from "@/components/ui/button";
import { Shield, Lock, Globe } from "lucide-react";
import heroNetwork from "@/assets/hero-network.jpg";
import Image from "next/image";
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
        <Image 
          src={heroNetwork} 
          alt="Decentralized network visualization" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex gap-1">
            <Shield className="w-5 h-5 text-primary animate-pulse" />
            <Lock className="w-5 h-5 text-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
            <Globe className="w-5 h-5 text-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Web3 Storage</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground to-accent">
          Your Photos,
          <br />
          Forever Decentralized
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
          Store and share your precious memories on the blockchain. Immutable, censorship-resistant, 
          and permanently accessible across global decentralized nodes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-primary/50 transition-all"
          >
            Start Uploading
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary/50 text-foreground hover:bg-primary/10 px-8 py-6 text-lg font-semibold"
          >
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-16 border-t border-border/50">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Immutable</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">∞</div>
            <div className="text-sm text-muted-foreground">Permanent Access</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">0</div>
            <div className="text-sm text-muted-foreground">Censorship</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

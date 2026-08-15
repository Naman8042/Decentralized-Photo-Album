import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Own Your
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Digital Memories?
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands who have taken control of their photo storage with blockchain technology.
            No subscriptions, no deletions, no limits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-primary/50 transition-all group"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-primary/50 text-foreground hover:bg-primary/10 px-10 py-6 text-lg font-semibold"
            >
              View Documentation
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            No credit card required • Connect with any Web3 wallet
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;

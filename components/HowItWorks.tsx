import { Upload, Lock, Network, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Photos",
    description: "Connect your wallet and upload images directly from your device.",
    number: "01",
  },
  {
    icon: Lock,
    title: "Encrypted & Hashed",
    description: "Photos are encrypted and a unique hash is created for blockchain verification.",
    number: "02",
  },
  {
    icon: Network,
    title: "Distributed Storage",
    description: "Images are split and stored across multiple decentralized nodes worldwide.",
    number: "03",
  },
  {
    icon: CheckCircle,
    title: "Access Anytime",
    description: "Retrieve your photos instantly from anywhere using your cryptographic keys.",
    number: "04",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, secure, and decentralized. Your photos in four easy steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center group">
                <div className="relative inline-block mb-6">
                  {/* Number badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold z-10">
                    {step.number}
                  </div>
                  
                  {/* Icon container */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30 group-hover:border-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

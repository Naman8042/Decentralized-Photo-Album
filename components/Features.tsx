import { Shield, Database, Lock, Zap, Globe, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Immutable Storage",
    description: "Once uploaded, your photos cannot be altered or tampered with. Blockchain ensures data integrity forever.",
  },
  {
    icon: Lock,
    title: "Censorship-Resistant",
    description: "No central authority can delete or restrict access to your content. True digital ownership.",
  },
  {
    icon: Database,
    title: "Decentralized Nodes",
    description: "Your data is distributed across thousands of global nodes, eliminating single points of failure.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized retrieval from the nearest nodes ensures quick access to your memories anywhere.",
  },
  {
    icon: Globe,
    title: "Permanent Access",
    description: "As long as the network exists, your photos remain accessible. No subscription cancellations.",
  },
  {
    icon: Users,
    title: "Secure Sharing",
    description: "Control who sees your content with blockchain-based permissions and cryptographic keys.",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-primary">Decentralized</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built on Web3 technology, your photo album leverages blockchain security and distributed storage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

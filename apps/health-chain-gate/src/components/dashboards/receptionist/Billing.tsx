import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

const Billing = () => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Billing</h1>
        <p className="text-muted-foreground mb-6">Generate invoices and manage payments</p>
        
        <Card className="p-12 text-center">
          <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Billing Module</h3>
          <p className="text-muted-foreground mb-6">Coming soon - Invoice generation and payment tracking</p>
          <Button>Create New Invoice</Button>
        </Card>
      </div>
    </div>
  );
};

export default Billing;

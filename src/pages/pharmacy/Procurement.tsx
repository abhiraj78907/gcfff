import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Star, Clock, Package, TrendingUp, ShoppingCart } from "lucide-react";
import { mockSuppliers, mockOrders, getMedicinesByEntity } from "../../lib/mockData";
import { useSubEntry } from "../../contexts/SubEntryContext";

export default function Procurement() {
  const { currentEntityId } = useSubEntry();
  const medicines = getMedicinesByEntity(currentEntityId);
  const reorderSuggestions = medicines.filter(m => m.quantity < m.reorderThreshold);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Procurement & Orders</h1>
        <p className="text-muted-foreground">Manage suppliers and purchase orders</p>
      </div>

      {/* Reorder Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-warning" />
            AI-Powered Reorder Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {reorderSuggestions.slice(0, 4).map((medicine) => {
              const suggestedQty = medicine.reorderThreshold * 2;
              const estimatedCost = suggestedQty * medicine.price;
              
              return (
                <div key={medicine.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                  <div>
                    <p className="font-medium">{medicine.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Current: {medicine.quantity} | Suggested: {suggestedQty}
                    </p>
                    <p className="text-sm text-primary">Est. Cost: ₹{estimatedCost}</p>
                  </div>
                  <Button size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Order
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Active Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{order.id}</p>
                    <Badge 
                      variant={
                        order.status === "Delivered" ? "default" : 
                        order.status === "In Transit" ? "secondary" : 
                        "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.supplier} • {order.items} items • ₹{order.total.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">ETA</p>
                    <p className="text-sm font-medium">{order.eta}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      window.location.href = `tel:${order.supplierPhone || "+91 9876543210"}`;
                    }}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supplier Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium">Supplier Name</th>
                  <th className="p-4 text-left text-sm font-medium">Rating</th>
                  <th className="p-4 text-left text-sm font-medium">Delivery Time</th>
                  <th className="p-4 text-left text-sm font-medium">Medicines</th>
                  <th className="p-4 text-left text-sm font-medium">Contact</th>
                  <th className="p-4 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-4">
                      <p className="font-medium">{supplier.name}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="text-sm font-medium">{supplier.rating}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{supplier.deliveryTime}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{supplier.medicines} items</Badge>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{supplier.contact}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            window.location.href = `tel:${supplier.contact}`;
                          }}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            alert(`Placing order with ${supplier.name}...`);
                          }}
                        >
                          Place Order
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

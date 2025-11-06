import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Trash2, Edit, Calendar } from "lucide-react";
import { getMedicinesByEntity } from "../../lib/mockData";
import { useSubEntry } from "../../contexts/SubEntryContext";
import { StatCard } from "../../components/StatCard";
import { Package, AlertTriangle, TrendingUp } from "lucide-react";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const { currentEntityId } = useSubEntry();
  const mockMedicines = getMedicinesByEntity(currentEntityId);

  const lowStockCount = mockMedicines.filter(m => m.quantity < m.reorderThreshold).length;
  const expiringCount = mockMedicines.filter(m => {
    const daysUntilExpiry = Math.floor((new Date(m.expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry < 90 && daysUntilExpiry > 0;
  }).length;
  const totalValue = mockMedicines.reduce((sum, m) => sum + (m.quantity * m.price), 0);

  const getExpiryStatus = (expiryDate: string) => {
    const daysUntilExpiry = Math.floor((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 0) return { status: "expired", color: "destructive" };
    if (daysUntilExpiry < 90) return { status: "expiring", color: "warning" };
    return { status: "good", color: "success" };
  };

  const filteredMedicines = mockMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory & Stock Management</h1>
        <p className="text-muted-foreground">Monitor and manage your medicine stock levels</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Medicines"
          value={mockMedicines.length}
          icon={Package}
          variant="default"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Stock Value"
          value={`₹${totalValue.toLocaleString()}`}
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* Search and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by medicine name, batch, or supplier..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Expired
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medicines Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium">Medicine Name</th>
                  <th className="p-4 text-left text-sm font-medium">Batch</th>
                  <th className="p-4 text-left text-sm font-medium">Supplier</th>
                  <th className="p-4 text-left text-sm font-medium">Expiry</th>
                  <th className="p-4 text-left text-sm font-medium">Quantity</th>
                  <th className="p-4 text-left text-sm font-medium">Reorder At</th>
                  <th className="p-4 text-left text-sm font-medium">Status</th>
                  <th className="p-4 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((medicine) => {
                  const expiryStatus = getExpiryStatus(medicine.expiry);
                  const isLowStock = medicine.quantity < medicine.reorderThreshold;
                  
                  return (
                    <tr key={medicine.id} className="border-b border-border hover:bg-muted/30">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-sm text-muted-foreground">{medicine.category}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{medicine.batch}</td>
                      <td className="p-4 text-sm">{medicine.supplier}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className={`h-4 w-4 text-${expiryStatus.color}`} />
                          <span className="text-sm">{medicine.expiry}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`font-medium ${isLowStock ? 'text-warning' : ''}`}>
                          {medicine.quantity}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{medicine.reorderThreshold}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          {isLowStock && (
                            <Badge variant="destructive" className="w-fit">Low Stock</Badge>
                          )}
                          {expiryStatus.status === "expiring" && (
                            <Badge variant="secondary" className="w-fit">Expiring Soon</Badge>
                          )}
                          {!isLowStock && expiryStatus.status === "good" && (
                            <Badge variant="default" className="w-fit">In Stock</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

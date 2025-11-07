import { useState } from "react";
import { Card } from "@patient/components/ui/card";
import { Button } from "@patient/components/ui/button";
import { Switch } from "@patient/components/ui/switch";
import { Input } from "@patient/components/ui/input";
import { Label } from "@patient/components/ui/label";
import { Separator } from "@patient/components/ui/separator";
import { 
  User, 
  Bell, 
  Globe, 
  Cloud, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Edit,
  Users,
  Phone
} from "lucide-react";
import { toast } from "@patient/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@patient/components/ui/select";
import { useLanguage } from "@shared/contexts/LanguageContext";

const Settings = () => {
  const { language, setLanguage } = useLanguage();
  const [notifications, setNotifications] = useState({
    medicineReminders: true,
    appointmentAlerts: true,
    missedDoseAlerts: true,
    voiceReminders: true,
    smsBackup: true,
  });

  const [cloudSync, setCloudSync] = useState(true);
  const [caregiverMode, setCaregiverMode] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-8 py-4 md:py-6">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">सेटिंग्स</h1>
          <p className="text-sm text-muted-foreground">अपनी प्राथमिकताएं प्रबंधित करें</p>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 py-6 md:py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="p-5 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-base md:text-lg font-semibold text-foreground">व्यक्तिगत जानकारी</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">पूरा नाम</Label>
                <div className="flex gap-2">
                  <Input id="name" defaultValue="रमेश कुमार" className="text-base" />
                  <Button variant="outline" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">फोन नंबर</Label>
                <div className="flex gap-2">
                  <Input id="phone" defaultValue="+91 9876543210" className="text-base" />
                  <Button variant="outline" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Caregiver Mode */}
          <Card className="p-5 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-base md:text-lg font-semibold text-foreground">देखभालकर्ता मोड</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground text-base">देखभालकर्ता एक्सेस</p>
                <p className="text-sm text-muted-foreground">परिवार के सदस्यों को दवाएं देखने दें</p>
              </div>
              <Switch
                checked={caregiverMode}
                onCheckedChange={(checked) => {
                  setCaregiverMode(checked);
                  toast({
                    title: checked ? "देखभालकर्ता मोड चालू" : "देखभालकर्ता मोड बंद",
                    description: checked ? "अब देखभालकर्ता आपकी दवाएं देख सकते हैं" : "देखभालकर्ता एक्सेस हटा दिया गया",
                  });
                }}
              />
            </div>
            
            {caregiverMode && (
              <>
                <Separator />
                <Button variant="outline" className="w-full h-12 text-base">
                  देखभालकर्ता जोड़ें
                </Button>
              </>
            )}
          </div>
        </Card>

          {/* Notifications */}
          <Card className="p-5 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-base md:text-lg font-semibold text-foreground">सूचनाएं</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground text-base">दवा की याद</p>
                <p className="text-sm text-muted-foreground">दवा लेने का समय होने पर सूचित करें</p>
              </div>
              <Switch
                checked={notifications.medicineReminders}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, medicineReminders: checked }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground text-base">आवाज से याद दिलाना</p>
                <p className="text-sm text-muted-foreground">बोलकर याद दिलाना चालू करें</p>
              </div>
              <Switch
                checked={notifications.voiceReminders}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, voiceReminders: checked }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground text-base">SMS बैकअप</p>
                <p className="text-sm text-muted-foreground">इंटरनेट न हो तो SMS से याद दिलाना</p>
              </div>
              <Switch
                checked={notifications.smsBackup}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, smsBackup: checked }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground text-base">अपॉइंटमेंट अलर्ट</p>
                <p className="text-sm text-muted-foreground">आने वाले अपॉइंटमेंट की याद</p>
              </div>
              <Switch
                checked={notifications.appointmentAlerts}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, appointmentAlerts: checked }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground text-base">छूटी दवा अलर्ट</p>
                <p className="text-sm text-muted-foreground">दवा छूटने पर सूचित करें</p>
              </div>
              <Switch
                checked={notifications.missedDoseAlerts}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, missedDoseAlerts: checked }))
                }
              />
            </div>
          </div>
        </Card>

          {/* Language */}
          <Card className="p-5 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-base md:text-lg font-semibold text-foreground">भाषा</h2>
          </div>
          
          <Select value={language} onValueChange={(val) => setLanguage(val as "english" | "hindi" | "kannada")}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english" className="text-base">English</SelectItem>
              <SelectItem value="hindi" className="text-base">हिंदी (Hindi)</SelectItem>
              <SelectItem value="kannada" className="text-base">ಕನ್ನಡ (Kannada)</SelectItem>
            </SelectContent>
          </Select>
        </Card>

          {/* Backup & Sync */}
          <Card className="p-5 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <Cloud className="w-5 h-5 text-primary" />
            <h2 className="text-base md:text-lg font-semibold text-foreground">बैकअप और सिंक</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground text-base">क्लाउड सिंक</p>
                <p className="text-sm text-muted-foreground">अपने डेटा को स्वचालित रूप से बैकअप करें</p>
              </div>
              <Switch
                checked={cloudSync}
                onCheckedChange={setCloudSync}
              />
            </div>
            
            {!cloudSync && (
              <div className="p-3 bg-warning/10 border border-warning rounded-md">
                <p className="text-sm text-foreground">
                  ⚠️ ऑफलाइन मोड सक्रिय। कनेक्ट होने पर डेटा सिंक होगा।
                </p>
              </div>
            )}
          </div>
        </Card>

          {/* Help & Support */}
          <Card className="p-5 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-base md:text-lg font-semibold text-foreground">मदद और सहायता</h2>
          </div>
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start h-12 text-base">
              अक्सर पूछे जाने वाले प्रश्न
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 text-base">
              सहायता से संपर्क करें
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 text-base">
              ट्यूटोरियल वीडियो देखें
            </Button>
            <Separator className="my-4" />
            <Button 
              variant="default" 
              className="w-full h-12 md:h-14 text-base md:text-lg bg-success hover:bg-success/90"
              onClick={() => window.location.href = 'tel:1800-000-0000'}
            >
              <Phone className="w-5 h-5 mr-2" />
              आपातकालीन सहायता: 1800-000-0000
            </Button>
          </div>
        </Card>

        {/* Logout */}
        <Button variant="destructive" className="md:col-span-2 w-full h-12 text-base" size="lg">
          <LogOut className="w-5 h-5 mr-2" />
          लॉग आउट
        </Button>
      </div>
      </div>
    </div>
  );
};

export default Settings;

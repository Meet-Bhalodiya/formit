
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFormBuilderStore } from "@/lib/store";
import { Download, Upload, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const FormExporter = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importData, setImportData] = useState('');
  
  const { components, formSettings, reset } = useFormBuilderStore();

  const exportForm = () => {
    const formData = {
      components,
      formSettings,
      version: "1.0",
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `form-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Form Exported",
      description: "Form has been saved as a JSON file",
    });
    setIsExportOpen(false);
  };

  const copyFormData = async () => {
    const formData = {
      components,
      formSettings,
      version: "1.0",
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(formData, null, 2);
    
    try {
      await navigator.clipboard.writeText(dataStr);
      toast({
        title: "Copied to Clipboard",
        description: "Form data has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const importForm = () => {
    try {
      const formData = JSON.parse(importData);
      
      if (!formData.components || !formData.formSettings) {
        throw new Error('Invalid form data structure');
      }
      
      // Reset current form and load new data
      reset();
      
      // Load the imported data
      useFormBuilderStore.setState({
        components: formData.components,
        formSettings: formData.formSettings
      });
      
      toast({
        title: "Form Imported",
        description: "Form has been loaded successfully",
      });
      
      setIsImportOpen(false);
      setImportData('');
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Invalid JSON format or structure",
        variant: "destructive"
      });
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportData(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export your form configuration to save or share with others.
            </p>
            <div className="flex gap-2">
              <Button onClick={exportForm} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </Button>
              <Button onClick={copyFormData} variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Import a previously exported form configuration. This will replace your current form.
            </p>
            
            <div>
              <Label htmlFor="file-import">Upload JSON File</Label>
              <Input
                id="file-import"
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="json-input">Or paste JSON data</Label>
              <textarea
                id="json-input"
                className="w-full mt-1 p-2 border rounded-md min-h-[200px] font-mono text-sm"
                placeholder="Paste your form JSON data here..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={importForm} 
              disabled={!importData.trim()}
              className="w-full"
            >
              Import Form
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

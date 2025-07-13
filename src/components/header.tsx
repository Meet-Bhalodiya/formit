
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Undo, Redo, Save, Upload } from "lucide-react";
import { useFormBuilderStore } from "@/lib/store";
import { FormExporter } from "./builder/FormExporter";
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  isPreviewMode: boolean;
  onTogglePreview: () => void;
}

export const Header = ({ isPreviewMode, onTogglePreview }: HeaderProps) => {
  const { undo, redo, canUndo, canRedo, validateForm, components, formSettings } = useFormBuilderStore();

  const handleUndo = () => {
    if (undo()) {
      toast({
        title: "Undo",
        description: "Action undone successfully",
      });
    }
  };

  const handleRedo = () => {
    if (redo()) {
      toast({
        title: "Redo", 
        description: "Action redone successfully",
      });
    }
  };

  const handleValidate = () => {
    const validation = validateForm();
    if (validation.isValid) {
      toast({
        title: "Form Valid",
        description: "Your form is ready to use!",
      });
    } else {
      toast({
        title: "Validation Issues",
        description: (
          <div className="space-y-1">
            {validation.errors.map((error, index) => (
              <div key={index} className="text-sm">{error}</div>
            ))}
          </div>
        ),
        variant: "destructive"
      });
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-foreground">Form Builder</h1>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={!canUndo()}
            title="Undo (Ctrl/Cmd + Z)"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRedo}
            disabled={!canRedo()}
            title="Redo (Ctrl/Cmd + Shift + Z)"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleValidate}
          disabled={components.length === 0}
        >
          Validate Form
        </Button>
        
        <FormExporter />
        
        <Button
          variant={isPreviewMode ? "default" : "outline"}
          size="sm"
          onClick={onTogglePreview}
          className="flex items-center gap-2"
          title="Toggle Preview (Ctrl/Cmd + P)"
        >
          {isPreviewMode ? (
            <>
              <EyeOff className="w-4 h-4" />
              Edit Mode
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Preview
            </>
          )}
        </Button>
      </div>
    </header>
  );
};

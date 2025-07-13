
import { useEffect } from "react";
import { useFormBuilderStore } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

export const KeyboardShortcuts = () => {
  const { undo, redo, canUndo, canRedo, setPreviewMode, isPreviewMode } = useFormBuilderStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const metaKey = isMac ? e.metaKey : e.ctrlKey;

      if (metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              if (canRedo()) {
                redo();
                toast({
                  title: "Redo",
                  description: "Action redone successfully",
                });
              }
            } else {
              e.preventDefault();
              if (canUndo()) {
                undo();
                toast({
                  title: "Undo",
                  description: "Action undone successfully",
                });
              }
            }
            break;
          case 'p':
            e.preventDefault();
            setPreviewMode(!isPreviewMode);
            toast({
              title: isPreviewMode ? "Edit Mode" : "Preview Mode",
              description: `Switched to ${isPreviewMode ? "edit" : "preview"} mode`,
            });
            break;
          case 's':
            e.preventDefault();
            // Export form functionality
            const state = useFormBuilderStore.getState();
            const formData = {
              components: state.components,
              formSettings: state.formSettings,
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
              description: "Form saved as JSON file",
            });
            break;
          case '/':
            e.preventDefault();
            // Show keyboard shortcuts help
            toast({
              title: "Keyboard Shortcuts",
              description: (
                <div className="space-y-1 text-sm">
                  <div><kbd>Ctrl/Cmd + Z</kbd> - Undo</div>
                  <div><kbd>Ctrl/Cmd + Shift + Z</kbd> - Redo</div>
                  <div><kbd>Ctrl/Cmd + P</kbd> - Toggle Preview</div>
                  <div><kbd>Ctrl/Cmd + S</kbd> - Export Form</div>
                  <div><kbd>Ctrl/Cmd + /</kbd> - Show Shortcuts</div>
                </div>
              ),
            });
            break;
        }
      }

      // Arrow key navigation for components
      if (!metaKey && ['ArrowUp', 'ArrowDown', 'Delete', 'Backspace'].includes(e.key)) {
        // This is handled in Canvas component
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo, setPreviewMode, isPreviewMode]);

  return null;
};

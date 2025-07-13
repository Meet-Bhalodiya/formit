
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFormBuilderStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Undo2 } from "lucide-react";

export const UndoToast = () => {
  const { recentlyDeleted, undoDelete, clearRecentlyDeleted } = useFormBuilderStore();
  const { toast, dismiss } = useToast();

  useEffect(() => {
    if (recentlyDeleted) {
      const toastId = toast({
        title: "Component deleted",
        description: `"${recentlyDeleted.component.label}" has been deleted.`,
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              undoDelete();
              dismiss();
            }}
            className="gap-1"
          >
            <Undo2 className="w-3 h-3" />
            Undo
          </Button>
        ),
      });

      // Auto-clear after 10 seconds
      const timer = setTimeout(() => {
        clearRecentlyDeleted();
        dismiss(toastId.id);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [recentlyDeleted, undoDelete, clearRecentlyDeleted, toast, dismiss]);

  return null;
};

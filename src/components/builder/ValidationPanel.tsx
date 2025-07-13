
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ValidationRule {
  type: 'min' | 'max' | 'pattern' | 'custom';
  value: string | number;
  message: string;
}

interface ValidationPanelProps {
  componentId: string;
  componentType: string;
  required: boolean;
  validationRules: ValidationRule[];
  onRequiredChange: (required: boolean) => void;
  onValidationRulesChange: (rules: ValidationRule[]) => void;
}

export const ValidationPanel = ({
  componentId,
  componentType,
  required,
  validationRules = [],
  onRequiredChange,
  onValidationRulesChange
}: ValidationPanelProps) => {
  const addValidationRule = () => {
    const newRule: ValidationRule = {
      type: 'min',
      value: '',
      message: 'Please enter a valid value'
    };
    onValidationRulesChange([...validationRules, newRule]);
  };

  const updateValidationRule = (index: number, updates: Partial<ValidationRule>) => {
    const newRules = [...validationRules];
    newRules[index] = { ...newRules[index], ...updates };
    onValidationRulesChange(newRules);
  };

  const removeValidationRule = (index: number) => {
    onValidationRulesChange(validationRules.filter((_, i) => i !== index));
  };

  const getValidationTypes = () => {
    switch (componentType) {
      case 'text':
      case 'textarea':
        return [
          { value: 'min', label: 'Min Length' },
          { value: 'max', label: 'Max Length' },
          { value: 'pattern', label: 'Pattern (Regex)' },
          { value: 'custom', label: 'Custom Rule' }
        ];
      case 'number':
        return [
          { value: 'min', label: 'Min Value' },
          { value: 'max', label: 'Max Value' },
          { value: 'custom', label: 'Custom Rule' }
        ];
      case 'email':
        return [
          { value: 'pattern', label: 'Email Pattern' },
          { value: 'custom', label: 'Custom Rule' }
        ];
      default:
        return [
          { value: 'custom', label: 'Custom Rule' }
        ];
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-card-foreground border-b border-border pb-2">
        Validation Rules
      </h4>

      <div className="flex items-center justify-between py-2">
        <Label htmlFor={`${componentId}-required`} className="text-sm font-medium">
          Required Field
        </Label>
        <Switch 
          id={`${componentId}-required`}
          checked={required}
          onCheckedChange={onRequiredChange}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Validation Rules</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addValidationRule}
            className="h-8"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Rule
          </Button>
        </div>

        {validationRules.map((rule, index) => (
          <div key={index} className="space-y-2 p-3 border border-border rounded-md">
            <div className="flex items-center gap-2">
              <Select
                value={rule.type}
                onValueChange={(value) => updateValidationRule(index, { type: value as ValidationRule['type'] })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getValidationTypes().map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeValidationRule(index)}
                className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            <Input
              placeholder={rule.type === 'pattern' ? 'Enter regex pattern' : 'Enter value'}
              value={rule.value}
              onChange={(e) => updateValidationRule(index, { value: e.target.value })}
            />

            <Input
              placeholder="Error message"
              value={rule.message}
              onChange={(e) => updateValidationRule(index, { message: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

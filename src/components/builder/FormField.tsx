
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ValidationRule {
  type: 'min' | 'max' | 'pattern' | 'custom';
  value: string | number;
  message: string;
}

interface FormComponent {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validationRules?: ValidationRule[];
  rows?: number;
  acceptedFileTypes?: string;
}

interface FormFieldProps {
  component: FormComponent;
  isPreview?: boolean;
}

export const FormField = ({ component, isPreview = false }: FormFieldProps) => {
  const renderField = () => {
    switch (component.type) {
      case "text":
        return (
          <Input
            placeholder={component.placeholder}
            className="transition-all duration-200 focus:shadow-glow"
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={component.placeholder}
            rows={component.rows || 4}
            className="transition-all duration-200 focus:shadow-glow resize-none"
          />
        );

      case "select":
        return (
          <Select>
            <SelectTrigger className="transition-all duration-200 focus:shadow-glow">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {component.options?.map((option, index) => (
                <SelectItem key={index} value={option.toLowerCase().replace(/\s+/g, '-')}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            {component.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${component.id}-${index}`} />
                <Label 
                  htmlFor={`${component.id}-${index}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case "radio":
        return (
          <RadioGroup>
            {component.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option.toLowerCase().replace(/\s+/g, '-')} id={`${component.id}-${index}`} />
                <Label 
                  htmlFor={`${component.id}-${index}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder={component.placeholder}
            className="transition-all duration-200 focus:shadow-glow"
          />
        );

      case "email":
        return (
          <Input
            type="email"
            placeholder={component.placeholder || "example@email.com"}
            className="transition-all duration-200 focus:shadow-glow"
          />
        );

      case "phone":
        return (
          <Input
            type="tel"
            placeholder={component.placeholder || "+1 (555) 123-4567"}
            className="transition-all duration-200 focus:shadow-glow"
          />
        );

      case "date":
        return (
          <Input
            type="date"
            className="transition-all duration-200 focus:shadow-glow"
          />
        );

      case "file":
        return (
          <Input
            type="file"
            accept={component.acceptedFileTypes}
            className="transition-all duration-200 focus:shadow-glow"
          />
        );

      default:
        return (
          <Input
            placeholder={component.placeholder}
            className="transition-all duration-200 focus:shadow-glow"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground flex items-center gap-1">
        {component.label}
        {component.required && (
          <span className="text-destructive">*</span>
        )}
      </Label>
      {renderField()}
      {/* Show validation rules in preview mode if any exist */}
      {isPreview && component.validationRules && component.validationRules.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {component.validationRules.map((rule, index) => (
            <div key={index}>
              {rule.type === 'min' && `Min: ${rule.value}`}
              {rule.type === 'max' && `Max: ${rule.value}`}
              {rule.type === 'pattern' && `Pattern: ${rule.value}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

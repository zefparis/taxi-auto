import { Request, Response, NextFunction, RequestHandler } from 'express';

type ValidationRule = {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: any[];
  items?: ValidationRule;
  properties?: Record<string, ValidationRule>;
};

type ValidationSchema = {
  body?: Record<string, ValidationRule>;
  params?: Record<string, ValidationRule>;
  query?: Record<string, ValidationRule>;
};

export function validateRequest(schema: ValidationSchema): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    // Validate each part of the request (body, params, query)
    for (const [part, rules] of Object.entries(schema)) {
      if (!rules) continue;

      const source = req[part as keyof typeof schema];
      if (!source) {
        if (Object.values(rules).some(rule => rule.required)) {
          errors.push(`Missing ${part} in request`);
        }
        continue;
      }

      // Validate each field in the part
      for (const [field, rule] of Object.entries(rules)) {
        const value = source[field];
        
        // Check required fields
        if (rule.required && (value === undefined || value === null || value === '')) {
          errors.push(`Field '${field}' is required`);
          continue;
        }

        // Skip further checks if value is not required and not provided
        if (value === undefined || value === null) continue;

        // Type checking
        if (rule.type === 'array' && !Array.isArray(value)) {
          errors.push(`Field '${field}' must be an array`);
          continue;
        } else if (rule.type === 'object' && (typeof value !== 'object' || Array.isArray(value))) {
          errors.push(`Field '${field}' must be an object`);
          continue;
        } else if (rule.type !== 'array' && rule.type !== 'object' && typeof value !== rule.type) {
          errors.push(`Field '${field}' must be of type '${rule.type}'`);
          continue;
        }

        // Min/Max for strings and arrays
        if ((rule.type === 'string' || rule.type === 'array') && rule.min !== undefined && value.length < rule.min) {
          errors.push(`Field '${field}' must be at least ${rule.min} characters long`);
        }
        if ((rule.type === 'string' || rule.type === 'array') && rule.max !== undefined && value.length > rule.max) {
          errors.push(`Field '${field}' must be at most ${rule.max} characters long`);
        }

        // Min/Max for numbers
        if (rule.type === 'number') {
          if (rule.min !== undefined && value < rule.min) {
            errors.push(`Field '${field}' must be at least ${rule.min}`);
          }
          if (rule.max !== undefined && value > rule.max) {
            errors.push(`Field '${field}' must be at most ${rule.max}`);
          }
        }

        // Pattern matching for strings
        if (rule.type === 'string' && rule.pattern && !rule.pattern.test(value)) {
          errors.push(`Field '${field}' does not match the required pattern`);
        }

        // Enum validation
        if (rule.enum && !rule.enum.includes(value)) {
          errors.push(`Field '${field}' must be one of: ${rule.enum.join(', ')}`);
        }

        // Nested object validation
        if (rule.type === 'object' && rule.properties && typeof value === 'object') {
          for (const [nestedField, nestedRule] of Object.entries(rule.properties)) {
            const nestedValue = value[nestedField];
            
            if (nestedRule.required && (nestedValue === undefined || nestedValue === null)) {
              errors.push(`Field '${field}.${nestedField}' is required`);
            }
          }
        }

        // Array item validation
        if (rule.type === 'array' && rule.items) {
          if (!Array.isArray(value)) continue;
          
          for (let i = 0; i < value.length; i++) {
            const item = value[i];
            if (rule.items.type && typeof item !== rule.items.type) {
              errors.push(`Item at index ${i} in '${field}' must be of type '${rule.items.type}'`);
            }
          }
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
        message: 'Validation failed',
      });
    }

    next();
  };
}

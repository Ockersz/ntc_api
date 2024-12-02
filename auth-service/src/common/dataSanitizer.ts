export class DataSanitizer {
  // Sanitize a string by trimming whitespace and removing HTML tags
  static sanitizeString(input: string): string {
    return input.trim().replace(/<[^>]*>?/gm, '');
  }

  // Sanitize a number, returning 0 for NaN values
  static sanitizeNumber(input: number): number {
    return isNaN(input) ? 0 : input;
  }

  // Sanitize a boolean, ensuring it's always a boolean
  static sanitizeBoolean(input: boolean): boolean {
    return !!input;
  }

  // Sanitize an array by mapping its elements through the sanitize method
  static sanitizeArray(input: any[]): any[] {
    return input.map((item) => this.sanitize(item));
  }

  // Sanitize an object by recursively sanitizing its properties
  static sanitizeObject(input: Record<string, any>): Record<string, any> {
    if (typeof input !== 'object' || input === null) {
      return {};
    }

    const sanitizedObject: Record<string, any> = {};
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        sanitizedObject[key] = this.sanitize(input[key]);
      }
    }
    return sanitizedObject;
  }

  // Main sanitize method to handle different input types
  static sanitize(input: any): any {
    if (Array.isArray(input)) {
      return this.sanitizeArray(input);
    }

    switch (typeof input) {
      case 'string':
        return this.sanitizeString(input);
      case 'number':
        return this.sanitizeNumber(input);
      case 'boolean':
        return this.sanitizeBoolean(input);
      case 'object':
        return this.sanitizeObject(input);
      default:
        return input; // Return as-is for unsupported types
    }
  }
}

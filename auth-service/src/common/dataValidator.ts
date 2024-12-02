import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsUsername(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUsername',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const usernameRegex = /^[a-z]{7,}$/;
          return typeof value === 'string' && usernameRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Username must be all lowercase and at least 7 characters long';
        },
      },
    });
  };
}

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return typeof value === 'string' && passwordRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        },
      },
    });
  };
}

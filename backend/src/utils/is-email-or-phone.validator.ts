import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsEmailOrPhone', async: false })
export class IsEmailOrPhone implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^0\d{9}$/;

    return emailRegex.test(value) || phoneRegex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Identifier must be a valid email or phone number';
  }
}

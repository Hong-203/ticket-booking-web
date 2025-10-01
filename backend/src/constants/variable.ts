export const API_PREFIX = 'apis';
export const MAIN_QUEUE = 'SAOTEEN';

export const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const NUMBER = '0123456789';
export const SPECIAL_CHARACTERS = '!#$%&()*+,-./:;<=>?@[]^_{|}~';
export const PASSWORD_CHARACTERS = `${LETTERS}${NUMBER}${SPECIAL_CHARACTERS}`;
export const PASSWORD_REGEX =
  '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[~`¿¡!#$%^&*€£@+÷=\\-[\\]\';,/{}()|":<>?._])[A-Za-z\\d~`¿¡!#$%^&*€£@+÷=\\-[\\]\';,/{}()|":<>?._]{8,20}$';
export const PHONE_REGEX = '^(?:\\+)?\\d{10,12}$';

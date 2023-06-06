export type UserType =
  | 'обучающийся'
  | 'отчислен'
  | 'сотрудник'
  | 'администратор';

export const userTypeArray: UserType[] = [
  'администратор',
  'отчислен',
  'обучающийся',
  'сотрудник',
];

export enum UserRolesEnum {
  Admin = 'администратор',
  Blocked = 'отчислен',
  Student = 'обучающийся',
  Employer = 'сотрудник',
}

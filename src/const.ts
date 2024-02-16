import { version } from '../package.json';

export const NAME = 'FormAPIEx';
export const VERSION = <[number, number, number]>(
  version.split('.').map((v) => Number(v))
);
export const AUTHOR = 'student_2333 <lgc2333@126.com>';
export const LICENSE = 'Apache-2.0';

export const FormClose = Symbol(`${NAME}_FormClose`);
export type FormClose = typeof FormClose;

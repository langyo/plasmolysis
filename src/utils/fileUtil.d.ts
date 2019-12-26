declare function copyFile(src: string, target: string): void;
declare function copyDir(src: string, target: string): void;
declare function readDir(src: string): string;
declare function readFile(src: string): string;
declare function writeFile(data: string, path: string): void;
declare function watchDir(
  src: string,
  callback: (path: string, actionType: 'create' | 'update' | 'delete' | 'init') => void
): void;

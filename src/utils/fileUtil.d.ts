declare function copyFile(src: string, target: string): void;
declare function copyDir(src: string, target: string): void;
declare function watchDir(
  src: string,
  callback: (path: string, actionType: 'create' | 'update' | 'delete') => void
): void;

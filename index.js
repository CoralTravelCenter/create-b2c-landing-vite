#!/usr/bin/env node

import {copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync} from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {execSync} from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.resolve(__dirname, 'project-scaffold');
const dest = process.cwd();

function copyRecursive(srcDir, destDir) {
  if (!existsSync(destDir)) mkdirSync(destDir, {recursive: true});

  for (const item of readdirSync(srcDir)) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);

    if (statSync(srcPath).isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(src, dest);

const pkgPath = path.join(dest, 'package.json');
if (existsSync(pkgPath)) {
  rmSync(pkgPath);
}

const gitignore = `
node_modules
`;

writeFileSync(path.join(dest, '.gitignore'), gitignore.trim() + '\n');

try {
  execSync('git init', {cwd: dest, stdio: 'ignore'});
  console.log('📁 Git-репозиторий инициализирован');
} catch {
  console.warn('⚠️ Не удалось инициализировать git');
}

console.log('✅ Шаблон успешно установлен в текущей директории');

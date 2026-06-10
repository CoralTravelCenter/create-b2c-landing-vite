#!/usr/bin/env node

import { mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import readline from 'node:readline';

const __dirname = dirname(fileURLToPath(import.meta.url));

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('🚀 B2C Landing project creator\n');

  const name = await ask('Project name: ');
  if (!name) {
    console.error('❌ Project name is required');
    process.exit(1);
  }

  const targetDir = join(process.cwd(), name);
  const templateDir = join(__dirname, 'template');

  try {
    await cp(templateDir, targetDir, { recursive: true });
    console.log(`✅ Template copied to ${name}/`);

    const pkgPath = join(targetDir, 'package.json');
    const pkgContent = await readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgContent);
    pkg.name = name;
    await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log('✅ package.json updated');

    console.log('📦 Installing dependencies...');
    execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
    
    console.log(`\n✨ Done! Run:\n  cd ${name}\n  npm run dev`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
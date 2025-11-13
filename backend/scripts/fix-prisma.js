#!/usr/bin/env node

/**
 * Script para corrigir problemas de permissão do Prisma no Windows
 * Verifica se o Prisma Client já existe antes de tentar gerar
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

// Encontrar o caminho do Prisma Client dinamicamente
const findPrismaClientPath = () => {
  const nodeModulesPath = path.join(__dirname, '../../node_modules');
  
  try {
    if (fs.existsSync(nodeModulesPath)) {
      // Procurar em .pnpm
      const pnpmPath = path.join(nodeModulesPath, '.pnpm');
      if (fs.existsSync(pnpmPath)) {
        const entries = fs.readdirSync(pnpmPath);
        const prismaEntry = entries.find(e => e.startsWith('@prisma+client@'));
        if (prismaEntry) {
          return path.join(pnpmPath, prismaEntry, 'node_modules', '.prisma', 'client');
        }
      }
      
      // Procurar diretamente em node_modules
      const directPath = path.join(nodeModulesPath, '@prisma', 'client', '.prisma', 'client');
      if (fs.existsSync(directPath)) {
        return directPath;
      }
    }
  } catch (err) {
    // Ignorar erros
  }
  
  return null;
};

// Verificar se o Prisma Client já existe e está válido
const isPrismaClientValid = () => {
  const prismaPath = findPrismaClientPath();
  if (!prismaPath || !fs.existsSync(prismaPath)) {
    return false;
  }
  
  try {
    const files = fs.readdirSync(prismaPath);
    
    // Verificar se os arquivos essenciais existem
    const requiredFiles = [
      'index.js',
      'index.d.ts',
      os.platform() === 'win32' 
        ? 'query_engine-windows.dll.node' 
        : os.platform() === 'darwin'
        ? 'query_engine-darwin'
        : 'query_engine-linux'
    ];
    
    const hasRequiredFiles = requiredFiles.some(file => 
      files.some(f => f.includes(file.split('.')[0]))
    );
    
    // Verificar se não há arquivos temporários travados
    const hasTempFiles = files.some(f => f.includes('.tmp'));
    
    return hasRequiredFiles && !hasTempFiles;
  } catch (err) {
    return false;
  }
};

const cleanPrismaFiles = () => {
  const prismaPath = findPrismaClientPath();
  if (!prismaPath) {
    return 0;
  }
  
  try {
    if (fs.existsSync(prismaPath)) {
      const files = fs.readdirSync(prismaPath);
      let cleaned = 0;
      
      // Remover arquivos temporários .tmp*
      files.forEach((file) => {
        if (file.includes('.tmp')) {
          const filePath = path.join(prismaPath, file);
          try {
            fs.unlinkSync(filePath);
            cleaned++;
          } catch (err) {
            // Ignorar erros de remoção
          }
        }
      });
      
      return cleaned;
    }
  } catch (err) {
    // Ignorar erros
  }
  
  return 0;
};

const generatePrisma = () => {
  return new Promise((resolve) => {
    console.log('🔄 Gerando Prisma Client...');
    
    // Usar pnpm exec para encontrar o prisma correto
    const isWindows = os.platform() === 'win32';
    const command = isWindows ? 'pnpm.cmd' : 'pnpm';
    const args = ['exec', 'prisma', 'generate'];
    
    const prismaProcess = spawn(command, args, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, PRISMA_GENERATE_SKIP_AUTOINSTALL: 'true' }
    });
    
    prismaProcess.on('close', (code) => {
      resolve(code === 0);
    });
    
    prismaProcess.on('error', (err) => {
      console.error('❌ Erro ao executar Prisma:', err.message);
      resolve(false);
    });
  });
};

// Executar verificação e geração
(async () => {
  // Verificar se já existe um Prisma Client válido
  if (isPrismaClientValid()) {
    console.log('✓ Prisma Client já existe e está válido, pulando geração');
    process.exit(0);
  }
  
  console.log('🧹 Limpando arquivos temporários do Prisma...');
  const cleaned = cleanPrismaFiles();
  if (cleaned > 0) {
    console.log(`✓ Limpeza concluída: ${cleaned} arquivo(s) temporário(s) removido(s)`);
  }
  
  // Aguardar um pouco antes de gerar
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const success = await generatePrisma();
  
  if (success) {
    console.log('✓ Prisma Client gerado com sucesso!');
    process.exit(0);
  } else {
    // Se falhou, verificar novamente se agora existe (pode ter sido gerado parcialmente)
    if (isPrismaClientValid()) {
      console.log('⚠ Geração falhou, mas Prisma Client válido encontrado. Continuando...');
      process.exit(0);
    }
    
    console.error('❌ Erro ao gerar Prisma Client');
    console.error('💡 Dicas:');
    console.error('   1. Feche todos os processos Node.js (VS Code, terminal, etc.)');
    console.error('   2. Execute: pnpm --filter backend prisma:generate');
    console.error('   3. Se persistir, reinicie o Windows');
    process.exit(1);
  }
})();


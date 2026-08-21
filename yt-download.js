#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get Termux storage paths
const HOME = process.env.HOME || '/data/data/com.termux/files/home';
const VIDEOS_DIR = path.join(HOME, 'storage/shared/Movies');
const MUSIC_DIR = path.join(HOME, 'storage/shared/Music');

// Ensure directories exist
[VIDEOS_DIR, MUSIC_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Colors for stylish output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlue: '\x1b[44m',
  bgGreen: '\x1b[42m'
};

function c(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function printBanner() {
  console.log(c('\n    ╔═══════════════════════════════════════╗', 'cyan'));
  console.log(c('    ║  ██╗  ██╗ █████╗ ██████╗ ███████╗    ║', 'cyan'));
  console.log(c('    ║  ██║  ██║██╔══██╗██╔══██╗██╔════╝    ║', 'cyan'));
  console.log(c('    ║  ███████║███████║██████╔╝███████╗    ║', 'cyan'));
  console.log(c('    ║  ██╔══██║██╔══██║██╔══██╗╚════██║    ║', 'cyan'));
  console.log(c('    ║  ██║  ██║██║  ██║██║  ██║███████║    ║', 'cyan'));
  console.log(c('    ║  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝    ║', 'cyan'));
  console.log(c('    ║        YouTube Downloader v2.0       ║', 'yellow'));
  console.log(c('    ╚═══════════════════════════════════════╝\n', 'cyan'));
}

function printSection(title) {
  console.log(c(`\n  ┌─ ${title} `, 'blue') + '─'.repeat(40 - title.length) + c('┐', 'blue'));
}

function printOption(num, text, desc = '') {
  const numStr = c(`  ${num})`, 'yellow');
  const textStr = c(text, 'white');
  const descStr = desc ? c(`  ${desc}`, 'dim') : '';
  console.log(`${numStr} ${textStr}${descStr}`);
}

function printSuccess(msg) {
  console.log(c(`\n  ✓ ${msg}`, 'green'));
}

function printError(msg) {
  console.log(c(`\n  ✗ ${msg}`, 'red'));
}

function printInfo(msg) {
  console.log(c(`  ℹ ${msg}`, 'cyan'));
}

function askUrl() {
  printSection('ENTER YOUTUBE URL');
  rl.question(c('  ► ', 'yellow'), (url) => {
    url = url.trim();
    if (!url) {
      printError('URL cannot be empty!');
      askUrl();
      return;
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      printError('Please enter a valid YouTube URL');
      askUrl();
      return;
    }

    askType(url);
  });
}

function askType(url) {
  printSection('SELECT DOWNLOAD TYPE');
  printOption('1', 'Video (MP4)', 'Save to Movies folder');
  printOption('2', 'Audio (MP3)', 'Save to Music folder');
  printOption('3', 'Exit', '');

  rl.question(c('\n  ► Choice: ', 'yellow'), (choice) => {
    choice = choice.trim();
    if (choice === '1') {
      askVideoQuality(url);
    } else if (choice === '2') {
      askAudioQuality(url);
    } else if (choice === '3') {
      console.log(c('\n  Bye! 👋\n', 'magenta'));
      rl.close();
      process.exit(0);
    } else {
      printError('Invalid choice!');
      askType(url);
    }
  });
}

function askVideoQuality(url) {
  printSection('SELECT VIDEO QUALITY');
  printOption('1', 'Best Available (up to 4K/8K)', 'Largest file size');
  printOption('2', '2K (1440p)', 'High quality');
  printOption('3', '1080p (Full HD)', 'Standard HD');
  printOption('4', '720p (HD)', 'Good quality, smaller');
  printOption('5', '480p (SD)', 'Mobile friendly');
  printOption('6', '360p (Low)', 'Smallest file');
  printOption('7', 'Back', '');

  rl.question(c('\n  ► Choice: ', 'yellow'), (choice) => {
    const qualityMap = {
      '1': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
      '2': 'bestvideo[height<=1440][ext=mp4]+bestaudio[ext=m4a]/best[height<=1440][ext=mp4]/best[height<=1440]',
      '3': 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best[height<=1080]',
      '4': 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best[height<=720]',
      '5': 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best[height<=480]',
      '6': 'bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]/best[height<=360]',
      '7': 'back'
    };

    const format = qualityMap[choice.trim()];
    if (choice === '7' || format === 'back') {
      askType(url);
      return;
    }
    if (!format) {
      printError('Invalid choice!');
      askVideoQuality(url);
      return;
    }

    downloadVideo(url, format, VIDEOS_DIR);
  });
}

function askAudioQuality(url) {
  printSection('SELECT AUDIO QUALITY');
  printOption('1', 'Best (320 kbps)', 'Highest quality');
  printOption('2', 'High (256 kbps)', 'Great quality');
  printOption('3', 'Standard (192 kbps)', 'Good balance');
  printOption('4', 'Low (128 kbps)', 'Smaller files');
  printOption('5', 'Back', '');

  rl.question(c('\n  ► Choice: ', 'yellow'), (choice) => {
    const qualityMap = {
      '1': '0',
      '2': '1',
      '3': '2',
      '4': '5',
      '5': 'back'
    };

    const quality = qualityMap[choice.trim()];
    if (choice === '5' || quality === 'back') {
      askType(url);
      return;
    }
    if (!quality) {
      printError('Invalid choice!');
      askAudioQuality(url);
      return;
    }

    downloadAudio(url, quality, MUSIC_DIR);
  });
}

function downloadVideo(url, format, outputDir) {
  printSection('DOWNLOADING VIDEO');
  printInfo('This may take a while depending on quality and length\n');

  const args = [
    '-f', format,
    '--merge-output-format', 'mp4',
    '--embed-thumbnail',
    '--embed-metadata',
    '-o', path.join(outputDir, '%(title)s.%(ext)s'),
    url
  ];

  runYtDlp(args, 'video', 'Movies');
}

function downloadAudio(url, quality, outputDir) {
  printSection('DOWNLOADING AUDIO');
  printInfo('Extracting audio as MP3...\n');

  const args = [
    '-x',
    '--audio-format', 'mp3',
    '--audio-quality', quality,
    '--embed-thumbnail',
    '--embed-metadata',
    '-o', path.join(outputDir, '%(title)s.%(ext)s'),
    url
  ];

  runYtDlp(args, 'audio', 'Music');
}

function runYtDlp(args, type, folderName) {
  const ytdlp = spawn('yt-dlp', args);

  let lastLine = '';

  ytdlp.stdout.on('data', (data) => {
    const output = data.toString();
    const lines = output.split('\n');
    lines.forEach(line => {
      if (line.includes('[download]') && (line.includes('%') || line.includes('ETA'))) {
        process.stdout.write('\r' + c('  ► ', 'cyan') + line.trim() + '   ');
        lastLine = line.trim();
      } else if (line.includes('[Merger]') || line.includes('[EmbedThumbnail]') || line.includes('[EmbedMetadata]') || line.includes('[ExtractAudio]')) {
        process.stdout.write('\r' + c('  ► ', 'magenta') + line.trim() + '   ');
      }
    });
  });

  ytdlp.stderr.on('data', (data) => {
    const output = data.toString();
    if (output.includes('ERROR') || output.includes('error:')) {
      console.log('\n');
      printError(output.trim());
    }
  });

  ytdlp.on('close', (code) => {
    console.log('\n');
    if (code === 0) {
      printSuccess(`Download complete! Saved to ${folderName} folder.`);
    } else {
      printError(`Download failed (exit code: ${code})`);
    }
    console.log('');
    askUrl();
  });
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log(c('\n\n  Bye! 👋\n', 'magenta'));
  rl.close();
  process.exit(0);
});

printBanner();
askUrl();
import { exec } from 'node:child_process';

let syncTimeout: ReturnType<typeof setTimeout> | null = null;
let isSyncing = false;
let pendingSync = false;

/**
 * Tự động đồng bộ các thay đổi từ local lên GitHub & Vercel (public)
 * Đã có cơ chế debounce để gom các thao tác liên tiếp thành 1 lần đẩy duy nhất.
 */
export function triggerAutoGitPush(delayMs = 3500): void {
  // Không kích hoạt git push khi đang chạy unit test
  if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    return;
  }

  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  syncTimeout = setTimeout(() => {
    executeGitPush();
  }, delayMs);
}

function executeGitPush(): void {
  if (isSyncing) {
    pendingSync = true;
    return;
  }

  isSyncing = true;
  pendingSync = false;

  const env = {
    ...process.env,
    PATH: `${process.cwd()}\\.tools\\node;C:\\Program Files\\Git\\cmd;C:\\Program Files\\Git\\bin;${process.env.PATH || ''}`,
  };

  console.log('[Auto-Sync] Phát hiện thay đổi tại Local -> Đang tự động đồng bộ lên GitHub & Vercel...');

  const cmd = 'git add . && git commit -m "Tu dong dong bo cap nhat tu local len public" && git push origin main';

  exec(cmd, { env }, (error, stdout, stderr) => {
    isSyncing = false;

    if (error) {
      const output = `${stdout} ${stderr}`;
      if (output.includes('nothing to commit') || output.includes('working tree clean')) {
        console.log('[Auto-Sync] Dữ liệu đã đồng bộ hoàn toàn với Public, không có thay đổi mới.');
      } else {
        console.warn('[Auto-Sync] Thông báo đồng bộ:', error.message);
      }
    } else {
      console.log('[Auto-Sync] [OK] ĐÃ ĐỒNG BỘ THÀNH CÔNG TỪ LOCAL LÊN PUBLIC (VERCEL)!');
    }

    if (pendingSync) {
      pendingSync = false;
      triggerAutoGitPush(2000);
    }
  });
}


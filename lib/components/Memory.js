import systemInformation from 'systeminformation';
import { execSync } from 'child_process';
import os from 'os';
import { Config } from '#template'

const platform = os.platform();

/**
 * 转换字节大小为更易读的格式（KB, MB, GB 等）
 * @param {number} bytes - 字节数
 * @return {string} 转换后的大小
 */
function formatSizeUnits(bytes) {
  if (bytes >= 1073741824) {
    return (bytes / 1073741824).toFixed(2) + ' GB';
  } else if (bytes >= 1048576) {
    return (bytes / 1048576).toFixed(2) + ' MB';
  } else if (bytes >= 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else if (bytes > 1) {
    return bytes.toFixed(2) + ' B';
  } else if (bytes === 1) {
    return bytes + ' byte';
  } else {
    return '0 bytes';
  }
}

/**
 * 获取内存使用情况，并以可视化的圈形图标表示
 * @return {Promise<Object>} 包含描述、进度和颜色值的对象
 */
export async function getMemoryUsageCircle() {
  try {
    let info
    if (Config.Config.wmic && platform === 'win32') {
      // 获取总物理内存
      const totalMemResult = execSync('wmic ComputerSystem get TotalPhysicalMemory').toString().trim();
      const totalMemory = parseInt(totalMemResult.split('\n')[1].trim(), 10);

      // 获取可用虚拟内存
      const freeMemResult = execSync('wmic OS get FreePhysicalMemory,TotalVisibleMemorySize').toString().trim();
      const lines = freeMemResult.split('\n').slice(1);
      const [freeMemoryKB, totalVisibleMemoryKB] = lines[0].trim().split(/\s+/).map(num => parseInt(num, 10));

      // 转换 KB 为 字节
      const totalVisibleMemory = totalVisibleMemoryKB * 1024;
      const freeMemory = freeMemoryKB * 1024;
      const activeMemory = totalVisibleMemory - freeMemory;
      info = {
        mem: {
          total: totalMemory,
          active: activeMemory
        }
      };
    } else {
      info = await systemInformation.get({
        mem: 'total,active'
      });
    }

    return {
      text: `${formatSizeUnits(info.mem.active)} / ${formatSizeUnits(info.mem.total)}`,
      progress: info.mem.active / info.mem.total
    };
  } catch (error) {
    console.error('获取内存圈形图信息时出错:', error);
    return {
      text: "0 B / 0 B",
      progress: 0
    };

  }
}

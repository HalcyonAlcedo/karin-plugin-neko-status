import systemInformation from 'systeminformation';
import { execSync } from 'child_process';
import os from 'os';
import { Config } from '#template'

const platform = os.platform();

/**
 * 获取操作系统的分发版信息
 * @return {Promise<Object>} 包含分发版信息的对象
 */
export async function getSysInfo() {
  try {
    let info
    if (Config.Config.wmic && platform === 'win32') {
      const result = execSync('wmic os get Caption').toString().trim();
      const lines = result.split('\n').slice(1);
      info = { osInfo: { distro: lines[0].trim() } };
    } else {
      info = await systemInformation.get({
        osInfo: 'distro'
      });
    }

    return {
      key: 'System',
      value: info.osInfo.distro.length > 36 ? info.osInfo.distro.slice(0, 36) + '...' : info.osInfo.distro
    };
  } catch (error) {
    console.error('获取系统信息时出错:', error);
    return {
      key: 'System',
      value: "The Emperor's New System"
    };
  }
}

import { common } from 'node-karin'
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

function getNetworkTraffic() {
  try {
    // 使用 wmic 命令获取网络接口信息
    const result = execSync('wmic path Win32_PerfRawData_Tcpip_NetworkInterface get Name,BytesReceivedPerSec,BytesSentPerSec /format:csv').toString().trim();
    const lines = result.split('\n');
    const data = lines.slice(1).map(line => {
      const [name, received, sent] = line.split(',');
      return { name, received: parseInt(received, 10), sent: parseInt(sent, 10) };
    });

    // 累加所有网络接口的流量数据
    const totalReceived = data.reduce((acc, iface) => acc + iface.received, 0);
    const totalSent = data.reduce((acc, iface) => acc + iface.sent, 0);

    return { totalReceived, totalSent };
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return null;
  }
}

function calculateNetworkSpeed(interval) {
  return new Promise((resolve, reject) => {
    const initialStats = getNetworkTraffic();

    if (!initialStats) return reject(new Error('Failed to get initial network stats'));

    setTimeout(() => {
      const finalStats = getNetworkTraffic();

      if (!finalStats) return reject(new Error('Failed to get final network stats'));

      const receivedSpeed = (finalStats.totalReceived - initialStats.totalReceived) / interval; // 每秒接收字节数
      const sentSpeed = (finalStats.totalSent - initialStats.totalSent) / interval; // 每秒发送字节数

      resolve({
        tx_sec: sentSpeed, // 上行速度
        rx_sec: receivedSpeed // 下行速度
      });
    }, interval);
  });
}
/**
 * 获取当前网络接口的上行下行速度
 * @return {Promise<Object>} 包含上行和下行速度的对象
 */
export async function getNetworkSpeed() {
  try {
    let primaryInterface
    if (Config.Config.wmic && platform === 'win32') {
      primaryInterface = await calculateNetworkSpeed(1000)
    } else {
      let info = await systemInformation.get({ networkStats: "iface" });
      if (!info.rx_sec || !info.tx_sec) {
        await common.sleep(1000)
        info = await systemInformation.get({
          networkStats: "rx_sec,tx_sec",
        })
      }
      if (!info.networkStats || info.networkStats.length === 0) {
        throw new Error('无法获取网络状态信息');
      }
      primaryInterface = info.networkStats[0];
    }
    return {
      text: `↑ ${formatSizeUnits(primaryInterface.tx_sec)}/s ↓ ${formatSizeUnits(primaryInterface.rx_sec)}/s`,
      progress: primaryInterface.tx_sec / (primaryInterface.tx_sec + primaryInterface.rx_sec)
    };
  } catch (error) {
    console.error('获取网络速度时出错:', error);
    return {
      text: '↑ 0 B/s ↓ 0 B/s',
      progress: 0
    };
  }
}

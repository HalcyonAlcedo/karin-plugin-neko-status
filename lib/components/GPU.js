import systemInformation from 'systeminformation';
import { execSync } from 'child_process';
import os from 'os';
import { Config } from '#template'

const platform = os.platform();

/**
 * 获取GPU信息
 * @return {Promise<Object>} 包含GPU模型或错误提示的对象
 */
export async function getGpuInfo() {
  try {
    let graphics
    if (Config.Config.wmic && platform === 'win32') {
      const result = execSync('wmic path win32_videocontroller get name').toString().trim();
      const lines = result.split('\n').slice(1);
      graphics = {
        controllers: lines.map(line => {
          return {
            model: line.trim()
          };
        })
      };
    } else {
      graphics = (await systemInformation.get({ graphics: 'controllers' })).graphics;
    }

    if (graphics.controllers.length === 0) {
      throw new Error('未找到GPU，请确认已安装显卡驱动');
    }

    let gpu = graphics.controllers.find(controller => controller.name) || graphics.controllers.find(controller => controller.model) || { model: "The Emperor's New GPU" };

    const gpuModel = gpu.model.length > 36 ? `${gpu.model.slice(0, 36)}...` : gpu.model;

    return {
      key: 'GPU',
      value: gpuModel
    };
  } catch (error) {
    console.error('获取GPU信息时出错:', error);

    return {
      key: 'GPU',
      value: "The Emperor's New GPU"
    };
  }
}

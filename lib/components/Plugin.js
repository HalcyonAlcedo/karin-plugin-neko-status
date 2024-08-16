import fs from 'fs';
import { common } from 'node-karin'

/**
 * 获取插件数量信息
 * @return {Promise<Object>} 包含插件数量信息的对象
 */
export async function getPluginNumInfo() {
    try {
        const pluginsCount = common.getPlugins().length || 0 + await common.getNpmPlugins().length || 0;
        const exampleDir = './plugins/karin-plugin-example';
        const jsFilesCount = fs.existsSync(exampleDir)
            ? fs.readdirSync(exampleDir)
                  .filter(fileName => fileName.endsWith('.js')).length
            : 0;

        return {
            key: 'Plugins',
            value: `${pluginsCount} plugin & ${jsFilesCount} js loaded`
        };
    } catch (error) {
        console.error('获取插件信息时出错:', error);
        return {
            key: 'Plugins',
            value: "0 plugin & 0 js loaded"
        };
    }
}

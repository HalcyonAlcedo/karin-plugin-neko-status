import { karin, YamlEditor, logger, common } from 'node-karin'
import { Config, dirPath } from '#template'
import fs from 'fs'

export const header = karin.command(
  /^[/#]?更换状态头图.*$/,
  async (e) => {
    const config = Config.Config
    let url = e.msg.replace(/^[/#]?更换状态头图/, '').trim()
    let imageUrl;

    // 获取消息中的图片
    if (e.image) {
      imageUrl = e.image[0]
    }

    const getChatHistoryMessage = async (messageId, count) => {
      return await e.bot.GetHistoryMessage(e.contact, messageId, count)
    }

    // 获取历史记录
    if (e.contact) {
      const historyMessage = await getChatHistoryMessage(e.message_id, 1)
      if (historyMessage.image) {
        imageUrl = historyMessage.image[0]
      }
    }

    if (url && !await isImageUrl(url)) {
      e.reply('无法获取到图片，请检查链接是否正确')
      return false;
    }

    url = url || imageUrl

    if (url) {
      config.headimg_url = url
      const yamlEditor = new YamlEditor(`${dirPath}/config/config/config.yaml`)
      yamlEditor.set('headimg_url', url)
      e.reply('设置成功')
    } else {
      e.reply('无法获取到图片')
      return false
    }
  },
  { permission: 'master' }
)
export const template = karin.command(
  /^[/#]?更换状态模板.*$/,
  async (e) => {
    const config = Config.Config
    let template = e.msg.replace(/^[/#]?更换状态模板/, '').trim()

    let templateOptions = await getTemplate()
    let templateList = templateOptions.map(val => val.value)

    if (templateList.indexOf(template) === -1) {
      e.reply('模板不存在，请发送“#状态模板列表”查看所有模板')
      return false
    }

    config.use_template = template
    const yamlEditor = new YamlEditor(`${dirPath}/config/config/config.yaml`)
    yamlEditor.set('use_template', template)
    e.reply('设置成功，当前状态模板：' + template)
  },
  { permission: 'master' }
)
export const templateList = karin.command(
  /^[/#]?状态模板列表.*$/,
  async (e) => {
    let templateOptions = await getTemplate();
    let templateList = templateOptions.map(val => val.value);
    e.reply('状态模板列表：\n' + templateList.join('\n'));
    return true;
  },
  { permission: 'master' }
)

async function isImageUrl(imageUrl) {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return contentType && contentType.startsWith('image/');
  } catch (error) {
    console.error('检查失败:', error);
    return false;
  }
}
async function getTemplate() {
  try {
    const template = fs.readdirSync(`${common.absPath(dirPath)}/resources/template`)
    let templateOptions = []
    template.forEach((item) => {
      templateOptions.push({ label: item + '模板', value: item })
    })
    return templateOptions
  } catch (err) {
    logger.error(`[NEKO-STATUS-PLUGIN v${Config.package.version}]`, '读取template失败')
    return [{ label: '读取失败', value: 'default' }]
  }
}

import { plugin, YamlEditor, logger, common } from '#Karin'
import Cfg from '../lib/config.js'
import fs from 'fs'
import { dirPath, version } from '../index.js'
import { KarinContact } from '../../../lib/bot/KarinElement.js'

export class neko_header extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: 'neko头图',
      /** 功能描述 */
      dsc: '设置状态头图',
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 1009,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^[/#]?更换状态头图.*$',
          /** 执行方法 */
          fnc: 'header',
          /** 主人权限 */
          permission: 'master'
        },
        {
          /** 命令正则匹配 */
          reg: '^[/#]?更换状态模板.*$',
          /** 执行方法 */
          fnc: 'template',
          /** 主人权限 */
          permission: 'master'
        },
        {
          /** 命令正则匹配 */
          reg: '^[/#]?状态模板列表.*$',
          /** 执行方法 */
          fnc: 'templateList',
          /** 主人权限 */
          permission: 'master'
        }
      ]
    })
  }

  async header() {
    const config = Cfg.Config
    let url = this.e.msg.replace(/^[/#]?更换状态头图/, '').trim()
    let imageUrl;

    // 获取消息中的图片
    if (this.e.image) {
      imageUrl = this.e.image[0]
    }

    const getChatHistoryMessage = async (messageId, count) => {
      const contact = this.e.isGroup
        ? KarinContact.group(parseInt(this.e.contact.peer))
        : KarinContact.private(parseInt(this.e.contact.peer))
      return await this.e.bot.GetHistoryMessage(contact, messageId, count)
    }

    // 获取历史记录
    if (this.e.contact) {
      const historyMessage = await getChatHistoryMessage(this.e.message_id, 1)
      if (historyMessage.image) {
        imageUrl = historyMessage.image[0]
      }
    }

    if (url && !await isImageUrl(url)) {
      this.reply('无法获取到图片，请检查链接是否正确')
      return false;
    }

    url = url || imageUrl

    if (url) {
      config.headimg_url = url
      const yamlEditor = new YamlEditor(`${dirPath}/config/config/config.yaml`)
      yamlEditor.set('headimg_url', url)
      this.reply('设置成功')
    } else {
      this.reply('无法获取到图片')
      return false
    }
  }

  async template() {
    const config = Cfg.Config
    let template = this.e.msg.replace(/^[/#]?更换状态模板/, '').trim()

    let templateOptions = await getTemplate()
    let templateList = templateOptions.map(val => val.value)

    if (templateList.indexOf(template) === -1) {
      this.reply('模板不存在，请发送“#状态模板列表”查看所有模板')
      return false
    }

    config.use_template = template
    const yamlEditor = new YamlEditor(`${dirPath}/config/config/config.yaml`)
    yamlEditor.set('use_template', template)
    this.reply('设置成功，当前状态模板：' + template)
  }

  async templateList(e) {
    let templateOptions = await getTemplate();
    let templateList = templateOptions.map(val => val.value);
    this.reply('状态模板列表：\n' + templateList.join('\n'));
    return true;
  }
}

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
    logger.error(`[NEKO-STATUS-PLUGIN v${version}]`, '读取template失败')
    return [{ label: '读取失败', value: 'default' }]
  }
}

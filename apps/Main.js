import { plugin, Renderer, segment } from '#Karin'
import Cfg from '../lib/config.js'
import { dirPath, basename } from '../index.js'
import getData from '../lib/model/getData.js'

export class neko_status extends plugin {
  constructor () {
    super({
      // 必选 插件名称
      name: 'neko状态',
      // 插件描述
      dsc: '获取neko状态',
      // 监听消息事件 默认message
      event: 'message',
      // 优先级
      priority: 4999,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^[/#]?(状态|status)$',
          /** 执行方法 */
          fnc: 'status',
          // 权限 master,owner,admin,all
          permission: 'all'
        }
      ],
    })
  }

  async status() {
    const config = Cfg.Config
    const data = await getData.getData(this.e)
    const base64 = await Renderer.render({
      name:'karin-plugin-neko-status',
      file: `${dirPath}/resources/template/${config.use_template}/template.html`,
      data: {
        pluginResources: `../../../plugins/${basename}/resources/`,
        data: data
      }
    })
    await this.reply([segment.image(base64)])
    return true
  }
}

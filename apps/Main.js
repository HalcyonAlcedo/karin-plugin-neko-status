import { segment, karin, Renderer } from 'node-karin'
import { dirPath, basename, Config } from '#template'
import getData from '../lib/model/getData.js'

export const status = karin.command(
  /^[/#]?(状态|status)$/,
  async (e) => {
    const config = Config.Config
    const data = await getData.getData(e)
    const base64 = await Renderer.render({
      name: 'karin-plugin-neko-status',
      file: `${dirPath}/resources/template/${config.use_template}/template.html`,
      data: {
        pluginResources: `../../../plugins/${basename}/resources`,
        data: data
      }
    })
    await e.reply([segment.image(base64)])
    return true
  },
  { permission: 'all', priority: 4999 }
)

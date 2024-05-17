import { logger } from '#Karin'
import { version } from '../../index.js'

/** 快捷logger：i-info m-mark w-warn e-error
 */
class Log {
  constructor () {
    this.header = `[NEKO-STATUS-PLUGIN v${version}]`
  }

  /** 快捷执行logger.info( )  */
  i (...msg) {
    logger.info(this.header, ...msg)
  }

  /** 快捷执行logger.mark( ) */
  m (...msg) {
    logger.mark(this.header, ...msg)
  }

  /** 快捷执行logger.warn( ) */
  w (...msg) {
    logger.warn(this.header, ...msg)
  }

  /** 快捷执行logger.error( ) */
  e (...msg) {
    logger.error(this.header, ...msg)
  }

  /** 快捷执行console.log( ) */
  c (...msg) {
    console.log(this.header, ...msg)
  }
}
export default new Log()

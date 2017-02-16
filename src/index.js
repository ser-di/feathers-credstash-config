import Credstash from 'credstash'
import deasync from 'deasync'
import Debug from 'debug'

export default module.exports = function (table, options) {
  const debug = Debug('feathers:credstash')
  debug(`INIT ${table}`)
  const credstash = new Credstash({table})

  return function () {
    debug('Start')
    let app = this
    debug('Get init')
    options = options || app.get('credstash')
    const get = deasync(credstash.get.bind(credstash))
    if (Array.isArray(options)) {
      debug('Array')
      options.forEach(paramName => {
        const val = get(paramName)
        app.set(paramName, val)
        debug(`param ${paramName} = ${val}`)
      })
    } else {
      debug('Object')
      for (let [csKey, appSetKey] of Object.entries(options)) {
        const val = get(csKey)
        app.set(appSetKey, val)
        debug(`param ${appSetKey} = ${val}`)
      }
    }
  }
}

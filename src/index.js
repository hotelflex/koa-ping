const os = require('os')
const df = require('node-df')
const path = require('path')
const appRootDir = require('app-root-path')
const pjson = require(appRootDir + path.sep + 'package.json')

const DEFAULT_PATH = '/ping'

const getInfo = () =>
  new Promise(resolve => {
    df((err, data) => {
      if (err) return resolve({ msg: 'Error fetching disk info', error: err })
      return resolve({
        timestamp: Date.now(),
        uptime: process.uptime(),
        application: {
          name: pjson.name,
          version: pjson.version,
          pid: process.pid,
          title: process.title,
          argv: process.argv,
          versions: process.versions,
          node_env: process.env.NODE_ENV,
        },
        resources: {
          memory: process.memoryUsage(),
          loadavg: os.loadavg(),
          cpu: os.cpus(),
          disk: data,
          nics: os.networkInterfaces(),
        },
        system: {
          arch: process.arch,
          platform: process.platform,
          type: os.type(),
          release: os.release(),
          hostname: os.hostname(),
          uptime: os.uptime(),
          cores: os.cpus().length,
          memory: os.totalmem(),
        },
      })
    })
  })

module.exports = p => async (ctx, next) => {
  p = p || DEFAULT_PATH
  if (p === ctx.path) {
    ctx.body = await getInfo()
  } else {
    return next()
  }
}

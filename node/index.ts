import { Service, ServiceContext } from '@vtex/api'
import { request } from 'http'
import { pick } from 'ramda'

const rootPath = '/ar'

const pickedHeaders = ['accept-encoding', 'accept-language', 'accept', 'cookie']

export default new Service({
  routes: {
    rewrite: async (ctx: ServiceContext) => {
      const {req, vtex: { account, workspace, operationId }} = ctx
      const host = `${workspace}--${account}.myvtex.com`

      const options = {
        headers: {
          ...pick(pickedHeaders, req.headers),
          host,
          'x-vtex-operation-id': operationId,
          'x-vtex-root-path': rootPath,
        },
        hostname: host,
        method: req.method,
        path: req.url!.replace(rootPath, '/'),
      }

      console.log('Proxying request:', options)

      await new Promise((resolve, reject) => {
        const proxyReq = request(options, (res) => {
          console.log(`Response status: ${res.statusCode}`, res.headers)
          ctx.status = res.statusCode as number
          ctx.set(res.headers as any)
          ctx.body = res
          resolve()
        })

        proxyReq.on('error', reject)
        proxyReq.end()

        // Don't cache errors if request fails
        ctx.set('cache-control', 'private, no-cache')
      })

    },
  },
})

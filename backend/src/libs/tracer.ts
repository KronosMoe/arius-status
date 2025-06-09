'use strict'

import { Logger } from '@nestjs/common'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express'
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import * as opentelemetry from '@opentelemetry/sdk-node'
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions'

const logger = new Logger('OpenTelemetry')

export async function startTracing() {
  const exporterOptions = {
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  }

  const traceExporter = new OTLPTraceExporter(exporterOptions)
  const sdk = new opentelemetry.NodeSDK({
    traceExporter,
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new GraphQLInstrumentation(),
    ],
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'arius-status-page',
      [ATTR_SERVICE_VERSION]: process.env.VITE_APP_VERSION || '1.0.0',
    }),
  })

  sdk.start()
  logger.log(`Tracing initialized with endpoint to ${exporterOptions.url}`)

  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => logger.log('Tracing terminated'))
      .catch((error) => logger.error('Error terminating tracing', error))
      .finally(() => process.exit(0))
  })
}

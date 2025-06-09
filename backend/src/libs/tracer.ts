/* eslint-disable no-console */
'use strict'

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import * as opentelemetry from '@opentelemetry/sdk-node'
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions'
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql'

export async function startTracing() {
  const exporterOptions = {
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  }

  const traceExporter = new OTLPTraceExporter(exporterOptions)
  const sdk = new opentelemetry.NodeSDK({
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations(),
      new GraphQLInstrumentation(),
    ],
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'arius-status-page',
      [ATTR_SERVICE_VERSION]: process.env.VITE_APP_VERSION || '1.0.0',
    }),
  })

  sdk.start()
  console.log('Tracing initialized with endpoint to ' + exporterOptions.url)

  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0))
  })
}

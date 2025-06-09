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

// Configure the SDK to export telemetry data to the console
// Enable all auto-instrumentations from the meta package
const exporterOptions = {
  url: 'http://otel-collector-arisu-opentelemetry-collector.monitoring.svc.cluster.local:4317/v1/traces',
}

const traceExporter = new OTLPTraceExporter(exporterOptions)
const sdk = new opentelemetry.NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations(),
    new GraphQLInstrumentation({
      // optional params
      // allowValues: true,
      // depth: 2,
      // mergeItems: true,
      // ignoreTrivialResolveSpans: true,
      // ignoreResolveSpans: true,
    }),
  ],
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'arius-status-page',
    [ATTR_SERVICE_VERSION]: process.env.VITE_APP_VERSION || '1.0.0',
  }),
})

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk.start()
console.log('Tracing initialized with ' + { url: exporterOptions })

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0))
})

export default sdk

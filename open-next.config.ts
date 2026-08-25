import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({
  // Configure incremental static regeneration cache tagging with KV
  incrementalCache: 'dummy',
});

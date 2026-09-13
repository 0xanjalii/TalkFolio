/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_DID_AGENT_ID?: string;
  readonly VITE_DID_CLIENT_KEY?: string;
  readonly VITE_DID_EMBED_SRC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

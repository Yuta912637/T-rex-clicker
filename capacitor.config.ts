import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'my-v0-project',
  webDir: 'out', // <- aqui aponta para a pasta exportada
  bundledWebRuntime: false
};

export default config;

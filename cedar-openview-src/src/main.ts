import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';

if (environment.production) {
  enableProdMode();
}


// needed for jsonld js library
(window as any).global = window;

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { Application } from 'express';

const initSentry = (app: Application) => {
  Sentry.init({
    dsn: 'https://3dd039f16dd54f71bb031d5ff0668acf@o594094.ingest.sentry.io/5768718',
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
  });
};

export default initSentry;

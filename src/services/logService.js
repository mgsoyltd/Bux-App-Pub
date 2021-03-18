// import * as Sentry from "@sentry/react";
// import { Integrations } from "@sentry/tracing";

function init() {
	// 	Sentry.init({
	// 		dsn:
	// 			"https://2221059f20104741af608fa7441cb8f7@o444001.ingest.sentry.io/5418478",
	// 		integrations: [new Integrations.BrowserTracing()],
	// 		tracesSampleRate: 1.0,
	// 	});

}

function log(error) {
	// 	Sentry.captureException(error);
	console.log(error);
}

const logger = {
	init,
	log,
};

export default logger;
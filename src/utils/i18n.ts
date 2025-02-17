import i18n from "i18n";
import { join } from "path";
import { log } from "./log";

i18n.configure({
    locales: [
        "en",
        "es"
    ],
    directory: join(__dirname, "..", "locales"),
    defaultLocale: "en",
    retryInDefaultLocale: true,
    objectNotation: true,
    register: global,

    mustacheConfig: {
        tags: ["{{", "}}"],
        disable: false
    },

    logWarnFn: function (msg) {
        log.warn(msg)
    },
    logErrorFn: function (msg) {
        log.error(`[Error]: ${msg}`);
    },
    missingKeyFn: function (_locale, value) {
        return value;
    }
});

i18n.setLocale('en');

export default i18n;
import chalk from "chalk";

const getTimestamp = () => new Date().toLocaleTimeString("en-US", { hour12: false });

const logMessage = (level: "info" | "success" | "warn" | "error", message: any) => {
    const colors = {
        info: chalk.blue,
        success: chalk.green,
        warn: chalk.yellow,
        error: chalk.red
    };
    const emojis = {
        info: "ℹ️", 
        success: "✅",
        warn: "⚠️",
        error: "❌"
    };

    console.log(`${colors[level](`[${level.toUpperCase()}]`)} ${chalk.gray(getTimestamp())} ${emojis[level]} ${message ? message : 'An unknown error occured'}`);
};

export const log = {
    info: (msg: any) => logMessage("info", msg),
    success: (msg: any) => logMessage("success", msg),
    warn: (msg: any) => logMessage("warn", msg),
    error: (msg: any) => logMessage("error", msg)
};

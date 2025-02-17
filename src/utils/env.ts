export const checkEnvVariables = (vars: Array<string>): void => {
    vars.forEach((variable) => {
        if(!process.env[variable]) throw new Error(`Missing "${variable}" in environment variables.`);
    });
};
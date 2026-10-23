// `npm run edit`: starts the development server with the click-to-edit visual editor switched on.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const next = require.resolve("next/dist/bin/next");
const child = spawn(process.execPath, [next, "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: { ...process.env, NZ_EDIT: "1" },
});
child.on("exit", (code) => process.exit(code ?? 0));

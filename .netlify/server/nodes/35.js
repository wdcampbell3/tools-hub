import * as server from '../entries/pages/styles/_page.server.ts.js';

export const index = 35;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/styles/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/styles/+page.server.ts";
export const imports = ["_app/immutable/nodes/35.efLkgE3r.js","_app/immutable/chunks/Botru9xy.js","_app/immutable/chunks/6b1v8pF7.js","_app/immutable/chunks/LDwRSj6l.js","_app/immutable/chunks/C9cHE3WJ.js","_app/immutable/chunks/LUiAmDV2.js","_app/immutable/chunks/CoTqtSdF.js","_app/immutable/chunks/DcsCE0Wi.js","_app/immutable/chunks/Dr50oWE6.js","_app/immutable/chunks/Cyq9jHuK.js","_app/immutable/chunks/EdJmPJPC.js","_app/immutable/chunks/DDxku7Xf.js","_app/immutable/chunks/DH1VtY3W.js"];
export const stylesheets = [];
export const fonts = [];

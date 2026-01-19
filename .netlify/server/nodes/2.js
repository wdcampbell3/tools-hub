import * as universal from '../entries/pages/(admin)/account/_layout.ts.js';
import * as server from '../entries/pages/(admin)/account/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(admin)/account/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/(admin)/account/+layout.ts";
export { server };
export const server_id = "src/routes/(admin)/account/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.B7EvrjxR.js","_app/immutable/chunks/DY0SOeZN.js","_app/immutable/chunks/KjYeVjkE.js","_app/immutable/chunks/CYgJF_JY.js","_app/immutable/chunks/B320hzTA.js","_app/immutable/chunks/Botru9xy.js","_app/immutable/chunks/6b1v8pF7.js","_app/immutable/chunks/BPIN8t2K.js"];
export const stylesheets = [];
export const fonts = [];

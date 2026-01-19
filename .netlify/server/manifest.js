export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.old.png","favicon.png","images/cm_logo.svg","images/example-home.png","images/hero-tech-OLD.png","images/hero-tech-gradient.jpeg","images/hero-tech.jpeg","images/hero-tech.png","images/hero-vibe-coder.png","images/rss.svg","images/social-icons/Facebook-60.jpg","images/social-icons/LinkedIn-60.jpg","images/social-icons/X-logo-60.jpg","images/social-icons/YouTube-Logo 60.jpg","images/social-icons/instagram-60.jpg","robots.txt"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".jpeg":"image/jpeg",".jpg":"image/jpeg",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.mS3WTvmF.js",app:"_app/immutable/entry/app.C-nl_RjS.js",imports:["_app/immutable/entry/start.mS3WTvmF.js","_app/immutable/chunks/DzLEkZjB.js","_app/immutable/chunks/6b1v8pF7.js","_app/immutable/chunks/7osi90ZP.js","_app/immutable/chunks/CYgJF_JY.js","_app/immutable/chunks/DH1VtY3W.js","_app/immutable/entry/app.C-nl_RjS.js","_app/immutable/chunks/Dp1pzeXC.js","_app/immutable/chunks/6b1v8pF7.js","_app/immutable/chunks/BeH4FE6R.js","_app/immutable/chunks/B9mEOmgN.js","_app/immutable/chunks/CoTqtSdF.js","_app/immutable/chunks/Botru9xy.js","_app/immutable/chunks/DcsCE0Wi.js","_app/immutable/chunks/D5kZuk5N.js","_app/immutable/chunks/COuWgno0.js","_app/immutable/chunks/DBp8CHuG.js","_app/immutable/chunks/DWtz_PWu.js","_app/immutable/chunks/DH1VtY3W.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js')),
			__memo(() => import('./nodes/21.js')),
			__memo(() => import('./nodes/22.js')),
			__memo(() => import('./nodes/23.js')),
			__memo(() => import('./nodes/27.js')),
			__memo(() => import('./nodes/28.js')),
			__memo(() => import('./nodes/29.js')),
			__memo(() => import('./nodes/30.js')),
			__memo(() => import('./nodes/31.js')),
			__memo(() => import('./nodes/32.js')),
			__memo(() => import('./nodes/35.js')),
			__memo(() => import('./nodes/36.js')),
			__memo(() => import('./nodes/37.js')),
			__memo(() => import('./nodes/38.js')),
			__memo(() => import('./nodes/39.js')),
			__memo(() => import('./nodes/40.js')),
			__memo(() => import('./nodes/41.js')),
			__memo(() => import('./nodes/42.js'))
		],
		routes: [
			{
				id: "/(admin)/account/(menu)",
				pattern: /^\/account\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(admin)/account/api",
				pattern: /^\/account\/api\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/(admin)/account/(menu)/billing",
				pattern: /^\/account\/billing\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(admin)/account/(menu)/billing/manage",
				pattern: /^\/account\/billing\/manage\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/(admin)/account/create_profile",
				pattern: /^\/account\/create_profile\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/(admin)/account/select_plan",
				pattern: /^\/account\/select_plan\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/(admin)/account/(menu)/settings",
				pattern: /^\/account\/settings\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/(admin)/account/(menu)/settings/change_email_subscription",
				pattern: /^\/account\/settings\/change_email_subscription\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/(admin)/account/(menu)/settings/change_email",
				pattern: /^\/account\/settings\/change_email\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/(admin)/account/(menu)/settings/change_password",
				pattern: /^\/account\/settings\/change_password\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/(admin)/account/(menu)/settings/delete_account",
				pattern: /^\/account\/settings\/delete_account\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/(admin)/account/(menu)/settings/edit_profile",
				pattern: /^\/account\/settings\/edit_profile\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/(admin)/account/(menu)/settings/reset_password",
				pattern: /^\/account\/settings\/reset_password\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/(admin)/account/sign_out",
				pattern: /^\/account\/sign_out\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/(admin)/account/subscribe/[slug]",
				pattern: /^\/account\/subscribe\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/api/chat",
				pattern: /^\/api\/chat\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/chat/_server.ts.js'))
			},
			{
				id: "/api/meetings",
				pattern: /^\/api\/meetings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/meetings/_server.ts.js'))
			},
			{
				id: "/api/models",
				pattern: /^\/api\/models\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/models/_server.ts.js'))
			},
			{
				id: "/api/test-auth",
				pattern: /^\/api\/test-auth\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/test-auth/_server.ts.js'))
			},
			{
				id: "/api/test-cloudinary",
				pattern: /^\/api\/test-cloudinary\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/test-cloudinary/_server.ts.js'))
			},
			{
				id: "/api/test-firebase",
				pattern: /^\/api\/test-firebase\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/test-firebase/_server.ts.js'))
			},
			{
				id: "/api/test-stripe",
				pattern: /^\/api\/test-stripe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/test-stripe/_server.ts.js'))
			},
			{
				id: "/api/theme/save",
				pattern: /^\/api\/theme\/save\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/theme/save/_server.ts.js'))
			},
			{
				id: "/api/theme/state",
				pattern: /^\/api\/theme\/state\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/theme/state/_server.ts.js'))
			},
			{
				id: "/(marketing)/auth/callback",
				pattern: /^\/auth\/callback\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/(marketing)/auth/callback/_server.ts.js'))
			},
			{
				id: "/(marketing)/auth/session",
				pattern: /^\/auth\/session\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/(marketing)/auth/session/_server.ts.js'))
			},
			{
				id: "/(marketing)/blog/rss.xml",
				pattern: /^\/blog\/rss\.xml\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/(marketing)/blog/rss.xml/_server.ts.js'))
			},
			{
				id: "/(marketing)/contact_us",
				pattern: /^\/contact_us\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/(marketing)/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,4,5,], errors: [1,,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/(marketing)/login/current_password_error",
				pattern: /^\/login\/current_password_error\/?$/,
				params: [],
				page: { layouts: [0,4,5,], errors: [1,,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/(marketing)/login/forgot_password",
				pattern: /^\/login\/forgot_password\/?$/,
				params: [],
				page: { layouts: [0,4,5,], errors: [1,,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/(marketing)/login/sign_in",
				pattern: /^\/login\/sign_in\/?$/,
				params: [],
				page: { layouts: [0,4,5,], errors: [1,,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/(marketing)/login/sign_up",
				pattern: /^\/login\/sign_up\/?$/,
				params: [],
				page: { layouts: [0,4,5,], errors: [1,,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/(marketing)/search/api.json",
				pattern: /^\/search\/api\.json\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/(marketing)/search/api.json/_server.ts.js'))
			},
			{
				id: "/styles",
				pattern: /^\/styles\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/test-auth",
				pattern: /^\/test-auth\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/test-cloudinary",
				pattern: /^\/test-cloudinary\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/test-stripe",
				pattern: /^\/test-stripe\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/tools/calculator",
				pattern: /^\/tools\/calculator\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/tools/converter",
				pattern: /^\/tools\/converter\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/tools/meeting-assistant",
				pattern: /^\/tools\/meeting-assistant\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/tools/signature",
				pattern: /^\/tools\/signature\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 35 },
				endpoint: null
			}
		],
		prerendered_routes: new Set(["/","/blog","/blog/from_idea_to_launch_vibe_coding_guide","/pricing","/search","/sitemap.xml"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

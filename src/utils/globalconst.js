// 全局变量
export const apiurl = 'http://localhost:8024'
export const rescode = {
    success          : 200,
    fail             : 100,
    error            : 500,

	invalidparams    : 406,
	bindparamserror  : 407,
	validparamserror : 408,

	permissionfailed : 403,

	requesterror     : 400,
    authcheckfail    : 401,
	authnotexist     : 402,
	authchecktimeout : 404,
	authformatfail   : 405,

	recordnotfound : 600
}

export const routerPath = new Map([
	['/admins', {name:"admins", parent:"manage", router:"/api/admin/list"}]
])	
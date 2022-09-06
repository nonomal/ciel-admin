// =================================================================================
// This is auto-generated by Freekey Admin at 2022-09-05 11:09:03. For more information see https://github.com/1211ciel/ciel-admin
// =================================================================================

package controller

import (
	"ciel-admin/internal/model/bo"
	"ciel-admin/internal/model/entity"
	"ciel-admin/internal/service/admin"
	"ciel-admin/internal/service/goldchangelog"
	"ciel-admin/internal/service/sys"
	"ciel-admin/utility/utils/res"
	"ciel-admin/utility/utils/xparam"
	"ciel-admin/utility/utils/xurl"
	"fmt"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/util/gconv"
)

type cGoldChangeLog struct{ cBase }

var GoldChangeLog = cGoldChangeLog{cBase{"u_gold_change_log", "/admin/goldChangeLog", "/user/goldChangeLog"}}

func (c cGoldChangeLog) RegisterRouter(g *ghttp.RouterGroup) {
	g.Group("/goldChangeLog", func(g *ghttp.RouterGroup) {
		g.Middleware(admin.AuthMiddleware)
		g.GET("/", c.Index)             // 主页面
		g.GET("/edit/:id", c.EditIndex) // 修改页面
		g.Middleware(admin.LockMiddleware, admin.ActionMiddleware)
		g.GET("/clear", c.Clear)
		g.GET("/del/:id", c.Del) // 删除请求
		g.POST("/post", c.Post)  // 添加请求
		g.POST("/put", c.Put)    // 修改请求
	})
}

func (c cGoldChangeLog) Index(r *ghttp.Request) {
	var (
		ctx     = r.Context()
		reqPath = r.URL.Path
		file    = fmt.Sprintf("%s/index.html", c.FileDir)
		msg     = sys.MsgFromSession(r)
		s       = bo.Search{
			T1: c.Table, T2: "u_user t2 on t1.uid = t2.id", SearchFields: "t1.*,t2.uname", OrderBy: "t1.id desc", Fields: []bo.Field{
				{Name: "trans_id", Type: 2},
				{Name: "desc", Type: 2},
				{Name: "type", Type: 1},
				{Name: "t2.uname", QueryName: "uname", Type: 2},
			}}
	)
	node, err := sys.NodeInfo(ctx, reqPath)
	if err != nil {
		res.Err(err, r)
	}
	s.Page, s.Size = res.GetPage(r)
	total, data, err := sys.List(ctx, s)
	if err != nil {
		res.Err(err, r)
	}
	// 返回页面
	res.Tpl(file, g.Map{
		"node": node,
		"list": data,
		"page": r.GetPage(total, s.Size).GetContent(3),
		"path": reqPath, // 用于确定导航菜单
		"msg":  msg,
	}, r)
}

func (c cGoldChangeLog) EditIndex(r *ghttp.Request) {
	var (
		table = c.Table
		id    = xparam.ID(r)
		d     = g.Map{"msg": sys.MsgFromSession(r)}
		f     = fmt.Sprint(c.FileDir, "/edit.html")
	)
	data, err := sys.GetById(r.Context(), table, id)
	if err != nil {
		res.Err(err, r)
	}
	for k, v := range data.Map() {
		r.SetForm(k, v)
	}
	res.Tpl(f, d, r)
}
func (c cGoldChangeLog) Post(r *ghttp.Request) {
	var (
		d = entity.GoldChangeLog{}
	)
	if err := r.Parse(&d); err != nil {
		res.Err(err, r)
	}
	res.OkSession("添加成功", r)
	if err := sys.Add(r.Context(), c.Table, &d); err != nil {
		res.ErrSession(err, r)
	}
	path := fmt.Sprint(c.ReqPath, "/add?", xurl.ToUrlParams(r.GetQueryMap()))
	res.RedirectTo(path, r)
}
func (c cGoldChangeLog) Del(r *ghttp.Request) {
	var (
		id    = r.Get("id")
		table = c.Table
	)
	res.OkSession("删除成功", r)
	if err := sys.Del(r.Context(), table, id); err != nil {
		res.ErrSession(err, r)
	}
	path := fmt.Sprint(c.ReqPath, "?", xurl.ToUrlParams(r.GetQueryMap()))
	res.RedirectTo(path, r)
}
func (c cGoldChangeLog) Put(r *ghttp.Request) {
	var (
		d     = entity.GoldChangeLog{}
		table = c.Table
	)
	if err := r.Parse(&d); err != nil {
		res.Err(err, r)
	}
	m := gconv.Map(d)
	delete(m, "createdAt")
	delete(m, "type")
	res.OkSession("修改成功", r)
	if err := sys.Update(r.Context(), table, d.Id, m); err != nil {
		res.ErrSession(err, r)
	}
	path := fmt.Sprint(c.ReqPath, "/edit/", d.Id, "?", xurl.ToUrlParams(r.GetQueryMap()))
	res.RedirectTo(path, r)
}

func (c cGoldChangeLog) Clear(r *ghttp.Request) {
	var (
		ctx = r.Context()
	)
	res.OkSession("ok", r)
	if err := goldchangelog.Clear(ctx); err != nil {
		res.ErrSession(err, r)
	}
	res.RedirectTo("/admin/goldChangeLog", r)
}

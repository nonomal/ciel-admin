package logic

import (
	"ciel-admin/utility/utils/res"
	"ciel-admin/utility/utils/xuser"
	"context"
	"encoding/json"
	"github.com/gogf/gf/v2/container/gmap"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gctx"
)

var (
	Ws     = lWs{}
	users  = gmap.New(true)
	admins = gmap.New(true)
)

type lWs struct{}

func (w lWs) GetUserWs(r *ghttp.Request) {

	ws, err := r.WebSocket()
	if err != nil {
		res.Err(err, r)
	}
	uid := xuser.Uid(r)
	users.Set(uid, ws)
	printUserWs()
	for {
		messageType, msg, err := ws.ReadMessage()
		if err != nil {
			users.Remove(uid)
			printUserWs()
			return
		}
		g.Log().Info(gctx.New(), "ws:user msg ", messageType, msg)
	}
}

func (w lWs) GetAdminWs(r *ghttp.Request) {
	ws, err := r.WebSocket()
	if err != nil {
		res.Err(err, r)
	}
	adminBo, err := Session.GetAdmin(r.Session)
	if err != nil || adminBo == nil {
		res.Err(err, r)
		return
	}

	id := adminBo.Admin.Id
	admins.Set(id, ws)
	printAdminWs()
	for {
		messageType, msg, err := ws.ReadMessage()
		if err != nil {
			admins.Remove(id)
			printAdminWs()
			return
		}
		g.Log().Info(gctx.New(), "ws:admin msg ", messageType, msg)
	}
}

func (w lWs) NoticeAllUser(ctx context.Context, msg interface{}) error {
	if users.Size() == 0 {
		return nil
	}
	marshal, _ := json.Marshal(msg)
	for _, item := range users.Values() {
		if err := item.(*ghttp.WebSocket).WriteMessage(1, marshal); err != nil {
			g.Log().Error(ctx, err)
			return err
		}
	}
	return nil
}

func (w lWs) NoticeAdmin(ctx context.Context, msg interface{}, uid int) error {
	to := admins.Get(uid)
	if to != nil {
		marshal, _ := json.Marshal(msg)
		if err := to.(*ghttp.WebSocket).WriteMessage(1, marshal); err != nil {
			g.Log().Error(ctx, err)
			return err
		}
	}
	return nil
}

func (w lWs) NoticeAllAdmin(ctx context.Context, msg interface{}) error {
	marshal, _ := json.Marshal(msg)
	for _, item := range admins.Values() {
		if err := item.(*ghttp.WebSocket).WriteMessage(1, marshal); err != nil {
			g.Log().Error(ctx, err)
			return err
		}
	}
	return nil
}

func (w lWs) NoticeUser(ctx context.Context, uid int, msg interface{}) error {
	marshal, _ := json.Marshal(msg)
	item := users.Get(uid)
	if item != nil {
		if err := item.(*ghttp.WebSocket).WriteMessage(1, marshal); err != nil {
			g.Log().Error(ctx, err)
			return err
		}
	}
	return nil
}

func printUserWs() {
	g.Log().Infof(gctx.New(), "user连接个数%v %v", len(users.Map()), users.Keys())
}
func printAdminWs() {
	//g.Log().Infof(gctx.New(), "admin连接个数%v %v", len(admins.Map()), admins.Keys())
}

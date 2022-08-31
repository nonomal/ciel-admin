package sys

import (
	"ciel-admin/internal/consts"
	"ciel-admin/internal/model/bo"
	"context"
	"errors"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
)

var (
	AdminSessionKey = "adminInfo"
	Uid             = "userInfoKey"
)

func setAdmin(ctx context.Context, data *bo.Admin) error {
	return g.RequestFromCtx(ctx).Session.Set(AdminSessionKey, data)
}
func GetAdmin(r *ghttp.Request) (*bo.Admin, error) {
	get, err := r.Session.Get(AdminSessionKey)
	if err != nil {
		return nil, err
	}
	if get == nil {
		return nil, errors.New("admin info is nil")
	}
	var data *bo.Admin
	err = get.Scan(&data)
	if err != nil {
		return nil, err
	}
	return data, err
}

func RemoveAdmin(ctx context.Context) error {
	return g.RequestFromCtx(ctx).Session.Remove(AdminSessionKey)
}
func AdminIsLogin(r *ghttp.Request) error {
	user, err := GetAdmin(r)
	if err != nil {
		return err
	}
	if user == nil {
		return consts.ErrNotAuth
	}
	return nil
}

func MsgFromSession(r *ghttp.Request) string {
	msg, err := r.Session.Get("msg")
	if err != nil {
		return ""
	}
	if !msg.IsEmpty() {
		_ = r.Session.Remove("msg")
	}
	return msg.String()
}

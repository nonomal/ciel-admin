package logic

import (
	"ciel-admin/internal/dao"
	"ciel-admin/internal/model/entity"
	"context"
	"errors"
	"fmt"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gfile"
	"github.com/gogf/gf/v2/util/gconv"
	"github.com/gogf/gf/v2/util/grand"
	"path"
	"time"
)

type file struct {
}

func (f file) Upload(ctx context.Context, r *ghttp.Request) error {
	files := r.GetUploadFiles("file")
	if len(files) == 0 {
		return errors.New("file can't be empty")
	}
	for _, file := range files {
		fileName := fmt.Sprint(grand.S(6), path.Ext(file.Filename))
		file.Filename = fileName
	}
	datePre := time.Now().Format("2006/01")
	group := r.Get("group").String()
	if group == "" || group == "undefined" {
		group = "1"
	}
	rootFilePath, err := g.Cfg().Get(ctx, "server.rootFilePath")
	if err != nil {
		return err
	}
	rootPath := gfile.Pwd() + rootFilePath.String()
	mixPath := fmt.Sprintf("%s/%s/%s/", rootPath, group, datePre)
	_, err = files.Save(mixPath)
	if err != nil {
		return err
	}
	for _, file := range files {
		dbName := fmt.Sprintf("%s/%s/%s", group, datePre, file.Filename)
		_, err = dao.File.Ctx(ctx).Insert(entity.File{
			Url:    dbName,
			Group:  gconv.Int(group),
			Status: 1,
		})
		if err != nil {
			return err
		}
	}
	return nil
}

var File = file{}

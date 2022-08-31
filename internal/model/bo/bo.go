// Package bo 业务对象封装
package bo

import (
	"ciel-admin/internal/model/entity"
)

type Admin struct {
	Admin *entity.Admin
	Menus []*Menu
}
type Menu struct {
	Id       int     `json:"id"        description:""`
	Pid      int     `json:"pid"       description:""`
	Name     string  `json:"name"      description:""`
	Path     string  `json:"path"      description:""`
	Type     int     `json:"type"      description:""`
	Sort     float64 `json:"sort"      description:""`
	Status   int     `json:"status"    description:""`
	Children []*Menu
}

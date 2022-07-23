// =================================================================================
// Code generated by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// User is the golang structure of table u_user for DAO operations like Where/Data.
type User struct {
	g.Meta      `orm:"table:u_user, do:true"`
	Id          interface{} //
	Uname       interface{} // {"label":"用户名","searchType":2,"required":1,"disabled":1}
	Pass        interface{} // {"hide":1,"editHide":1}
	Nickname    interface{} // {"label":"昵称","required":1,"comment":"取一个昵称吧"}
	Description interface{} // {"fieldType":"markdown"}
	Status      interface{} // {"searchType":2,"fieldType":"select","options":"1:正常:tag-info,2:禁用:tag-danger"}
	CreatedAt   *gtime.Time //
	UpdatedAt   *gtime.Time //
}

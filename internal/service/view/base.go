package view

import (
	"fmt"
	"github.com/gogf/gf/v2/util/gconv"
)

func SwitchTagClass(num int) string {
	class := ""
	switch num % 7 {
	case 0:
		class = "tag-danger"
	case 1:
		class = "tag-info"
	case 2:
		class = "tag-success"
	case 3:
		class = "tag-primary"
	case 4:
		class = "tag-warning"
	case 5:
		class = "tag-brown"
	case 6:
		class = "tag-purple"
	default:
		class = "tag-info"
	}
	return class
}

func Tag(i interface{}, content interface{}) string {
	if content == "" {
		return ""
	}
	return fmt.Sprintf("<span class='%s'>%v</span>", SwitchTagClass(gconv.Int(i)), content)
}

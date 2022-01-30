// =================================================================================
// This is auto-generated by GoFrame CLI tool only once. Fill this file as you wish.
// =================================================================================

package dao

import (
	"interface/internal/service/internal/dao/internal"
)

// bookCategoryDao is the data access object for table b_book_category.
// You can define custom methods on it to extend its functionality as you wish.
type bookCategoryDao struct {
	*internal.BookCategoryDao
}

var (
	// BookCategory is globally public accessible object for table b_book_category operations.
	BookCategory = bookCategoryDao{
		internal.NewBookCategoryDao(),
	}
)

// Fill with you ideas below.

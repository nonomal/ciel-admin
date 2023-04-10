import {useRouter} from "next/router";
import {useMenu} from "../data/use-menu";
import {keyAdminInfo, keyMenu, keySelectedMenu1, keyToken} from "../consts/consts";
import Link from "next/link";
import {handleChange, handleChangeToLocalStorage, useLocalStorage} from "../libs/utils";
import {toast} from "react-toastify";
import {useAdmin} from "../data/use-admin";
import {useEffect, useRef, useState} from "react";
import Head from "next/head";
import jsCookie from "js-cookie";
import {addData, getById, update, updateAdminSelfPass} from "../libs/api-admin";
import {ThemeToggle} from "./common";
// 搜索 input 相关组件
export const searchInput = (key, name, field, tempQuery, setTempQuery, setQuery) => {
    return <label className={'input'} key={key}>
        {name}
        <input name={field} value={tempQuery[field] || ''}
               onChange={e => handleChange(setTempQuery, tempQuery, e)}
               onKeyPress={e => {
                   if (e.key === 'Enter') {
                       tempQuery.page = 1
                       handleChange(setTempQuery, tempQuery, e)
                       handleChange(setQuery, tempQuery, e)
                   }
               }}
        />
    </label>
}
export const searchSelect = (key, name, field, options, tempQuery, setTempQuery, setQuery) => {
    if (!options) return <span className={'tag-danger'}>{`选项 ${field}的 options 属性为空或者不正确`}</span>
    return <label key={key} className={'input'}>
        {name}
        <select value={tempQuery[field]} name={field} onChange={e => {
            tempQuery.page = 1
            handleChange(setTempQuery, tempQuery, e)
            handleChange(setQuery, tempQuery, e)
        }}>
            <option value={''}>请选择</option>
            {options.split(',').map((j, index) => {
                let arr = j.split(":")
                return <option key={index} value={arr[0]} className={arr[2]}>{arr[1]}</option>
            })}
        </select>
    </label>
}
export const searchDate = (key, tempQuery, setTempQuery, setQuery) => {
    let arr = []
    arr[0] = <label key={key} className={'input'}>开始日期 <input type={"date"} value={tempQuery['begin'] || ''} name={'begin'} onChange={e => {
        tempQuery.page = 1
        handleChange(setTempQuery, tempQuery, e)
        handleChange(setQuery, tempQuery, e)
    }}/></label>
    arr[1] = <label key={key * 100} className={'input'}>结束日期 <input type={"date"} value={tempQuery['end'] || ''} name={'end'} onChange={e => {
        tempQuery.page = 1
        handleChange(setTempQuery, tempQuery, e)
        handleChange(setQuery, tempQuery, e)
    }}/></label>
    return arr
}
export const trInput = (name, field, data, setData) => {
    return <tr>
        <td>{name}</td>
        <td><input value={data[field] || ''} name={field} onChange={e => handleChange(setData, data, e)}/></td>
    </tr>
}
// options format  eg 1:ok,2:fail
export const trSelect = (name, field, options, data, setData) => {
    return <tr>
        <td>{name}</td>
        <td>
            <select key={field} name={field} value={data[field || '']} onChange={e => handleChange(setData, data, e)}>
                <option value="">请选择</option>
                {options.split(',').map((i, index) => {
                    let arr = i.split(":")
                    return <option key={index} value={arr[0]}>{arr[1]}</option>
                })}
            </select>
        </td>
    </tr>
}

export const trSelectCache = (key, name, field, options, data, setData, defaultValue) => {
    return <tr>
        <td>{name}</td>
        <td>
            <select key={field} name={field} value={data[field || '']} onChange={e => handleChangeToLocalStorage(key, setData, data, e)}>
                {defaultValue ? <option value={defaultValue.value}>{defaultValue.label}</option>
                    : <option value="">请选择</option>}
                {options.split(',').map((i, index) => {
                    let arr = i.split(":")
                    let a, b
                    if (arr.length === 1) {
                        a = arr[0]
                        b = arr[0]
                    } else {
                        a = arr[0]
                        b = arr[1]
                    }
                    return <option key={index} value={a}>{b}</option>
                })}
            </select>
        </td>
    </tr>
}
export const trSubmit = (fn, name, cls) => {
    return <tr>
        <td></td>
        <td>
            <button className={cls ? cls : 'btn-warning'} onClick={fn}>{name}</button>
        </td>
    </tr>
}
export const Headers = () => {
    // 检查用户是否登录
    const router = useRouter()
    // 检查
    const {user, loggedOut, loading} = useAdmin()
    if (loggedOut) {
        if (router.pathname !== '/backend/sys/login') {
            router.push('/backend/sys/login')
        }
        return
    }
    // 处理登出
    const handleLogout = () => {
        if (confirm('确认要登出？')) {
            jsCookie.remove(keyToken)
            router.push('/backend/sys/login')
            localStorage.removeItem(keyMenu)
            localStorage.removeItem(keyAdminInfo)
            localStorage.removeItem(keySelectedMenu1)
        }
    }

    // 修改密码
    const handleUpdatePass = () => {
        let pass = prompt('请输入新的密码')
        if (pass) {
            updateAdminSelfPass(pass).then(() => {
                toast.success('修改成功')
            })
        }
    }
    return <div className={'top'}>
        <div className={'w flex-center'}>
            <Link className={'logo mr-auto'} href={process.env.HOME_PAGE}>{process.env.SYSTEM_NAME}</Link>
            <div className={'top-pc fs-15 top-right'}>
                {loading || !user ? '' :
                    <>
                        <Link className={'link-1'} href={process.env.HOME_PAGE}>首页</Link>
                        <Link className={'link-1 color-desc-02'} href={process.env.HOME_PAGE}>{user && user.info.uname}</Link>
                        <a href={'#'} className={'link-1'} onClick={handleUpdatePass}>修改密码</a>
                        <a href={'#'} className={'link-1'} onClick={handleLogout}>登出</a>
                        <ThemeToggle/>
                    </>
                }
            </div>
        </div>
    </div>
}
export const Nav = () => {
    const {user} = useAdmin()
    const [selectedMenu1, setSelectedMenu1] = useLocalStorage(keySelectedMenu1, '通用')
    return <div className={'box-02 no-bottom-border'}>
        <div className={'nav'}>
            {user && user.menus.map((i, index) => <a
                key={index}
                className={selectedMenu1 === i.name ? 'link-2 link-2-active' : 'link-2'}
                onClick={() => setSelectedMenu1(i.name)}>{i.name}</a>)}
        </div>
        <div className={'sub-nav'}>
            {user && user.menus.filter(i => {
                return i.name === selectedMenu1
            })[0].children.map((i, index) => {
                return <Link
                    key={index}
                    className={'link-3'}
                    href={i.path}
                >{i.name}</Link>
            })}
        </div>
    </div>
}
export const Footer = () => {
    return <div className={'footer'}>
        <div className="w block">
            <div className={''}>
                <Link className={'link-4 strong'} href={process.env.HOME_PAGE}>首页</Link> <span className={'ml-6 mr-6'}>•</span>
                <Link className={'link-4 strong'} href={'/backend/sys/test?name=CSS'}> CSS</Link>
            </div>
            <div className={'mt-10 fs-12'}>
                <p className={'fs-13'}>感觉还没熟悉，重头再来，熟能生巧。</p>
                <p className={'mt-3'}>越简单的事情越难做到。</p>
                <p className={'mt-3'}>少则得，多则惑。</p>
            </div>
        </div>
    </div>
}
export const PageInfo = ({children}) => {
    const router = useRouter()
    const {menu, error, loading} = useMenu(router.pathname)
    if (loading) return <PageInfoWithInfo backUrl={process.env.HOME_PAGE} backName={process.env.SYSTEM_NAME} desc={'加载中...'}/>
    if (error) {
        return
    }
    if (!menu) return <>
        <Head><title>{'BLEACH'}</title></Head>
        <div className={'box-02 no-bottom-border'}>{children}</div>
    </>

    let img = process.env.IMG_PREFIX + (menu.icon ? menu.icon : '/image/golang.png')
    return <div>
        <Head>
            <title>{process.env.SYSTEM_NAME + ' › ' + menu.name}</title>
        </Head>
        <div className={'box-02 no-bottom-border'}>
            <div className={'cell flex bg-dark color-white-1'}>
                <a href={img} target={'_blank'}>
                    <img className={'s-icon-64 mr-12'} src={img} alt="menu"/>
                </a>
                <div className={'flex-1'}>
                    <div className={'flex-between'}>
                        <div>
                            <Link className={'color-blue hover-underline'} href={process.env.HOME_PAGE}>BLEACH</Link> &nbsp;› &nbsp; {menu && menu.name}
                        </div>
                    </div>
                    <div className={'fs-13 mt-6'}>{menu && menu.desc || '暂无说明'}</div>
                </div>
            </div>
            {children}
        </div>
    </div>
}
export const PageInfoWithInfo = ({backUrl, backName, pageName, desc, icon, children}) => {
    let img = process.env.IMG_PREFIX + (icon ? icon : '/image/golang.png')
    return <div className={'box-02 no-bottom-border'}>
        <div className={'cell flex bg-dark color-white-1'}>
            <a href={img} target={'_blank'}>
                <img className={'s-icon-64 mr-12'} src={img} alt="icon"/>
            </a>
            <div className={'flex-1'}>
                <div className={'flex-between'}>
                    <div>
                        <Link className={'color-blue hover-underline'} href={backUrl || process.env.HOME_PAGE}>{backName || process.env.SYSTEM_NAME}</Link> &nbsp;› &nbsp; {pageName}
                    </div>
                </div>
                <div className={'fs-13 mt-6'}>{desc || '暂无说明'}</div>
            </div>
        </div>
        {children}
    </div>
}
export const PageButtons = ({query, setTempQuery, setQuery, totalPage, total}) => {
    const currentPage = query && query.page || 1
    let start, end
    if (currentPage <= 6) {
        start = 2
        end = totalPage < 10 ? totalPage : 10
    } else if (currentPage + 4 >= totalPage - 1) {
        start = totalPage - 9
        if (start < 2) {
            start = 2
        }
        end = totalPage
    } else {
        start = currentPage - 5
        if (start < 2) {
            start = 2
        }
        end = currentPage + 4
    }
    const goTo = (newVar) => {
        setTempQuery(newVar)
        setQuery(newVar)
    }
    const pageButtons = []
    pageButtons.push(<span key={''} className={currentPage === 1 ? 'GPageSpan strong' : 'GPageLink cursor-pointer'}
                           onClick={() => {
                               if (currentPage !== 1) {
                                   goTo({...query, page: 1})
                               }
                           }}>1</span>)
    for (let i = start; i < end; i++) {
        if (currentPage >= 6) {
            if (i === start && i > 1) {
                pageButtons.push(<span key={i + 'pre'}>...</span>)
            }
        }
        pageButtons.push(<a key={i} className={currentPage === i ? 'GPageSpan strong' : 'GPageLink cursor-pointer'} onClick={() => goTo({...query, page: i})}>{i}</a>)
    }

    if (currentPage < totalPage - 2 && totalPage > 10) {
        pageButtons.push(<span key={'next'}>...</span>)
    }
    if (totalPage !== 1) {
        pageButtons.push(<a key={'last'} className={currentPage === totalPage ? 'GPageSpan strong' : 'GPageLink cursor-pointer'}
                            onClick={() => {
                                if (currentPage !== totalPage) {
                                    let newVar = {...query, page: totalPage};
                                    goTo(newVar)
                                }
                            }}>{totalPage}</a>)

    }
    let preNum = currentPage - 1
    let preClass = 'btn-info'
    if (preNum < 1) {
        preNum = 1
        preClass += ' btn-disabled'
    }
    let lastNum = currentPage + 1
    let lastClass = 'btn-info'
    if (lastNum > totalPage) {
        lastNum = totalPage
        lastClass += ' btn-disabled'
    }
    return <>
        <span className={'mr-12'}></span>
        {pageButtons}
        <label className={'input mr-12'}>
            <select name="size" onChange={(e) => goTo({...query, page: 1, size: e.target.value})}>
                <option value="15">页面大小</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="15">15</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="1000">1000</option>
                <option value="2000">2000</option>
                <option value="10000">10000</option>
            </select>
        </label>
        <span className={'mr-auto color-desc-02 fs-10'}>共<b> {total} </b>条 </span>
        <span className={preClass + " mr-3"} onClick={() => goTo({...query, page: preNum})}>❮</span>
        <span className={lastClass + " mr-3"} onClick={() => goTo({...query, page: lastNum})}>❯</span>
    </>
}

export const Td = ({pageConf, data}) => {
    let res = []
    pageConf.fields.forEach((i, index) => {
        if (i.hide) {
            return
        }
        let field = i.field
        if (i.renderFn) { // 如果有自己的渲染逻辑
            res.push(<td key={index}>{i.renderFn(data)}</td>)
        } else if (field == 'type' || field == 'status' || i.type == 'select') { // 如果是选项
            res.push(<td key={index}>{tdOptions(i.options, data[i.field])}</td>)
        } else if (field == 'icon' || i.type == 'img') { // 如果是图片
            let v = data[i.field];
            let src = process.env.IMG_PREFIX + "/" + v
            res.push(<td key={index}>{v ? <a href={src} target={'_blank'}><img className={'s-icon-24'} src={src} alt=''/></a> : <span className={'tag-info'}>暂无图片</span>}</td>)
        } else {
            res.push(<td key={index}>{data[i.field]}</td>)
        }
    })
    return res
}
export const SearchInput = ({pageConf, tempQuery, setTempQuery, setQuery}) => {
    return pageConf.fields.filter(i => i.search).map((i, index) => {
        if (i.field === 'status' || i.type === 'select') { // 如果为选项时
            return searchSelect(index, i.name, i.field, i.options, tempQuery, setTempQuery, setQuery)
        } else if (i.field == 'createdDate') {
            return searchDate(index, tempQuery, setTempQuery, setQuery)
        } else {
            return searchInput(index, i.name, i.field, tempQuery, setTempQuery, setQuery)
        }
    })
}
export const AddPage = ({setShowType, pageConf, defaultData}) => {
    // 获取第一个input 的焦点
    let firstInput = false
    const inputRef = useRef(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const [data, setData] = useState(defaultData ? defaultData : {})
    // 提交
    const handleSubmit = async () => {
        if (!checkFormRequiredData(pageConf, data)) {
            inputRef.current.focus()
            return
        }
        const {code} = await addData(pageConf.path, data)
        if (code === 0) {
            toast.success('添加成功', {position: 'top-center'})
            setShowType(1)
        }
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') return handleSubmit()
    }
    return <div className={'box-02 no-bottom-border'}>
        <div className={'cell'}><a href={'#'} onClick={() => setShowType(1)}>{pageConf.name}</a>&nbsp;›&nbsp; 添加新{pageConf.name}</div>
        <table className={'cell table-add '}>
            <tbody>
            {pageConf.fields.map((i, index) => {
                if (!i.addShow) {
                    if (i.field == 'id' || i.field == 'createdAt' || i.field == 'updatedAt' || i.addHide == 1) {
                        return
                    }
                }
                let inputRequired = i.required === 1 ? 'inputRequired' : ''
                let td
                if (i.field == 'type' || i.field == 'status' || i.type == 'select') {
                    td = <select name={i.field} value={data[i.field]} onChange={e => handleChange(setData, data, e)} className={inputRequired} required={i.required}>
                        <option>请选择</option>
                        {i.options.split(',').map((i, index) => {
                            let arr = i.split(':')
                            return <option key={index} value={arr[0]} className={arr[2]}>{arr[1]}</option>
                        })}
                    </select>
                } else if (i.type == 'textarea' || i.field == 'desc') {
                    td = <textarea name={i.field} value={data[i.field || '']}
                                   onChange={e => handleChange(setData, data, e)}/>
                } else {
                    if (!firstInput) {
                        firstInput = true
                        td = <input ref={inputRef} name={i.field} value={data[i.field] || ''}
                                    onChange={e => handleChange(setData, data, e)} type={i.type} required={i.required} className={inputRequired}
                                    onKeyPress={handleKeyPress}
                        />
                    } else {
                        td = <input name={i.field} value={data[i.field] || ''}
                                    onChange={e => handleChange(setData, data, e)}
                                    type={i.type} required={i.required} className={inputRequired}
                                    onKeyPress={handleKeyPress}
                        />
                    }
                }
                return <tr key={index}>
                    <td>{i.name}</td>
                    <td>{td}</td>
                </tr>
            })}
            <tr>
                <td></td>
                <td>
                    <button className={'btn-info mr-12'} onClick={() => setShowType(1)}>返回</button>
                    <button className={'btn-info mr-12'} onClick={() => setData({})}>重置</button>
                    <button className={'btn-warning'} onClick={handleSubmit}>提交</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
}
export const UpdatePage = ({pageConf, id, setShowType}) => {
    const [reqData, setReqData] = useState({})
    const isMounted = useRef(false) // 防止多次请求
    // 获取数据
    useEffect(() => {
        if (isMounted.current) {
            // 不是第一次渲染
            return
        }
        isMounted.current = true
        getById(`${pageConf.path}?id=${id}`).then((data) => {
            setReqData(data)
        })
    }, [id])

    //获取第一个input的焦点
    const inputRef = useRef(null)
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])
    let firstInput = true

    // 提交修改
    const handleSubmit = async () => {
        if (!checkFormRequiredData(pageConf, reqData, 1)) {
            inputRef.current.focus()
            return
        }
        const {code} = await update(`${pageConf.path}`, reqData)
        if (code === 0) {
            toast.success('修改成功', {position: 'top-center'})
            setShowType(1)
        }
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') return handleSubmit()
    }
    return <div className={'box-02 no-bottom-border'}>
        <div className={'cell'}>
            <a href={'#'} onClick={() => setShowType(1)}>{pageConf.name}</a>&nbsp;›&nbsp; 修改{pageConf.name}
        </div>
        <table className={'cell table-add'}>
            <tbody>
            {reqData && pageConf.fields.map((i, index) => {
                if (i.editHide === 1) {
                    return
                }
                let disabled = i.disabled === 1
                if (i.field == 'id' || i.field == 'createdAt' || i.field == 'updatedAt') {
                    disabled = true
                }
                let inputRequired = i.required === 1 ? 'inputRequired' : ''
                let td
                if (i.field === 'type' || i.field === 'status' || i.type == 'select') {
                    td = <select name={i.field} value={reqData[i.field]} onChange={e => handleChange(setReqData, reqData, e)} className={inputRequired} disabled={disabled}>
                        <option>请选择</option>
                        {
                            i.options.split(',').map((i, index) => {
                                let arr = i.split(':')
                                return <option key={index} value={arr[0]} className={arr[2]}>{arr[1]}</option>
                            })}
                    </select>
                } else if (i.type == 'textarea' || i.field == 'desc') {
                    td = <textarea name={i.field} value={reqData[i.field || '']} onChange={e => handleChange(setReqData, reqData, e)}></textarea>
                } else {
                    if (firstInput && !disabled) {
                        firstInput = false
                        td = <input ref={inputRef} name={i.field} value={reqData[i.field] || ''}
                                    onChange={e => handleChange(setReqData, reqData, e)} className={inputRequired} disabled={disabled}
                                    onKeyPress={handleKeyPress}
                        />
                    } else {
                        td = <input name={i.field} value={reqData[i.field] || ''}
                                    onChange={e => handleChange(setReqData, reqData, e)} className={inputRequired} disabled={disabled}
                                    onKeyPress={handleKeyPress}
                        />
                    }
                }
                return <tr key={index}>
                    <td>{i.name}</td>
                    <td>{td}</td>
                </tr>
            })}
            <tr>
                <td></td>
                <td>
                    <button className={'btn-info mr-12'} onClick={() => setShowType(1)}>返回</button>
                    <button className={'btn-warning'} onClick={handleSubmit}>提交</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
}
const checkFormRequiredData = (pageConf, data, editType) => {
    let err = {}
    pageConf.fields.filter(i => {
        if (editType) { // 如果是修改类型则隐藏的字段不用计算
            return !i.editHide && i.required === 1
        }
        return i.required === 1
    }).forEach(i => {
        if (!data[i.field]) {
            err[i.field] = i.name
        }
    })
    if (Object.keys(err).length !== 0) {
        let msg = []
        for (let errKey in err) {
            msg.push(err[errKey])
        }
        toast.warning(`请输入 [${msg.join('，')}]`, {position: 'top-center'})
        return false
    }
    return true
}
const tdOptions = (options, value) => {
    let goad = options.split(",").filter(i => {
        return i.split(':')[0] == value
    })
    if (!goad || goad.length == 0) {
        return <span>{value}</span>
    }
    goad = goad[0].split(":")
    return <span className={goad[2]}>{goad[1]}</span>

}



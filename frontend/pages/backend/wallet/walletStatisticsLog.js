import useSWR from "swr";
import {listData} from "../../../libs/api-admin";
import {useState} from "react";
import {objToParams,} from "../../../libs/utils";
import {AddPage, Footer, Headers, Nav, PageButtons, PageInfo, SearchInput, Td, UpdatePage} from "../../../compoents/sys-page";
import {FullScreenLoading} from "../../../compoents/common";
import numeral from "numeral";

const pageConf = {
    name: '账变统计', path: '/walletStatisticsLog',
    fields: [
        {field: 'id', name: 'ID', renderFn: (d) => d.id,},
        {field: 'uname', name: '用户名', search: 1, required: 1},
        {field: 'createdDate', name: '日期', renderFn: (d) => d.createdDate.split(' ')[0], search: 1},
        {field: 't1', name: '支付宝充值', renderFn: (d) => numeral(d.t1).format('0,00.00')},
        {field: 't2', name: '微信充值', renderFn: (d) => numeral(d.t2).format('0,00.00')},
        {field: 't3', name: 'PayPal充值', renderFn: (d) => numeral(d.t3).format('0,00.00')},
    ]
}

export default function WalletStatisticsLog() {
    const [query, setQuery] = useState() // 查询参数
    const [showType, setShowType] = useState(1) // 1 主页 2添加 3修改
    const [id, setId] = useState() // 修改数据时使用
    return (<>
        <Headers/>
        <div className={'wrapper'}>
            <div className="w">
                <div className={'wrapper-left'}>
                    <Nav/>
                    {showType === 1 && <MainPage query={query} setQuery={setQuery} setShowType={setShowType} setId={setId}/>}
                    {showType === 2 && <AddPage pageConf={pageConf} setShowType={setShowType}/>}
                    {showType === 3 && <UpdatePage pageConf={pageConf} setShowType={setShowType} id={id}/>}
                </div>
            </div>
        </div>
        <Footer/>
    </>)
}

const MainPage = ({query, setQuery, setShowType, setId}) => {
    const [tempQuery, setTempQuery] = useState({})
    const s = objToParams(query)
    const {data, isLoading, mutate, error} = useSWR(`/${pageConf.path}/list?${s !== undefined ? s : ''}`, listData)
    if (error) return
    return <>
        <PageInfo>
            <div className={'cell p-3 flex-center'}>
                <span className={'mr-auto'}></span>
                <SearchInput pageConf={pageConf} tempQuery={tempQuery} setTempQuery={setTempQuery} setQuery={setQuery}></SearchInput>
            </div>
        </PageInfo>
        <div className={'box-02 no-bottom-border'}>
            {isLoading
                ? <FullScreenLoading/>
                : <>
                    {data && data.list.length === 0
                        ? <div className={'cell color-desc-02 fs-13'}>暂无数据</div>
                        : <>
                            <div className={'cell flex-center p-3'}><PageButtons query={query} setTempQuery={setTempQuery} setQuery={setQuery} totalPage={data && data.total_page} total={data && data.total}/></div>
                            <table className={'table-1'}>
                                <tbody>
                                <tr>{pageConf.fields.filter(i => !i.hide).map((i, index) => <th key={index}>{i.name}</th>)}
                                    <th>操作</th>
                                </tr>
                                {data && data.list.map((i, index) => <tr key={index}><Td pageConf={pageConf} data={i}/>
                                    <td>
                                        <button className={'btn-disabled-v2ex strong'}>删除</button>
                                    </td>
                                </tr>)}
                                </tbody>
                            </table>
                            <div className={'cell-tools p-3 flex-center'}><PageButtons totalPage={data && data.total_page} total={data && data.total} setTempQuery={setTempQuery} setQuery={setQuery} query={query}/></div>
                        </>
                    }
                </>
            }
        </div>
    </>
}
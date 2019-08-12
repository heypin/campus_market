import React from 'react'
import {Button, Table} from "antd";
import {Link} from "react-router-dom";

const columns=[
    {title: '商品ID', dataIndex: 'goodsId', key: '1', },
    {title: '用户ID', dataIndex: 'userId', key: '2',},
    {title: '名称', dataIndex: 'goodsName', key: '3',},
    {title: '价格', dataIndex: 'goodsPrice', key: '4',},
    {title: '原价', dataIndex: 'goodsRealPrice', key: '5',},
    {title: '上架时间', dataIndex: 'shelfTime', key: '6',},
    {title: '下架时间', dataIndex: 'offShelfTime', key: '7',},
    {title: '描述', dataIndex: 'goodsDescribe', key: '8',},
    {title: '状态', dataIndex: 'goodsState', key: '9',
        render: (text) => {
            if(text===0) return (<Button >上架</Button>);
            else if(text===1) return (<Button >下架</Button>);
        }
    },
    {title: '操作', key: '10',
        render: (text, record) => (
            <Link to={`/goods/${record.goodsId}`}>商品详情</Link>
        ),
    },
]
export default class GoodsManage extends  React.Component{
    render() {
        return (
            <Table columns={columns}  />
        )
    }
}

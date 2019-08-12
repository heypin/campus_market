import React from 'react'
import {Button, Table} from "antd";
import {Link} from "react-router-dom";

const columns=[
    {title: '用户ID', dataIndex: 'userId', key: '1', },
    {title: '余额', dataIndex: 'balance', key: '2',},
    {title: '申请提现', dataIndex: 'withdraw', key: '3',},
    {title: '申请充值', dataIndex: 'recharge', key: '4',},
    {title: '状态', dataIndex: 'purseState', key: '5',
        render: (text) => {
            if(text===1) return (<div><Button>通过</Button><Button>不通过</Button></div> );
            else if(text===2) return "已通过";
            else if(text===3) return "不通过";
        }
    },
    {title: '操作', key: '6',
        render: (text, record) => (
            <Link >商品详情</Link>

        ),
    },
]
export default class PurseManage extends  React.Component{
    render() {
        return (
            <Table columns={columns}  />
        )
    }
}

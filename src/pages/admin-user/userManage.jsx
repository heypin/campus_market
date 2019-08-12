import React from 'react'
import {Button, Table} from "antd";
import {Link} from "react-router-dom";

const columns=[
    {title: '用户名', dataIndex: 'username', key: '1',},
    {title: '密码', dataIndex: 'password', key: '2',},
    {title: '手机号', dataIndex: 'telephone', key: '3',},
    {title: '头像', dataIndex: 'userAvatarUrl', key: '4',},
    {title: '地址', dataIndex: 'userAddress', key: '5',},
    {title: 'QQ号', dataIndex: 'qqNumber', key: '6',},
    {title: '状态', dataIndex: 'userState', key: '7',
        render: (text) => {
            if(text===0) return "正常";
            else if(text===1) return "已冻结";
        }
    },
    {title: '操作', key: '8',
        render: (text, record) => (
            <Link>商品详情</Link>

        ),
    },
]
export default class UserManage extends  React.Component{
    render() {
        return (
            <Table columns={columns}  />
        )
    }
}

import React from 'react';
import { Result, Button } from 'antd';
import {Link} from 'react-router-dom'
export default class NotAuthorized extends React.Component{
    render() {
        return (
            <Result
                status="403"
                title="401"
                subTitle="需要登录才能访问"
                extra={<Link to='/home'><Button type="primary" >返回主页</Button></Link>}
            />
        )
    }
}


import React from 'react';
import { Result, Button } from 'antd';
import {Link} from 'react-router-dom'
export default class NotFound extends React.Component{
    render() {
        return (
            <Result
                status="404"
                title="404"
                subTitle="页面走丢了"
                extra={<Link to='/home'><Button type="primary" >返回主页</Button></Link>}
            />
        )
    }
}

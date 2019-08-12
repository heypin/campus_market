import React from 'react'
import './publishGoods.less'
import { Form, Input } from 'antd'

class PublishGoods extends React.Component{
    render() {
        const { getFieldDecorator } = this.props.form;
        const {TextArea}=Input


        return (
            <Form  style={{width:'40vw'}}  onSubmit={this.handleSubmit} className="login-form">
                <Form.Item label="商品名称">
                    {getFieldDecorator('goodsName', {
                        rules: [{ required: true, message: '请输入手机号!' }],
                    })(
                        <Input />,
                    )}
                </Form.Item>
                <Form.Item label="商品价格">
                    {getFieldDecorator('goodsPrice', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <Input type="password" placeholder="密码"/>,
                    )}
                </Form.Item>
                <Form.Item label="原价">
                    {getFieldDecorator('realPrice', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <Input placeholder="密码"/>,
                    )}
                </Form.Item>
                <Form.Item label="描述">
                    {getFieldDecorator('describe', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <TextArea rows={4} placeholder="密码"/>,
                    )}
                </Form.Item>

            </Form>
        )
    }
}
const WrappedPublishGoods = Form.create()(PublishGoods);
export default WrappedPublishGoods

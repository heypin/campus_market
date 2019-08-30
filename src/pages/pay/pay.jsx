import React from 'react'
import {Steps, Button, message, Card, Form, Upload, Modal, Input, InputNumber} from 'antd';
import './pay.less'
import Constant from "../../utils/constant";
import moment from 'moment';
import Request from '../../api';
const { Step } = Steps;


 class Pay extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            order:{}
        };
    }
    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    handlePay=()=>{
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                try {
                   const order= await Request.addOrder(values);
                   this.setState({order:order});
                   message.success("支付成功");
                   this.next();
                }catch (e) {
                    if(e.response.status===402){
                        message.error("余额不足!");
                    }else{
                        message.error("参数错误!");
                    }
                }
            }
        });
    };
    render() {
        if(!this.props.location.goodsDetail) return "请选择商品";
        const { current } = this.state;
        const {goodsDetail}=this.props.location;
        const { getFieldDecorator } = this.props.form;
        const {user}=this.props;
        const {order} = this.state;

        const firstContent=(<div className="confirm-goods">
            <div className="goods-detail">
                <div className="goods-image">
                    <img src={Constant.BaseImgUrl+goodsDetail.goodsImg}
                         className="main-image" alt="商品图片"/>
                </div>
                <div className="goods-info">
                    <p className="title">{goodsDetail.goodsName}</p>
                    <div className="username">
                        <img alt="avatar" src={goodsDetail.user.userAvatarUrl?Constant.BaseAvatar+goodsDetail.user.userAvatarUrl:""}/>
                        <span>{goodsDetail.user.username}</span>
                    </div>
                    <div className="goods-price">
                        <i className="iconfont icon-Price-Tag"/>
                        <span className="price">{goodsDetail.goodsPrice}</span>
                        <span className="realPrice">{goodsDetail.goodsRealPrice}</span>
                    </div>
                    <div className="time">
                        <i className="iconfont icon-shijian"/>
                        <span>{moment(goodsDetail.shelfTime).format("YYYY-MM-DD")}</span>
                    </div>
                </div>

            </div>
            <div className="goods-describe">
                <p>商品描述：</p>
                <div>{goodsDetail.goodsDescribe}</div>
            </div>
        </div>);
        const secondContent=(<div>
            <Form labelCol={{span:3,offset:0}}  wrapperCol={{span:8}} >
                <Form.Item wrapperCol={{span:0}}>
                    {getFieldDecorator('userId', {
                        rules: [{ required: true, message: '请输入ID' }],
                        initialValue:user.userId
                    })(
                        <Input type="hidden" />,
                    )}
                </Form.Item>
                <Form.Item wrapperCol={{span:0}}>
                    {getFieldDecorator('goodsId', {
                        rules: [{ required: true, message: '请输入商品ID' }],
                        initialValue:goodsDetail.goodsId
                    })(
                        <Input type="hidden" />,
                    )}
                </Form.Item>
                <Form.Item label="姓名">
                    {getFieldDecorator('orderName', {
                        rules: [{ required: true, message: '请输入收货人姓名' }],
                    })(
                        <Input />,
                    )}

                </Form.Item>
                <Form.Item label="手机号">
                    {getFieldDecorator('orderPhone', {
                        rules: [{ required: true, message: '请输入手机号' }, {len:11,message:'请输入11位手机号'},],
                        initialValue:user.telephone
                    })(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label="地址">
                    {getFieldDecorator('orderAddress',{
                        rules: [{ required: true, message: '请输入收货地址' }],
                        initialValue:user.userAddress
                    })(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item label="备注" wrapperCol={{span:12}}>
                    {getFieldDecorator('orderInformation', {
                        rules: [],
                    })(
                        <Input.TextArea rows={4} />,
                    )}
                </Form.Item>

            </Form>
        </div>);
        const lastContent=(<div className="order-detail">
            <p>
                <span>订单编号：</span>
                {order.orderNo}
            </p>
            <p>
                <span>姓名：</span>
                {order.orderName}
            </p>
            <p>
                <span>价格：</span>
                {order.orderPrice}
            </p>
            <p>
                <span>联系方式：</span>
                {order.orderPhone}
            </p>
            <p>
                <span>收货地址：</span>
                {order.orderAddress}
            </p>
            <p>
                <span>备注：</span>
                {order.orderInformation}
            </p>
            <p>
                <span>下单时间：</span>
                {order.orderCreatedTime}
            </p>
        </div>);
        const steps = [
            {title: '确认商品', content: firstContent,},
            {title: '填写订单', content: secondContent,},
            {title: '完成', content: lastContent,},
        ];
        return (
            <div className="pay">
                <Card title="支付" className="container">
                    <Steps current={current}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                    <div className="steps-content">{steps[current].content}</div>
                    <div className="steps-action">
                        {current === 0 && (<span>
                            <Button type="primary" onClick={() => this.next()}>
                                下一步
                            </Button>
                            <Button style={{marginLeft:10}} onClick={()=>{this.props.history.goBack()}}>
                                返回商品
                            </Button>
                        </span>)}
                        {current === 1 && (<span>
                            <Button type="primary" onClick={this.handlePay}>
                                立即支付
                            </Button>
                            <Button style={{marginLeft:10}} onClick={()=>this.prev()}>
                                上一步
                            </Button>
                        </span>)}
                        {current===2 && (<span>
                            <Button  type="primary" onClick={()=>{this.props.history.goBack()}}>
                                返回商品
                            </Button>
                        </span>)}
                    </div>
                </Card>
            </div>
        )
    }
}
export default Form.create()(Pay);

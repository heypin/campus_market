import React from 'react'
import './personalCenter.less'
import {Card, Comment, List, InputNumber, message, Button, Form, Input, Row, Col, Divider} from 'antd';
import moment from 'moment';
import Request from "../../api";
import {Link} from "react-router-dom";
import Constant from "../../utils/constant";
import EditPersonalInfo from './editPersonalInfo';

class PersonalCenter extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            unReadComments:[],
            balance:0,
            personalInfoState:1,
            purse:{},
        };
        this.inputValue=0
    }
    onChange=(value)=>{
        this.inputValue=value;
    };
    loadPurseBalance=async ()=>{
        const result=await Request.getPurseByUserId(this.props.user.userId);
        this.setState({balance:result.balance,purse:result});
    };
    loadRelytoMeCommentsData=async ()=>{
        const result = await Request.getReplyToMeComment(this.props.user.userId);
        let unReadComments=[];
        result.forEach((item)=>{
            if(item.replyIsRead!==1){
                item.actions=[<Link to={"/goods/"+item.goodsId} >详情</Link>,
                    <Button type="link" onClick={()=>this.handleReadComment(item.commentId)}>标为已读</Button> ];
                unReadComments.push(item);
                item.commentCreatedTime=moment(item.commentCreatedTime).format('YYYY-MM-DD HH:mm:ss');
            }
        });
        this.setState({unReadComments:unReadComments});
    };
    handleReadComment=async (commentId)=>{
        try{
            await Request.readComment(this.props.user.userId,commentId);
            this.loadRelytoMeCommentsData();
            message.success("操作成功");
        }catch (e) {
            message.error("操作失败");
        }
    };
    handleRecharge=async ()=>{
        if(this.inputValue<=0) message.error("请输入大于0的数");
        try {
            await Request.rechargeOrWithdraw({userId:this.props.user.userId,recharge:this.inputValue});
            message.success("操作成功");

        }catch (e) {
            message.error("操作失败");
        }
    };
    handleWithdraw=async ()=>{
        if(this.inputValue<this.state.balance) message.error("提现金额超出余额");
        try {
            await Request.rechargeOrWithdraw({userId:this.props.user.userId,withdraw:this.inputValue});
            message.success("操作成功");
        }catch (e) {
            message.error("操作失败");
        }
    };
    componentDidMount() {
        this.loadPurseBalance();
        this.loadRelytoMeCommentsData();
    }

    handleModifyPassword=(e)=>{
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    await Request.editUserInfo(values);
                    message.success("修改密码成功");
                }catch (e) {
                    message.error("修改密码失败,参数错误");
                }
            }
        });
    };

    render() {
        const user=this.props.user;
        const { getFieldDecorator } = this.props.form;
        const purse=this.state.purse;
        const personalInfo=(
            <div className="personal-info">
                <p><label>用户名:</label>{user.username}</p>
                <p><label>手机号码:</label>{user.telephone}</p>
                <p><label>QQ号码:</label>{user.qqNumber}</p>
                <p><label>收货地址:</label>{user.userAddress}</p>
            </div>
        );

        const modifyPasword=(
            <Form wrapperCol={{span:6}} labelCol={{span:3,offset:0}} onSubmit={this.handleModifyPassword} className="login-form" >
                <Form.Item wrapperCol={{span:0}}>
                    {getFieldDecorator('userId', {
                        rules: [{ required: true, message: '请输入ID!' }],
                        initialValue:user.userId
                    })(
                        <Input type="hidden" />,
                    )}
                </Form.Item>
                <Form.Item label="密码" >
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入密码!'},{min:6,message:'请输入至少6位密码'},],
                    })(
                        <Input type="password"/>,
                    )}
                </Form.Item>
                <Form.Item label="确认密码" >
                    {getFieldDecorator('confirmPassword', {
                        rules: [{required: true, message: '请重复密码!'},{min:6,message:'请输入至少6位密码'},],
                    })(
                        <Input type="password"/>,
                    )}
                </Form.Item>
                <Form.Item wrapperCol={{offset:3}}>
                    <Button type="primary" htmlType="submit" >
                        确认修改
                    </Button>
                </Form.Item>
            </Form>
        );
        return (
                <div className="personal-center">



                    <Card title="我的钱包" >
                        <span style={{marginRight:20}}>钱包余额: {this.state.balance}</span>
                        <InputNumber
                            defaultValue={0}
                            min={0}
                            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\￥\s?|(,*)/g, '')}
                            onChange={this.onChange}
                            style={{width:120,marginLeft:100,marginRight:50}}
                        />
                        <Button style={{marginRight:20}} onClick={this.handleRecharge}>充值</Button>
                        <Button style={{marginRight:20}} onClick={this.handleWithdraw}>提现</Button>
                        <span>上次申请状态:{(function () {
                            if(purse.purseState===0) return "无需审核";
                            else if(purse.purseState===1) return "待审核";
                            else if(purse.purseState===2) return "未通过";
                            else if(purse.purseState===3) return "已通过";
                        })()}</span>
                    </Card>
                    <Card title="个人信息" style={{marginBottom:20,marginTop:20}} extra={
                        <span>
                            <Button type="link" onClick={()=>{this.setState((state)=>{
                                let value=state.personalInfoState===2?1:2;
                                return {personalInfoState:value};
                            })}} style={{padding:0}}>
                                {this.state.personalInfoState===2?"取消编辑":"编辑信息"}
                            </Button>
                            <Divider type="vertical"/>
                            <Button type="link" onClick={()=>{this.setState((state)=>{
                                let value=state.personalInfoState===3?1:3;
                                return {personalInfoState:value};
                            })}} style={{padding:0}}>
                                {this.state.personalInfoState===3?"取消修改":"修改密码"}
                            </Button>
                        </span>
                    }>
                        {this.state.personalInfoState===1&&personalInfo}
                        {this.state.personalInfoState===2&&<EditPersonalInfo user={user}/>}
                        {this.state.personalInfoState===3&&modifyPasword}
                    </Card>
                    <Card title="回复我的" >
                        <List className="comment-list" header={`${this.state.unReadComments.length} 回复`} itemLayout="horizontal" dataSource={this.state.unReadComments}
                              renderItem={item => (
                                  <li>
                                      <Comment actions={item.actions} author={item.user.username} avatar={Constant.BaseAvatar+item.user.userAvatarUrl}
                                          content={item.commentContent} datetime={item.commentCreatedTime}
                                      />
                                  </li>
                              )}
                        />
                    </Card>
                </div>



        )
    }
}
export default Form.create()(PersonalCenter);

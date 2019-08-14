import React from 'react'
import './personalCenter.less'
import {Card, Comment, List, InputNumber, message, Button} from 'antd';
import moment from 'moment';
import Request from "../../api";
import {Link} from "react-router-dom";
import Constant from "../../utils/constant";

export default class PersonalCenter extends React.Component{

    constructor(props) {
        super(props);
        this.state = {unReadComments:[],balance:0}
    }
    loadPurseBalance=async ()=>{
        const result=await Request.getPurseByUserId(this.props.user.userId);
        this.setState({balance:result.balance});
    };
    loadRelytoMeCommentsData=async ()=>{
        const result = await Request.getReplyToMeComment(this.props.user.userId);
        console.log(result);
        let unReadComments=[];
        result.forEach((item)=>{
            console.log("replyIsRead",typeof item.replyIsRead,item.replyIsRead);
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
            message.success("操作失败");
        }
    };
    handleRecharge=async ()=>{

    };
    handleWithdraw=async ()=>{

    };
    componentDidMount() {
        this.loadPurseBalance();
        this.loadRelytoMeCommentsData();
    }

    render() {
        return (
                <div>
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
                        <Button onClick={this.handleWithdraw}>提现</Button>
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

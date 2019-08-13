import React from 'react'
import {Card, Button, Comment, List, Mentions, Empty, Avatar,message} from 'antd';
import './goods.less'
import Constant from '../../utils/constant'
import Request from '../../api'
import moment from "moment";
import {UserContext} from "../../App";

export default class Goods extends React.Component{
    constructor(prop){
        super(prop);
        this.goodsId = prop.match.params.id;
        this.user=null;
        this.comment='';
        this.mentions=[];
        this.mentionCount=0;
        this.state = {
            goodsDetail: {
                imagesList:[]
            },
            mainImageUrl:"",
            comments:[],
            hasFocus:false,
        }
    }
    onChange=(value)=> {
        this.comment=value;
    };

    onSelect=(option)=> {
        if(this.mentions.length===0){
            this.mentions.push(option);
        }
        this.mentionCount++;
    };
    addFocus=async ()=>{
        if(this.state.hasFocus){
          const  result=await Request.addWatch(this.user.userId,this.goodsId)
        }
    };
    buyNow= ()=>{

    };
    handleSubmitComment=async ()=>{
        if(this.mentionCount>1){
            message.info("只能回复一个人");
        }
        if(this.comment===''){
            message.info("请输入评论");
            return ;
        }
        let replyUserId=this.mentions.length===1?this.mentions[0].userId:undefined;
        try{
            const result=await Request.addComment({
                userId:this.user.userId,
                goodsId:this.goodsId,
                replyUserId:replyUserId,
                commentContent:this.comment,
            });
            this.loadCommentsData();
        }catch (e) {
            message.error("添加评论失败!");
        }

    };
    loadGoodsData = async()=>{

        try {
            const result = await Request.getGoodsDetail(this.goodsId);
            this.setState((state)=>{
                let mainImageUrl="";
                if(result.imagesList.length>0){
                    mainImageUrl=result.imagesList[0].imgUrl
                }
                return {goodsDetail:result,mainImageUrl:mainImageUrl};
            })
        } catch (e) {
            this.props.history.replace("/404");
        }
    };
    loadCommentsData=async ()=>{
        const result = await Request.getCommentsByGoodsId(this.goodsId);
        this.setState({comments:result})
    };
    queryHasFocus= ()=>{
        setTimeout(async ()=>{
            if(this.user===null) return ;
            const result=await Request.hasWatchGoods(this.user.userId,this.goodsId);
            this.setState({hasFocus:result.hasWatch});
        },500);

    };
    componentDidMount(){
        this.loadGoodsData();
        this.loadCommentsData();
        this.queryHasFocus();
    }

    handleNeedLogin=()=>{
        message.info("请登录后继续操作！");
    };

    render() {
        const goodsDetail=this.state.goodsDetail;


        return(
            <div className="goods">

                <div  className="container">
                    <Card  title="商品详情" >
                        <div className="goods-detail">
                            <div className="goods-image">
                                <img src={this.state.mainImageUrl!==""?
                                    Constant.BaseImgUrl+this.state.mainImageUrl:""}
                                     className="main-image" alt="商品图片"/>
                            </div>
                            <div className="goods-info">
                                <p className="title">{goodsDetail.goodsName}</p>
                                <div className="username">
                                    <img alt="avatar" src={goodsDetail.userAvatarUrl?Constant.BaseAvatar+goodsDetail.userAvatarUrl:""}/>
                                    <span>{goodsDetail.username}</span>
                                </div>
                                <div className="goods-price">
                                    <i className="iconfont icon-Price-Tag"/>
                                    <span className="price">{goodsDetail.goodsPrice}</span>
                                    <span className="realPrice">{goodsDetail.goodsRealPrice}</span>
                                </div>
                                <div className="qq">
                                    <i className="iconfont icon-QQ"/>
                                    <span>{goodsDetail.qqNumber}</span>
                                </div>
                                <div className="time">
                                    <i className="iconfont icon-shijian"/>
                                    <span>{moment(goodsDetail.shelfTime).format("YYYY-MM-DD")}</span>
                                </div>

                                <UserContext.Consumer>
                                    {
                                        ({user}) => {
                                            if(user!==null){
                                                this.user=user;
                                            }
                                            return (
                                                <div className="button-group">
                                                    <Button type="primary" className="focus"
                                                            onClick={user===null ? this.handleNeedLogin : this.addFocus}
                                                    >{
                                                        this.state.hasFocus?"已经关注":"加入关注"
                                                    }
                                                    </Button>
                                                    <Button type="primary" className="buy"
                                                            onClick={user===null?this.handleNeedLogin: this.buyNow}
                                                    >立即购买
                                                    </Button>
                                                </div>
                                            )
                                        }
                                    }
                                </UserContext.Consumer>

                                <div className="img-list">
                                    <p>所有图片</p>
                                    <ul >
                                        {
                                            goodsDetail.imagesList.map((item,index)=>{
                                                return (
                                                    <li key={index} style={{cursor:"pointer"}}>
                                                        <img src={Constant.BaseImgUrl+item.imgUrl}
                                                             onClick={()=>{
                                                                  this.setState({mainImageUrl:item.imgUrl})
                                                             }}/>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </Card>
                    <Card title="商品描述" className="goods-describe">
                        {goodsDetail.goodsDescribe}
                    </Card>
                    <Card title="评论列表" className="comment-detail">
                        <Mentions style={{ width: '100%' }} placeholder="输入'@'符号来回复评论中的某个用户" onChange={this.onChange} onSelect={this.onSelect} rows={3}>
                            {
                                this.state.comments.map((item,index)=>{
                                    let time=moment(item.commentCreatedTime).format("YYYY-MM-DD HH:mm:ss");
                                    return (
                                        <Mentions.Option key={item.commentId} value={`${item.user.username} [${time}]\n`}  userId={item.user.userId}>
                                            <div >
                                                <Avatar src={Constant.BaseAvatar+item.user.userAvatarUrl}/>
                                                <span style={{marginLeft:10,marginRight:10}}>{item.user.username}</span>
                                                {time}
                                            </div>
                                        </Mentions.Option>
                                    )
                                })
                            }
                        </Mentions>
                        <UserContext.Consumer>
                            {
                                ({user})=>{
                                    return (
                                        <Button type="primary" onClick={user===null?
                                            this.handleNeedLogin: this.handleSubmitComment} className="submit"
                                        >提交评论
                                        </Button>
                                    )
                                }
                            }
                        </UserContext.Consumer>

                        {
                            this.state.comments.length===0?
                                (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />):
                                (<List className="comment-list" header={`${this.state.comments.length} 条评论`}
                                       itemLayout="horizontal" dataSource={this.state.comments}
                                       renderItem={item => (
                                           <li>
                                               <Comment  author={item.user.username}
                                                         avatar={item.user.userAvatarUrl?Constant.BaseAvatar+item.user.userAvatarUrl:""}
                                                         content={item.commentContent}
                                                         datetime={<span style={{color:"black"}}>
                                                             {moment(item.commentCreatedTime).format("YYYY-MM-DD HH:mm:ss")}
                                                         </span>}
                                               />
                                           </li>
                                       )}
                                />)
                        }
                    </Card>

                </div>
            </div>

        )
    }
}

import React from 'react'
import {Card, Icon, Button, Comment, List, Mentions, Empty, Avatar} from 'antd';
import './goods.less'
import Constant from '../../utils/constant'
import Request from '../../api'
import moment from "moment";

export default class Goods extends React.Component{
    constructor(prop){
        super(prop);
        this.comment='';
        this.mentions=[];
        this.state = {
            goodsDetail: {
                imagesList:[]
            },
            mainImageUrl:"",
            comments:[],
        }
    }
    onChange=(value)=> {
        this.comment=value;
    }

    onSelect=(option)=> {
        this.mentions.push(option)
    }
    handleSubmit=()=>{
        console.log(this.mentions)
    }
    loadGoodsData = async()=>{
        const goodsId = this.props.match.params.id;
        try {
            const result = await Request.getGoodsDetail(goodsId);
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
    }
    loadCommentsData=async ()=>{
        const goodsId = this.props.match.params.id;
        const result = await Request.getCommentsByGoodsId(goodsId);
        this.setState({comments:result})
    }
    componentDidMount(){
        this.loadGoodsData();
        this.loadCommentsData();

    }

    render() {
        const goodsDetail=this.state.goodsDetail;


        return(
            <div  className="goods">
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
                                <img alt="avatar" src={Constant.BaseAvatar+goodsDetail.userAvatarUrl}/>
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
                                <span>{goodsDetail.shelfTime}</span>
                            </div>
                            <div className="button-group">
                                <Button type="primary" className="focus">加入关注</Button>
                                <Button type="primary" className="buy">立即购买</Button>
                            </div>
                            <div className="img-list">
                                <p>所有图片</p>
                                <ul >
                                    {
                                        goodsDetail.imagesList.map((item,index)=>{
                                            return (
                                                <li key={index}><img src={Constant.BaseImgUrl+item.imgUrl}/></li>
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
                    <Mentions style={{ width: '100%' }} onChange={this.onChange} onSelect={this.onSelect} rows={3}>
                        {
                            this.state.comments.map((item)=>{
                               return (
                                   <Mentions.Option value={item.user.username} key={item.commentId} userId={item.user.userId}>
                                       <Avatar src={Constant.BaseAvatar+item.user.userAvatarUrl}/>
                                       <span style={{marginLeft:10,marginRight:10}}>{item.user.username}</span>
                                       {moment(item.commentCreatedTime).format("YYYY-MM-DD HH:mm:ss")}
                                   </Mentions.Option>
                               )
                            })
                        }
                    </Mentions>
                    <Button type="primary" onClick={this.handleSubmit} className="submit">提交评论</Button>
                    {
                        this.state.comments.length===0?
                            (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />):
                            (<List className="comment-list" header={`${this.state.comments.length} 条评论`}
                                   itemLayout="horizontal" dataSource={this.state.comments}
                                  renderItem={item => (
                                      <li>
                                          <Comment  author={item.user.username}
                                                   avatar={Constant.BaseAvatar+item.user.userAvatarUrl}
                                                    content={item.commentContent}
                                                    datetime={moment(item.commentCreatedTime).format("YYYY-MM-DD HH:mm:ss")}
                                          />
                                      </li>
                                  )}
                            />)
                    }
                </Card>

            </div>
        )
    }
}

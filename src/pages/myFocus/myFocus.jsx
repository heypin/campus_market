import React from 'react'
import './myFocus.less'
import {Button, List,Divider,message} from "antd";
import Request from '../../api'
import Constant from '../../utils/constant'

export default class MyFocus extends React.Component{
    constructor(prop){
        super(prop);
        this.state={goodsData:[]};
    }
    loadGoodsData=async ()=>{
        const result=await Request.getWatchList(this.props.user.userId);
        this.setState({goodsData:result})
    };
    componentDidMount() {
        this.loadGoodsData();
    }
    handleUnWatch=async (goodsId)=>{
        try{
            await Request.unwatch(this.props.user.userId,goodsId);
            message.info("取消成功!");
        }catch (e) {
            message.info("取消失败!");
        }
        this.loadGoodsData();
    };
    render() {
        return (
            <List itemLayout="horizontal" size="large" dataSource={this.state.goodsData} className="my-focus"
                  renderItem={item => (
                      <List.Item key={item.goodsId}>
                          <div className="cover">
                              <img  alt="cover" src={Constant.BaseImgUrl+item.image.imgUrl} />
                          </div>
                          <div className="goods-info">
                              <span>{item.goodsName}</span>
                              <span>{item.goodsPrice}</span>
                              <span>{item.goodsDescribe}</span>
                              <div className="action">
                                  <Button type="link" onClick={()=>{this.handleUnWatch(item.goodsId)}}>取消关注</Button>
                                  <Divider type="vertical"/>
                                  <Button type="link" onClick={()=>this.props.history.push(`/goods/${item.goodsId}`)}>商品详情</Button>
                              </div>
                          </div>
                      </List.Item>
                  )}
            />
        )
    }
}

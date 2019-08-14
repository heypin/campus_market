import React from 'react'
import product from './myProduct.less'
import {Button, List,message} from "antd";
import Request from '../../api'
import Constant from '../../utils/constant'

export default class MyProduct extends React.Component{
    constructor(prop){
        super(prop);
        this.state={goodsData:[]};
    }
    loadGoodsData=async ()=>{
        const result=await Request.getMyProductByUserId(25);
        this.setState({goodsData:result})
    };
    componentDidMount() {
        this.loadGoodsData();
    }
    handleGoodsState=async (goodsId,goodsState)=> {
        let updateState = (goodsState === 1 ? 0 : 1);
        try{
            await Request.updateGoodsState(this.props.user.userId,goodsId,updateState);
            message.success("操作成功");
            this.loadGoodsData();

        }catch (e) {
            message.success("操作失败");
        }
    };
    render() {
        return (
            <List itemLayout="horizontal" size="large" dataSource={this.state.goodsData} className="my-product"
                  renderItem={item => (
                      <List.Item key={item.goodsId}>
                          <div className="cover">
                              <img  alt="cover" src={Constant.BaseImgUrl+item.image.imgUrl} />
                          </div>
                          <div className="goods-info">
                              <span>{item.goodsName}</span>
                              <span className="price">{item.goodsPrice}</span>
                              <span>{item.goodsDescribe}</span>
                              <div className="action">
                                  <Button onClick={()=>this.props.history.push(`/goods/${item.goodsId}`)}>
                                      详情
                                  </Button>
                                  <Button onClick={()=>this.props.history.push({pathname:`/account/publish-goods`,state:item})}>
                                      编辑
                                  </Button>
                                  <Button onClick={()=>this.handleGoodsState(item.goodsId,item.goodsState)}>
                                      {item.goodsState===1?"下架":"上架"}
                                  </Button>
                              </div>
                          </div>
                      </List.Item>
                  )}
            />
        )
    }
}

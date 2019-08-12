import React from 'react'
import product from './myProduct.less'
import {Button, List} from "antd";
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
    }
    componentDidMount() {
        this.loadGoodsData();
    }
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
                              <span>{item.goodsPrice}</span>
                              <span>{item.goodsDescribe}</span>
                              <div className="action">
                                  <Button>详情</Button>
                                  <Button>编辑</Button>
                                  <Button>下架</Button>
                              </div>
                          </div>
                      </List.Item>
                  )}
            />
        )
    }
}

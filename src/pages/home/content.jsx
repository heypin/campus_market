import React from 'react'
import {Card, Row, Col, Pagination, Avatar} from 'antd';
import Constant from '../../utils/constant'
import {Link} from 'react-router-dom'
const { Meta } = Card;

export default class MainContent extends React.Component{

    render() {

        const listItem =   this.props.goods.records.map((item)=>{
           return (
               <Link to={{pathname:"/goods/"+item.goodsId}} key={item.goodsId} >
                   <Col span={6}  style={{marginTop:20}} >
                       <Card
                           hoverable
                           cover={<img alt="cover"  src={Constant.BaseImgUrl+ item.imagesList[0].imgUrl}
                                        style={{width:180,height:180,marginLeft:"auto",marginRight:"auto"}}/>}
                           style={{width:180,height:260}}
                           bodyStyle={{paddingLeft:5,paddingRight:5}}
                       >
                           <Meta title={<div style={{overflow:"hidden",textOverflow:"ellipsis",fontSize:14}}>{item.goodsName}</div>}
                                 description={<span>{item.goodsPrice}</span>}
                                 avatar={<Avatar src={Constant.BaseAvatar+item.userAvatarUrl}/> }
                           />

                       </Card>
                   </Col>
               </Link>

           )
        });

        return (

            <div style={{backgroundColor:"white"}}>
                <Card title="最新发布" >
                    <Row  gutter={16} >
                        {listItem}
                    </Row>
                    <Pagination
                        showQuickJumper
                        defaultCurrent={1}
                        pageSize={20}
                        total={this.props.goods.total}
                        hideOnSinglePage={false}
                        onChange={this.props.onPageChange}
                        style={{marginBottom:20,marginTop:20}}
                    />
                </Card>


            </div>
        )
    }
}

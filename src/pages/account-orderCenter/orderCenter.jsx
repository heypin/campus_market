import React from 'react'
import './orderCenter.less'
import { Tabs,Table, Button,message } from 'antd';
import {Link} from 'react-router-dom';
import Request from '../../api'
import moment from 'moment'
const { TabPane } = Tabs;

const columns=[
    {title: '订单编号', dataIndex: 'orderNo', key: 'orderNo', },
    {title: '价格', dataIndex: 'orderPrice', key: 'orderPrice',},
    {title: '姓名', dataIndex: 'orderName', key: 'orderName',},
    {title: '手机号', dataIndex: 'orderPhone', key: 'orderPhone',},
    {title: '收货地址', dataIndex: 'orderAddress', key: 'orderAddress',},
    {title: '备注', dataIndex: 'orderInformation', key: 'orderInformation',},
    {title: '下单时间', dataIndex: 'orderCreatedTime', key: 'orderCreatedTime',
        render:(text)=>moment(text).format('YYYY-MM-DD HH:mm:ss')},
];
export default class OrderCenter extends React.Component{
    constructor(prop){
        super(prop);
        this.state={purchaseData:[],soldData:[]}
    }
    purchaseColumns = columns.concat([
        {title: '订单状态', dataIndex: 'orderState', key: 'orderState', render: (text,record) => {
                if(text===1) return "待发货";
                else if(text===2) return (<Button onClick={()=>this.confirmReceipt(record.orderId)}>确认收货</Button>);
                else if(text===3) return "已完成";}
        },
        {title: '操作', key: 'action', render: (text, record) => (<Link to={`/goods/${record.goodsId}`}>商品详情</Link>),},
    ]);
    soldColumns=columns.concat([
        {title: '订单状态', dataIndex: 'orderState', key: 'orderState', render: (text,record) => {
                if(text===1) return <Button onClick={()=>this.deliverGoods(record.orderId)}>发货</Button>;
                else if(text===2) return "待收货";
                else if(text===3) return "已完成";}
        },
        {title: '操作', key: 'action', render: (text, record) => (<Link to={`/goods/${record.goodsId}`}>商品详情</Link>),},
    ]);
    confirmReceipt=async (orderId)=>{
        try{
            await Request.confirmReceipt(orderId);
            message.success("收货成功");
            this.loadPurchaseOrderData();
        }catch (e) {
            message.error("操作失败");
        }
    };
    deliverGoods=async (orderId)=>{
        try{
            await Request.deliverGoods(orderId);
            message.success("已发货");
            this.loadSoldOrderData();
        }catch (e) {
            message.error("操作失败");
        }
    };
    tabChange=(key)=>{

    };

    loadPurchaseOrderData=async ()=>{
        const result = await Request.getPurchaseOrderByUserId(this.props.user.userId);
        this.setState({purchaseData:result})
    };
    loadSoldOrderData=async ()=>{
        const result=await Request.getSoldOrderByUserId(this.props.user.userId);
        this.setState({soldData:result});
    }
    componentDidMount() {
        this.loadPurchaseOrderData();
        this.loadSoldOrderData();
    }

    render() {
        return (
            <Tabs defaultActiveKey="1" onChange={this.tabChange} size="large">
                <TabPane tab="我买的" key="1">
                    <Table columns={this.purchaseColumns} dataSource={this.state.purchaseData} rowKey={record=>record.orderId}/>
                </TabPane>
                <TabPane tab="我卖的" key="2">
                    <Table columns={this.soldColumns} dataSource={this.state.soldData} rowKey={record=>record.orderId}/>
                </TabPane>
            </Tabs>
        )
    }
}

import React from 'react'
import {Switch,Route,Link,Redirect} from 'react-router-dom';
import { Layout, Menu, Icon,Avatar } from 'antd';
import PurseManage from '../admin-purse/purseManage';
import OrderManage from '../admin-order/orderManage';
import GoodsManage from '../admin-goods/goodsManage';
import UserManage from '../admin-user/userManage';

const { Header, Content, Footer, Sider } = Layout;
export default class Admin extends React.Component{
    constructor(props){
        super(props)
        this.menuData=[
            {key:"1", path:"/admin/purse-manage",text:"钱包管理",icon:<Icon type="user" />},
            {key:"2", path:"/admin/order-manage",text:"订单管理",icon:<Icon type="video-camera" />},
            {key:"3", path:"/admin/goods-manage",text:"商品管理",icon: <Icon type="cloud-o" />},
            {key:"4", path:"/admin/user-manage",text:"用户管理",icon:<Icon type="user" />},
        ];
    }

    //输入路径名或返回时能正确显示菜单选中状态
    getSelectedKey=()=> {
        const path = this.props.location.pathname;
        let selectedKey=[];
        this.menuData.forEach((item)=>{
            if(item.path===path){
                selectedKey=[item.key];
            }
        });
        return selectedKey;
    };

    render() {
        let selectedKey = this.getSelectedKey();
        if(selectedKey.length===0){
            selectedKey=['1'];
        }
        return (
            <Layout>
                <Sider style={{ overflow: 'auto',height:'100vh',position:'fixed',left: 0}}>
                    <div>
                        <Avatar  icon="user" style={{margin:"auto",display:"block"}} size={100}/>
                    </div>

                    <Menu theme="dark" mode="inline"  selectedKeys={selectedKey} >
                        {
                            this.menuData.map((item)=>{
                                return (
                                    <Menu.Item key={item.key}>
                                        <Link to={item.path} >
                                            {item.icon}
                                            <span className="nav-text">{item.text}</span>
                                        </Link>
                                    </Menu.Item>
                                )
                            })
                        }
                    </Menu>
                </Sider>
                <Layout style={{ marginLeft: 200 }}>
                    <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                        <div style={{ padding: 24, background: '#fff' }}>
                            <Switch>
                                <Redirect from="/admin" exact to="/admin/purse-manage"/>
                                <Route path="/admin/purse-manage" component={PurseManage}/>
                                <Route path="/admin/order-manage" component={OrderManage}/>
                                <Route path="/admin/goods-manage" component={GoodsManage}/>
                                <Route path="/admin/user-manage" component={UserManage}/>
                            </Switch>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>©2019 Created by heypin</Footer>
                </Layout>
            </Layout>
        )
    }
}

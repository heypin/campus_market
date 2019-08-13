import React from 'react'
import './account.less'
import {Switch,Route,Link,Redirect} from 'react-router-dom'
import PersonalCenter from '../personalCenter/personalCenter'
import MyFocus from '../myFocus/myFocus'
import MyProduct from '../myProduct/myProduct'
import OrderCenter from '../orderCenter/orderCenter'
import PublishGoods from '../publishGoods/publishGoods'

import { Layout, Menu, Icon,Avatar } from 'antd';
import {UserContext} from "../../App";
const { Header, Content, Footer, Sider } = Layout;


export default class Account extends React.Component{

    constructor(props){
        super(props);
        this.menuData=[
            {key:"1", path:"/account/personal-center",text:"个人中心",icon:<Icon type="user" />},
            {key:"2", path:"/account/my-focus",text:"我的收藏",icon:<Icon type="video-camera" />},
            {key:"3", path:"/account/order-center",text:"订单中心",icon: <Icon type="upload" />},
            {key:"4", path:"/account/my-product",text:"我的闲置",icon:<Icon type="bar-chart" />},
            {key:"5", path:"/account/publish-goods",text:"发布物品",icon:<Icon type="cloud-o" />},
        ];
        this.state={selectedKeys:["1"]};
        console.log(props);
    }
    getSelectedKey=()=> {
        const path = this.props.location.pathname;
        let selectedKey=[];
        this.menuData.forEach((item)=>{
            if(item.path==path){
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

                <Sider style={{ overflow: 'auto',height:'100vh',position:'fixed',left: 0,backgroundColor:"white"}}>
                    <div>
                        <Avatar  icon="user" style={{margin:"auto",display:"block"}} size={100}/>
                    </div>

                    <Menu theme="light" mode="inline"  selectedKeys={selectedKey} onClick={this.onMenuClick}>
                        {
                            this.menuData.map((item)=>{
                                return (
                                    <Menu.Item key={item.key}>
                                        <Link to={item.path}>
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
                    <Header style={{ background: '#fff', padding: 0 }} />
                    <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                        <div style={{ padding: 24, background: '#fff' }}>
                            <UserContext.Consumer>
                                {({user})=>{
                                    console.log(user);
                                    if(user===null) return null;
                                    return(
                                        <Switch>
                                            <Redirect from='/account' exact to='/account/personal-center'/>
                                            <Route path='/account/my-focus'  render={()=><MyFocus user={user}/>} />
                                            <Route path='/account/my-product' render={()=><MyProduct user={user}/>} />
                                            <Route path='/account/order-center' render={()=><OrderCenter user={user}/>}/>
                                            <Route path='/account/personal-center' render={()=><PersonalCenter user={user}/>}/>
                                            <Route path='/account/publish-goods' render={()=><PublishGoods user={user}/>}/>
                                        </Switch>
                                    )
                                }}
                            </UserContext.Consumer>

                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>©2019 Created by heypin</Footer>
                </Layout>
            </Layout>
        )
    }
}


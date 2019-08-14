import React from 'react'
import {Layout, Menu, Icon, Input, Button} from 'antd';
import './home.less'
import MainContent from './content'
import Request from '../../api'
import LoginForm from '../../components/login/login'
import RegisterForm from '../../components/register/register'
import  logo from '../../assets/img/logo.png'
import {UserContext} from "../../App";
import Constant from '../../utils/constant'
import {Link} from "react-router-dom";
const { Search  } = Input;
export  default  class Home extends React.Component{

    constructor(props) {
        super(props);
        this.state = { goods: {records: [], total: 0}};
        this.goodsMenu = {};
        this.selectedMenuKey="0";
    }

    loadData= async ()=>{
        const result = await Request.getLatestGoods(0,1,20);
        this.setState({goods:result});
        this.goodsMenu["0"]=result;
    };
    onPageChange=async (pageNumber)=> {
        let key=this.selectedMenuKey;
        const result = await Request.getLatestGoods(key,pageNumber,20);

        this.goodsMenu[key]=result;
        this.setState({goods:result});
    };
    searchGoods=async (value)=>{
        const result = await Request.getSearchResult(value,1,20);
        this.setState({goods:result});

    };

    componentDidMount() {
        this.loadData();
    };

    handleLogout = (changeLoginState) => {
        changeLoginState({user: null});
        window.localStorage.removeItem("user_token");

    };
    onMenuItemClick=async (config)=>{
        let {key}=config;
        this.selectedMenuKey=key;
        if(this.goodsMenu[key]===undefined){
            const result = await Request.getLatestGoods(key,1,20);
            this.goodsMenu[key]=result;
        }
        this.setState({goods:this.goodsMenu[key]})
    };
    render() {
        const { Header, Footer, Sider, Content } = Layout;
        return (
            <div className='home'>
                <Layout className='container'>
                    <Header className='header' style={{ position: 'fixed', zIndex: 1, width: 1000 }}>
                        <div className="nav">
                            <div className="logo">
                                <img src={logo} alt="logo"/>
                                <span>xxx</span>
                            </div>
                            <Search className="search" style={{width: "300px"}} placeholder="搜索" size='large'
                                    onSearch={this.searchGoods} enterButton/>

                            <UserContext.Consumer>
                                {
                                    ({user, changeLoginState}) => {
                                        if (user===null) {
                                            return (
                                                <div className="right">
                                                    <LoginForm className="login" changeLoginState={changeLoginState}/>
                                                    <RegisterForm className="register"/>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div className="right-haslogin">
                                                    <Link to={{pathname:'/account'}}>
                                                        <img src={user.userAvatarUrl?Constant.BaseAvatar + user.userAvatarUrl:""} className="avatar"/>
                                                        <span>{user.username}</span>
                                                    </Link>
                                                    <Button type="link" onClick={()=>this.handleLogout(changeLoginState)}>退出</Button>
                                                </div>
                                            )
                                        }
                                    }
                                }
                            </UserContext.Consumer>

                        </div>
                    </Header>
                    <Layout className='body'>
                        <Sider className='sider' style={{overflow: 'auto', height: '100vh', position: 'fixed', }}>
                            <Menu defaultSelectedKeys={['0']}  mode="inline" theme="light" onClick={this.onMenuItemClick}>
                                <Menu.Item key="0"><i className="iconfont icon-huo"/>最新发布</Menu.Item>
                                <Menu.Item key="1"><i className="iconfont icon-shuma-xiangji"/>闲置数码</Menu.Item>
                                <Menu.Item key="2"><i className="iconfont icon-yundong"/>运动户外</Menu.Item>
                                <Menu.Item key="3"><i className="iconfont icon-dianqi"/>电器日用</Menu.Item>
                                <Menu.Item key="4"><i className="iconfont icon-tushuguan"/>图书教材</Menu.Item>
                                <Menu.Item key="5"><i className="iconfont icon-yiwu"/>美妆衣物</Menu.Item>
                                <Menu.Item key="6"><i className="iconfont icon-xiuxian"/>休闲娱乐</Menu.Item>
                                <Menu.Item key="7"><i className="iconfont icon-qita"/>其他类别</Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout style={{ marginLeft: 200 }}>
                            <Content className='content' >
                                <MainContent  goods={this.state.goods} onPageChange={this.onPageChange}/>
                            </Content>
                        </Layout>
                    </Layout>

                </Layout>
                <div className='home-footer'>
                    <div >Copyright &copy;2019 heyongpin</div>
                </div>
            </div>

        )
    }
}

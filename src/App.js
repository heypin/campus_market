import React, {Component} from 'react'
import Home from './pages/home/home'
import Admin from './pages/admin/admin'
import Goods  from './pages/goods/goods'
import {BrowserRouter,Route,Switch,Redirect} from "react-router-dom";
import Account from './pages/account/account'
import NotAuthorized from './pages/error/401/401'
import NotFound from './pages/error/404/404'
import Request from './api'
import {message} from "antd";
import Constant from "./utils/constant";
export  const UserContext = React.createContext({
    changeLoginState:()=>{},
    user:null,
    admin:null,
})
export default class App extends Component {

    constructor(props){
        super(props);
        this.state={
            changeLoginState:this.changeLoginState,
            user:null,
            admin:null,
        };
    }
    changeLoginState=(option)=>{
        this.setState(option);
    };
     componentDidMount=async ()=> {
        let user_token=window.localStorage.getItem("user_token");
        let admin_token=window.localStorage.getItem("admin_token");
        if(user_token){
            try{
                const result=await Request.getUserByToken(user_token);
                this.changeLoginState({user:result});
            }catch (e) {
                message.error("请重新登录后操作!");
                window.localStorage.removeItem("user_token");//可能为失效，所以移除
            }
        }
        if(admin_token){
            try{
                const result=await Request.getAdminByToken(admin_token);
                this.changeLoginState({admin:result});
            }catch (e) {
                message.error("请重新登录后操作!");
                window.localStorage.removeItem("admin_token");
            }
        }
    };

    render(){
        return (
            <UserContext.Provider value={this.state}>
                <BrowserRouter>
                    <Switch>
                        <Redirect from='/' exact to='/home'/>
                        <Route path='/home' component={Home}/>
                        <Route path='/account' component={this.state.user===null?NotAuthorized:Account}/>
                        <Route path='/admin'  component={this.state.admin===null?NotAuthorized:Admin}/>
                        <Route path='/goods/:id' component={Goods}/>
                        <Route path='/401' component={NotAuthorized}/>
                        <Route component={NotFound}/>
                    </Switch>
                </BrowserRouter>
            </UserContext.Provider>
        )
    }
}

import './login.less'
import { Form, Icon, Input, Button, Spin,Modal,message } from 'antd';
import {withRouter} from 'react-router-dom'
import React from 'react'
import Request from '../../api'
class NormalLoginForm extends React.Component {
    constructor(prop){
        super(prop);
        this.state={visible: false, confirmLoading: false,};
    }
    showModal = () => {
        this.setState({visible: true,});
    };


    userLogin = async (user) => {
        try{
            this.setState({confirmLoading: true,});
            const result=await Request.userLogin(user);
            window.localStorage.setItem("user_token",result.token);
            this.setState({visible: false, confirmLoading: false,});
            message.success("登录成功!");

            this.props.changeLoginState({user:result.user});//这句一定要放在this.setState之后
        }catch (e) {
            this.setState({confirmLoading: false,});
            message.error("用户名或密码错误！");
        }
    };
    handleAdminLogin=async ()=>{
        try{
            this.setState({confirmLoading: true,});
            const result=await Request.adminLogin({telephone:"13918888888",password:"123456"});
            window.localStorage.setItem("admin_token",result.token);
            this.setState({visible: false, confirmLoading: false,});
            message.success("登录成功!");
            this.props.changeLoginState({admin:result.admin});
            this.props.history.push("/admin");

        }catch (e) {
            this.setState({confirmLoading: false,});
            message.error("用户名或密码错误！");
        }
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.userLogin(values);
            }
        });

    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { visible, confirmLoading } = this.state;
        const formItemLayout = {
            wrapperCol: {
                  span: 16,offset:4 ,
            },
        };
        return (
            <div>
                <Button type="primary" size="large" onClick={this.showModal}>
                    登录
                </Button>
                <Modal title="登录" visible={visible}
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel} footer={null}
                >
                    <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item className="username">
                            {getFieldDecorator('telephone', {
                                rules: [{ required: true, message: '请输入手机号!' },{len:11,message:'请输入11位手机号'},],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="手机号"
                                />,
                            )}
                        </Form.Item >
                        <Form.Item className="password">
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' },{min:6,message:'请输入至少6位密码'},],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item className="login-form-button">
                            <Button type="primary" htmlType="submit" className="login-button">
                                <Spin indicator={<Icon type="loading" spin/>} spinning={confirmLoading}/>登录
                            </Button>
                            <Button type="link" onClick={this.handleAdminLogin} className="admin-button">
                                <Spin indicator={<Icon type="loading" spin/>} spinning={confirmLoading}/>直接进入后台
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>


        );
    }
}

const WrappedNormalLoginForm = withRouter(Form.create()(NormalLoginForm));
export default WrappedNormalLoginForm

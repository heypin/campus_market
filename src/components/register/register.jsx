import {Form, Input, Modal, Button, message,} from 'antd';
import React from 'react';
import './register.less'
import Request from '../../api'
class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        visible: false,
        confirmLoading: false,
    };
    showModal = () => {
        this.setState({visible: true,});
    };
    handleCancel = () => {
        this.setState({visible: false,});
    };
    userRegister=async (user)=>{
        try{
            this.setState({confirmLoading: true,});
            await Request.userRegister(user);
            this.setState({visible: false, confirmLoading: false,});
            message.success("注册成功!");
        }catch (e) {
            this.setState({confirmLoading: false,});
            if(e.response.status===400){
                for(let i in e.response.data){
                    message.error(e.response.data[i]);
                }
            }else {
                message.error("手机号已被注册！");
            }
        }
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.userRegister(values);
            }
        });
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码不一致!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };



    render() {
        const { getFieldDecorator } = this.props.form;
        const { visible, confirmLoading } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 10,
                },
            },
        };

        return (

            <div>
                <Button type="primary" size="large" onClick={this.showModal}>
                    注册
                </Button>
                <Modal title="用户注册" visible={visible} confirmLoading={confirmLoading}
                       onCancel={this.handleCancel} footer = {null}
                >
                    <Form {...formItemLayout} onSubmit={this.handleSubmit} className="registerForm">
                        <Form.Item label="手机号">
                            {getFieldDecorator('telephone', {
                                rules: [
                                    {required: true, message: '请输入手机号!',},
                                    {len:11,message:'请输入11位手机号'},
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="密码" hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [
                                    {required: true, message: '请输入密码',},
                                    {min:6,message:'请输入至少6位密码'},
                                    {validator: this.validateToNextPassword,},
                                ],
                            })(<Input.Password />)}
                        </Form.Item>

                        <Form.Item label="重复密码" hasFeedback>
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {required: true, message: '请重复密码',},
                                    {min:6,message:'请输入至少6位密码'},
                                    {validator: this.compareToFirstPassword,},
                                ],
                            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                        </Form.Item>

                        {/*<Form.Item label="验证码">*/}
                        {/*    <Row gutter={8}>*/}
                        {/*        <Col span={12}>*/}
                        {/*            {getFieldDecorator('captcha', {rules: [{ required: true, message: '请输入验证码' }],})(<Input />)}*/}
                        {/*        </Col>*/}
                        {/*        <Col span={12}>*/}
                        {/*            <Button>获取验证码</Button>*/}
                        {/*        </Col>*/}
                        {/*    </Row>*/}
                        {/*</Form.Item>*/}

                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" className="registerBtn">
                                注册
                            </Button>
                        </Form.Item>
                    </Form>


                </Modal>
            </div>


        );
    }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);
export default WrappedRegistrationForm;

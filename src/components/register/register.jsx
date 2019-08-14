import {Form, Input, Modal, Row, Col, Button,} from 'antd';
import React from 'react';
import './register.less'

class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = () => {
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
    };

    handleCancel = () => {

        this.setState({
            visible: false,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

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
            callback('Two passwords that you enter is inconsistent!');
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
        const { autoCompleteResult } = this.state;
        const { visible, confirmLoading, ModalText } = this.state;

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
                <Modal
                    title="用户注册"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    footer = {null}
                >


                    <Form {...formItemLayout} onSubmit={this.handleSubmit} className="registerForm">
                        <Form.Item label="手机号">
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="密码" hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入密码',
                                    },
                                    {
                                        validator: this.validateToNextPassword,
                                    },
                                ],
                            })(<Input.Password />)}
                        </Form.Item>

                        <Form.Item label="重复密码" hasFeedback>
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请重复密码',
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    },
                                ],
                            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                        </Form.Item>



                        <Form.Item label="验证码">
                            <Row gutter={8}>
                                <Col span={12}>
                                    {getFieldDecorator('captcha', {
                                        rules: [{ required: true, message: '请输入验证码' }],
                                    })(<Input />)}
                                </Col>
                                <Col span={12}>
                                    <Button>获取验证码</Button>
                                </Col>
                            </Row>
                        </Form.Item>



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

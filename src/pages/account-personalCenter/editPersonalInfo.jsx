import React from 'react'
import {Button, Col, Form, Icon, Input, message, Row, Upload} from 'antd'
import Constant from "../../utils/constant";
import Request from '../../api'


class EditPersonalInfo extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            imageUrl:undefined,
        };
    }
    normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    beforeUpload=(file)=> {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'|| file.type === 'image/gif';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片应小于 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.setState({imageUrl:info.file.response.url, loading: false,})
        }
    };
    handleEditPersonalInfo = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                if(typeof values.userAvatarUrl=="object"){
                    values.userAvatarUrl=values.userAvatarUrl[0].response.url;
                }
                try {
                    await Request.editUserInfo(values);
                    message.success("修改成功");
                }catch (e) {
                    if(e.response.status===400){
                        for(let i in e.response.data){
                            message.error(e.response.data[i]);
                        }
                    }else {
                        message.error("手机号已被注册");
                    }
                }
            }
        });
    };
    render() {
        const user=this.props.user;
        const { imageUrl } = this.state;
        const { getFieldDecorator } = this.props.form;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <Form   onSubmit={this.handleEditPersonalInfo} >
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label="头像" >
                            {getFieldDecorator('userAvatarUrl', {
                                getValueFromEvent: this.normFile,
                                initialValue:user.userAvatarUrl,
                            })(
                                <Upload  listType="picture-card" className="avatar-uploader" name="file"
                                         showUploadList={false} action={Constant.UploadAvatar}
                                         beforeUpload={this.beforeUpload} onChange={this.handleChange} accept="image/*"
                                >
                                    {imageUrl ? <img src={Constant.BaseAvatar+imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                </Upload>
                            )}
                        </Form.Item>

                    </Col>
                    <Col span={0}>
                        <Form.Item >
                            {getFieldDecorator('userId', {
                                rules: [{ required: true, message: '请输入ID!' }],
                                initialValue:user.userId
                            })(
                                <Input type="hidden" />,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="用户名">
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                                initialValue:user.username
                            })(
                                <Input />,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8} offset={1}>
                        <Form.Item label="手机号码">
                            {getFieldDecorator('telephone', {
                                rules: [{ required: true, message: '请输入手机号!' },{len:11,message:'请输入11位手机号'},],
                                initialValue: user.telephone
                            })(
                                <Input />,
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="QQ号码">
                            {getFieldDecorator('qqNumber', {
                                initialValue:user.qqNumber
                            })(
                                <Input  />,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8} offset={1}>
                        <Form.Item label="收货地址">
                            {getFieldDecorator('userAddress', {
                                initialValue:user.userAddress
                            })(
                                <Input />,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="确认修改">
                            <Button type="primary" htmlType="submit" >
                                确认修改
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default Form.create()(EditPersonalInfo);

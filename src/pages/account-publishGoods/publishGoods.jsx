import React from 'react'
import './publishGoods.less'
import {Button, Form, Input, InputNumber, message, Icon, Upload,Modal} from 'antd'
import Request from "../../api";
import Constant from "../../utils/constant";

class PublishGoods extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [
                {
                    uid: '-1',
                    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                    response:{url:""}
                },
            ],
        };


    }
    handleChange = (e) =>{
        const {fileList}=e;
        console.log(e);
        this.setState({ fileList })
        console.log(fileList);
    };
    handleSubmit=(e)=>{
        const {fileList}=this.state;
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    if(fileList.length>=1){
                        values.goodsImg=fileList[0].response.url;
                    }
                    if(fileList.length>=2){
                        values.images=[];
                        fileList.forEach((item,index)=>{
                           values.images.push({imgUrl:item.response.url});
                        });
                    }
                    console.log("valuse",values);
                }catch (e) {
                    message.error("修改密码失败,参数错误");
                }
            }
        });
    };
    handleCancel = () => this.setState({ previewVisible: false });
    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const {TextArea}=Input;
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <Form labelCol={{span:3,offset:0}}  wrapperCol={{span:8}}  onSubmit={this.handleSubmit} className="login-form">
                <Form.Item label="商品图片" wrapperCol={{span: 12}}>
                    <Upload
                        action={Constant.UploadImage}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                    >
                        {fileList.length >= 6 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                    </Modal>
                </Form.Item>
                <Form.Item label="商品名称">
                    {getFieldDecorator('goodsName', {
                        rules: [{ required: true, message: '商品名称!' }],
                    })(
                        <Input />,
                    )}

                </Form.Item>
                <Form.Item label="商品价格">
                    {getFieldDecorator('goodsPrice', {
                        rules: [{ required: true, message: '请输入商品价格!' }],
                    })(
                        <InputNumber
                            min={0}
                            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\￥\s?|(,*)/g, '')}
                        />
                    )}
                </Form.Item>
                <Form.Item label="原价">
                    {getFieldDecorator('realPrice')(
                        <InputNumber
                            min={0}
                            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\￥\s?|(,*)/g, '')}
                        />
                    )}
                </Form.Item>
                <Form.Item label="描述">
                    {getFieldDecorator('goodsDescribe', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <TextArea rows={4} />,
                    )}
                </Form.Item>
                <Form.Item wrapperCol={{span:3,offset:3}}>
                    <Button type="primary" htmlType="submit" >
                        发布
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}
const WrappedPublishGoods = Form.create()(PublishGoods);
export default WrappedPublishGoods

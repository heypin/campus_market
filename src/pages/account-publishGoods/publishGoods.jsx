import React from 'react'
import './publishGoods.less'
import {Button, Form, Input, InputNumber, message, Icon, Upload,Modal,Select} from 'antd'
import Request from "../../api";
import Constant from "../../utils/constant";

class PublishGoods extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            isModifyState:false,
            category:[],
        };
    }
    setInitValueWhenUpdate=()=> {
        const goods=this.props.location.state;
        if(goods!==undefined){
            this.props.form.setFieldsValue({
                goodsName:goods.goodsName,
                goodsPrice:goods.goodsPrice,
                goodsRealPrice:goods.goodsRealPrice,
                goodsDescribe:goods.goodsDescribe,
                categoryId:goods.categoryId
            });
            this.setState({
                isModifyState:true,
                fileList:[{
                    uid:"-1",
                    url:Constant.BaseImgUrl+goods.goodsImg,
                    response:{url:goods.goodsImg}}
                ]});
        }

    };

    loadGoodsImages=async ()=> {
        const goods=this.props.location.state;
        if(goods!==undefined){
            const images = await Request.getImagesByGoodsId(goods.goodsId);
            let files=[];
            images.forEach((item,index)=>{
                files.push({
                    uid:(-index-2).toString(),
                    url:Constant.BaseImgUrl+item.imgUrl,
                    response: {url:item.imgUrl}
                })
            });
            this.setState((state)=>{
                return {
                    fileList:state.fileList.concat(files)
                }
            })
        }

    };
    loadAllCategory=async ()=>{
        const result=await Request.getAllCategory();
        this.setState({category:result});
    };
    componentDidMount() {
        this.loadGoodsImages();
        this.loadAllCategory();
        this.setInitValueWhenUpdate();
    }

    handleModifyGoods=async ()=>{
        const {fileList} = this.state;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    if(fileList.length>=1){
                        values.goodsImg=fileList[0].response.url;
                    }
                    values.goodsId=this.props.location.state.goodsId;
                    await Request.modifyGoodsById(values);
                    message.success("商品修改成功!");
                    if(fileList.length>=2){
                        let images=[];
                        for(let i=1;i<fileList.length;i++){
                            images.push({goodsId:values.goodsId,imgUrl:fileList[i].response.url});
                        }
                        try {
                            await Request.addPicture(images);
                            message.success("图片修改成功!");
                        }catch (e) {
                            message.error("图片修改失败");
                        }
                    }
                } catch (e) {
                    if(e.response.status===400){
                        for(let i in e.response.data){
                            message.error(e.response.data[i]);
                        }
                    }else {
                        message.error("商品修改失败");
                    }
                }
            }
        });
    };
    handleChange = (e) =>{
        const {fileList}=e;
        this.setState({ fileList });

    };
    handleSubmit=(e)=>{
        e.preventDefault();
        const {fileList}=this.state;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    if(fileList.length>=1){
                        values.goodsImg=fileList[0].response.url;
                    }
                    const goods=await Request.publishGoods(values);
                    message.success("商品发布成功!");
                    if(fileList.length>=2){
                        let images=[];
                        for(let i=1;i<fileList.length;i++){
                            images.push({goodsId:goods.goodsId,imgUrl:fileList[i].response.url});
                        }
                        try {
                            await Request.addPicture(images);
                            message.success("图片添加成功!");
                        }catch (e) {
                            message.error("商品图片添加失败");
                        }
                    }
                }catch (e) {
                    if(e.response.status===400){
                        for(let i in e.response.data){
                            message.error(e.response.data[i]);
                        }
                    }else {
                        message.error("商品发布失败");
                    }
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
        const user=this.props.user;
        const {TextArea}=Input;
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <Form labelCol={{span:3,offset:0}}  wrapperCol={{span:8}}  onSubmit={this.handleSubmit} >
                <Form.Item label="商品图片" wrapperCol={{span: 20}}>
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
                <Form.Item wrapperCol={{span:0}}>
                    {getFieldDecorator('userId', {
                        rules: [{ required: true, message: '请输入ID!' }],
                        initialValue:user.userId
                    })(
                        <Input type="hidden" />,
                    )}

                </Form.Item>
                <Form.Item label="分类" hasFeedback>
                    {getFieldDecorator('categoryId', {
                        rules: [{ required: true, message: '请选择分类' }],
                    })(
                        <Select placeholder="选择分类">
                            {
                                this.state.category.map((item,index)=>{
                                  return   <Select.Option value={item.categoryId} key={index}>{item.categoryName}</Select.Option>
                                })
                            }
                        </Select>,
                    )}
                </Form.Item>
                <Form.Item label="商品名称">
                    {getFieldDecorator('goodsName', {
                        rules: [{ required: true, message: '请输入商品名称' }],
                    })(
                        <Input />,
                    )}

                </Form.Item>
                <Form.Item label="商品价格">
                    {getFieldDecorator('goodsPrice', {
                        rules: [{ required: true, message: '请输入商品价格' }],
                    })(
                        <InputNumber
                            min={0}
                            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\￥\s?|(,*)/g, '')}
                        />
                    )}
                </Form.Item>
                <Form.Item label="原价">
                    {getFieldDecorator('goodsRealPrice')(
                        <InputNumber
                            min={0}
                            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\￥\s?|(,*)/g, '')}
                        />
                    )}
                </Form.Item>
                <Form.Item label="描述" wrapperCol={{span:16}}>
                    {getFieldDecorator('goodsDescribe', {
                        rules: [{ required: true, message: '请输入商品描述' }],
                    })(
                        <TextArea rows={4} />,
                    )}
                </Form.Item>
                <Form.Item wrapperCol={{span:3,offset:3}}>
                    {
                        this.state.isModifyState ? (
                            <Button type="primary" onClick={this.handleModifyGoods}>
                                确认修改
                            </Button>
                        ) : (
                            <Button type="primary" htmlType="submit">
                                发布
                            </Button>
                        )
                    }

                </Form.Item>
            </Form>
        )
    }
}
const WrappedPublishGoods = Form.create()(PublishGoods);
export default WrappedPublishGoods

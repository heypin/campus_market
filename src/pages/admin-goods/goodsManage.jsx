import React from 'react'
import {Button, Card, Form, Input, message, Pagination, Popconfirm, Table} from "antd";
import moment from "moment"
import {Resizable} from "react-resizable";
import Request from '../../api'
import Constant from "../../utils/constant";

const EditableContext = React.createContext();
const ResizeableTitle = props => {
    const { onResize, width, ...restProps } = props;
    if (!width) {return <th {...restProps} />;}
    return (
        <Resizable width={width} height={0} onResize={onResize} draggableOpts={{ enableUserSelectHack: false }}>
            <th {...restProps} />
        </Resizable>
    );
};
class EditableCell extends React.Component {
    renderCell = ({ getFieldDecorator }) => {
        const {editing, dataIndex, title, inputType, record, index, children, ...restProps} = this.props;
        return (<td {...restProps}>
            {editing ? (
                <Form.Item style={{ margin: 0 }}>
                    {getFieldDecorator(dataIndex, {rules: [{required: true, message: `请输入${title}!`,}],
                        initialValue: record[dataIndex],})(<Input  />)}
                </Form.Item>
            ) : (children)}
        </td>);
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}



class GoodsManage extends  React.Component{
    handleGoodsState=async (goodsId,updateState)=>{
        try{
            let goods={goodsId:goodsId,goodsState: updateState};
            if(updateState===1){
                goods.shelfTime=moment().format('YYYY-MM-DDTHH:mm:ss');
            }
            if(updateState===0){
                goods.offShelfTime=moment().format('YYYY-MM-DDTHH:mm:ss');
            }
            await Request.updateGoodsById(goods);
            this.loadGoodsDataByPage(this.pageNum);
            message.success("操作成功!");
        }catch (e) {
            message.error("操作失败!");
        }

    };
    goodsColumns=[
        {width:100,editable:false,title: '用户ID', dataIndex: 'userId', key: '1',},
        {width:150,editable:true,title: '名称', dataIndex: 'goodsName', key: '2',},
        {width:150,editable:true,title: '图片', dataIndex: 'goodsImg', key: '3',
            render:(text)=>{
                return <img src={Constant.BaseImgUrl+text} style={{width:80,height:80}}/>
            }
        },
        {width:150,editable:true,title: '价格', dataIndex: 'goodsPrice', key: '4',},
        {width:150,editable:true,title: '原价', dataIndex: 'goodsRealPrice', key: '5',},
        {width:150,editable:true,title: '上架时间', dataIndex: 'shelfTime', key: '6',
            render:(text)=>moment(text).format('YYYY-MM-DD HH:mm:ss')},
        {width:150,editable:true,title: '下架时间', dataIndex: 'offShelfTime', key: '7',
            render:(text)=>moment(text).format('YYYY-MM-DD HH:mm:ss')},
        {width:150,editable:true,title: '描述', dataIndex: 'goodsDescribe', key: '8',},
        {width:150,editable:true,title: '状态', dataIndex: 'goodsState', key: '9',
            render: (text,record) => {
                if(text===0) return (<Button type="primary" onClick={()=>this.handleGoodsState(record.goodsId,1)}>上架</Button>);
                else if(text===1) return <Button onClick={()=>this.handleGoodsState(record.goodsId,0)}>下架</Button>;
            },
            filters: [{text: '已下架', value: 0,}, {text: '已上架', value: 1,}],
            onFilter: (value, record) => record.goodsState=== value,
        },
        {title: '操作', key: '10',
            render: (text, record) => {
                const {editingKey} = this.state;
                const editable = this.isEditing(record);
                return(
                    <span>
                            {editable ? (
                                <React.Fragment>
                                    <EditableContext.Consumer>
                                        {form => (
                                            <Popconfirm title="确定保存" onConfirm={() => this.save(form, record.goodsId)}>
                                                <a style={{marginRight: 10}}>保存</a>
                                            </Popconfirm>
                                        )}
                                    </EditableContext.Consumer>
                                    <a onClick={() => this.cancel(record.goodsId)}>取消</a>
                                </React.Fragment>
                            ) : (
                                <a disabled={editingKey !== ''} onClick={() => this.edit(record.goodsId)}>
                                    编辑
                                </a>
                            )
                            }
                        </span>
                );
            },
        },
    ];
    constructor(prop){
        super(prop);
        this.state={goods:{records:[]},editingKey:'',columns:this.goodsColumns};
        this.pageNum=1;
    };

    onSearch=(value)=>{

    };
    loadGoodsDataByPage=async (pageNum)=>{
        const result= await Request.getGoodsListByPage(pageNum,20);
        this.setState({goods:result});
    };
    componentDidMount() {
        this.loadGoodsDataByPage(1);

    };

    onPageChange=(pageNum)=>{
        this.loadGoodsDataByPage(pageNum);
        this.pageNum=pageNum;
        this.cancel();
    };
    isEditing = record => {
        return record.goodsId === this.state.editingKey;
    };
    cancel = () => {
        this.setState({ editingKey: '' });
    };
    save(form, key) {
        form.validateFields(async (error, row) => {
            if (error) {return;}
            const newData = [...this.state.goods.records];
            const index = newData.findIndex(item => { return key === item.goodsId});
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {...item, ...row,});
                try{
                    await Request.updateGoodsById({...item,...row});
                    message.success("更新成功!");
                    this.setState((state)=>{
                        state.goods.records=newData;
                        return {goods: state.goods, editingKey: ''}
                    });
                }catch (e) {

                    this.setState({ editingKey: '' });
                    if(e.response.status===400){
                        for(let i in e.response.data){
                            message.error(e.response.data[i]);
                        }
                    }else {
                        message.error("更新失败!");
                    }
                }

            } else {
                this.setState({ editingKey: '' });
            }
        });
    }
    edit(key) {
        this.setState({ editingKey: key });
    }

    components = {body: {cell: EditableCell}, header:{cell:ResizeableTitle},};
    handleResize = index => (e, { size }) => {
        this.setState(({ columns }) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { columns: nextColumns };
        });
    };

    render() {
        const columns = this.state.columns.map((col,index) => {
            let onCell=undefined;
            if (col.editable) {
                onCell = record => ({
                    record, dataIndex: col.dataIndex, title: col.title, editing: this.isEditing(record),
                })
            }
            return {
                ...col,
                onCell: onCell,
                onHeaderCell:column => ({
                    width: column.width,
                    onResize: this.handleResize(index),
                }),
            };
        });
        return (
            <Card title="商品管理" >
                <EditableContext.Provider value={this.props.form}>
                    <Table columns={columns}
                           bordered={true}
                           rowKey={record=>record.goodsId}
                           dataSource={this.state.goods.records}
                           pagination={
                               <Pagination showQuickJumper defaultCurrent={1} pageSize={20} total={this.state.goods.total}
                                           onChange={this.onPageChange} style={{marginBottom:20,marginTop:20}}/>
                           }
                           components={this.components}
                    />
                </EditableContext.Provider>
            </Card>
        )
    }
}
export default Form.create()(GoodsManage);

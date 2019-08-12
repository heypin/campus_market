import React from 'react'
import {Input, Pagination, Table,Card,Popconfirm, Form, InputNumber} from "antd";
import { Resizable } from 'react-resizable';
import './orderManage.less'
import Request from '../../api'
const {Search}=Input;

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
                        {getFieldDecorator(dataIndex, {initialValue: record[dataIndex],})(<Input style={{width:"100%"}} />)}
                    </Form.Item>
                ) : (children)}
            </td>);
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}
class OrderManage extends  React.Component{
    constructor(prop){
        super(prop);
        this.state={orders:{},editingKey:'',orderColumns:this.orderColumns};
    };
    loadOrderDataByPage=async (pageNum)=>{
      const result= await Request.getOrderListByPage(pageNum,20);
      this.setState({orders:result});
    };
    componentDidMount() {
        this.loadOrderDataByPage(1);
    };

    onPageChange=(pageNum)=>{
        this.loadOrderDataByPage(pageNum);
        this.cancel();
    };
    onSearch=(value)=>{

    };
    isEditing = record => {
        return record.orderId === this.state.editingKey;
    };
    cancel = () => {
        this.setState({ editingKey: '' });
    };
    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {return;}

        });
    }
    edit(key) {
        this.setState({ editingKey: key });
    }
    orderColumns=[
        {width:100,title: '订单编号', dataIndex: 'orderNo', key: 'orderNo',},
        {width:100,title: '用户ID', dataIndex: 'userId', key: 'userId'},
        {width:100,title: '姓名', dataIndex: 'orderName', key: 'orderName',editable:true},
        {width:100,title: '价格', dataIndex: 'orderPrice', key: 'orderPrice',editable:true,
            sorter: (a, b) => a.orderPrice - b.orderPrice,sortDirections: ['descend', 'ascend'],},
        {width:100,title: '手机号', dataIndex: 'orderPhone', key: 'orderPhone',editable:true,},
        {width:100,title: '收货地址', dataIndex: 'orderAddress', key: 'orderAddress',editable:true},
        {width:100,title: '备注', dataIndex: 'orderInformation', key: 'orderInformation',editable:true},
        {width:100,title: '下单时间', dataIndex: 'orderCreatedTime', key: 'orderCreatedTime'},
        {width:100,title: '订单状态', dataIndex: 'orderState', key: 'orderState',editable:true,
            render: (text) => {
                if(text===1) return "待发货";
                else if(text===2) return "待收货";
                else if(text===3) return "已完成";
            },
            filters: [{text: '待发货', value: 1,}, {text: '待收货', value: 2,},{text: '已完成', value: 3,},],
            onFilter: (value, record) => record.orderState=== value,
        },
        {title: '操作', key: 'action',
            render: (text, record) => {
                const {editingKey} = this.state;
                const editable = this.isEditing(record);
                return(
                    <span>
                            {editable ? (
                                <React.Fragment>
                                    <EditableContext.Consumer>
                                        {form => (
                                            <Popconfirm title="确定保存" onConfirm={() => this.save(form, record.orderId)}>
                                                <a style={{marginRight: 10}}>保存</a>
                                            </Popconfirm>
                                        )}
                                    </EditableContext.Consumer>
                                    <a onClick={() => this.cancel(record.orderId)}>取消</a>
                                </React.Fragment>
                            ) : (
                                <a disabled={editingKey !== ''} onClick={() => this.edit(record.orderId)}>
                                    编辑
                                </a>
                            )
                            }
                        </span>
                );
            },
        },
    ];
    components = {
        body: {
            cell: EditableCell
        },
        header:{
            cell:ResizeableTitle
        },
    };
    handleResize = index => (e, { size }) => {
        this.setState(({ orderColumns }) => {
            const nextColumns = [...orderColumns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { orderColumns: nextColumns };
        });
    };
    render() {

        const columns = this.state.orderColumns.map((col,index) => {
            let onCell=undefined;
            if (!col.editable) {
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
            <Card title="订单管理" extra={<Search enterButton="搜索" size="default" onSearch={this.onSearch}/>}>
                <EditableContext.Provider value={this.props.form}>
                    <Table columns={columns}
                           bordered={true}
                           rowKey={record=>record.orderId}
                           dataSource={this.state.orders.records}
                           pagination={
                               <Pagination showQuickJumper defaultCurrent={1} pageSize={20} total={this.state.orders.total}
                                     onChange={this.onPageChange} style={{marginBottom:20,marginTop:20}}/>
                           }
                           components={this.components}
                    />
                </EditableContext.Provider>
            </Card>

        )
    }
}
export default Form.create()(OrderManage);



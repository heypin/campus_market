import React from 'react'
import {Button, Card, Form, Input, message, Pagination, Popconfirm, Table} from "antd";
import {Link} from "react-router-dom";
import {Resizable} from "react-resizable";
import Request from '../../api';
import {random} from "../../App";

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
                    {getFieldDecorator(dataIndex, {rules: [],
                        initialValue: record[dataIndex],})(<Input />)}
                </Form.Item>
            ) : (children)}
        </td>);
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}



class PurseManage extends  React.Component{
    handlePurseState=async (record,state)=>{
      if(state===2){
          try{
              let balance=parseFloat(record.balance);
              let recharge=parseFloat(record.recharge);
              let withdraw=parseFloat(record.withdraw);
              await Request.updatePurseById({purseId:record.purseId, purseState:2,
                  recharge:0,withdraw:0, balance:balance+recharge-withdraw});
              this.loadPurseDataByPage(this.pageNum);
              message.success("操作成功!");

          }catch (e) {
              message.error("操作失败!");
          }
      }
      if(state===3){
          try{
              await Request.updatePurseById({purseId:record.purseId,purseState:3});
              this.loadPurseDataByPage(this.pageNum);
              message.success("操作成功!");

          }catch (e) {
              message.error("操作失败!");
          }

      }
    };
    purseColumns=[
        {width:100,editable:false,title: '用户ID', dataIndex: 'userId', key: '1', },
        {width:150,editable:true,title: '余额', dataIndex: 'balance', key: '2',},
        {width:150,editable:true,title: '申请提现', dataIndex: 'withdraw', key: '3',},
        {width:150,editable:true,title: '申请充值', dataIndex: 'recharge', key: '4',},
        {width:240,editable:true,title: '状态', dataIndex: 'purseState', key: '5',
            render: (data,record) => {
                let text=parseInt(data);
                if(text===0) return "无需审核";
                else if(text===1) return (<div>
                    <Button onClick={()=>this.handlePurseState(record,2)}style={{marginRight:5}}>通过</Button>
                    <Button onClick={()=>this.handlePurseState(record,3)}>不通过</Button>
                </div> );
                else if(text===2) return "已通过";
                else if(text===3) return "不通过";

            },
            filters: [{text: '无需审核', value: 0,},{text: '待审核', value: 1,}, {text: '已通过', value: 2,},{text: '不通过', value: 3,},],
            onFilter: (value, record) => record.purseState=== value,
        },
        {title: '操作', key: '6',
            render: (text, record) => {
                const {editingKey} = this.state;
                const editable = this.isEditing(record);
                return(
                    <span>
                            {editable ? (
                                <React.Fragment>
                                    <EditableContext.Consumer>
                                        {form => (
                                            <Popconfirm title="确定保存" onConfirm={() => this.save(form, record.purseId)}>
                                                <a style={{marginRight: 10}}>保存</a>
                                            </Popconfirm>
                                        )}
                                    </EditableContext.Consumer>
                                    <a onClick={() => this.cancel(record.purseId)}>取消</a>
                                </React.Fragment>
                            ) : (
                                <a disabled={editingKey !== ''} onClick={() => this.edit(record.purseId)}>
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
        this.state={purse:{records:[]},editingKey:'',columns:this.purseColumns};
        this.pageNum=1;
    };
    loadPurseDataByPage=async (pageNum)=>{
        const result= await Request.getPurseListByPage(pageNum,20);
        this.setState({purse:result});
    };
    componentDidMount() {
        this.loadPurseDataByPage(1);
        console.log(random);

    };

    onPageChange=(pageNum)=>{
        this.loadPurseDataByPage(pageNum);
        this.pageNum=pageNum;
        this.cancel();
    };
    onSearch=(value)=>{

    };

    isEditing = record => {
        return record.purseId === this.state.editingKey;
    };
    cancel = () => {
        this.setState({ editingKey: '' });
    };
    save(form, key) {
        form.validateFields(async (error, row) => {
            if (error) {return;}
            const newData = [...this.state.purse.records];
            const index = newData.findIndex(item => { return key === item.purseId});
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {...item, ...row,});
                try{
                    await Request.updatePurseById({purseId:item.purseId,...row});
                    message.success("更新成功!");
                    this.setState((state)=>{
                        state.purse.records=newData;
                        return {purse: state.purse, editingKey: ''}
                    });
                }catch (e) {
                    message.error("更新失败!");
                    this.setState({ editingKey: '' });
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
            <Card title="钱包管理" >
                <EditableContext.Provider value={this.props.form}>
                    <Table columns={columns}
                           bordered={true}
                           rowKey={record=>record.purseId}
                           dataSource={this.state.purse.records}
                           pagination={
                               <Pagination showQuickJumper defaultCurrent={1} pageSize={20} total={this.state.purse.total}
                                           onChange={this.onPageChange} style={{marginBottom:20,marginTop:20}}/>
                           }
                           components={this.components}
                    />
                </EditableContext.Provider>
            </Card>
        )
    }
}
export default Form.create()(PurseManage);

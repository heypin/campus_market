import React from 'react'
import {Button, Card, Form, Input, message, Pagination, Popconfirm, Table} from "antd";
import {Resizable} from "react-resizable";
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



class UserManage extends  React.Component{
    userColumns=[
        {width:100,editable:true,title: '用户名', dataIndex: 'username', key: '1',},
        {width:150,editable:true,title: '密码', dataIndex: 'password', key: '2',},
        {width:150,editable:true,title: '手机号', dataIndex: 'telephone', key: '3',},
        {width:150,editable:true,title: '头像', dataIndex: 'userAvatarUrl', key: '4',},
        {width:150,editable:true,title: '地址', dataIndex: 'userAddress', key: '5',},
        {width:150,editable:true,title: 'QQ号', dataIndex: 'qqNumber', key: '6',},
        {width:150,editable:true,title: '状态', dataIndex: 'userState', key: '7',
            render: (text) => {
                if(text===1) return "正常";
                else if(text===0) return "已冻结";
            },
            filters: [{text: '正常', value: 1,}, {text: '已冻结', value: 0,}],
            onFilter: (value, record) => record.userState=== value,
        },
        {title: '操作', key: '8',
            render: (text, record) => {
                const {editingKey} = this.state;
                const editable = this.isEditing(record);
                return(
                    <span>
                            {editable ? (
                                <React.Fragment>
                                    <EditableContext.Consumer>
                                        {form => (
                                            <Popconfirm title="确定保存" onConfirm={() => this.save(form, record.userId)}>
                                                <a style={{marginRight: 10}}>保存</a>
                                            </Popconfirm>
                                        )}
                                    </EditableContext.Consumer>
                                    <a onClick={() => this.cancel(record.userId)}>取消</a>
                                </React.Fragment>
                            ) : (
                                <a disabled={editingKey !== ''} onClick={() => this.edit(record.userId)}>
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
        this.state={user:{records:[]},editingKey:'',columns:this.userColumns};
    };


    onSearch=(value)=>{

    };
    loadUserDataByPage=async (pageNum)=>{
        const result= await Request.getUserListByPage(pageNum,20);
        this.setState({user:result});
    };
    componentDidMount() {
        this.loadUserDataByPage(1);

    };

    onPageChange=(pageNum)=>{
        this.loadUserDataByPage(pageNum);
        this.cancel();
    };
    isEditing = record => {
        return record.userId === this.state.editingKey;
    };
    cancel = () => {
        this.setState({ editingKey: '' });
    };
    save(form, key) {
        form.validateFields(async (error, row) => {
            if (error) {return;}
            const newData = [...this.state.user.records];
            const index = newData.findIndex(item => { return key === item.userId});
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {...item, ...row,});
                try{
                    await Request.updateUserById({userId:item.userId,...row});
                    message.success("更新成功!");
                    this.setState((state)=>{
                        state.user.records=newData;
                        return {user: state.user, editingKey: ''}
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
                onCell = record => ({record, dataIndex: col.dataIndex, title: col.title, editing: this.isEditing(record),})
            }
            return {...col, onCell: onCell, onHeaderCell:column => ({
                    width: column.width,
                    onResize: this.handleResize(index),}),
            };
        });
        return (
            <Card title="用户管理" >
                <EditableContext.Provider value={this.props.form}>
                    <Table columns={columns}
                           bordered={true}
                           rowKey={record=>record.userId}
                           dataSource={this.state.user.records}
                           pagination={
                               <Pagination showQuickJumper defaultCurrent={1} pageSize={20} total={this.state.user.total}
                                           onChange={this.onPageChange} style={{marginBottom:20,marginTop:20}}/>
                           }
                           components={this.components}
                    />
                </EditableContext.Provider>
            </Card>
        )
    }
}
export default Form.create()(UserManage);

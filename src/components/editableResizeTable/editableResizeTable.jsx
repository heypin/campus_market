// import React from 'react'
// import {Input, Pagination, Table,Card,Popconfirm, Form, InputNumber} from "antd";
// import { Resizable } from 'react-resizable';
// const EditableContext = React.createContext();
// const ResizeableTitle = props => {
//     const { onResize, width, ...restProps } = props;
//     if (!width) {return <th {...restProps} />;}
//     return (
//         <Resizable width={width} height={0} onResize={onResize} draggableOpts={{ enableUserSelectHack: false }}>
//             <th {...restProps} />
//         </Resizable>
//     );
// };
// class EditableCell extends React.Component {
//     renderCell = ({ getFieldDecorator }) => {
//         const {editing, dataIndex, title, inputType, record, index, children, ...restProps} = this.props;
//         return (<td {...restProps}>
//             {editing ? (
//                 <Form.Item style={{ margin: 0 }}>
//                     {getFieldDecorator(dataIndex, {initialValue: record[dataIndex],})(<Input />)}
//                 </Form.Item>
//             ) : (children)}
//         </td>);
//     };
//
//     render() {
//         return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
//     }
// }
// class EditableResizeTable extends React.Component{
//     constructor(prop){
//         super(prop);
//         this.components = {
//             body: {
//                 cell: EditableCell
//             },
//             header:{
//                 cell:ResizeableTitle
//             },
//         };
//     }
//     handleResize = index => (e, { size }) => {
//         this.setState(({ orderColumns }) => {
//             const nextColumns = [...orderColumns];
//             nextColumns[index] = {
//                 ...nextColumns[index],
//                 width: size.width,
//             };
//             return { orderColumns: nextColumns };
//         });
//     };
// }

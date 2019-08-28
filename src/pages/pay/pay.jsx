import React from 'react'

export default class Pay extends React.Component{

    render() {
        if(!this.props.location.goodsDetail) return "请选择商品";
        return (
            <div>12</div>
        )
    }
}

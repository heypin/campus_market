import React from 'react'
import './personalCenter.less'
import {Card, Comment, List, InputNumber, Mentions, Avatar, Icon, Button} from 'antd';
import moment from 'moment';


const data = [
    {
        actions: [<span>回复</span>,<span>查看商品详情</span>,],
        author: 'Han Solo',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content: (
            <p>
                We supply a series of design principles, practical patterns and high quality design
                resources (Sketch and Axure), to help people create their product prototypes beautifully and
                efficiently.
            </p>
        ),
        datetime: moment().format('YYYY-MM-DD HH:mm:ss')
    },

];

export default class PersonalCenter extends React.Component{

    render() {
        return (
                <div>
                    <Card title="我的钱包" >
                        <span style={{marginRight:20}}>钱包余额:</span>
                        <span>信誉积分:</span>
                        <InputNumber
                            defaultValue={1000}
                            min={0}
                            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\￥\s?|(,*)/g, '')}
                            onChange={this.onChange}
                            style={{width:200,marginLeft:100,marginRight:50}}
                        />
                        <Button style={{marginRight:20}}>充值</Button>
                        <Button>提现</Button>
                    </Card>
                    <Card title="回复我的" >
                        <List className="comment-list" header={`${data.length} 回复`} itemLayout="horizontal" dataSource={data}
                              renderItem={item => (
                                  <li>
                                      <Comment
                                          actions={item.actions}
                                          author={item.author}
                                          avatar={item.avatar}
                                          content={item.content}
                                          datetime={item.datetime}
                                      />
                                  </li>
                              )}
                        />
                    </Card>
                </div>



        )
    }
}

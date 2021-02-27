
import React, { Component } from 'react';
import {Button,Input,Modal,message,Icon} from 'antd'
import Frame from '@components/frame'
import './style.less'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            name: '',
            classes: []
        }
    }
    componentDidMount(){
        this.get_classes()
    }
    componentWillUnmount(){

    }
    async get_classes(){
        let res = await Frame.http.getSync(Frame.util.make_url('/get_classes'),{})
        console.log(res)
        let classes = res.body
        classes.sort((a, b)=>{
            return b.create_time - a.create_time
        })
        this.setState({
            classes: res.body
        })
    }
    onCreateClick(){
        this.setState({
            name: '',
            visible: true
        })
    }
    async createPost(){
        if(!this.state.name){
            message.warning("名字不能为空")
            return
        }
        this.setState({
            visible: false
        })
        //http://10.200.3.16:3202
        let res = await Frame.http.postSync(Frame.util.make_url('/create_class'),{name: this.state.name})
        console.log(res)

        await this.get_classes()
    }
    onNameChange(e){
        console.log(e.target.value)
        this.setState({
            name: e.target.value
        })
    }
    render_class_list(){
        let arr = []
        for(let cls of this.state.classes){
            let id = cls._id
            let dateStr = Frame.util.dataFormat(cls.create_time)
            arr.push((
                <div className="item_box" key={id}>
                    <div className="left">
                        <div className="title">{cls.name}</div>
                        <span className="info">
                            <span>id:</span> {id}
                        </span>
                        <span className="info"><span>创建时间:</span> {dateStr}</span>
                    </div>
                    <div className="right">
                        <Button type="primary" onClick={()=>{
                            console.log(cls.id)
                            //window.location.href = Frame.util.make_route('/edit_class')
                            this.props.history.push(`/sections?id=${id}&name=${cls.name}`)
                        }}>编辑课程<Icon type="edit" /></Button>
                    </div>

                </div>
            ))
        }
        return arr
    }
    render() {
        return (
            <div className="home_html">
                <div className="base_page_head">
                    <Button type="primary" onClick={this.onCreateClick.bind(this)}><Icon type="plus" />创建新套课</Button>
                </div>

                {this.render_class_list()}
                <Modal
                    title="创建"
                    visible={this.state.visible}
                    okText={"确认"}
                    cancelText={"取消"}
                    okButtonProps={{ disabled: false }}
                    onOk={()=>{
                        this.createPost()

                    }}
                    onCancel={()=>{
                        this.setState({
                            visible: false
                        })
                    }}
                >
                    套课名称：
                    <Input style={{width: 300}}
                           value={this.state.name}
                           onChange={this.onNameChange.bind(this)}
                    />
                </Modal>
            </div>
        );
    }
}

export default Home;

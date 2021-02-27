
import React, { Component } from 'react';
import {Button,Input,Modal,message,Icon} from 'antd'
import Frame from '@components/frame'
import './style.less'

function get_article(content){
    let article = ''
    for(let con of content){
        if('text' in con){
            article += con.text
        }
    }
    return article
}
class Sections extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            name: '',
            sections: []
        }

        let search = Frame.util.get_url_params(decodeURIComponent(window.location.search))
        console.log(search)
        this.cls_id = search.id
        this.cls_name = search.name
    }
    componentDidMount(){
        this.get_sections()
    }
    componentWillUnmount(){

    }
    async get_sections(){
        let res = await Frame.http.getSync(Frame.util.make_url('/get_sections'),{class_id: this.cls_id})
        console.log(res)
        let sections = res.body
        sections.sort((a, b)=>{
            return b.create_time - a.create_time
        })
        this.setState({
            sections: sections
        })
    }
    onCreateClick(){

        this.props.history.push(`/edit_class?id=${this.cls_id}&name=${this.cls_name}`)
        //window.location.href = `/edit_class?id=${this.cls_id}&name=${this.cls_name}`
    }
    onModifyClick(section_id){
        this.props.history.push(`/edit_class?id=${this.cls_id}&name=${this.cls_name}&section_id=${section_id}&type=modify`)
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

        for(let section of this.state.sections){
            let id = section._id
            let dateStr = Frame.util.dataFormat(section.create_time)
            arr.push((
                <div className="section" onClick={this.onModifyClick.bind(this, id)} key={id}>
                    <div className="title">{section.title}</div>
                    <div className="sub_title">
                        <span>简介：</span>{get_article(section.content)}
                    </div>
                </div>
            ))
        }
        return arr
    }
    render() {
        return (
            <div className="sections_html">
                <div className="base_page_head">
                    <div className="class_name">{this.cls_name}</div>
                </div>
                <div className="section_list">
                    <div className="section" onClick={this.onCreateClick.bind(this)}>
                        <Icon type="plus" className="add_icon"/>
                    </div>
                    {this.render_class_list()}
                </div>

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

export default Sections;

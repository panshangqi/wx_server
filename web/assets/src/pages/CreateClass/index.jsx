
import React, { Component } from 'react';
import {Button,Input,Modal,message,Icon} from 'antd'
import Frame from '@components/frame'
import RichEditer from '@components/RichEditer'
import $ from 'jquery'
import './style.less'

class CreateClass extends Component {
    constructor(props) {
        super(props);
        this.search = Frame.util.get_url_params(decodeURIComponent(window.location.search))
        console.log(this.search)
        this.cls_id = this.search.id
        this.cls_name = this.search.name
        
        this.state = {
            visible: false,
            name: '',
            title: '',
            sub_title: '',
            introduction: '', //简介
            background: {
                image: null,
                extension: null
            },
            rich_text: '',
            classes: []
        }
    }
    componentDidMount(){
        this.get_classes()

    }
    
    componentWillUnmount(){

    }
    async get_classes(){

        let res = await Frame.http.getSync(Frame.util.make_url('/get_classes'),{class_id: this.cls_id})
        console.log(res)
        let class_info = res.body
        let base64str = await Frame.util.toDataUrl(class_info.background['image'])
        this.setState({
            name: class_info.name,
            title: class_info.title,
            sub_title: class_info.sub_title,
            //introduction: class_info.introduction,
            background: {
                image: base64str,
                extension: class_info.background.extension
            }
        })
        this.refs.rich_editer.setHtml(class_info.introduction)
    }
    async toBackClick(){
        let hr = await Frame.util.confirmDialog("提示","返回将不保留任何信息，确定退出？")
        if(hr){
            this.props.history.push(`/home`)
        }
        
    }
    
    onNameChange(e){
        console.log(e.target.value)
        this.setState({
            name: e.target.value
        })
    }
    async onCreateClick(){
        if(!this.state.title){
            message.warning("主标题不能为空")
            return
        }
        if(!this.state.sub_title){
            message.warning("副标题不能为空")
            return
        }
        if(!this.state.background.extension){
            message.warning("背景图片不能为空")
            return
        }
        let rich_text = this.refs.rich_editer.getHtml()
        if(!rich_text){
            message.warning("课程简介不能为空")
            return
        }
        
        let res = await Frame.http.postSync(Frame.util.make_url('/create_class'),{
            data: {
                title: this.state.title,
                sub_title: this.state.sub_title,
                background: this.state.background,
                introduction: rich_text //this.state.introduction
            },
            class_id: this.cls_id,
            action: this.cls_id ? 'modify':'create'
        })
        console.log(res)
        this.props.history.push(`/home`)
    }
    onTitleChange(type, e){
        if(type == 'title') {
            this.setState({
                title: e.target.value
            })
        }else if(type == 'sub_title') {
            this.setState({
                sub_title: e.target.value
            })
        }
    }
    onUploadImageClick(){
        let $contentEle = $('#main_input')
        
        let file=$contentEle.click()
    }
    onChangeImage(){
        // 获取文件信息
        let background = this.state.background
        
        let $contentEle = $('#main_input')
        let file=$contentEle[0].files[0]

        if(file.size > 1024*1024){
            message.warning("图片大小不能超过1MB")
            return
        }

        let suffix = Frame.util.get_file_suffix(file.name)

        // 转化为base64
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload =  (res) => {
            let base = res.target.result
            let con = {}
            con.image = base
            con.extension = suffix

            this.setState({
                background: con
            })
        }
    }
    onTextChange(e){
        
        this.setState({
            introduction: e.target.value
        })
    }
    render() {
        return (
            <div className="create_class_html">
                <div className="base_page_head">
                    <span className="to_back" onClick={this.toBackClick.bind(this)}><Icon type="rollback" />{this.cls_name}</span>
                    <Button type="primary" onClick={this.onCreateClick.bind(this)}>提交</Button>
                </div>
                <div>主标题： <Input value={this.state.title} onChange={this.onTitleChange.bind(this, 'title')} style={{width: 300}}/></div>
                <div className="cut_line"/>
                <div>副标题： <Input value={this.state.sub_title} onChange={this.onTitleChange.bind(this, 'sub_title')} style={{width: 300}}/></div>
                <div className="cut_line"/>
                <div className="main_background">
                    <Button type="primary" className="upload_btn" onClick={this.onUploadImageClick.bind(this)}>
                        <Icon type="upload" />
                        上传背景图片
                    </Button>
                    <span className="tip">图片大小不能超过1M</span>
                    <input type="file" id="main_input" onChange={this.onChangeImage.bind(this)} style={{'display':'none'}}></input>
                    <img src={this.state.background.image}/>
                </div>
                <div className="cut_line"/>
                <div className="introduction" id={'introduction'} >
                    <div className="title_in">课程简介</div>
                    <textarea style={{display: 'none'}} value={this.state.introduction} onChange={this.onTextChange.bind(this)}/>
                    <RichEditer ref="rich_editer"/>
                </div>
                <div className="richEdit">
                    
                </div>
                <Button onClick={()=>{
                    let text = this.refs.rich_editer.getHtml()
                    console.log(text)
                    this.setState({
                        rich_text: text
                    })
                }} >测试</Button>
                <div>
                <div dangerouslySetInnerHTML = {{ __html: this.state.rich_text }} className="context_panel"></div>
                </div>
            </div>
        );
    }
}

export default CreateClass;
/*
<Editor
                        className='min-h300'
                        apiKey='Your_Key'
                        ref='tinyEditor'
                        // automatic_uploads={!false}
                        // images_upload_url={utils.url + '/fileclient-management/api/uploadpic'}
                        // images_upload_handler={this.imagesUploadHandler}
                        // initialValue='<p>在此輸入您的資訊內容</p>'
                        value={this.state.content}
                        init={{
                        min_height: 500,
                        theme: 'modern',
                        // language: 'zh_TW',
                        // skin: 'lightgray',
                        // menubar: false, // 頂部菜單
                        // resize: false, // 右下角調整大小
                        statusbar: false, // 底部狀態欄
                        object_resizing: false, // 禁止設置媒體大小
                        images_upload_url: utils.url + '/fileclient-management/api/uploadpic',
                        images_upload_handler: this.imagesUploadHandler,
                        images_reuse_filename: true,
                        plugins: 'table advlist image lists preview textcolor', // imagetools 圖片編輯工具-剪切、旋轉、設置大小
                        toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | image'
                        // image_description: false, // 图像对话框中的图像描述输入字段
                        // image_caption: true // 圖片下的文字
                        // image_title: true
                        }}
                    />
*/
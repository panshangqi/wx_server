
import React, { Component } from 'react';
import {Button,Input,message,Icon} from 'antd'
import Frame from '@components/frame'
import $ from 'jquery'
import './style.less'
import phone_bg from '@imgs/phone_box.png'
import header_music from '@imgs/header-music.png'
const { TextArea } = Input;




class EditClass extends Component {
    constructor(props) {
        super(props);
        console.log(window.location.search)
        this.search = Frame.util.get_url_params(decodeURIComponent(window.location.search))
        console.log(this.search)
        this.cls_id = this.search.id
        this.cls_name = this.search.name
        this.state = {
            content: [],
            title: '',
            author: '',
            music: {
                audio: '',
                extension: '',
                duration: 0 //音频时间长
            },
            visible: false,
            section_info: null
        }
        
    }
    componentDidMount(){
        this.action = 'create'
        if(this.search.section_id && this.search.type == 'modify'){
            this.action = 'modify'
            this.init()
        }
    }
    componentWillUnmount(){

    }
    async init(){
        let res = await Frame.http.getSync(Frame.util.make_url('/get_sections'),{class_id: this.cls_id, section_id: this.search.section_id})
        console.log(res)
        let section_info = res.body
        let audio_url = section_info.music.audio
        Frame.util.toDataUrl(audio_url, (result)=>{
            this.setState({
                music: {
                    audio: result,
                    extension: section_info.music.extension
                }
            })
        })
        //let audioBase64 = await toDataUrl(audio_url)
        //audioBase64 = audioBase64.replace('mpeg;', 'mp3;')
        //section_info.music.audio = audioBase64
        for(let con of section_info.content) {
            if('image' in con) {
                let base64str = await Frame.util.toDataUrl(con['image'])
                con.image = base64str
            }
        }
        console.log(section_info)
        this.setState({
            section_info: section_info,
            title: section_info.title,
            author: section_info.author,
            content: section_info.content
        })
    }
    async onSubmitClick(){

        if(!this.state.title){
            message.warning("标题不能为空")
            return
        }
        if(!this.state.music.extension){
            message.warning("音乐未选择")
            return
        }
        if(!this.state.music.duration){
            message.warning("正在计算音乐时长")
            return
        }
        if(!this.state.author){
            message.warning("作者不能为空")
            return
        }
        Frame.util.loading(true, '正在发送')
        let title = this.state.title
        let author = this.state.author
        let music = this.state.music
        let content = this.state.content
 
        for(let con of content){
            if('text' in con){
                if(!con.text){
                    message.warning("段落不能为空")
                    return
                }
            }
            else if('image' in con){
                if(!con.extension){
                    message.warning("图片未选择")
                    return
                }
            }
        }
        
        let data = {title, author, music, content}
        console.log(data)
        //
        let res = await Frame.http.postSync(Frame.util.make_url('/create_and_update_section'),{
            data: data, 
            class_id: this.cls_id, 
            section_id: this.search.section_id || '', 
            action: this.action 
        })
        console.log(res)
        Frame.util.loading(false, '正在发送')

        this.props.history.push(`/sections?id=${this.cls_id}&name=${this.cls_name}`)

    }
    onPreviewClick(){
        $('#phone_box').show(500)
    }
    renderPhoneContent(){
        let arr = []
        let index = 10010
        arr.push(
            <div className="article-title" key={index++}>{this.state.title}</div>
        )
        arr.push(
            <div className="music-player" key={index++}>
                <div className="music-header">
                    <img src={header_music}/>
                </div>
                <div className="music-info">
                    <div className="music-title">{this.state.title}</div>
                    <div className="music-author">{this.state.author}</div>
                    <div className="music-progress">
                        <div className="timer">00:00</div>
                        <div className="progress-bar"></div>
                        <div className="timer">00:00</div>    
                    </div>
                </div>
            </div>
        )
        
        for(let con of this.state.content){
            if('text' in con){
                arr.push(
                    <div className="article-text" key={index++}>{con.text}</div>
                )
            }
            else if('image' in con){
                arr.push(
                    <div className="article-image" key={index++}>
                        <img src={con.image}/>    
                    </div>
                )
            }
            
        }

        return arr
    }
    onLoadedmetadata(e){
        console.log(e)
        let time = $('#audio_mp3')[0].duration
        console.log(time)
        let music = this.state.music
        music.duration = time
        this.setState({
            music: music
        })
    }
    onChangeAudio(e){
        let file = document.getElementById('audio_upload').files[0]
        console.log(file)
        if(file.size > 1024*1024*10){
            message.warning("音频大小不能超过10MB")
            return
        }

        let suffix = Frame.util.get_file_suffix(file.name)
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload =  (res) => {
            let base = res.target.result
            this.setState({
                music: { audio: base, extension: suffix }
            })
            $('#audio_mp3').attr('src', base)
        }
    }
    onUploadImageClick(key, e){
        let $contentEle = $('#content-eles-'+key)
        let file=$contentEle.find('input')[0].click()
    }
    onChangeImage(key, e){
        // 获取文件信息
        let content = this.state.content
        let con = content[key]
        
        let $contentEle = $('#content-eles-'+key)
        let file=$contentEle.find('input')[0].files[0]

        // 每个 file 对象包含了下列信息:
        // name: 文件名.
        // lastModified: UNIX timestamp 形式的最后修改时间.
        // lastModifiedDate: Date 形式的最后修改时间.
        // size: 文件的字节大小.
        // type: 文件类型.
        console.log(file)
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
            con.image = base
            con.extension = suffix

            this.setState({
                content: content
            })
        }

        // 获取/限制图片尺寸
        // let myimg = URL.createObjectURL(file);
        // let img = new Image();
        // img.src = myimg;
        // img.onload = function () {
        //     if (img.width !== 860 && img.height !== 450) {
        //         alert("只能上传860*450px的图片！");
        //     } else {
        //         // 操作……
        //         // 还可以根据file.type判断类型，根据file.size限制判断字节,1M = 1024 * 1024
        //         const formdata = new FormData()
        //         formdata.append('file', file)
        //         // 调接口，data为formdata
        //     }
        // }
        console.log(key)
    }
    addText(){
        
        let content = this.state.content
        content.push({
            'text': null
        })
        this.setState({
            content: content
        })
    }
    addImage(){
        let content = this.state.content
        content.push({
            'image': null
        })
        this.setState({
            content: content
        })
    }
    //<TextArea value={value} onChange={this.onChange} placeholder="" autoSize={{ minRows: 3, maxRows: 5 }} />
    onTextChange(key, e){
        //console.log(key)
        let content = this.state.content
        content[key].text = e.target.value
        //console.log(key, e.target.value)
        this.setState({
            content: content
        })
    }
    onOpClick(type, id){
        let content = this.state.content
        let total = content.length
        
        if(type == 'up' && id > 0){
            let x = id - 1
            let y = id
            let temp = content[id-1]
            content[id-1] = content[id]
            content[id] = temp
        }else if(type == 'down' && id + 1 < total){
            let x = id - 1
            let y = id
            let temp = content[id+1]
            content[id+1] = content[id]
            content[id] = temp
        }else if(type == 'del'){
            content.splice(id, 1)
        }

        this.setState({
            content: content
        })
    }
    renderOpBtns(key){
        let up_classname = "op_button"
        let down_classname = up_classname
        if(key == 0){
            up_classname += " disable"
        }
        if(key == this.state.content.length - 1){
            down_classname += ' disable'
        }

        return (
            <div>
                <Icon type="arrow-up" className={up_classname} onClick={this.onOpClick.bind(this, 'up', key)}/>
                <Icon type="arrow-down" className={down_classname} onClick={this.onOpClick.bind(this, 'down', key)} />
                <Icon type="close" className="op_button delete" onClick={this.onOpClick.bind(this, 'del', key)}/>
            </div>
        )
    }
    renderContent(){
        let arr = []
        let key = 0
        let total = this.state.content.length
        for(let ele of this.state.content){
            if('image' in ele){
                arr.push((
                    <div className="content-eles" id={'content-eles-'+key} key={key} tag="image">
                        <div className="left_btns">
                            <Button type="primary" className="upload_btn" onClick={this.onUploadImageClick.bind(this, key)}>
                                <Icon type="upload" />
                                上传
                            </Button>
                            <span className="tip">图片大小不能超过1M</span>
                            <input type="file" onChange={this.onChangeImage.bind(this, key)} style={{'display':'none'}}></input>
                            <img src={ele.image}/>
                        </div>
                        <div className="op_btns">
                            {this.renderOpBtns(key)}
                        </div>
                    </div>
                ))
            }else if('text' in ele){
                arr.push((
                    <div className="content-eles" id={'content-eles-'+key} key={key} tag="text" >
                        <div className="left_btns">
                            文本：
                            <textarea value={ele.text} onChange={this.onTextChange.bind(this, key)}/>
                        </div>
                        <div className="op_btns">
                            {this.renderOpBtns(key)}
                        </div>
                    </div>
                ))
            }
            
            //console.log(ele)
            key++
        }
        return arr
    }
    onTitleChange(e){
        this.setState({
            title: e.target.value
        })
    }
    onAuthorChange(e){
        this.setState({
            author: e.target.value
        })
    }
    async toBackClick(){
        let hr = await Frame.util.confirmDialog("提示","返回将不保留任何信息，确定退出？")
        if(hr){
            this.props.history.push(`/sections?id=${this.cls_id}&name=${this.cls_name}`)
        }
        
    }
    
    render() {
        return (
            <div className="edit_html">
                <div className="base_page_head">
                    <span className="class_name" onClick={this.toBackClick.bind(this)}><Icon type="rollback" />{this.cls_name}</span>
                    <Button type="primary" onClick={this.onSubmitClick.bind(this)}>提交</Button>
                    <Button type="primary" onClick={this.onPreviewClick.bind(this)} style={{marginLeft: 20}}>手机效果预览</Button>
                </div>
                <div>标题： <Input value={this.state.title} onChange={this.onTitleChange.bind(this)} style={{width: 300}}/></div>
                <div className="cut_line"/>
                <div>作者： <Input value={this.state.author} onChange={this.onAuthorChange.bind(this)} style={{width: 300}}/></div>
                <div className="cut_line"/>
                <div className='audio_box'>音频：
                    <input type="file" id="audio_upload" onChange={this.onChangeAudio.bind(this)}></input>

                    <audio controls 
                            id="audio_mp3" 
                            className="audio_play" 
                            src={this.state.music.audio}
                            onLoadedMetadata={this.onLoadedmetadata.bind(this)}
                    >
                        <source type="audio/mpeg"/>
                    </audio>
                    <span className="tip">音频大小不能超过10M</span>
                </div>
                <div className="cut_line"/>
                <div className="edit_content">内容：
                    <Button type="primary" onClick={this.addImage.bind(this)}>插入图片</Button>
                    <Button type="primary" style={{marginLeft: 20}} onClick={this.addText.bind(this)}>插入文字</Button>
                </div>

                {
                    this.renderContent()
                }

                <div className="phone_box"
                    id="phone_box"
                    onClick={()=>{
                        $('#phone_box').hide(500)
                    }}
                >
                    <img className="phone_bg" src={phone_bg}>
                    </img>
                    <div className="phone_content">
                        {this.renderPhoneContent()}
                    </div>
                </div>

            </div>
        );
    }
}

export default EditClass;

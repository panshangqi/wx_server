
import React, { Component } from 'react';
import {Button,Input,Modal,Icon} from 'antd'
import Frame from '@components/frame'
import $ from 'jquery'
import './style.less'


class Login extends Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            svg_code: ''
        };
    }
    componentDidMount(){
        
        
    }
    
    componentWillUnmount(){
        
    }
   
    onSVGCODEChange(e){
        console.log(e.target.value)
        let scv_code = e.target.value
        let svg_str = e.target.value
        
        let final = ''
        let img_url = ''
        if(svg_str != ''){
            svg_str = svg_str.replace(/</g, "%3C")
            svg_str = svg_str.replace(/>/g, "%3E")
            svg_str = svg_str.replace(/\"/g, "'")
            svg_str = svg_str.replace(/#/g, "%23")
            
            //console.log(svg_str)
            img_url = 'data:image/svg+xml,' + svg_str
            final = 'background-image: url("data:image/svg+xml,' + svg_str + '");'
        }
        //console.log(final)
        this.setState({
            svg_code: scv_code,
            css_code: final
        })

        $('#show_icon').css('background-image', `url("${img_url}")`)
    }
    render() {
        return (
            <div id="svg_wcss_html">
                <textarea class="svg_code" placeholder="请输入svg 代码" value={this.state.svg_code} onChange={this.onSVGCODEChange.bind(this)}></textarea>
                <div className="cut_line" />
                <textarea class="css_code" value={this.state.css_code}></textarea>
                <div className="cut_line" />
                <div className="show_icon" id="show_icon" />
            </div>
        );
    }
}

export default Login;

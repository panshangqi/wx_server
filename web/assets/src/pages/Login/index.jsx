
import React, { Component } from 'react';
import {Button,Input,Modal,Icon} from 'antd'
import Frame from '@components/frame'
import './style.less'

function alert_error(msg) {
    return (
        Modal.error({
            title: '提示',
            content: msg,
            width: 500,
            onOk: () => {}
        })
    );
}
class Login extends Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            username: '',
            password: ''
        };
    }
    componentDidMount(){
        
        this.checkLogin()
    }
    async checkLogin(){
        let hr = await Frame.http.getSync('/client/check/login/status')
        console.log('login status', hr)
        if(hr && hr.type == 'AJAX' && hr.body.status == 'success'){
            this.props.history.push(`/home`)
        }
    }
    componentWillUnmount(){
        
    }
    async login() {

        let res = await Frame.http.postSync('/client/login',{
            username: this.state.username,
            password: this.state.password
        })
        console.log(res)
        if(res && res.type == 'AJAX' && res.body.success == 'yes') {
            Frame.cookies.set_cookies({
                token: res.body.token,
                username: res.body.username
            })
            this.props.history.push(`/home`)
            return
        }else{
            alert_error('登录失败，请检查账号密码是否正确')
        }
        
    }
   
    render() {
        return (
            <div id="login_html">
                
                <div className="main_logo">
                
                </div>
                <div className="title">长青微信小程序中台配置系统</div>
                <div className="input_info">
                    <Input 
                    placeholder="请输入账号"
                    value={this.state.username} 
                    onChange={(e)=>{
                        this.setState({
                            username: e.target.value
                        })
                    }}/>
                </div>
                <div className="input_info">
                    
                    <Input.Password placeholder="请输入密码" value={this.state.password} onChange={(e)=>{
                        this.setState({
                            password: e.target.value
                        })
                    }}/>
                </div>
                <div className="input_info">
                    <Button
                        className="login_btn"
                        type="primary"
                        onClick={this.login.bind(this)}
                        style={{width: '100%'}}
                    >登 录</Button>
                </div>
            </div>
        );
    }
}

export default Login;

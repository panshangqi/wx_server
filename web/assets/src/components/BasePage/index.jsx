
import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import {Link} from 'react-router-dom';
import Frame from '@components/frame'
import $ from 'jquery'

const { Header, Sider, Content } = Layout;
import './style.less'
let menu_config = [
    {key: '0' , route: '/home', icon: 'windows', name: '首页'},
    //{key: '1' , route: '/edit_class', icon: 'edit', name: '编辑课程'}
]
class BasePage extends Component {
    constructor(props) {
        super(props);
        console.log(window.location)
        this.state = {
            collapsed: false,
            selectKey: '0',
            head_width: $(window).width()-200
        }
    }
    componentDidMount(){
        let cur_route = window.location.pathname
        // if(cur_route == '/login'){
        //     $('#logout_button').hide()
        // }else{
        //     $('#logout_button').show()
        // }
        for(let cf of menu_config){
            console.log(cf, cur_route)
            if(cur_route == cf.route){
                
                this.setState({
                    selectKey: cf.key
                })
                break;
            }
        }
        $(window).resize(()=>{
            this.setState({
                head_width: $(window).width - 200
            })
        })
    }
    componentWillUnmount(){

    }
    onMenuItemClick({ item, key, keyPath, domEvent }){
        console.log(key)
        this.setState({
            selectKey: key
        });
    }
    toggle () {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    async onLogoutClick(){
        let userinfo = Frame.cookies.get_cookies()
        console.log(userinfo)
        if(!userinfo){
            return
        }
        let cf = await Frame.util.confirmDialog('提示', '确定退出？')
        if(cf){
            console.log('退出')
            let res = await Frame.http.postSync(Frame.util.make_url('/logout'),{
                username: userinfo.username
            })
            console.log(res)
            Frame.cookies.del_cookies()
            //this.props.history.push(`/login`)
            window.location.href='/login'
        }
    }
    render() {
        return (
            <div className="base_page_html">
                <Layout>
                    <Sider trigger={null} collapsible collapsed={this.state.collapsed} width="200">
                        <div className="base_page_logo"/>
                        <Menu theme="dark" mode="inline"
                              defaultSelectedKeys={[this.state.selectKey]}
                              onSelect={this.onMenuItemClick.bind(this)}
                              selectedKeys={[this.state.selectKey]}
                        >
                            {
                                menu_config.map((item)=>{
                                    return (
                                        <Menu.Item key={item.key}>
                                            <Link to={item.route}><Icon type={item.icon} />{item.name}</Link>
                                        </Menu.Item>
                                    )
                                })
                            }
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', 
                                        padding: 0, 
                                        position: 'fixed', 
                                        zIndex: 1, 
                                        width: this.state.head_width, 
                                        marginLeft: 0,
                                        borderBottom: '1px solid #aaa'}}>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle.bind(this)}
                                style={{marginLeft: 20}}
                            />

                            <div className="logout_button" id="logout_button" onClick={this.onLogoutClick.bind(this)}>
                                <Icon type="logout" className="icon"/>
                                退出
                            </div>
                        </Header>
                        <Content
                            style={{
                                margin: '90px 15px 30px',
                                padding: 24,
                                background: '#fff',
                                Height: 800,
                                minHeight: 700
                            }}
                        >
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default BasePage;

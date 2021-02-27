
import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import {Link} from 'react-router-dom';
import Frame from '@components/frame'

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
            selectKey: '0'
        }
    }
    componentDidMount(){
        let cur_route = window.location.pathname
        for(let cf of menu_config){
            console.log(cf, cur_route)
            if(cur_route == cf.route){
                console.log('++++++++++++++++++++++++')
                this.setState({
                    selectKey: cf.key
                })
                break;
            }
        }
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
    render() {
        return (
            <div className="base_page_html">
                <Layout>
                    <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
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
                        <Header style={{ background: '#fff', padding: 0, position: 'fixed', zIndex: 1, width: '100%', borderBottom: '1px solid #aaa'}}>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle.bind(this)}
                                style={{marginLeft: 20}}
                            />
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

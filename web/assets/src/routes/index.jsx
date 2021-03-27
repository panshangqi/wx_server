import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router,Route,Redirect, Link, Switch} from 'react-router-dom';
import { createHashHistory, createBrowserHistory } from 'history';
import 'antd/dist/antd.less'
import './index.less'
import Login from '@pages/Login'
import Home from '@pages/Home'
import EditClass from '@pages/EditClass'
import Sections from '@pages/Sections'
import CreateClass from '@pages/CreateClass'
import SVG_SCSS from '@pages/SVG_SCSS'
import BasePage from '@components/BasePage'
import Frames from '@components/frame'

var history = createBrowserHistory();
//loading-component 动态组件加载
//使用 react-loadable 动态 import React 组件，让首次加载时只加载当前路由匹配的组件。
document.onreadystatechange = function () {
    console.log(document.readyState);
    if(document.readyState === 'complete') {

    }else{

    }
}


class AuthRouteEx extends React.Component {
    constructor() {
        super();
        this.state = {
            
        };
    }
    componentDidMount(){
        console.log('init auth routeex')
        //this.init()
    }
    /*
    async init() {
        let hr = await YQ.http.getSync(YQ.util.make_url('/check/login/status'))
        console.log('login status', hr, window.location.pathname)
        if(hr.status != 'success'){
            return
        }
        let res = await YQ.http.getSync(YQ.util.make_url('/light_support/user/info-userid'),{})
        console.log(res)
        res.status = 1
        if(res.status == 2){
            await ApplyingAuth()
            return
        }
        if(res.status == 3){
            await applayAuth()
            return
        }

        let roles = []
        if(res.roles.indexOf('super_admin')>-1){
            roles = ['super_admin', 'admin', 'user']
        }else if(res.roles.indexOf('admin')>-1){
            roles = ['admin', 'user']
        }else if(res.roles.indexOf('user')>-1){
            roles = ['user']
        }
        this.setState({
            roles: roles
        })
    }
    */
    //路由权限校验
    PrivateRoute ({component:Component, ...rest}) {
        if(Frames.cookies.get_cookies() !== null){
            //console.log(this.state.roles, Role)
            return (
                <Route {...rest} render={ (props) => {
                    return <Component {...props} />
                }}
                />
            )
        }else{
            return (<div>登录失效, 请重新登录&nbsp;<Link to='/login'>去登录</Link></div>)
        }
    }
    render() {
        return (
            <Router history={history}>
                <BasePage>
                    <Switch>
                        <Route exact path="/login" component={Login}/>
                        <this.PrivateRoute exact path={'/home'} component={Home} />
                        <this.PrivateRoute exact path={"/create_class"} component={CreateClass} />
                        <this.PrivateRoute exact path={"/sections"} component={Sections} />
                        <this.PrivateRoute exact path={"/edit_class"} component={EditClass} />
                        <this.PrivateRoute exact path={"/svg_scss"} component={SVG_SCSS} />
                        <Redirect to="/home" />
                    </Switch>
                </BasePage>
            </Router>
        );
    }
}
ReactDOM.render( <AuthRouteEx />, document.getElementById('root'));
/*

ReactDOM.render(
    <Router history={history}>
        <BasePage>
            <Switch>
                <Route exact path="/home" component={Home}/>
                <Route exact path="/sections" component={Sections}/>
                <Route exact path="/edit_class" component={EditClass}/>
                <Redirect to="/home" />
            </Switch>
        </BasePage>
    </Router>
    , document.getElementById('root'));

*/
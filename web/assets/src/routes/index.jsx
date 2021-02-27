import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router,Route,Redirect, Link, Switch} from 'react-router-dom';
import { createHashHistory, createBrowserHistory } from 'history';
import 'antd/dist/antd.less'
import './index.less'
import Home from '@pages/Home'
import EditClass from '@pages/EditClass'
import Sections from '@pages/Sections'
import BasePage from '@components/BasePage'

var history = createBrowserHistory();
//loading-component 动态组件加载
//使用 react-loadable 动态 import React 组件，让首次加载时只加载当前路由匹配的组件。
document.onreadystatechange = function () {
    console.log(document.readyState);
    if(document.readyState === 'complete') {

    }else{

    }
}
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


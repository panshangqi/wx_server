
import React, { Component } from 'react';
import {Button} from 'antd'
import Frame from '@components/frame'
import './style.less'
import barChartCom from './bar_chart_com'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount(){
        //http://10.200.3.16:3202
        // Frame.http.get('/api/client/check_version_enable',{version: '0.2.0'},function (data) {
        //     console.log(data)
        // })

        barChartCom('bar_charts_example')
    }
    componentWillUnmount(){

    }

    render() {
        return (
            <div className="demo_html">
                <div className="title">Demo</div>
                <h2>Antd Demo</h2>
                <div>
                    <Button type="primary">Primary</Button>
                    <Button>Default</Button>
                    <Button type="dashed">Dashed</Button>
                    <Button type="danger">Danger</Button>
                    <Button type="link">Link</Button>
                </div>
                <h2 style={{marginTop: 50}}>eCharts Demo</h2>
                <div>
                    <div id="bar_charts_example" style={{ width: 400, height: 250 }}></div>
                    <div id="bar_charts_example_3d" style={{ width: 500, height: 250 }}></div>
                </div>

            </div>
        );
    }
}

export default Home;

import echarts from "echarts/lib/echarts";
import 'echarts/lib/chart/bar'
//引入 ECharts 主模块
//import echarts from 'echarts/lib/echarts';
//引入柱状图
// import 'echarts/map/js/china';
// import 'echarts/lib/chart/line';
// import 'echarts/lib/chart/bar';
//
// import 'echarts/lib/chart/scatter'
// import 'echarts/lib/chart/effectScatter'
// import 'echarts/lib/chart/custom'
// import 'echarts/lib/chart/map'
//
// // 引入提示框和标题组件
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/legend';
// import 'echarts/lib/component/grid';
// import 'echarts/lib/component/dataZoom';
// import 'echarts/lib/component/markLine';
var barChartCom = function(ele_id){
    var myChart = echarts.init(document.getElementById(ele_id));
    myChart.setOption({
        color: ['#3398DB'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'直接访问',
                type:'bar',
                barWidth: '60%',
                data:[10, 52, 200, 334, 390, 330, 220]
            }
        ]
    })
}

export default barChartCom;
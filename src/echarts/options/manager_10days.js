import echartConfig from '../config';

/**
 args = {
    data: [20, 36, 80, 156, 165, 175]//必填 数据
  }
 **/

export default args => {
  const getOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
        extraCssText: 'z-index:1',
      },
      grid: {
        top: '4%',
        left: '2%',
        right: '2%',
        bottom: '0%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#c4e1fd',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            color: '#556677',
            fontSize: 12,
            margin: 15,
          },
          splitLine: {
            show: true,         //x轴切割线是否显示
            lineStyle: {
              color: '#c4e1fd'    //x轴切割线颜色
            }
          },
          axisPointer: {
            label: {
              padding: [0, 0, 10, 0],
              margin: 15,
              fontSize: 12,
              backgroundColor: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#c4e1fd',
                  },
                  {
                    offset: 0.86,
                    color: '#c4e1fd',
                  },
                  {
                    offset: 0.86,
                    color: '#c4e1fd',
                  },
                  {
                    offset: 1,
                    color: '#c4e1fd',
                  },
                ],
                global: false,
              },
            },
          },
          data: args.xAxisData || []
          // boundaryGap: false,
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#c4e1fd',
            },
          },
          axisLabel: {
            color: '#556677',
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: args.seriesName,
          type: 'bar',
          data: args.data || [],
          symbolSize: 0,
          symbol: 'circle',
          smooth: true,
          yAxisIndex: 0,
          // showSymbol: false,
          lineStyle: {
            width: 5,
            color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
              {
                offset: 0,
                color: '#1f94f3',
              },
              {
                offset: 1,
                color: '#40acfb',
              },
            ]),
            shadowColor: 'rgba(115,221,255, 0.3)',
          },
          itemStyle: {
            color: '#40acfb',
            borderColor: '#40acfb',
          },
        },
      ],
    }
  };

  const getEventCallbacks = () => {
    return []
  };

  return {
    option: getOption(),
    eventCallbacks: getEventCallbacks()
  }
}

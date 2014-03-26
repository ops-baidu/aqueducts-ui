Highcharts.setOptions(
  global : 
    useUTC : false
)
jQuery ->
  ## main var 
  root_url = '/v1/events?'
  static_chart = "static_chart"
  dynamic_chart = "dynamic_chart"

  credits = 
    enabled: true
    href: "http://7.genius.in.baidu.com:8080"
    style:
      color: 'blue'
    text: "Aqueducts"

  ## get data from rails view  
  product =  $('#info').data('product')
  service = $('#info').data('service')

  showChart = -> 
    chart = $(this).closest('.chart')
    item = chart.data('item')
    calculation = chart.data('calculation')
    ## main configration
    ajax_params= (from, to, unit) ->
      product: product
      service: service
      item: item
      calculation: calculation
      from: from
      to: to
      period: unit
      #realtime: realtime

    ## static chart
    $.ajax
      type: 'GET',
      url: root_url
      data: ajax_params("-36h","now", "60")
      success: (data) ->
        $("##{static_chart}_#{item}_#{calculation}").highcharts 'StockChart',
          rangeSelector : 
            phpselected : 1
          title : 
            text : 'Non-realtime'
          series : [
            name : item
            data : data
          ]
          credits: credits
      tooltip: 
        valueDecimals: 2

    ## dynamic chart
    $("##{dynamic_chart}_#{item}_#{calculation}").highcharts
      chart: 
        type: 'arearange'
        animation: Highcharts.svg
        marginRight: 10
        events: 
          load: ->
            series = this.series[0]
            setInterval( -> 
              $.ajax
                type: 'GET',
                url: root_url
                data: ajax_params("-16s","now","1")
                success: (data) ->
                  console.log(data)
                  if data[data.length - 1] != series[series.length - 1]
                    series.addPoint( [ data[data.length - 1][0] , data[data.length - 1][1] ], true, true)
            , 2000)
      title: 
        text: 'Realtime'
      xAxis: 
        type: 'datetime'
        tickPixelInterval: 75
      yAxis: 
        min: 0
        title: 
          text: item
      legend: 
        enabled: false
      exporting: 
        enabled: false
      series: [
        enabled: false
        name: item
        type: 'areaspline' 
        marker: 
          enabled: false
        data: ( ->
          data = []
          origin_data = ( ->
            json = null
            $.ajax({
              async: false
              global: false
              url: root_url
              dataType: "json"
              data: ajax_params("-16s","now","1")
              success: (data) -> 
                json = data.slice -60
            })
            return json
          )()
          j = -60
          for i in origin_data
            data.push 
              x: i[0]
              y: i[1]
            j = j + 1 
          return data
        )()
      ]
      tooltip:
        crosshairs:
          enable: true
          width: 2
      credits: credits
      plotOptions: 
        areaspline: 
          fillColor: 
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1}
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
         lineWidth: 1
         marker: 
           enabled: true
           radius: 1
         shadow: false
         states: 
           hover: 
             lineWidth: 1
         threshold: null

  $('.chart').on('show.chart', showChart)
  $('.chart').trigger('show.chart')


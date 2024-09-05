export const tagTreeData = [{
    id: 11,
    label: '号码归属地',//两个时间也是单选
    disabled: true,
    selectedChildId: null,
    children: [{
        id: 'province_name',
        label: '省份'
    }, {
        id: 'city_name',
        label: '市'
    }, {
        id: 'town_name',
        label: '区县'
    }]
},{
    id: 22,
    label: '投诉来源',
    children: [{
        id: 'source_code_level1',
        label: '投诉一级来源'
    }, {
        id: 'source_code_level2',
        label: '投诉二级来源'
    }, {
        id: 'source_code_level3',
        label: '投诉三级来源'
    }]
},
{
    id: 55,
    label: '投诉现象',
    children: [{
        id: 'complaint_phenomenon_level1',
        label: '投诉一级现象'
    }, {
        id: 'complaint_phenomenon_level2',
        label: '投诉二级现象'
    }, {
        id: 'complaint_phenomenon_level3',
        label: '投诉三级现象'
    }]
},
{
    id: 66,
    label: '投诉原因',
    children: [{
        id: 'reason_level1',
        label: '投诉一级原因'
    }, {
        id: 'reason_level2',
        label: '投诉二级原因'
    }, {
        id: 'reason_level3',
        label: '投诉三级原因'
    }]
},
{
    id: 77,
    label: '投诉产品',
    children: [{
        id: 'product_level1',
        label: '投诉一级产品'
    }, {
        id: 'product_level2',
        label: '投诉二级产品'
    }]
},
{
    id: 'cust_type',
    label: '客户类型',
    children: []
},
{
    id: 'user_star_level',
    label: '客户星级',
    children: []
},
{
    id: 33,
    label: '时间类型',//时间查询字段，1为province_order_create_time，2为settlement_time，3为work_archives_time
    children: [{
        id: 'province_order_create_time',
        timeType:'1',
        label: '建单时间'
    }, {
        id: 'settlement_time',
        timeType:'2',
        label: '办结时间'
    }, {
        id: 'work_archives_time',
        timeType:'3',
        label: '归档时间'
    }]
},
{
    id: 44,
    label: '时间分组',//是单选
    disabled: true,
    selectedChildId: null,
    children: [{
        id: '1',
        label: '年'
    }, {
        id: '2',
        label: '月'
    }, {
        id: '3',
        label: '日'
    }]
}
]

export const checkData = [
    {label:'建单总量',id:'create_num'},
    {label:'在途单量',id:'process_num'},
    {label:'超时单量',id:'timeout_num'},
    {label:'办结单量',id:'settlement_num'},
    {label:'归档单量',id:'archives_num'},
    {label:'处理及时率',id:'time_settlement_num'},
    {label:'重复投诉率',id:'repeat_rate'},
    {label:'客户参评率',id:'comment_rate'},
    {label:'回访满意率',id:'satisfied_rate'},
]

export const custTypeData = [
    {label:'政企客户',id:'1000',value:'1000'},
    {label:'公众客户',id:'1100',value:'1100'},
    {label:'转售客户',id:'1200',value:'1200'},
    {label:'其他客户',id:'9900',value:'9900'},

]

export const userStarLevelData = [
    {label:'1星',id:'3100',value:'3100'},
    {label:'2星',id:'3200',value:'3200'},
    {label:'3星',id:'3300',value:'3300'},
    {label:'4星',id:'3400',value:'3400'},
    {label:'5星',id:'3500',value:'3500'},
    {label:'6星',id:'3600',value:'3600'},
    {label:'7星',id:'3700',value:'3700'},

]

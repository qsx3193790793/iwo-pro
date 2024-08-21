export default {
  name: '投诉单详情模板',
  compType: '',
  title: '投诉单详情模板',
  type: 'json',
  json: {
    "form": {
      "eventsType": "事件",
      "interfaceName": null,
      "interfaceReqParams": null,
      "interfaceResParams": null,
      "events": [
        "complaint_init"
      ],
      "eventsFields": [],
      "hiddenFields": [],
      "interfaceCode": null,
      "interfaceReqParamsArray": null,
      "interfaceResParamsArray": null
    },
    "stage": [
      {
        "cId": "FMBlock_ID_ADB0AA5CAA553047119BAE5B902C0D2633C1",
        "name": "FMBlock",
        "compType": "",
        "z_props": {
          "isBtnBlock": "基础",
          "name": "受理信息",
          "subName": ""
        },
        "children": [
          {
            "cId": "FMCascader_ID_29B98840B4F2C344ADAA0DE95140EE763863",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "col": 6,
              "key": "askSourceSrlChain",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "投诉来源",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMCascader",
              "optionsEvent": "complaint_listComplaintSourceTree",
              "checkStrictly": true,
              "valueType": "array"
            },
            "children": []
          },
          {
            "cId": "FMRadio_ID_15C275D2E84ABA47E77A5681EC0EB7C8BD79",
            "name": "FMRadio",
            "compType": "FMRadio",
            "z_props": {
              "col": 6,
              "key": "workorderStrictest",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "0",
              "name": "是否市场最严工单",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "optionsType": "字典",
              "optionsStaticValue": [],
              "optionsDictName": "yes_no",
              "optionsEvent": "",
              "type": "FMRadio"
            },
            "children": []
          },
          {
            "cId": "FMSelect_ID_21DEA64C3ADFFA40F25B655C396AD6BC3BD2",
            "name": "FMSelect",
            "compType": "FMSelect",
            "z_props": {
              "col": 6,
              "key": "workorderStrictestScene",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "市场最严工单场景",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "optionsType": "静态数据",
              "optionsStaticValue": [
                {
                  "label": "业务退订",
                  "value": "业务退订"
                },
                {
                  "label": "套餐变更",
                  "value": "套餐变更"
                },
                {
                  "label": "销户退网",
                  "value": "销户退网"
                },
                {
                  "label": "携号转网",
                  "value": "携号转网"
                },
                {
                  "label": "靓号低消",
                  "value": "靓号低消"
                },
                {
                  "label": "费用争议",
                  "value": "费用争议"
                },
                {
                  "label": "其他",
                  "value": "其他"
                }
              ],
              "optionsDictName": "",
              "optionsEvent": "",
              "type": "FMSelect"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_24220559CBAC5B46EA6895A18D6F3E82089F",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "controlChannel",
              "isRequire": false,
              "isDisable": true,
              "clearable": true,
              "value": "",
              "name": "责任管控渠道",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": null
          },
          {
            "cId": "FMCascader_ID_7EAF3E7DCAEF5745185896EB997CD6D5ADAB",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "col": 6,
              "key": "complaintPhenomenonLevel",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "投诉现象",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [
                "complaint_phenomenon_and_product_change"
              ],
              "eventsFields": [],
              "type": "FMCascader",
              "optionsEvent": "complaint_listComplaintPhenomenonTree",
              "checkStrictly": true,
              "valueType": "array"
            },
            "children": []
          },
          {
            "cId": "FMCascader_ID_D460CE558412F34793DB13148F8F2B1528AC",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "col": 6,
              "key": "productLevel",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "产品",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [
                "complaint_phenomenon_and_product_change"
              ],
              "eventsFields": [],
              "type": "FMCascader",
              "optionsEvent": "complaint_listProductTree",
              "checkStrictly": true,
              "valueType": "array"
            },
            "children": []
          },
          {
            "cId": "FMCascader_ID_3C69F466E0C63E481C6B6D787355C6AE2CA0",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "col": 6,
              "key": "developChannelLevel",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "发展渠道",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMCascader",
              "optionsEvent": "complaint_listChannelTree",
              "checkStrictly": true,
              "valueType": "array"
            },
            "children": []
          },
          {
            "cId": "FMEmpty_ID_C01D326988CDFF4CD6E9E629D6FC83E93C62",
            "name": "FMEmpty",
            "compType": "divider-empty",
            "z_props": {
              "col": 6
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_24AB0B30C08CE047FC3886C09F92EEEFF95A",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "assistStaffId",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "受理工号",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_CE4677D1120D264668B9AF07A5366359A6A2",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "assistStaffName",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "受理员工姓名",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_149388EF69829F47C21A44CDB82A2AF90010",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "opGropName",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "受理团队/班组",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_17043A8B694FFE483F1BC32497AB2B7EFFAC",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "urgencyCount",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "催单次数",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": null
          },
          {
            "cId": "FMTextarea_ID_B07335BBEAB3624E39894CF79432E93A8241",
            "name": "FMTextarea",
            "compType": "FMTextarea",
            "z_props": {
              "col": 24,
              "key": "complaintInfo",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "用户投申诉内容",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMTextarea",
              "rows": 4,
              "maxlength": 0,
              "resize": "none"
            },
            "children": []
          }
        ]
      },
      {
        "cId": "FMBlock_ID_5EB1F6DE987F2947967B30EC623445FB10E0",
        "name": "FMBlock",
        "compType": "",
        "z_props": {
          "isBtnBlock": "基础",
          "name": "回单信息",
          "subName": ""
        },
        "children": [
          {
            "cId": "FMInput_ID_91AFF1E634DD8C423B1A672B8115989A1453",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "timeoutFlag",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "工单超时状态",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_818E8BD9B5802E441A591C4E5CF91650F16B",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "demandTimeLimit",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "工单要求时限",
              "placeholder": "",
              "showCondition": [],
              "relevance": "",
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_6925D5805370BC48C2EA7D3771602CD52ED3",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "nodeCode",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "工单流转状态",
              "placeholder": "",
              "showCondition": [],
              "relevance": "",
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_009EC2EFC8A376488B6B228A20B452FBE784",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "assistStaffId",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "处理员工工号",
              "placeholder": "",
              "showCondition": [],
              "relevance": "",
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_33AFCD8CCFE1F6415A1AF9880AEB1E245B82",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "assistStaffName",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "处理员工姓名",
              "placeholder": "",
              "showCondition": [],
              "relevance": "",
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_8BEA7E8E2F1C4C4655B8B0865AF1CB7E163E",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "assistGroupName",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "处理团队/班组",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": []
          }
        ]
      }
    ]
  }

}

export default {
  title: "投诉单详情模板",
  json: {
    "form": {
      "labelPosition": "right",
      "labelWidth": 110,
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
          "collapsed": false,
          "isBtnBlock": "基础",
          "name": "受理信息",
          "subName": ""
        },
        "children": [
          {
            "cId": "FMCascader_ID_17C31D504E91E14AB2E846B754980F98376F",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "col": 8,
              "key": "problemLanIdChain",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "申告地",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMCascader",
              "optionsEvent": "complaint_hNumber_tree",
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
              "col": 8,
              "key": "workorderStrictest",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "0",
              "name": "是否最严工单",
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
              "col": 8,
              "key": "workorderStrictestScene",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "最严工单场景",
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
            "cId": "FMCascader_ID_29B98840B4F2C344ADAA0DE95140EE763863",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "col": 8,
              "key": "askSourceSrlChain",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "投诉来源",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [
                "complaint_source_change"
              ],
              "eventsFields": [],
              "type": "FMCascader",
              "optionsEvent": "complaint_listComplaintSourceTree",
              "checkStrictly": true,
              "valueType": "array"
            },
            "children": []
          },
          {
            "cId": "FMCascader_ID_7EAF3E7DCAEF5745185896EB997CD6D5ADAB",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "col": 8,
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
              "col": 8,
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
              "col": 8,
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
            "cId": "FMInput_ID_C3281AF1127C414B099A6D80BD8BE041C1B8",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "appealUserName",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "申诉用户姓名",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMDatePicker_ID_1CE283422BD33E464B28B80F18849D327893",
            "name": "FMDatePicker",
            "compType": "FMDatePicker",
            "z_props": {
              "col": 8,
              "key": "appealDate",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "申诉日期",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMDatePicker",
              "limit": "无限制",
              "format": "yyyy-MM-dd HH:mm:ss",
              "dateType": "FMDateTimePicker"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_9E4EE2BCC7F988436CBA0BEEB30EC0648EB6",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "upgradeTrend",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "客户升级投诉倾向",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMTextarea_ID_5F9B43ED84B966492F3B37ADD5F97B5E9A04",
            "name": "FMTextarea",
            "compType": "FMTextarea",
            "z_props": {
              "col": 24,
              "key": "complaintDescription",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "用户申诉描述",
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
          "collapsed": false,
          "isBtnBlock": "基础",
          "name": "回单信息",
          "subName": ""
        },
        "children": [
          {
            "cId": "FMSelect_ID_6039212BCFCC3843C458431E63A8CA4061CF",
            "name": "FMSelect",
            "compType": "FMSelect",
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
              "optionsType": "字典",
              "optionsStaticValue": [
                {
                  "label": "预览1",
                  "value": "预览1"
                },
                {
                  "label": "预览2",
                  "value": "预览2"
                }
              ],
              "optionsDictName": "timeout_flag",
              "optionsEvent": "",
              "type": "FMSelect"
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
              "type": "FMInput",
              "suffix": ""
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
              "type": "FMInput",
              "suffix": ""
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
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
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
              "type": "FMInput",
              "suffix": ""
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
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_2D3E7D9AE701FE434D8985C10D879C59CF9B",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "replyRecordingNum",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "回复录音流水号",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMDatePicker_ID_6E14ED216003EF4CDB0A79ABC654D112E7AD",
            "name": "FMDatePicker",
            "compType": "FMDatePicker",
            "z_props": {
              "col": 8,
              "key": "replyTime",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "回复时间",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMDatePicker",
              "limit": "无限制",
              "format": "yyyy-MM-dd HH:mm:ss",
              "dateType": "FMDateTimePicker"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_9E797CE5E82DFE4DA5F91BFCEADAF8B54E18",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "replyStaffId",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "回复人员工号",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_565D7242F2608043609B2AC92321637B24FC",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "checkSituation",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "核查及处理结果",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_16DE6F45AB8D3D4E9AEAAEABEBAF2BB4244E",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "timeoutReason",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "超时原因",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMSelect_ID_74B7DB4CA7949C4A79BB13D31FC4F4099003",
            "name": "FMSelect",
            "compType": "FMSelect",
            "z_props": {
              "col": 8,
              "key": "raiseDealFlag",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "是否提级办结",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "optionsType": "字典",
              "optionsStaticValue": [
                {
                  "label": "预览1",
                  "value": "预览1"
                },
                {
                  "label": "预览2",
                  "value": "预览2"
                }
              ],
              "optionsDictName": "yes_no",
              "optionsEvent": "",
              "type": "FMSelect"
            },
            "children": []
          },
          {
            "cId": "FMSelect_ID_4D78516092F33E4DD78A81A2BE15AB79AB8E",
            "name": "FMSelect",
            "compType": "FMSelect",
            "z_props": {
              "col": 8,
              "key": "valetFlag",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "是否代客",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "optionsType": "字典",
              "optionsStaticValue": [
                {
                  "label": "预览1",
                  "value": "预览1"
                },
                {
                  "label": "预览2",
                  "value": "预览2"
                }
              ],
              "optionsDictName": "yes_no",
              "optionsEvent": "",
              "type": "FMSelect"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_84E09CE4B56BEE444208242E5EB68FB626AC",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "valetScene",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "代客场景",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_C9CF7439473B8243CA9818FFBD80C271B2D4",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "reasonLevel1",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "原因一级",
              "placeholder": "",
              "showCondition": [],
              "relevance": "",
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_5562E0804264C9479EA9ADDD9202FBDE8086",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "reasonLevel2",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "原因二级",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_42EF097590DC8242784B93CE58A442C6CBFF",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "reasonLevel3",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "原因三级",
              "placeholder": "",
              "showCondition": [],
              "relevance": "",
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_A477D5710D914F4C2A184E324ACAA1B036B1",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "reasonLevel4",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "原因四级",
              "placeholder": "",
              "showCondition": [],
              "relevance": "",
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_C9C8D0FC53104B49A78BE24D6C223BAFC1E8",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "reasonLevel5",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "原因五级",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMDatePicker_ID_631F89EAA31C3349FEC8B9930B8716A7039F",
            "name": "FMDatePicker",
            "compType": "FMDatePicker",
            "z_props": {
              "col": 8,
              "key": "settlementTime",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "办结时间",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMDatePicker",
              "limit": "无限制",
              "format": "yyyy-MM-dd HH:mm:ss",
              "dateType": "FMDateTimePicker"
            },
            "children": []
          },
          {
            "cId": "FMSelect_ID_EB2C9CCF8E1EC94D8D2A800C5D1F4738913A",
            "name": "FMSelect",
            "compType": "FMSelect",
            "z_props": {
              "col": 8,
              "key": "settleFlag",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "问题是否解决",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "optionsType": "字典",
              "optionsStaticValue": [
                {
                  "label": "预览1",
                  "value": "预览1"
                },
                {
                  "label": "预览2",
                  "value": "预览2"
                }
              ],
              "optionsDictName": "yes_no",
              "optionsEvent": "",
              "type": "FMSelect"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_33A9CBB87B013F460A3B0E4E1322878B0115",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "completionUnit",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "办结单位",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMSelect_ID_0C94FBAC2B2F2C4E9F7B0CCE21D1E1F979B9",
            "name": "FMSelect",
            "compType": "FMSelect",
            "z_props": {
              "col": 8,
              "key": "checkAssessResult",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "客户满意测评",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "optionsType": "字典",
              "optionsStaticValue": [
                {
                  "label": "预览1",
                  "value": "预览1"
                },
                {
                  "label": "预览2",
                  "value": "预览2"
                }
              ],
              "optionsDictName": "check_assess_result",
              "optionsEvent": "",
              "type": "FMSelect"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_42558B94BE44EE474958792F8930295E4142",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "complaintRational",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "客户投诉是否合理",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMSelect_ID_0EFC55069536244CB09AC3B76A58F21302E6",
            "name": "FMSelect",
            "compType": "FMSelect",
            "z_props": {
              "col": 8,
              "key": "isFixDuty",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "是否有责",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "optionsType": "字典",
              "optionsStaticValue": [
                {
                  "label": "预览1",
                  "value": "预览1"
                },
                {
                  "label": "预览2",
                  "value": "预览2"
                }
              ],
              "optionsDictName": "yes_no",
              "optionsEvent": "",
              "type": "FMSelect"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_21014F598A6CBB4F29DA490D9BAD3CEC14C1",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "dutyUnit",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "责任单位",
              "placeholder": "",
              "showCondition": [],
              "relevance": "",
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_5119C417EDC1E840497BE2DD2C40308FB86B",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "completionStaff",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "办结员工",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": [],
              "type": "FMInput",
              "suffix": ""
            },
            "children": []
          }
        ]
      },
      {
        "cId": "FMBlock_ID_7FFD4A365790C54551BB5E95BFA20FFAE67A",
        "name": "FMBlock",
        "compType": "",
        "z_props": {
          "collapsed": false,
          "isBtnBlock": "按钮组",
          "name": "",
          "subName": ""
        },
        "children": [
          {
            "cId": "FMButtons_ID_CF437E1C00607344D849F63836F72A0116AD",
            "name": "FMButtons",
            "compType": "FMButtons",
            "z_props": {
              "col": 24,
              "align": "center",
              "verticalAlign": "form",
              "isShowInDetail": false
            },
            "children": [
              {
                "cId": "FMButton_ID_0CD1C96846D961484F2915FF7B487A467E44",
                "name": "FMButton",
                "compType": "FMButton",
                "z_props": {
                  "isDisable": false,
                  "showCondition": [],
                  "type": "FMButton",
                  "isShowInDetail": false,
                  "btnName": "办结",
                  "btnType": "success",
                  "eventsType": "事件",
                  "interfaceName": "",
                  "interfaceReqParams": [],
                  "interfaceResParams": [],
                  "interfaceCode": "",
                  "interfaceReqParamsArray": [],
                  "interfaceResParamsArray": [],
                  "events": [
                    "complaint_completed"
                  ],
                  "eventsFields": []
                },
                "children": []
              }
            ]
          }
        ]
      }
    ]
  }
};

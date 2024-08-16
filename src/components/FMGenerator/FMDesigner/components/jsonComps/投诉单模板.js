export default {
  name: '投诉单模板',
  compType: '',
  title: '投诉单模板',
  type: 'json',
  json: {
    "form": {
      "eventsType": "事件",
      "events": [
        "complaint_init"
      ],
      "eventsFields": [],
      "hiddenFields": [
        {
          "label": "complaint.workorderId",
          "value": null
        },
        {
          "label": "complaint.lanId",
          "value": null
        },
        {
          "label": "complaint.provinceOrderCreateTime",
          "value": null
        },
        {
          "label": "complaint.createStaff",
          "value": null
        },
        {
          "label": "complaint.settlementTime",
          "value": null
        },
        {
          "label": "complaint.workArchivesTime",
          "value": null
        },
        {
          "label": "complaint.workorderType",
          "value": "BUS0001"
        },
        {
          "label": "complaint.recmplntTimes30days",
          "value": null
        },
        {
          "label": "complaint.croscmplntTimes30days",
          "value": null
        },
        {
          "label": "complaint.refundRecords90days",
          "value": null
        },
        {
          "label": "complaint.satisfactionEstima30days",
          "value": null
        },
        {
          "label": "complaint.dissatisfactionEstima30days",
          "value": null
        },
        {
          "label": "complaint.governmentEnterprisekeyPerson",
          "value": null
        },
        {
          "label": "complaint.custType",
          "value": null
        },
        {
          "label": "complaint.userStarLevel",
          "value": null
        },
        {
          "label": "complaint.netAge",
          "value": null
        },
        {
          "label": "complaint.custAge",
          "value": null
        },
        {
          "label": "complaint.importantCustomer",
          "value": null
        },
        {
          "label": "complaint.askSourceSrl",
          "value": null
        },
        {
          "label": "complaint.cityFlag",
          "value": null
        },
        {
          "label": "complaint.replyRecordingNum",
          "value": null
        },
        {
          "label": "complaint.replyAudio",
          "value": null
        },
        {
          "label": "complaint.replyTime",
          "value": null
        },
        {
          "label": "complaint.replyStaffId",
          "value": null
        },
        {
          "label": "complaint.problemReason",
          "value": null
        },
        {
          "label": "complaint.checkSituation",
          "value": null
        },
        {
          "label": "complaint.timeoutFlag",
          "value": null
        },
        {
          "label": "complaint.demandTimeLimit",
          "value": null
        },
        {
          "label": "complaint.nodeCode",
          "value": null
        },
        {
          "label": "complaint.opStaffName",
          "value": null
        },
        {
          "label": "complaint.opGropName",
          "value": null
        },
        {
          "label": "complaint.assistStaffId",
          "value": null
        },
        {
          "label": "complaint.assistStaffName",
          "value": null
        },
        {
          "label": "complaint.assistGroupName",
          "value": null
        },
        {
          "label": "complaint.urgencyCount",
          "value": null
        },
        {
          "label": "complaint.contactName",
          "value": null
        },
        {
          "label": "complaint.timeoutReason",
          "value": null
        },
        {
          "label": "complaint.settleFlag",
          "value": null
        },
        {
          "label": "complaint.unsettleReason",
          "value": null
        },
        {
          "label": "complaint.raiseDealFlag",
          "value": null
        },
        {
          "label": "complaint.valetFlag",
          "value": null
        },
        {
          "label": "complaint.valetScene",
          "value": null
        },
        {
          "label": "complaint.reasonLevel1",
          "value": null
        },
        {
          "label": "complaint.reasonLevel1Code",
          "value": null
        },
        {
          "label": "complaint.reasonLevel2",
          "value": null
        },
        {
          "label": "complaint.reasonLevel2Code",
          "value": null
        },
        {
          "label": "complaint.reasonLevel3",
          "value": null
        },
        {
          "label": "complaint.reasonLevel3Code",
          "value": null
        },
        {
          "label": "complaint.reasonLevel4",
          "value": null
        },
        {
          "label": "complaint.reasonLevel4Code",
          "value": null
        },
        {
          "label": "complaint.reasonLevel5",
          "value": null
        },
        {
          "label": "complaint.reasonLevel5Code",
          "value": null
        },
        {
          "label": "complaint.appealResult",
          "value": null
        },
        {
          "label": "complaint.statusCd",
          "value": "C006000"
        },
        {
          "label": "complaint.developChannelCode",
          "value": null
        },
        {
          "label": "complaint.recordingId",
          "value": ""
        }
      ]
    },
    "stage": [
      {
        "cId": "FMBlock_ID_5EB1F6DE987F2947967B30EC623445FB10E0",
        "name": "FMBlock",
        "compType": "",
        "z_props": {
          "isBtnBlock": "基础",
          "name": "用户信息",
          "subName": ""
        },
        "children": [
          {
            "cId": "FMInput_ID_91AFF1E634DD8C423B1A672B8115989A1453",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.callerNo",
              "isRequire": false,
              "isDisable": true,
              "clearable": true,
              "value": "",
              "name": "主叫号码",
              "placeholder": "",
              "showCondition": [],
              "relevance": "",
              "eventsType": "事件",
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
              "col": 6,
              "key": "complaint.complaintAssetNum",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "业务号码",
              "placeholder": "",
              "showCondition": [],
              "relevance": "",
              "eventsType": "事件",
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
              "col": 6,
              "key": "complaint.custName",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "客户名称",
              "placeholder": "",
              "showCondition": [],
              "relevance": "",
              "eventsType": "事件",
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
              "col": 6,
              "key": "complaint.phoneLocal",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "号码归属地",
              "placeholder": "",
              "showCondition": [],
              "relevance": "",
              "eventsType": "事件",
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
              "col": 6,
              "key": "complaint.contactPhone1",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "联系电话1",
              "placeholder": "",
              "showCondition": [],
              "relevance": "",
              "eventsType": "事件",
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
              "col": 6,
              "key": "complaint.contactPhone2",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "联系电话2",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_9E4EE2BCC7F988436CBA0BEEB30EC0648EB6",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.upgradeTrend",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "客户升级投诉倾向",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": []
          },
          {
            "cId": "FMSelect_ID_7578EC13F740FB4DDEABDB89E64B9D1F0CD7",
            "name": "FMSelect",
            "compType": "FMSelect",
            "z_props": {
              "col": 6,
              "key": "complaint.problemLanId",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "申告地",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "optionsType": "字典",
              "optionsStaticValue": [],
              "optionsDictName": "base_province_code",
              "optionsEvent": "",
              "type": "FMSelect"
            },
            "children": []
          }
        ]
      },
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
              "key": "complaint.askSourceSrlChain",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "投诉来源",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "type": "FMCascader",
              "optionsEvent": "complaint_listComplaintSourceTree",
              "checkStrictly": true
            },
            "children": []
          },
          {
            "cId": "FMRadio_ID_15C275D2E84ABA47E77A5681EC0EB7C8BD79",
            "name": "FMRadio",
            "compType": "FMRadio",
            "z_props": {
              "type": "FMRadio",
              "col": 6,
              "key": "complaint.workorderStrictest",
              "isRequire": false,
              "isDisable": false,
              "optionsType": "字典",
              "optionsStaticValue": [],
              "optionsDictName": "yes_no",
              "optionsEvent": "",
              "clearable": true,
              "value": "0",
              "name": "是否市场最严工单",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": []
            },
            "children": []
          },
          {
            "cId": "FMSelect_ID_21DEA64C3ADFFA40F25B655C396AD6BC3BD2",
            "name": "FMSelect",
            "compType": "FMSelect",
            "z_props": {
              "col": 6,
              "key": "complaint.workorderStrictestScene",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "市场最严工单场景",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
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
            "cId": "FMCascader_ID_3C69F466E0C63E481C6B6D787355C6AE2CA0",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "col": 6,
              "key": "complaint.developChannelLevel",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "发展渠道",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "type": "FMCascader",
              "optionsEvent": "complaint_listChannelTree",
              "checkStrictly": true
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_24220559CBAC5B46EA6895A18D6F3E82089F",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.controlChannel",
              "isRequire": false,
              "isDisable": true,
              "clearable": true,
              "value": "",
              "name": "责任管控渠道",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": null
          },
          {
            "cId": "FMInput_ID_92C09391B322CD4AEAFAA6FF2CCC2900612C",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.complaintWorksheetId",
              "isRequire": false,
              "isDisable": true,
              "clearable": true,
              "value": "11",
              "name": "集团工单编号",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": null
          },
          {
            "cId": "FMInput_ID_DBE2E44DCF90F44E698ABFCD736C6E6E751C",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.unifiedComplaintCode",
              "isRequire": true,
              "isDisable": true,
              "clearable": true,
              "value": "",
              "name": "统一投诉编码",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": null
          },
          {
            "cId": "FMInput_ID_D0E72EEA81734C4D372A2A4F472A03783167",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.callId",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "呼叫流水号",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
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
              "key": "complaint.appealUserName",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "申诉用户姓名",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": null
          },
          {
            "cId": "FMDatePicker_ID_7D83EA434A74294885E9872E8B39B58522E0",
            "name": "FMDatePicker",
            "compType": "FMDatePicker",
            "z_props": {
              "col": 6,
              "key": "complaint.appealDate",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "申诉日期",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "type": "FMDatePicker",
              "format": "yyyy-MM-dd HH:mm:ss",
              "dateType": "FMDateTimePicker"
            },
            "children": null
          },
          {
            "cId": "FMTextarea_ID_3297E42348B68245EE086066B2D62E630EDD",
            "name": "FMTextarea",
            "compType": "FMTextarea",
            "z_props": {
              "col": 20,
              "key": "complaint.complaintDescription",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "用户申诉描述",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "type": "FMTextarea",
              "rows": 5,
              "maxlength": 0,
              "resize": "none"
            },
            "children": []
          },
          {
            "cId": "FMButtons_ID_CBFB805395618748D70B8DCDC05345768ABC",
            "name": "FMButtons",
            "compType": "FMButtons",
            "z_props": {
              "col": 4,
              "align": "left",
              "verticalAlign": "form"
            },
            "children": [
              {
                "cId": "FMButton_ID_28CE8176919BA94C7C99491E3DE57001C153",
                "name": "FMButton",
                "compType": "FMButton",
                "z_props": {
                  "isDisable": false,
                  "showCondition": [],
                  "eventsType": "事件",
                  "events": [],
                  "eventsFields": [],
                  "type": "FMButton",
                  "btnName": "获取投诉现象",
                  "btnType": "primary"
                },
                "children": []
              }
            ]
          }
        ]
      },
      {
        "cId": "FMBlock_ID_435554E94AB9104073891303F3C1C0D25363",
        "name": "FMBlock",
        "compType": "",
        "z_props": {
          "isBtnBlock": "基础",
          "name": "投诉细分",
          "subName": ""
        },
        "children": [
          {
            "cId": "FMCascader_ID_7EAF3E7DCAEF5745185896EB997CD6D5ADAB",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "col": 12,
              "key": "complaint.complaintPhenomenonLevel",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "投诉现象",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [
                "complaint_phenomenon_and_product_change"
              ],
              "eventsFields": [],
              "type": "FMCascader",
              "optionsEvent": "complaint_listComplaintPhenomenonTree",
              "checkStrictly": true
            },
            "children": []
          },
          {
            "cId": "FMCascader_ID_D460CE558412F34793DB13148F8F2B1528AC",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "col": 12,
              "key": "complaint.productLevel",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "产品",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [
                "complaint_phenomenon_and_product_change"
              ],
              "eventsFields": [],
              "type": "FMCascader",
              "optionsEvent": "complaint_listProductTree",
              "checkStrictly": true
            },
            "children": []
          },
          {
            "cId": "FMTextarea_ID_B07335BBEAB3624E39894CF79432E93A8241",
            "name": "FMTextarea",
            "compType": "FMTextarea",
            "z_props": {
              "col": 20,
              "key": "complaint.complaintInfo",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "用户投申诉内容",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
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
            "cId": "FMButtons_ID_C35634C3D54049401A1A603AFB20107D40EB",
            "name": "FMButtons",
            "compType": "FMButtons",
            "z_props": {
              "col": 4,
              "align": "left",
              "verticalAlign": "form"
            },
            "children": [
              {
                "cId": "FMButton_ID_2F23564E04107143CFEA1B5BC9F5BAABC38D",
                "name": "FMButton",
                "compType": "FMButton",
                "z_props": {
                  "isDisable": false,
                  "showCondition": [
                    {
                      "key": "complaint.statusCd",
                      "condition": "等于",
                      "value": "C006000",
                      "relation": "&&"
                    }
                  ],
                  "eventsType": "事件",
                  "events": [
                    "complaint_btn_formatVerbalTrickContent"
                  ],
                  "eventsFields": [],
                  "type": "FMButton",
                  "btnName": "投诉内容模板化",
                  "btnType": "default"
                },
                "children": []
              }
            ]
          }
        ]
      },
      {
        "cId": "FMBlock_ID_7FFD4A365790C54551BB5E95BFA20FFAE67A",
        "name": "FMBlock",
        "compType": "",
        "z_props": {
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
              "verticalAlign": "form"
            },
            "children": [
              {
                "cId": "FMButton_ID_0CD1C96846D961484F2915FF7B487A467E44",
                "name": "FMButton",
                "compType": "FMButton",
                "z_props": {
                  "isDisable": false,
                  "showCondition": [],
                  "eventsType": "事件",
                  "events": [
                    "complaint_submit"
                  ],
                  "eventsFields": [],
                  "type": "FMButton",
                  "btnName": "提交",
                  "btnType": "success"
                },
                "children": []
              },
              {
                "cId": "FMButton_ID_72C9E2A306CCC143523A64FA4951843BFD83",
                "name": "FMButton",
                "compType": "FMButton",
                "z_props": {
                  "isDisable": false,
                  "showCondition": [],
                  "eventsType": "事件",
                  "events": [],
                  "eventsFields": [],
                  "type": "FMButton",
                  "btnName": "暂存",
                  "btnType": "warning"
                },
                "children": []
              }
            ]
          }
        ]
      }
    ]
  }

}

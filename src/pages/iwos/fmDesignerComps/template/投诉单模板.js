export default {
  title: '投诉单模板',
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
      "hiddenFields": [
        {
          "label": "workorderId",
          "value": null
        },
        {
          "label": "lanId",
          "value": null
        },
        {
          "label": "provinceOrderCreateTime",
          "value": null
        },
        {
          "label": "createStaff",
          "value": null
        },
        {
          "label": "settlementTime",
          "value": null
        },
        {
          "label": "workArchivesTime",
          "value": null
        },
        {
          "label": "workorderType",
          "value": "BUS0001"
        },
        {
          "label": "recmplntTimes30days",
          "value": null
        },
        {
          "label": "croscmplntTimes30days",
          "value": null
        },
        {
          "label": "refundRecords90days",
          "value": null
        },
        {
          "label": "satisfactionEstima30days",
          "value": null
        },
        {
          "label": "dissatisfactionEstima30days",
          "value": null
        },
        {
          "label": "governmentEnterprisekeyPerson",
          "value": null
        },
        {
          "label": "custType",
          "value": null
        },
        {
          "label": "userStarLevel",
          "value": null
        },
        {
          "label": "netAge",
          "value": null
        },
        {
          "label": "custAge",
          "value": null
        },
        {
          "label": "importantCustomer",
          "value": null
        },
        {
          "label": "askSourceSrl",
          "value": null
        },
        {
          "label": "cityFlag",
          "value": null
        },
        {
          "label": "replyRecordingNum",
          "value": null
        },
        {
          "label": "replyAudio",
          "value": null
        },
        {
          "label": "replyTime",
          "value": null
        },
        {
          "label": "replyStaffId",
          "value": null
        },
        {
          "label": "problemReason",
          "value": null
        },
        {
          "label": "checkSituation",
          "value": null
        },
        {
          "label": "timeoutFlag",
          "value": null
        },
        {
          "label": "demandTimeLimit",
          "value": null
        },
        {
          "label": "nodeCode",
          "value": null
        },
        {
          "label": "opStaffName",
          "value": null
        },
        {
          "label": "opGropName",
          "value": null
        },
        {
          "label": "assistStaffId",
          "value": null
        },
        {
          "label": "assistStaffName",
          "value": null
        },
        {
          "label": "assistGroupName",
          "value": null
        },
        {
          "label": "urgencyCount",
          "value": null
        },
        {
          "label": "contactName",
          "value": null
        },
        {
          "label": "timeoutReason",
          "value": null
        },
        {
          "label": "settleFlag",
          "value": null
        },
        {
          "label": "unsettleReason",
          "value": null
        },
        {
          "label": "raiseDealFlag",
          "value": null
        },
        {
          "label": "valetFlag",
          "value": null
        },
        {
          "label": "valetScene",
          "value": null
        },
        {
          "label": "reasonLevel1",
          "value": null
        },
        {
          "label": "reasonLevel1Code",
          "value": null
        },
        {
          "label": "reasonLevel2",
          "value": null
        },
        {
          "label": "reasonLevel2Code",
          "value": null
        },
        {
          "label": "reasonLevel3",
          "value": null
        },
        {
          "label": "reasonLevel3Code",
          "value": null
        },
        {
          "label": "reasonLevel4",
          "value": null
        },
        {
          "label": "reasonLevel4Code",
          "value": null
        },
        {
          "label": "reasonLevel5",
          "value": null
        },
        {
          "label": "reasonLevel5Code",
          "value": null
        },
        {
          "label": "appealResult",
          "value": null
        },
        {
          "label": "statusCd",
          "value": null
        },
        {
          "label": "developChannelCode",
          "value": null
        },
        {
          "label": "recordingId",
          "value": null
        }
      ],
      "interfaceCode": null,
      "interfaceReqParamsArray": null,
      "interfaceResParamsArray": null
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
              "type": "FMInput",
              "col": 6,
              "key": "callerNo",
              "isRequire": false,
              "isDisable": true,
              "clearable": true,
              "value": "",
              "name": "主叫号码",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [],
              "eventsFields": []
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_818E8BD9B5802E441A591C4E5CF91650F16B",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "type": "FMInput",
              "col": 6,
              "key": "complaintAssetNum",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "业务号码",
              "placeholder": "",
              "showCondition": [],
              "relevance": "",
              "events": [],
              "eventsFields": []
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_6925D5805370BC48C2EA7D3771602CD52ED3",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "custName",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "客户名称",
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
              "col": 6,
              "key": "contactPhone1",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "联系电话1",
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
              "col": 6,
              "key": "contactPhone2",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "联系电话2",
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
            "cId": "FMInput_ID_9E4EE2BCC7F988436CBA0BEEB30EC0648EB6",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "upgradeTrend",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "客户升级投诉倾向",
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
            "cId": "FMCascader_ID_7578EC13F740FB4DDEABDB89E64B9D1F0CD7",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "col": 6,
              "key": "problemLanIdChain",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "申告地",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "events": [
                "complaint_source_change"
              ],
              "eventsFields": [],
              "type": "FMCascader",
              "optionsEvent": "",
              "checkStrictly": true,
              "valueType": "array"
            },
            "children": []
          },
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
              "key": "askSourceSrlChain",
              "isRequire": true,
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
              "events": ["complaint_workorderStrictest_change"],
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
              "optionsType": "字典",
              "optionsStaticValue": [],
              "optionsDictName": "workorder_strictest_scene",
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
            "cId": "FMInput_ID_92C09391B322CD4AEAFAA6FF2CCC2900612C",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaintWorksheetId",
              "isRequire": true,
              "isDisable": true,
              "clearable": true,
              "value": "",
              "name": "集团工单编号",
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
            "cId": "FMInput_ID_DBE2E44DCF90F44E698ABFCD736C6E6E751C",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "unifiedComplaintCode",
              "isRequire": true,
              "isDisable": true,
              "clearable": true,
              "value": "",
              "name": "统一投诉编码",
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
            "cId": "FMInput_ID_D0E72EEA81734C4D372A2A4F472A03783167",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "callId",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "呼叫流水号",
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
              "key": "appealUserName",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": "",
              "name": "申诉用户姓名",
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
            "cId": "FMDatePicker_ID_7D83EA434A74294885E9872E8B39B58522E0",
            "name": "FMDatePicker",
            "compType": "FMDatePicker",
            "z_props": {
              "col": 6,
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
                  "type": "FMButton",
                  "btnName": "获取投诉现象",
                  "btnType": "primary",
                  "eventsType": "事件",
                  "interfaceName": "",
                  "interfaceReqParams": [],
                  "interfaceResParams": [],
                  "interfaceCode": "",
                  "interfaceReqParamsArray": [],
                  "interfaceResParamsArray": [],
                  "events": [],
                  "eventsFields": []
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
              "key": "complaintPhenomenonLevel",
              "isRequire": true,
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
              "col": 12,
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
            "cId": "FMTextarea_ID_B07335BBEAB3624E39894CF79432E93A8241",
            "name": "FMTextarea",
            "compType": "FMTextarea",
            "z_props": {
              "col": 20,
              "key": "complaintInfo",
              "isRequire": true,
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
                  "showCondition": [],
                  "type": "FMButton",
                  "btnName": "投诉内容模板化",
                  "btnType": "default",
                  "eventsType": "事件",
                  "interfaceName": "",
                  "interfaceReqParams": [],
                  "interfaceResParams": [],
                  "interfaceCode": "",
                  "interfaceReqParamsArray": [],
                  "interfaceResParamsArray": [],
                  "events": [
                    "complaint_btn_formatVerbalTrickContent"
                  ],
                  "eventsFields": []
                },
                "children": []
              }
            ]
          },
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
                  "type": "FMButton",
                  "btnName": "提交",
                  "btnType": "success",
                  "eventsType": "事件",
                  "interfaceName": "",
                  "interfaceReqParams": [],
                  "interfaceResParams": [],
                  "interfaceCode": "",
                  "interfaceReqParamsArray": [],
                  "interfaceResParamsArray": [],
                  "events": [
                    "complaint_submit"
                  ],
                  "eventsFields": []
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
                  "type": "FMButton",
                  "btnName": "暂存",
                  "btnType": "warning",
                  "eventsType": "事件",
                  "interfaceName": "",
                  "interfaceReqParams": [],
                  "interfaceResParams": [],
                  "interfaceCode": "",
                  "interfaceReqParamsArray": [],
                  "interfaceResParamsArray": [],
                  "events": ['complaint_save'],
                  "eventsFields": []
                },
                "children": []
              },
              {
                "cId": "FMButton_ID_72C9E2A306CAA143523A64FA4951843BFD83",
                "name": "FMButton",
                "compType": "FMButton",
                "z_props": {
                  "type": "FMButton",
                  "isDisable": false,
                  "btnName": "取消",
                  "btnType": "danger",
                  "showCondition": [
                    {
                      "key": "statusCd",
                      "condition": "等于",
                      "value": "C100001",
                      "relation": "&&"
                    }
                  ],
                  "eventsType": "事件",
                  "interfaceName": "",
                  "interfaceReqParams": [],
                  "interfaceResParams": [],
                  "events": [
                    "complaint_cancel"
                  ],
                  "eventsFields": [],
                  "interfaceCode": "",
                  "interfaceReqParamsArray": [],
                  "interfaceResParamsArray": []
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

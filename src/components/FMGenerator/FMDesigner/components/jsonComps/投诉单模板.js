export default {
  name: '投诉单模板',
  compType: '',
  title: '投诉单模板',
  type: 'json',
  json: {
    "form": {
      "events": [
        "complaint_init"
      ],
      "eventsType": "事件",
      "eventsFields": [],
      "hiddenFields": [
        {
          "label": "complaint.provinceOrderCreateTimeStr",
          "value": null,
        },
        {
          "label": "complaint.settlementTimeStr",
          "value": null,
        },
        {
          "label": "complaint.workArchivesTimeStr",
          "value": null,
        },
        {
          "label": "complaint.workorderType",
          "value": "BUS0001"
        },
        {
          "label": "complaint.recmplntTimes30days",
          "value": null,
        },
        {
          "label": "complaint.croscmplntTimes30days",
          "value": null,
        },
        {
          "label": "complaint.refundRecords90days",
          "value": null,
        },
        {
          "label": "complaint.satisfactionEstima30days",
          "value": null,
        },
        {
          "label": "complaint.dissatisfactionEstima30days",
          "value": null,
        },
        {
          "label": "complaint.governmentEnterprisekeyPerson",
          "value": null,
        },
        {
          "label": "complaint.custType",
          "value": null,
        },
        {
          "label": "complaint.userStarLevel",
          "value": null,
        },
        {
          "label": "complaint.netAge",
          "value": null,
        },
        {
          "label": "complaint.custAge",
          "value": null,
        },
        {
          "label": "complaint.importantCustomer",
          "value": null,
        },
        {
          "label": "complaint.cityFlag",
          "value": null,
        },
        {
          "label": "complaint.replyRecordingNum",
          "value": null,
        },
        {
          "label": "complaint.replyAudio",
          "value": null,
        },
        {
          "label": "complaint.replyTimeStr",
          "value": null
        },
        {
          "label": "complaint.replyStaffId",
          "value": null,
        },
        {
          "label": "complaint.problemReason",
          "value": null,
        },
        {
          "label": "complaint.checkSituation",
          "value": null,
        },
        {
          "label": "complaint.timeoutFlag",
          "value": null,
        },
        {
          "label": "complaint.demandTimeLimit",
          "value": null,
        },
        {
          "label": "complaint.nodeCode",
          "value": null,
        },
        {
          "label": "complaint.opStaffName",
          "value": null,
        },
        {
          "label": "complaint.opGropName",
          "value": null,
        },
        {
          "label": "complaint.assistStaffId",
          "value": null,
        },
        {
          "label": "complaint.assistStaffName",
          "value": null,
        },
        {
          "label": "complaint.assistGroupName",
          "value": null,
        },
        {
          "label": "complaint.urgencyCount",
          "value": null,
        },
        {
          "label": "complaint.contactName",
          "value": null,
        },
        {
          "label": "complaint.timeoutReason",
          "value": null,
        },
        {
          "label": "complaint.settleFlag",
          "value": null,
        },
        {
          "label": "complaint.unsettleReason",
          "value": null,
        },
        {
          "label": "complaint.raiseDealFlag",
          "value": null,
        },
        {
          "label": "complaint.valetFlag",
          "value": null,
        },
        {
          "label": "complaint.valetScene",
          "value": null,
        },
        {
          "label": "complaint.reasonLevel1",
          "value": null,
        },
        {
          "label": "complaint.reasonLevel1Code",
          "value": null,
        },
        {
          "label": "complaint.reasonLevel2",
          "value": null,
        },
        {
          "label": "complaint.reasonLevel2Code",
          "value": null,
        },
        {
          "label": "complaint.reasonLevel3",
          "value": null,
        },
        {
          "label": "complaint.reasonLevel3Code",
          "value": null,
        },
        {
          "label": "complaint.reasonLevel4",
          "value": null,
        },
        {
          "label": "complaint.reasonLevel4Code",
          "value": null,
        },
        {
          "label": "complaint.reasonLevel5",
          "value": null,
        },
        {
          "label": "complaint.reasonLevel5Code",
          "value": null,
        },
        {
          "label": "complaint.appealResult",
          "value": null,
        },
        {
          "label": "complaint.statusCd",
          "value": "C006000"
        },
        {
          "label": "complaint.developChannelCode",
          "value": null,
        }
      ]
    },
    "stage": [
      {
        "cId": "FMBlock_ID_ADB0AA5CAA553047119BAE5B902C0D2633C1",
        "name": "FMBlock",
        "compType": "",
        "z_props": {
          "name": "投诉单基本信息",
          "subName": ""
        },
        "children": [
          {
            "cId": "FMCascader_ID_29B98840B4F2C344ADAA0DE95140EE763863",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "col": 6,
              "key": "complaint.askSourceSrl",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": null,
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
              "name": "投诉编码",
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
            "cId": "FMInput_ID_DBE2E44DCF90F44E698ABFCD736C6E6E751F",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.complaintAssetNum",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": null,
              "name": "业务号码",
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
            "cId": "FMInput_ID_CE7CFBD525E66349EDF87693CFE4A75FB090",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.custName",
              "isRequire": false,
              "isDisable": true,
              "clearable": true,
              "value": null,
              "name": "客户名称",
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
            "cId": "FMInput_ID_17043A8B694FFE483F1BC32497AB2B7EFFAC",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.appealUserName",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": null,
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
            "cId": "FMInput_ID_F77B598B23B6D249EA2B0BFE6AE528AE6A55",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.contactPhone1",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": null,
              "name": "联系电话1",
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
            "cId": "FMInput_ID_228F2C61D3FFDC4EE9087929BC9F4CFA5BDB",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.contactPhone2",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": null,
              "name": "联系电话2",
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
            "cId": "FMInput_ID_228F2C61D3FFDC4EE9089C29BC9F4CFA5BDB",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.upgradeTrend",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "无",
              "name": "客户升级投诉倾向",
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
            "cId": "FMInput_ID_92C09391B322CD4AEAFAA6FF2CCC2900613C",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.appealWorksheetId",
              "isRequire": false,
              "isDisable": true,
              "clearable": true,
              "value": null,
              "name": "申诉工单编号",
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
            "cId": "FMDatePicker_ID_7D83EA434A74294885E9872E8B39B58522E0",
            "name": "FMDatePicker",
            "compType": "FMDatePicker",
            "z_props": {
              "col": 6,
              "key": "complaint.appealDateStr",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": null,
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
            "cId": "FMInput_ID_9B95D60E45839D48D75938FC7DA4A1EDC022",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.callerNo",
              "isRequire": false,
              "isDisable": true,
              "clearable": true,
              "value": null,
              "name": "主叫号码",
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
            "cId": "FMInput_ID_A2B3D66A57A00F4A782A4F50E402FA18C4B6",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.complaintChannel",
              "isRequire": false,
              "isDisable": true,
              "clearable": true,
              "value": null,
              "name": "工单受理渠道",
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
            "cId": "FMInput_ID_24220559CBAC5B46EA6895718D6F4E82089F",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.createStaff",
              "isRequire": false,
              "isDisable": true,
              "clearable": true,
              "value": null,
              "name": "工单受理工号",
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
            "cId": "FMInput_ID_24220559CBAC5B46EA6895A18D6F3E82089F",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.phoneLocal",
              "isRequire": false,
              "isDisable": true,
              "clearable": true,
              "value": null,
              "name": "号码归属地",
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
              "value": null,
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
            "cId": "FMInput_ID_C0176B850C18CC43D878381D672856E46BC2",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.recordingId",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": null,
              "name": "录音流水号",
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
            "cId": "FMInput_ID_6A9C3C32A65EC347862A8S93FCF93DBA78A3",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 6,
              "key": "complaint.worksheetId",
              "isRequire": false,
              "isDisable": true,
              "clearable": true,
              "value": null,
              "name": "省内工单编号",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "type": "FMInput"
            },
            "children": null
          }
        ]
      },
      {
        "cId": "FMBlock_ID_435554E94AB9104073891303F3C1C0D25363",
        "name": "FMBlock",
        "compType": "",
        "z_props": {
          "name": "投诉细分",
          "subName": ""
        },
        "children": [
          {
            "cId": "FMRadio_ID_81F1DF7ED5279C4B42E93902A8735A50A5BF",
            "name": "FMRadio",
            "compType": "FMRadio",
            "z_props": {
              "col": 8,
              "key": "complaint.workorderStrictest",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": "0",
              "name": "是否市场最严工单",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "optionsType": "静态数据",
              "optionsStaticValue": [
                {
                  "label": "是",
                  "value": null,
                },
                {
                  "label": "否",
                  "value": "0"
                }
              ],
              "optionsDictName": "",
              "optionsEvent": "",
              "type": "FMRadio"
            },
            "children": []
          },
          {
            "cId": "FMSelect_ID_7B4452824298074DDADBE9AD728A07FA74A9",
            "name": "FMSelect",
            "compType": "FMSelect",
            "z_props": {
              "col": 8,
              "key": "complaint.workorderStrictestScene",
              "isRequire": false,
              "isDisable": false,
              "clearable": true,
              "value": null,
              "name": "市场最严工单场景",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "optionsType": "静态数据",
              "optionsStaticValue": [],
              "optionsDictName": "",
              "optionsEvent": "",
              "type": "FMSelect"
            },
            "children": []
          },
          {
            "cId": "FMInput_ID_048371839CC8224C6BA80B49B0B19BC515FE",
            "name": "FMInput",
            "compType": "FMInput",
            "z_props": {
              "col": 8,
              "key": "complaint.controlChannel",
              "isRequire": false,
              "isDisable": true,
              "clearable": true,
              "value": null,
              "name": "责任管控渠道",
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
            "cId": "FMCascader_ID_7EAF3E7DCAEF5745185896EB997CD6D5ADAB",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "type": "FMCascader",
              "col": 8,
              "key": "complaint.complaintPhenomenonLevel",
              "isRequire": true,
              "isDisable": false,
              "optionsEvent": "complaint_listComplaintPhenomenonTree",
              "checkStrictly": true,
              "clearable": true,
              "value": null,
              "name": "投诉现象",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [
                "complaint_phenomenon_and_product_change"
              ],
              "eventsFields": []
            },
            "children": []
          },
          {
            "cId": "FMCascader_ID_D460CE558412F34793DB13148F8F2B1528AC",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "type": "FMCascader",
              "col": 8,
              "key": "complaint.productLevel",
              "isRequire": false,
              "isDisable": false,
              "optionsEvent": "complaint_listProductTree",
              "checkStrictly": true,
              "clearable": true,
              "value": null,
              "name": "产品",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [
                "complaint_phenomenon_and_product_change"
              ],
              "eventsFields": []
            },
            "children": []
          },
          {
            "cId": "FMCascader_ID_B1FF9D9AFD3D814240E83AA4A7CCE97AB7BB",
            "name": "FMCascader",
            "compType": "FMCascader",
            "z_props": {
              "col": 8,
              "key": "complaint.developChannel",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": null,
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
            "cId": "FMTextarea_ID_B07335BBEAB3624E39894CF79432E93A8241",
            "name": "FMTextarea",
            "compType": "FMTextarea",
            "z_props": {
              "col": 12,
              "key": "complaint.complaintDescription",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": null,
              "name": "投诉描述备注",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "type": "FMTextarea",
              "rows": 4,
              "resize": "none"
            },
            "children": []
          },
          {
            "cId": "FMTextarea_ID_D9AFA0D012EC1B4E09CB217CED52A3CF7224",
            "name": "FMTextarea",
            "compType": "FMTextarea",
            "z_props": {
              "col": 12,
              "key": "complaint.complaintInfo",
              "isRequire": true,
              "isDisable": false,
              "clearable": true,
              "value": null,
              "name": "投/申诉内容",
              "placeholder": "",
              "showCondition": [],
              "relevance": [],
              "eventsType": "事件",
              "events": [],
              "eventsFields": [],
              "type": "FMTextarea",
              "rows": 4,
              "resize": "none"
            },
            "children": []
          },
          {
            "cId": "FMButtons_ID_C35634C3D54049401A1A603AFB20107D40EB",
            "name": "FMButtons",
            "compType": "FMButtons",
            "z_props": {
              "col": 12,
              "align": "right",
              "verticalAlign": "top"
            },
            "children": [
              {
                "cId": "FMButton_ID_2F23564E04107143CFEA1B5BC9F5BAABC38D",
                "name": "FMButton",
                "compType": "FMButton",
                "z_props": {
                  "isDisable": false,
                  "showCondition": [],
                  "eventsType": "事件",
                  "events": ['complaint_btn_formatVerbalTrickContent'],
                  "eventsFields": [],
                  "type": "FMButton",
                  "btnName": "投诉内容模板化",
                  "btnType": "default"
                },
                "children": []
              },
              {
                "cId": "FMButton_ID_37E9BFC41019BF4DA00BAD959E1666DBDA35",
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
          },
          {
            "cId": "FMButtons_ID_EFB56C26F4C6E74DD46B0EEF18D1723D0601",
            "name": "FMButtons",
            "compType": "FMButtons",
            "z_props": {
              "col": 12,
              "align": "right",
              "verticalAlign": "top"
            },
            "children": [
              {
                "cId": "FMButton_ID_1B98A0EF57017246CC397231D9C419AB82E8",
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
        "cId": "FMBlock_ID_7FFD4A365790C54551BB5E95BFA20FFAE67A",
        "name": "FMBlock",
        "compType": "",
        "z_props": {
          "isBtnBlock": "是",
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
              }
            ]
          }
        ]
      }
    ]
  }

}

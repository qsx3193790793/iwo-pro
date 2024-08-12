module.exports = {
  method: 'get',
  url: process.env.VUE_APP_BASE_API_IS_LOC === 'true' ? 'group_team' : 'qdpc/userauthplan/group_team',
  mockTemplate: {
    "code": "200",
    "message": "success",
    "data": [
      {
        "staffCode": "SADMIN203924920",
        "schdlStaffRelId": 203924920,
        "staffName": "SADMIN203924920",
        "relType": "1002",
        "staffId": 1
      },
      {
        "staffCode": "CM_HUANGSJ",
        "schdlStaffRelId": 203912046,
        "staffName": "黄水晶",
        "relType": "1002",
        "staffId": 7313576937
      },
      {
        "staffCode": "SHENGU",
        "schdlStaffRelId": 203915644,
        "staffName": "沈崮",
        "relType": "1002",
        "staffId": 111
      },
      {
        "staffCode": "W_ZJHC_GSY",
        "schdlStaffRelId": 203916541,
        "staffName": "W_ZJHC_GSY",
        "relType": "1002",
        "staffId": 12345678
      },
      {
        "staffCode": "YOULEI",
        "schdlStaffRelId": 203916546,
        "staffName": "尤磊",
        "relType": "1002",
        "staffId": 330067
      },
      {
        "staffCode": "SHIMUYAO",
        "schdlStaffRelId": 203916547,
        "staffName": "施慕垚",
        "relType": "1002",
        "staffId": 330078
      },
      {
        "staffCode": "LUYI_XIN",
        "schdlStaffRelId": 203916548,
        "staffName": "陆祎",
        "relType": "1002",
        "staffId": 715678
      },
      {
        "staffCode": "WUWENJUN",
        "schdlStaffRelId": 203916549,
        "staffName": "邬文钧",
        "relType": "1002",
        "staffId": 770545
      },
      {
        "staffCode": "CAISHWXTX",
        "schdlStaffRelId": 203916542,
        "staffName": "蔡思虹",
        "relType": "1001",
        "staffId": 14717314
      },
      {
        "staffCode": "QP_CAIJIHUI",
        "schdlStaffRelId": 203916543,
        "staffName": "蔡继辉",
        "relType": "1001",
        "staffId": 15008891
      },
      {
        "staffCode": "QP_YAOJINHUA",
        "schdlStaffRelId": 203916544,
        "staffName": "姚芹华",
        "relType": "1001",
        "staffId": 15008896
      },
      {
        "staffCode": "QP_LILINGLI",
        "schdlStaffRelId": 203916545,
        "staffName": "李玲莉",
        "relType": "1001",
        "staffId": 15008901
      }
    ]
  }
}

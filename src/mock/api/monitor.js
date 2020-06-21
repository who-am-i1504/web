export default [{
    path: '/api/monitor/rule_get',
    method: 'post',
    handle({params,Repeat}) {
      let {pageSize,page} = params
      return {
        status: 200,
        message: "success",
        data: Repeat(pageSize, {
          'id|+1': [1, 2, 3, 4, 5, 6],
          'ip|1': ['127.0.0.1','10.254.123.253','85.56.85.75']
        }),
        'size': 100000
      }
    }
  },
  {
    path: '/api/monitor/rule/add',
    method: 'post',
    handle({ params,Repeat }) {
      let { ip } = params
      return {
        status: 200,
        message: "success",
        data: {
          'id': 10000,
          'ip': ip
        }
      }
    }
  },
  {
    path: '/api/monitor/rule/update',
    method: 'post',
    handle({ params,Repeat }) {
      let { id,ip } = params
      return {
        status: 200,
        message: "success",
        data: {
          'id': id,
          'ip': ip
        }
      }
    }
  },
  {
    path: '/api/monitor/rule/delete',
    method: 'post',
    handle({ params, Repeat }) {
      let { id, ip } = params
      return {
        status: 200,
        message: "success",
        data: {}
      }
    }
  },
  {
    path: '/api/monitor/activate_find',
    method: 'post',
    handle({ params, Repeat }) {
      let { id, ip } = params
      return {
        status: 200,
        message: "success",
        data: {
          "10.246.229.255": {
            "tcp": {
              "21": {
                "endtime": "1591355765",
                "reason": "syn-ack",
                "reason_ttl": "128",
                "services": "ftp",
                "state": "open"
              },
              "104": {
                "endtime": "1591355765",
                "reason": "syn-ack",
                "reason_ttl": "128",
                "services": "dicom",
                "state": "open"
              },
              "80": {
                "endtime": "1591355765",
                "reason": "syn-ack",
                "reason_ttl": "128",
                "services": "http",
                "state": "open"
              }
            }
          }
        }    
      }
    }
  },
  {
    path: '/api/monitor/result/astm',
    method: 'post',
    handle({ params, Repeat }) {
      let { pageSize, page } = params;
      return {
        status: 200,
        message: 'success',
        data: Repeat(pageSize, {
          "id|+1": 3,
          "send_ip_port|1": ['127.0.0.1:8080', '127.0.0.1:80', '198.1.2.3:4500'],
          "sender_tag|1":[true, false],
          "receiver_tag|1":[true,false],
          "receiver_ip_port|1": ['127.0.0.1:8081', '127.0.0.1:81', '198.1.2.3:40'],
          "sender": 'BS-XXX^01.03.07.03^123456',
          "receiver": 'BS-XXX^01.03.07.03^123456',
          "processing": 'SA',
          'type|1': ['U^R01^ORU_R01', 'A^A01^ADT_A01'],
          'version|1': ['1394-97', '1394-02'],
          'message_time': '@datetime',
          'content': 'H|\^\n&\nP|1\nO|1|927529||^^^A1\^^^A2\nR|1|^^^A1|0.295||||||||19890327132247\nR|2|^^^A2|0.312||||||||19290327132248\nP|2\nO|1|927533||^^^A3\^^^A4\nR|1|^^^A3|1.121||||||||19890327132422\nR|2|^^^A4|1.097||||||||19890317132423\nL|1',
          'size': 1623,
        }),
        size: 100000

      }
    }
  },
  {
    path: '/api/monitor/result/hl7',
    method: 'post',
    handle({ params, Repeat }) {
      let { pageSize, page } = params;
      return {
        status: 200,
        message: 'success',
        data: Repeat(pageSize, {
          "id|+1": 3,
          "send_ip_port|1": ['127.0.0.1:8080', '127.0.0.1:80', '198.1.2.3:4500'],
          "receiver_ip_port|1": ['127.0.0.1:8081', '127.0.0.1:81', '198.1.2.3:40'],
          "sender_tag|1":[true, false],
          "receiver_tag|1":[true,false],
          "seqnumber|1": ['暂无', 1234, 5284, 5847, 893, 888],
          'size': 1623,
          'type|1': ['U^R01^ORU_R01', 'A^A01^ADT_A01'],
          'version|1': ['2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9'],
          'time': '@datetime',
          'content':'MSH|^~\&||MINDRAY_D-SERIES^00A037009A0053DE^EUI-64||||20190929092150000||ORU^R01^ORU_R01|374|P|2.6|||AL|NE||UNICODE UTF-8|||IHE_PCD_001^IHE PCD^1.3.6.1.4.1.19376.1.6.1.1.1^ISO\nPID|||^^^Hospital^PI||^^^^^^L\nPV1||I\nOBR|1||374^MINDRAY_D-SERIES^00A037009A0053DE^EUI-64|CONTINUOUS WAVEFORM|||20190929092149610|20190929092150610\nOBX|1|NA|151780^MDC_IMPED_TTHOR^MDC|1.7.1.151780|0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0|262656^MDC_DIM_DIMLESS^MDC\nOBX|2|NM|0^MDC_ATTR_SAMP_RATE^MDC|1.7.1.151780.1|500|264608^MDC_DIM_PER_SEC^MDC\nOBX|3|NM|2327^MDC_ATTR_NU_MSMT_RES^MDC|1.7.1.151780.2|1.000000|262656^MDC_DIM_DIMLESS^MDC\nOBX|4|NM|262196^MDC_EVT_INOP^MDC|1.7.1.151780.3|32767'
        }),
        size:100000
      }
    }
  },
  {
    path: '/api/monitor/result/dicom',
    method: 'post',
    handle({ params, Repeat }) {
      let { pageSize, page } = params;
      return {
        status: 200,
        message: 'success',
        data: Repeat(pageSize, {
          "id|+1": 3,
          "send_ip_port|1": ['127.0.0.1:8080', '127.0.0.1:80', '198.1.2.3:4500'],
          "receiver_ip_port|1": ['127.0.0.1:8081', '127.0.0.1:81', '198.1.2.3:40'],
          "seqnumber|1": ['暂无', 1234, 5284, 5847, 893, 888],
          'size': 1623,
          'type|1': ['U^R01^ORU_R01', 'A^A01^ADT_A01'],
          'version|1': ['2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9'],
          'time': '@datetime',
          'content':'MSH|^~\&||MINDRAY_D-SERIES^00A037009A0053DE^EUI-64||||20190929092150000||ORU^R01^ORU_R01|374|P|2.6|||AL|NE||UNICODE UTF-8|||IHE_PCD_001^IHE PCD^1.3.6.1.4.1.19376.1.6.1.1.1^ISO\nPID|||^^^Hospital^PI||^^^^^^L\nPV1||I\nOBR|1||374^MINDRAY_D-SERIES^00A037009A0053DE^EUI-64|CONTINUOUS WAVEFORM|||20190929092149610|20190929092150610\nOBX|1|NA|151780^MDC_IMPED_TTHOR^MDC|1.7.1.151780|0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0^0|262656^MDC_DIM_DIMLESS^MDC\nOBX|2|NM|0^MDC_ATTR_SAMP_RATE^MDC|1.7.1.151780.1|500|264608^MDC_DIM_PER_SEC^MDC\nOBX|3|NM|2327^MDC_ATTR_NU_MSMT_RES^MDC|1.7.1.151780.2|1.000000|262656^MDC_DIM_DIMLESS^MDC\nOBX|4|NM|262196^MDC_EVT_INOP^MDC|1.7.1.151780.3|32767'
        }),
        size:100000
      }
    }
  },
]
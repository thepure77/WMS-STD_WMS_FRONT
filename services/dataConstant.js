(function () {
    app.constant('msgSettings', {
        msgDelConfirm: "ยืนยันการลบข้อมูล",
        msgDelSucc: "ลบข้อมูลสำเร็จ",
        msgDelFail: "ลบข้อมูลไม่สำเร็จ",
    });
    var api = {
        //------- Producttion
        // PlanGR:         'https://or-dcwms.pttor.com/AMZ_WMS_PlanGRAPI/api/',
        // GR:             'https://or-dcwms.pttor.com/AMZ_WMS_GRAPI/api/',
        // Putaway:        'https://or-dcwms.pttor.com/AMZ_WMS_PutawayAPI/api/',
        // PO:             'https://or-dcwms.pttor.com/AMZ_WMS_POAPI/api/',
        // PlanGI:         'https://or-dcwms.pttor.com/AMZ_WMS_PlanGIAPI/api/',
        // GI:             'https://or-dcwms.pttor.com/AMZ_WMS_GIAPI/api/',
        // GI_Auto:        'https://or-dcwms.pttor.com/AMZ_WMS_GIAPI_AUTO_WAVE/api/',
        // Load:           'https://or-dcwms.pttor.com/AMZ_WMS_LoadAPI/api/',
        // Master:         'https://or-dcwms.pttor.com/AMZ_WMS_MasterAPI/api/',
        // GT:             'https://or-dcwms.pttor.com/AMZ_WMS_TransferAPI/api/',
        // BinBalance:     'https://or-dcwms.pttor.com/AMZ_WMS_BinBalanceAPI/api/',
        // Rollcage:       'https://or-dcwms.pttor.com/AMZ_WMS_RollCageAPI/api/',
        // YardDock:       'https://or-dcwms.pttor.com/AMZ_WMS_YardAPI/api/',
        // OMS:            'https://or-dcwms.pttor.com/AMZ_OMS_API/api/',
        // WCS:            'http://10.106.159.21/AMZ_WMS_WCSAPI/api/',

        //------- UAT
        // PlanGR:      'http://10.106.159.12/AMZ_WMS_PlanGRAPI/api/',
        // GR:          'http://10.106.159.12/AMZ_WMS_GRAPI/api/',
        // Putaway:     'http://10.106.159.12/AMZ_WMS_PutawayAPI/api/',
        // PO:          'http://10.106.159.12/AMZ_WMS_POAPI/api/',
        // PlanGI:      'http://10.106.159.12/AMZ_WMS_PlanGIAPI/api/',
        // GI:          'http://10.106.159.12/AMZ_WMS_GIAPI/api/',
        // Load:        'http://10.106.159.12/AMZ_WMS_LoadAPI/api/',
        // Master:      'http://10.106.159.12/AMZ_WMS_MasterAPI/api/',
        // GT:          'http://10.106.159.12/AMZ_WMS_TransferAPI/api/',
        // BinBalance:  'http://10.106.159.12/AMZ_WMS_BinBalanceAPI/api/',
        // Rollcage:    'http://10.106.159.12/AMZ_WMS_RollCageAPI/api/',
        // YardDock:    'http://10.106.159.12/AMZ_WMS_YardAPI/api/',
        // OMS:         'http://10.106.159.10/AMZ_OMS_API/api/',

        //------- UAT_S4
        // PlanGR:      'http://10.106.159.12/AMZ_WMS_PlanGRAPI_S4/api/',
        // GR:          'http://10.106.159.12/AMZ_WMS_GRAPI_S4/api/',
        // Putaway:     'http://10.106.159.12/AMZ_WMS_PutawayAPI_S4/api/',
        // PO:          'http://10.106.159.12/AMZ_WMS_POAPI_S4/api/',
        // PlanGI:      'http://10.106.159.12/AMZ_WMS_PlanGIAPI_S4/api/',
        // GI:          'http://10.106.159.12/AMZ_WMS_GIAPI_S4/api/',
        // Load:        'http://10.106.159.12/AMZ_WMS_LoadAPI_S4/api/',
        // Master:      'http://10.106.159.12/AMZ_WMS_MasterAPI_S4/api/',    
        // GT:          'http://10.106.159.12/AMZ_WMS_TransferAPI_S4/api/',
        // BinBalance:  'http://10.106.159.12/AMZ_WMS_BinBalanceAPI_S4/api/',
        // Rollcage:    'http://10.106.159.12/AMZ_WMS_RollCageAPI_S4/api/',
        // YardDock:    'http://10.106.159.12/AMZ_WMS_YardAPI_S4/api/',
        // OMS:         'http://10.106.159.10/AMZ_OMS_API_S4/api/',

        //------- Kasco
        PlanGR:      'http://203.151.56.165/AMZ_WMS_PlanGRAPI/api/',
        GR:          'http://203.151.56.165/AMZ_WMS_GRAPI/api/',
        Putaway:     'http://203.151.56.165/AMZ_WMS_PutawayAPI/api/',
        PO:          'http://203.151.56.165/AMZ_WMS_PO/api/',
        // PlanGI:      'http://203.151.56.165/AMZ_WMS_PlanGIAPI/api/',
        // GI:          'http://203.151.56.165/AMZ_WMS_GIAPI/api/',
        Load:        'http://203.151.56.165/AMZ_WMS_LoadAPI/api/',
        Master:      'http://203.151.56.165/AMZ_WMS_MasterAPI/api/',
        GT:          'http://203.151.56.165/AMZ_WMS_TransferAPI/api/',
        BinBalance:  'http://203.151.56.165/AMZ_WMS_BinBalanceAPI/api/',
        Rollcage:    'http://203.151.56.165/AMZ_WMS_RollCageAPI/api/',
        YardDock:    'http://203.151.56.165/AMZ_WMS_YardAPI/api/',

        //------- Localhost
        // PlanGR:      'https://localhost:44305/api/',
        // GR:          'https://localhost:44328/api/',
        // Putaway:     'https://localhost:44353/api/',
        // PO:          'https://localhost:44306/api/',
        PlanGI:      'https://localhost:44328/api/',
        GI:          'http://localhost:44345/api/',
        GI_Auto:     'http://localhost:44345/api/',
        // Load:        'https://localhost:44330/api/',
        // Master:      'https://localhost:44327/api/',
        // GT:          'https://localhost:44350/api/',
        // BinBalance:  'https://localhost:44354/api/',
        // Rollcage:    'https://localhost:44342/api/',
        // YardDock:    'https://localhost:44355/api/',
        // OMS:         'https://localhost:44340/api/',
        // WCS:         'https://localhost:44377/api/',
        // Report:      'https://localhost:44329/api/',
        //Report:      'https://localhost:5006/api/',

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        Pack: 'http://10.106.159.12/AMZ_WMS_PackAPI/api/',
        // Pack: 'http://10.106.159.12/AMZ_WMS_PackAPI_S4/api/',
        // Pack: 'http://kascoit.ddns.me:99/AMZ_WMS_PackAPI/api/',
        // Pack: 'https://localhost:44329/api/',

        // Reports
        // Report: 'http://10.106.159.12/AMZ_WMS_ReportAPI/api/',
        // Report: 'http://kascoit.ddns.me:99/AMZ_WMS_ReportAPI/api/',
       

        // Cyclecount
        // Cyclecount: 'http://10.106.159.12/AMZ_WMS_CyclecountAPI/api/',
        Cyclecount: 'http://kascoit.ddns.me:99/AMZ_WMS_CyclecountAPI/api/',
        // Cyclecount: 'https://localhost:44351/api/',

        // Dashboard
        // Dashboard: 'http://10.106.159.12/AMZ_WMS_Dashboard/api/',
        // Dashboard: 'http://kascoit.ddns.me:99/AMZ_WMS_DashboardAPI/api/',
        Dashboard: 'https://localhost:44339/api/',

        //Import
        // Import: 'http://10.106.159.12/AMZ_WMS_IMPORT/api/',
        Import: 'http://kascoit.ddns.me:99/AMZ_WMS_IMPORT/api/',

        // Bom
        // BOM: 'http://10.106.159.12/AMZ_WMS_BomAPI/api/',
        BOM: 'http://kascoit.ddns.me:99/AMZ_WMS_BomAPI/api/',
        // BOM: 'https://localhost:44351/api/',


        // Replenishment
        Replenishment: 'http://localhost:44027/api/',

        
        LogsUser: 'https://localhost:44355/api/',
        //LogsUser: 'http://10.106.159.12/AMZ_WMS_LogsAPI/api/',

        VirtualWarehousePreview: 'http://10.106.159.12/AMZ_WMS_VirtualWarehouse/api/',

        VirtualWarehouseManage: 'http://10.106.159.12/AMZ_WMS_VirtualWarehouse/api/',

        Claim: 'https://localhost:44328/api/',
    }


    var _url = api;
    app.constant('webServiceAPI', _url);
    app.constant('authenConstant', {
        url: 'api/User/addUser',
    });

    app.constant('ngAuthSettings', {
        WebService: _url,
        rootUrl: '',
        WebClient: '',
        ClientDirective: '',
        clientId: 'id',
        directory: {
            directive: '',
            modules: '',
            assets: '',
            widgets: ''
        }
    });

    app.constant('ngLangauge', [
        { id: 1, lang: "en", name: "EN" },
        { id: 2, lang: "th", name: "TH" },
        { id: 3, lang: "ch", name: "CH" }

    ]);
}());
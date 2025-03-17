app.requires.push('ngMessages');
app.requires.push('ngIntlTelInput');
app.controller("ctrlUyeOl", function ($scope, api, $parse, $http) {

    $scope.IsLoaded = true;
    $scope.UyeModel = {};
    $scope.UyeModel.defaultCountryCode = siteSettings.ulkeGosterme ? siteSettings.ulkeKodu : globalModel.countryCode;
    $scope.UyeModel.hideCountry = siteSettings.ulkeGosterme;
    $scope.UyeModel.districtCustomValueActive = siteSettings.adresAyarlari.ilceOzelDegerAktif;
    $scope.UyeModel.AdresAyarlari = siteSettings.adresAyarlari;
    $scope.UyeModel.Ulke = {};
    $scope.UyeModel.Sehir = {};
    $scope.UyeModel.Ilce = {};
    $scope.UyeModel.Semt = {};
    $scope.UyeModel.OgrenimDurumu = {};
    $scope.IsValidUyeOlCountry = true;
    $scope.IsValidUyeOlCity = true;
    $scope.IsValidUyeOlDistrict = true;
    $scope.IsValidUyeOlZone = true;
    $scope.IsValidUyeOlCinsiyet = true;
    $scope.IsValidUyeOlOgrenimDurumu = true;
    $scope.IsValidUyeOlSifreStrengthShowMessage;
    $scope.SayfaModel = siteSettings.uyelikSayfaParametre;
    $scope.SmsOnaySecili = false;
    $scope.otpLoginActive = siteSettings.otpLoginActive

    $scope.UyeModel.OtpAktif = false;
    if (siteSettings.smsAktif) {

    }

    //TV9-11586
    //if (siteSettings.uyelikYoneticiOnayiAktif || siteSettings.uyelikMailOnayiAktif) {
    //    $scope.SayfaModel.adresAlaniAktif = false;
    //}    

    $http.get("/api/member/CanUseOtp")
        .then(response => {
            $scope.UyeModel.OtpAktif = response.data;
        })

    $scope.zoneList = [];

    PrePareModel();

    api.getEducationStatus(null, function (response) {
        $scope.educationStatusList = response.educationStatus;
    });

    var getUyeOlCountry = function () {
        api.getCountry(null, function (response) {
            if (!response.isError) {
                $scope.countryUyeOlList = response.countries;
                var ulke = response.countries.filter(function (x) { return x.countryAlpha2 == globalModel.countryCode; })[0];
                $scope.UyeModel.Ulke.countryId = ulke.countryId;
                if (ulke.countryId > 0) {
                    $('#slcUlke').addClass('active');
                    $('#slcUlke').closest('.newUserWrapper').find('.placeholderLabel').addClass('active');
                }
                getUyeOlCity(ulke.countryId);
            }
        });
    };

    if (!$scope.UyeModel.hideCountry && $scope.FormAlan.UlkeGoster) {
        getUyeOlCountry();
    }
    else {
        getUyeOlCity(siteSettings.ulkeId);
    }

    function getUyeOlCity(countryID) {
        api.getCity({ CountryId: countryID }, function (response) {
            if (!response.isError)
                $scope.cityUyeOlList = response.cities;
        });
    };

    function getUyeOlDistrict(cityID, countryID) {
        api.getDistrict({ CityId: cityID, CountryId: countryID }, function (response) {
            if (!response.isError) {
                $scope.districtUyeOlList = response.districts;
            }
        });
    };

    function getUyeOlZone(districtID, cityID, countryID) {
        api.getZone({ DistrictId: districtID, CityId: cityID, CountryId: countryID }, function (response) {
            if (!response.isError)
                $scope.zoneList = response.zones;
        });
    };

    $scope.ChangeUyeOlCountry = function () {
        if ($scope.UyeModel.Sehir != undefined) {
            $scope.UyeModel.Sehir.cityId = 0;
        }
        if ($scope.UyeModel.Ilce != undefined) {
            $scope.UyeModel.Ilce.districtId = 0;
        }
        $scope.cityUyeOlList = [];
        $scope.districtUyeOlList = [];

        var countryID = typeof $scope.UyeModel.Ulke != "undefined" ? $scope.UyeModel.Ulke.countryId : 0;
        if (countryID == 0) {
            $scope.cityUyeOlList = [];
            $scope.districtUyeOlList = [];
            $scope.zoneList = [];
            $('#slcUlke').removeClass('active');
            $('#slcUlke').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            $('#slcSehir').removeClass('active');
            $('#slcSehir').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            $('#slcIlce').removeClass('active');
            $('#slcIlce').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            $('#slctZone').removeClass('active');
            $('#slctZone').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
        }
        else {
            getUyeOlCity(countryID);
            $('#slcUlke').addClass('active');
            $('#slcSehir').removeClass('active');
            $('#slcSehir').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            $('#slcIlce').removeClass('active');
            $('#slcIlce').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            $('#slctZone').removeClass('active');
            $('#slctZone').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
        }

    };

    $scope.ChangeUyeOlCity = function () {
        //  $scope.UyeModel.Ilce.districtId = 0;
        var countryID = typeof $scope.UyeModel.Ulke != "undefined" ? $scope.UyeModel.Ulke.countryId : 0;
        var cityID = typeof $scope.UyeModel.Sehir != "undefined" ? $scope.UyeModel.Sehir.cityId : 0;


        if ($scope.FormAlan.UlkeGoster && $scope.FormAlan.UlkeZorunlu && countryID == 0) {
            $scope.cityUyeOlList = [];
        }
        if (cityID == 0) {
            $scope.districtUyeOlList = [];
            $scope.zoneList = [];
            $('#slcSehir').removeClass('active');
            $('#slcSehir').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            $('#slcIlce').removeClass('active');
            $('#slcIlce').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            $('#slctZone').removeClass('active');
            $('#slctZone').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
        }
        else {
            getUyeOlDistrict(cityID, countryID);
            $('#slcSehir').addClass('active');
            $('#slcIlce').removeClass('active');
            $('#slcIlce').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            $('#slctZone').removeClass('active');
            $('#slctZone').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
        }
    };

    $scope.ChangeDistrict = function () {
        $scope.UyeModel.Semt.zoneId = 0;
        var countryID = typeof $scope.UyeModel.Ulke != "undefined" ? $scope.UyeModel.Ulke.countryId : 0;
        var cityID = typeof $scope.UyeModel.Sehir != "undefined" ? $scope.UyeModel.Sehir.cityId : 0;
        var districtId = typeof $scope.UyeModel.Ilce != "undefined" ? $scope.UyeModel.Ilce.districtId : 0;

        if (countryID == 0 || cityID == 0 || districtId == 0) {
            $scope.cityList = [];
            $scope.districtList = [];
            $scope.zoneList = [];
            $('#slcIlce').removeClass('active');
            $('#slcIlce').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            $('#slctZone').removeClass('active');
            $('#slctZone').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
        }
        else {
            getUyeOlZone(districtId, cityID, countryID);
            $('#slcIlce').addClass('active');
            $('#slctZone').removeClass('active');
            $('#slctZone').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
        }
    };

    $scope.ChangeZone = function (selectZone) {
        if (typeof selectZone == 'undefined') {
            $('#slctZone').removeClass('active');
            $('#slctZone').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
        }
        else {
            $('#slctZone').addClass('active');
        }
    };

    $scope.ChangeOgrenim = function (selectOgrenim) {
        if (typeof selectOgrenim == 'undefined') {
            $('#slcOgrenimDurumu').removeClass('active');
            $('#slcOgrenimDurumu').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
        }
        else {
            $('#slcOgrenimDurumu').addClass('active');
        }
    };
    $scope.ChangeDogum = function (selectDogum, element) {
        if (element == 'Gun') {
            if (selectDogum == '') {
                $('#slcDogumGunuGun').removeClass('active');
                $('#slcDogumGunuGun').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            }
            else {
                $('#slcDogumGunuGun').addClass('active');
            }
        }

        if (element == 'Ay') {
            if (selectDogum == '') {
                $('#slcDogumGunuAy').removeClass('active');
                $('#slcDogumGunuAy').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            }
            else {
                $('#slcDogumGunuAy').addClass('active');
            }
        }

        if (element == 'Yil') {
            if (selectDogum == '') {
                $('#slcDogumGunuYil').removeClass('active');
                $('#slcDogumGunuYil').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            }
            else {
                $('#slcDogumGunuYil').addClass('active');
            }
        }
    };
    $scope.ChangeCinsiyet = function (selectCinsiyet) {
        if (selectCinsiyet == '') {
            $('#slcCinsiyet').removeClass('active');
            $('#slcCinsiyet').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
        }
        else {
            $('#slcCinsiyet').addClass('active');
        }
    };
    $scope.ChangeDogum = function (selectDogum, element) {
        if (element == 'Gun') {
            if (selectDogum == '') {
                $('#slcDogumGunuGun').removeClass('active');
                $('#slcDogumGunuGun').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            }
            else {
                $('#slcDogumGunuGun').addClass('active');
            }
        }

        if (element == 'Ay') {
            if (selectDogum == '') {
                $('#slcDogumGunuAy').removeClass('active');
                $('#slcDogumGunuAy').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            }
            else {
                $('#slcDogumGunuAy').addClass('active');
            }
        }

        if (element == 'Yil') {
            if (selectDogum == '') {
                $('#slcDogumGunuYil').removeClass('active');
                $('#slcDogumGunuYil').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
            }
            else {
                $('#slcDogumGunuYil').addClass('active');
            }
        }
    };
    $scope.ChangeCinsiyet = function (selectCinsiyet) {
        if (selectCinsiyet == '') {
            $('#slcCinsiyet').removeClass('active');
            $('#slcCinsiyet').closest('.newUserWrapper').find('.placeholderLabel').removeClass('active');
        }
        else {
            $('#slcCinsiyet').addClass('active');
        }
    };

    $scope.RakamGirisKontrol = function (e) {
        if (e.charCode > 57 || (e.charCode > 32 && e.charCode < 48)) {
            e.preventDefault();
        }
    };

    $scope.RakamGirisKontrolKeyUp = function (e) {
        var intlNumber = $(e.target).intlTelInput("getSelectedCountryData");
        if (typeof intlNumber != 'undefined' && (intlNumber.iso2 == "tr" || intlNumber.iso2 == "bg")) {
            var countryCode = "+" + intlNumber.dialCode;
            var telNum = $(e.target).val();
            if (intlNumber.iso2 == "tr") {
                const newStr = telNum.replace(/^\+90/, "");
                var re = new RegExp("^[^5]");
                if (re.test(newStr.trim())) {
                    $(e.target).val(countryCode);
                }
            }
            if (intlNumber.iso2 == "bg") {
                var countryRegex = new RegExp("^\\" + countryCode);
                const newStr = telNum.replace(countryRegex, "");
                str = newStr.length > 0 ? newStr.trim() : "";
                var re = new RegExp(/^(8)/);
                if (!re.test(newStr.trim())) {
                    $(e.target).val(countryCode);
                }
                else {
                    if (newStr.trim().length >= 2) {
                        var re = new RegExp(/^(87|88|89)/);
                        if (!re.test(newStr.trim())) {
                            $(e.target).val(countryCode);
                        }
                    }
                }
            }

        }
    };

    $scope.UyeOlKaydet = async function (isValid, ivtControl, figenOtp) {
        $scope.UyeOlSubmitted = true;
        $scope.ProcessValidation = true;
        if (typeof $scope.UyeModel.Ad != "undefined" && $scope.UyeModel.Ad != "") {
            var fontControl = ValidateFont($scope.UyeModel.Ad, "fontRequiredAd");
            if (fontControl) {
                $('#txtAd').closest('.newUserWrapper').addClass('isRequiredDiv');
            } else {
                $('#txtAd').closest('.newUserWrapper').removeClass('isRequiredDiv');
            }
        }
        else {
            $('#txtAd').closest('.newUserWrapper').removeClass('isRequiredDiv');
            $('.fontRequiredAd').hide();
        }
        if (typeof $scope.UyeModel.SoyAd != "undefined" && $scope.UyeModel.SoyAd != "") {
            var fontControl = ValidateFont($scope.UyeModel.SoyAd, "fontRequiredSoyad");
            if (fontControl) {
                $('#txtSoyAd').closest('.newUserWrapper').addClass('isRequiredDiv');
            } else {
                $('#txtSoyAd').closest('.newUserWrapper').removeClass('isRequiredDiv');
            }
        }
        else {
            $('#txtSoyAd').closest('.newUserWrapper').removeClass('isRequiredDiv');
            $('.fontRequiredSoyad').hide();
        }

        if ($scope.UyeModel.SmsIzin) {
            $scope.SmsOnaySecili = true;
        }

        if ($scope.FormAlan.UlkeGoster && $scope.FormAlan.UlkeZorunlu) {

            if (typeof $scope.UyeModel.Ulke == "undefined" || !$scope.UyeModel.Ulke.countryId || $scope.UyeModel.Ulke.countryId == 0) {
                $scope.IsValidUyeOlCountry = false;
                $scope.ProcessValidation = false;
            } else {
                $scope.IsValidUyeOlCountry = true;
            }
        }
        if ($scope.FormAlan.SehirGoster && $scope.FormAlan.SehirZorunlu) {
            if (typeof $scope.UyeModel.Sehir == "undefined" || !$scope.UyeModel.Sehir.cityId || $scope.UyeModel.Sehir.cityId == 0) {
                $scope.IsValidUyeOlCity = false;
                $scope.ProcessValidation = false;
            } else {
                $scope.IsValidUyeOlCity = true;
            }
        }
        if ($scope.FormAlan.IlceGoster && $scope.FormAlan.IlceZorunlu) {
            if ($scope.UyeModel.Ulke.countryId == 1) {
                if (typeof $scope.UyeModel.Ilce == "undefined" || typeof $scope.UyeModel.Sehir == "undefined" || !$scope.UyeModel.Ilce.districtId || $scope.UyeModel.Ilce.districtId == 0) {
                    $scope.IsValidUyeOlDistrict = false;
                    $scope.ProcessValidation = false;
                } else {
                    $scope.IsValidUyeOlDistrict = true;
                }
            }
        }
        if ($scope.zoneList.length > 0 && $scope.FormAlan.SemtGoster && $scope.FormAlan.SemtZorunlu && $scope.UyeModel.AdresAyarlari.semtAktif) {
            if (!$scope.UyeModel.Semt.zoneId || $scope.UyeModel.Semt.zoneId == 0) {
                $scope.IsValidUyeOlZone = false;
                $scope.ProcessValidation = false;
            } else {
                $scope.IsValidUyeOlZone = true;
            }
        }
        if ($scope.FormAlan.CinsiyetGoster && $scope.FormAlan.CinsiyetZorunlu) {
            if (typeof $scope.UyeModel.Cinsiyet == "undefined") {
                $scope.IsValidUyeOlCinsiyet = false;
                $scope.ProcessValidation = false;
            }
            else {
                $scope.IsValidUyeOlCinsiyet = true;
            }
        }


        if ($scope.FormAlan.OgrenimDurumuGoster && $scope.FormAlan.OgrenimDurumuZorunlu) {
            if (!$scope.UyeModel.OgrenimDurumu.id || $scope.UyeModel.OgrenimDurumu.id == 0) {
                $scope.IsValidUyeOlOgrenimDurumu = false;
                $scope.ProcessValidation = false;
            } else {
                $scope.IsValidUyeOlOgrenimDurumu = true;
            }
        }

        if (!isValid || !$scope.ProcessValidation) {
            return;
        }

        var passwordValidResult = ValidationUserPassword($scope.UyeModel.Sifre);

        if (passwordValidResult.isError) {
            $scope.IsValidUyeOlSifreStrengthShowMessage = passwordValidResult.errorMessage;
            return;
        }
        else {
            $scope.IsValidUyeOlSifreStrengthShowMessage = '';
        }

        if ($scope.SayfaModel.adresAlaniAktif) {

            var adresScope = $('#divAdresDetay').scope().$parent;
            if (!$('#frmAdresDetay').scope().FormIsValid) {
                adresScope.SaveMemberAddres(false);
                return;
            }
        }

        if (siteSettings.uyelikSayfaParametre.dinamikFormAktif && siteSettings.uyelikSayfaParametre.dinamikFormId > 0) {
            var dinamikFormScope = $('#frmDinamikForm').scope();
            if (dinamikFormScope != "undefined") {
                var validation = dinamikFormScope.formValid;
                if (!validation) {
                    angular.element(document.getElementById('ngFormController')).scope().Save(false);
                    return;
                }
            }
        }

        var telefon = "";
        if (typeof $scope.UyeModel.CepTelefon != 'undefined') {
            var telefonZorunlu = $scope.FormAlan.telefonZorunlu;

            if (!telefonZorunlu) {
                if ($('#txtCepTelefon').intlTelInput("isValidNumber")) {
                    $('.telGecersiz').hide();
                    $('#txtCepTelefon').closest('.newUserWrapper').removeClass('isRequiredDiv');
                }
                else {
                    var val = $('#txtCepTelefon').val();
                    var regex = new RegExp("^\\+\\d{1,3}$");
                    var sonuc = regex.test(val);

                    if (!sonuc) {
                        $('.telGecersiz').show();
                        $('#txtCepTelefon').closest('.newUserWrapper').addClass('isRequiredDiv');
                        return;
                    }
                }
            }
            telefon = $scope.UyeModel.CepTelefon.replace("+", "");
            telefon = telefon.replace(/ /g, "");
        }

        if ($scope.UyeModel.MailAdres != '') {
            if (siteSettings.uyelikSayfaParametre.adresAlaniAktif) {
                var captha = $('.adresDetayGuvenlikKodu');
            } else {
                var captha = $('.uyeolGuvenlikKodu');
            }
            var input = $scope.UyeModel.MailAdres
            await CheckUser(input, 1, captha);
        }

        if ($('#txtCepTelefon').length > 0 || $('#txtCepTelefon').intlTelInput("isValidNumber")) {
            if (siteSettings.uyelikSayfaParametre.adresAlaniAktif) {
                var captha = $('.adresDetayGuvenlikKodu');
            } else {
                var captha = $('.uyeolGuvenlikKodu');
            }
            var input = $('#txtCepTelefon').val();
            await CheckUser(input, 2, captha);
        }

        if (!checkUserPhone) {
            return;
        }

        if (!checkUserCaptcha) {
            return;
        }

        if (!checkUserMail) {
            return;
        }

        var dogumGunu = "";
        if (!$scope.FormAlan.DogumGunuGoster) {
            dogumGunu = "01.01.1900";
        }

        dogumGunu = (typeof $scope.UyeModel.DogumGunuAy != 'undefined' ? $scope.UyeModel.DogumGunuAy : "01") + "." +
            (typeof $scope.UyeModel.DogumGunuGun != 'undefined' ? $scope.UyeModel.DogumGunuGun : "01") + "." +
            (typeof $scope.UyeModel.DogumGunuYil != 'undefined' ? $scope.UyeModel.DogumGunuYil : "1900");

        if (!$scope.UyeModel.Sozlesme) {
            return;
        }

        var guvenlikKodu = "";
        if (globalModel.xidActive) {
            if (siteSettings.uyelikSayfaParametre.adresAlaniAktif) {
                guvenlikKodu = $("#txtGuvenlikKodu").val();
                if (guvenlikKodu == "") {
                    $('#txtGuvenlikKodu').closest('.newUserWrapper').addClass('isRequiredDiv');
                    $(".adresDetayGuvenlikKodu  label.isRequired").show();
                    return;
                }
            }
            else {
                guvenlikKodu = $(".uyeolGuvenlikKodu #txtGuvenlikKodu").val();
                if (guvenlikKodu == "") {
                    $(".uyeolGuvenlikKodu label.isRequired").show();
                    $('#txtGuvenlikKodu').closest('.newUserWrapper').addClass('isRequiredDiv');
                    return;
                }
            }
        }
        let otp = $("#txtOtp").val();

        var requestMember = {
            Name: (typeof $scope.UyeModel.Ad != "undefined" ? $scope.UyeModel.Ad : ""),
            LastName: (typeof $scope.UyeModel.SoyAd != "undefined" ? $scope.UyeModel.SoyAd : ""),
            Telephone: telefon,
            EMail: $scope.UyeModel.MailAdres,
            CellPhone: telefon,
            Password: $scope.UyeModel.Sifre,
            PasswordUpdate: false,
            CountryId: (typeof $scope.UyeModel.Ulke != "undefined" ? $scope.UyeModel.Ulke.countryId : 0),
            CityId: (typeof $scope.UyeModel.Sehir != "undefined" ? $scope.UyeModel.Sehir.cityId : 0),
            District: (typeof $scope.UyeModel.IlceAdi != "undefined" ? $scope.UyeModel.IlceAdi : ""),
            DistrictId: (typeof $scope.UyeModel.Ilce != "undefined" ? $scope.UyeModel.Ilce.districtId : 0),
            ZoneId: $scope.UyeModel.AdresAyarlari.semtAktif ? $scope.UyeModel.Semt.zoneId : 0,
            DateOfBirth: dogumGunu,
            GenderId: (typeof $scope.UyeModel.Cinsiyet != "undefined" ? $scope.UyeModel.Cinsiyet : 2),
            JobTitle: (typeof $scope.UyeModel.Meslek != "undefined" ? $scope.UyeModel.Meslek : ""),
            EducationStatusId: ((typeof $scope.UyeModel.OgrenimDurumu != "undefined" && typeof $scope.UyeModel.OgrenimDurumu.id != "undefined") ? $scope.UyeModel.OgrenimDurumu.id : 0),
            SmsAllowed: $scope.UyeModel.SmsIzin,
            EmailAllowed: $scope.UyeModel.MailIzin,
            MemberTypeId: 1,
            MemberSource: $(window).width() < 992 ? (globalModel.isiosDevice || globalModel.isAndroidDevice ? 2 : 1) : 0,
            MemberProjectSource: 'UyeOl',
            XID: guvenlikKodu,
            GivenOtp: typeof figenOtp != 'undefined' ? figenOtp : otp,
            EncryptedOtp: window.__otp__
        };

        var smsPermission = requestMember.SmsAllowed;
        var mailpermission = requestMember.EmailAllowed

        if (siteSettings.siteYonetimAyar.iysApiAyar.iysYoluAktif) {
            smsPermission = false;
            mailpermission = false;
        }

        if (typeof ivtControl == "undefined") {
            ivtControl = false;
        }

        var formData = new FormData();
        formData.append("Name", requestMember.Name);
        formData.append("LastName", requestMember.LastName);
        formData.append("Telephone", requestMember.Telephone);
        formData.append("EMail", requestMember.EMail);
        formData.append("CellPhone", requestMember.CellPhone);
        formData.append("Password", requestMember.Password);
        formData.append("PasswordUpdate", requestMember.PasswordUpdate);
        formData.append("CountryId", requestMember.CountryId);
        formData.append("CityId", requestMember.CityId);
        formData.append("District", requestMember.District);
        formData.append("DistrictId", requestMember.DistrictId);
        formData.append("ZoneId", requestMember.ZoneId);
        formData.append("DateOfBirth", requestMember.DateOfBirth);
        formData.append("GenderId", requestMember.GenderId);
        formData.append("JobTitle", requestMember.JobTitle);
        formData.append("EducationStatusId", requestMember.EducationStatusId);
        formData.append("SmsAllowed", smsPermission);
        formData.append("EmailAllowed", mailpermission);
        formData.append("MemberTypeId", requestMember.MemberTypeId);
        formData.append("MemberSource", requestMember.MemberSource);
        formData.append("MemberProjectSource", requestMember.MemberProjectSource);
        formData.append("XID", requestMember.XID);
        formData.append("GivenOtp", requestMember.GivenOtp);
        formData.append("EncryptedOtp", requestMember.EncryptedOtp);
        formData.append("IVTVerify", ivtControl);

        if (siteSettings.uyelikSayfaParametre.dinamikFormAktif && siteSettings.uyelikSayfaParametre.dinamikFormId > 0) {
            var formScope = angular.element(document.getElementById('ngFormController')).scope();

            var dinamikFormData = formScope.$parent.getFormData();

            for (var fd of dinamikFormData.entries()) {
                //Daha önce veri eklenmiş mi diye kontrol edelim(sayfa postback olduğunda var olan veriyi tekrar eklememesi için)
                var data = formData.get(fd[0]);
                if (data == null) {
                    formData.append(fd[0], fd[1]);
                }
                console.log(fd[0]);
                console.log(fd[1]);
            }

            //formData.append("DynamicFormId", dinamikFormData.get("DynamicFormId"));
            //formData.append("FormData", dinamikFormData.get("FormData"));
            //formData.append("ObjectType", dinamikFormData.get("ObjectType"));
            //formData.append("FormAction", dinamikFormData.get("FormAction"));
            //formData.append("ObjectId", dinamikFormData.get("ObjectId"));

            //var fileIndex = 1;
            //for (var i = 0; i < fileIndex; i++) {

            //}

            //formScope.OutParams.ObjectId = response.memberId;
            //formScope.Save(true);
        }



        var request = new XMLHttpRequest();
        //request.addEventListener("load", reqListener);
        request.open("POST", "/api/member/SaveMemberAndLoginV2");
        request.send(formData);

        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                var saveMemberAndLoginResponse = JSON.parse(request.responseText);
                if (siteSettings.siteYonetimAyar.iysApiAyar.iysYoluAktif && (requestMember.EmailAllowed || requestMember.SmsAllowed)) {
                    if (requestMember.EmailAllowed)
                        saveMemberAndLoginResponse.redirectUrl += "&mper=" + true;
                    if (requestMember.SmsAllowed)
                        saveMemberAndLoginResponse.redirectUrl += "&sper=" + true;
                }
                callBackSaveMember(saveMemberAndLoginResponse);
            }
        };

        function callBackSaveMember(response) {
            if (response.isError) {

                if (response.xidActive) {
                    globalModel.xidActive = true;
                    $(".xIDDiv").show();
                    $('#txtGuvenlikKodu').val("");
                    $('#txtGuvenlikKodu').closest('.newUserWrapper').addClass('isRequiredDiv');
                    $('#imgTicimaxCaptcha').attr('src', '/api/Captcha/GetCaptcha?v=' + new Date().getTime());
                    swal({
                        title: " ",
                        text: response.errorMessage,
                        type: "warning",
                        confirmButtonColor: "#DD6B55",
                        closeOnConfirm: false,
                        confirmButtonText: translateIt('Global_Tamam'),
                    });
                }
                else {
                    if (response.isIVTRequired) {
                        $scope.IVTVerifyChange(response);
                    } else if (!response.isIVTRequired && response.dataId) {
                        $scope.UyeOlKaydet(true, true);
                        return;
                    } else if (!response.isIVT && response.isIVTRequired) {
                        swal({
                            title: response.errorCode,
                            text: response.errorMessage,
                            type: "warning",
                        });
                    } else {
                        if (response.figenSoft != null) {
                            if (response.figenSoft.otpRequired && !response.figenSoft.otpCheck) {
                                $scope.FigenSignVerify();
                            }
                            if (response.figenSoft.otpRequired && response.figenSoft.otpCheck) {
                                $('#FigenOnay .phnCtrlContDiv').removeClass('pionNone');
                                $('#FigenOnay #figenSmsControl').val('');
                                swal({
                                    title: response.errorCode,
                                    text: response.figenSoft.message,
                                    type: "warning",
                                });
                            }
                            if (!response.figenSoft.otpRequired) {
                                $('#FigenOnay .phnCtrlContDiv').removeClass('pionNone');
                                $('#FigenOnay #figenSmsControl').val('');
                                swal({
                                    title: response.errorCode,
                                    text: response.figenSoft.message,
                                    type: "warning",
                                });
                            }
                        } else {
                            swal({
                                title: response.errorCode,
                                text: response.errorMessage,
                                type: "warning",
                            });
                        }
                    }
                }
                //Processden Çıkılması Lazım
                return;
            }
            else {

                if (!response.redirectUrl.includes("UyelikTamamlandi")) {
                    if (typeof visiLab != "undefined") {
                        visiLab.AddParameter("OM.exVisitorID", $scope.UyeModel.MailAdres);
                        visiLab.AddParameter("OM.b_sgnp", "1");
                        visiLab.AddParameter("OM.sms", $scope.UyeModel.SmsIzin);
                        visiLab.AddParameter("OM.email", $scope.UyeModel.MailIzin);
                        visiLab.Collect();
                        visiLab.SuggestActions();
                    }
                }
                
                $("#FigenOnay").remove();

                if (siteSettings.personaClickAktif) {
                    var dateOfBirth = "";
                    var isValidBirthday = false;
                    if (typeof dogumGunu != 'undefined' && dogumGunu != "") {
                        dateOfBirth = new Date(dogumGunu);
                        var minDate = new Date("01.01.1900");
                        var currentDate = new Date();
                        isValidBirthday = dateOfBirth > minDate && dateOfBirth < currentDate;
                        if (isValidBirthday) {
                            var year = dateOfBirth.getFullYear();
                            var month = ("0" + (dateOfBirth.getMonth() + 1)).slice(-2);
                            var day = ("0" + dateOfBirth.getDate()).slice(-2);
                            dateOfBirth = `${year}-${month}-${day}`.toString();
                        }
                    }
                    var personaClickLocation = "";
                    if (globalModel.member.memberCountryCode != undefined && globalModel.member.memberCountryCode != null && globalModel.member.memberCountryCode != '') {
                        personaClickLocation = globalModel.member.memberCountryCode;
                    }

                    personaclick('profile', 'set',
                        {
                            id: response.memberId,
                            email: $scope.UyeModel.MailAdres,
                            birthday: isValidBirthday ? dateOfBirth.toString() : "",
                            location: personaClickLocation
                        });
                    personaclick('segment', 'add', {
                        email: requestMember.EMail,
                        phone: requestMember.CellPhone,
                        segment_id: siteSettings.personaClickUyeSegmentId,
                        shop_id: siteSettings.personaShopId,
                        shop_secret: siteSettings.personaShopSecret
                    });
                }

                if (!response.isError || (response.errorCode == "Err-Login-003" || response.errorCode == "Err-Login-004")) {

                    SetStokBilgilendirme(response.stockAlerts);
                    SetFavoriListe(response.favoritesProduct);

                    /* Adres Active  */
                    if ($scope.SayfaModel.adresAlaniAktif) {
                        var adresScope = $('#divAdresDetay').scope().$parent;
                        adresScope.SaveMemberAddres(true);
                    }
                    /* Adres Active  */

                    setTimeout(function () {
                        RedirectProcess(response.redirectUrl);
                    }, 500);
                }
                else {

                    RedirectProcess(response.redirectUrl);

                }



            }

        }

        //api.saveMemberAndLogin(requestMember, function (response) {


        //    /* Dinamik Form Active */
        //    if (siteSettings.uyelikSayfaParametre.dinamikFormAktif && siteSettings.uyelikSayfaParametre.dinamikFormId > 0) {
        //        var formScope = angular.element(document.getElementById('ngFormController')).scope();
        //        formScope.OutParams.ObjectId = response.memberId;
        //        formScope.Save(true);
        //    }
        //    /* Dinamik Form Active */


        //});
    };


    $scope.IVTVerifyChange = async function (res) {
        $.get(siteSettings.siteYonetimAyar.sablonAyar.sablonYolu + "/Genel/IvtYoluOnayUye.html?v=" + new Date() +"", function (page_data) {
            res.phone = $scope.UyeModel.CepTelefon.replace("90","");
            res.pageControl = 'YeniUye';
            var html = Handlebars.compile(page_data)(res);
            $('body').append(html);
            initLang();
        });
    }

    $scope.FigenSignVerify = function () {
        $.get(siteSettings.siteYonetimAyar.sablonAyar.sablonYolu + "/Genel/FigenYoluOnayUye.html?v=" + new Date()+"", function (page_data) {
            var model = {
                pageType: 'UyeOl'
            }
            var html = Handlebars.compile(page_data)(model);
            $('body').append(html);
            initLang();
        });
    }

    function ValidateFont(input, className) {
        var invalidChars = "";

        for (var c of input) {
            if (c == " ") {
                continue;
            }
            if (!c.match(/[\u0041-\u005A\u0061-\u007A\u00C0-\u00FF\u0100-\u024F\u1E00-\u1EFF\u2C60-\u2C7F\u0400-\u04FF\uA720-\uA7FF\u0600-\u06FF]+/u)) {
                invalidChars += c;
            }
        }

        if (invalidChars.length > 0) {
            $('.' + className).text(translateIt('Validation_FontControl'));
            console.log("Invalid Chars : " + invalidChars);
            $('.' + className).append(' " ' + invalidChars + ' "');
            $('.' + className).show();
            $scope.ProcessValidation = false;
            return true;
        }
        else {
            $('.' + className).hide();
            return false;
        }
    }

    function RedirectProcess(redirectUrl) {
        if (siteSettings.uyelikYoneticiOnayiAktif || siteSettings.uyelikMailOnayiAktif) {
            window.location.href = redirectUrl;
        }
        else {
            var queryString = getQueryStringByName('ReturnUrl');
            if (queryString != null) {
                window.location.href = queryString.replace('://', '');
            }
            else {

                if (redirectUrl == "" || redirectUrl == null) {
                    window.location.href = '/';
                }
                else {
                    window.location.href = redirectUrl.replace('://', '');
                }
            }
        }
    }

    function PrePareModel() {
        var sayfaParams = siteSettings.uyelikSayfaParametre.alanParametre;
        for (var i = 0; i < sayfaParams.length; i++) {


            var model = $parse("FormAlan." + sayfaParams[i].alanAdi + "Goster");
            model.assign($scope, sayfaParams[i].goster);

            //Göster false zorunluluk kaldırılır
            model = $parse("FormAlan." + sayfaParams[i].alanAdi + "Zorunlu");
            model.assign($scope, (sayfaParams[i].goster ? sayfaParams[i].zorunlu : false));

        }

        $scope.UyelikSozlesmeSecim = siteSettings.uyelikSayfaParametre.alanParametre.filter(function (el) {
            return el.alanAdi === "UyelikSozlesmeSecim";
        })[0];

        $scope.UyelikKampanyaEmailSecim = siteSettings.uyelikSayfaParametre.alanParametre.filter(function (el) {
            return el.alanAdi === "KampanyaEmailSecim";
        })[0];

        $scope.UyelikKampanyaSmsSecim = siteSettings.uyelikSayfaParametre.alanParametre.filter(function (el) {
            return el.alanAdi === "KampanyaSmsSecim";
        })[0];
        var telefonAlanParametre = siteSettings.uyelikSayfaParametre.alanParametre.filter(function (el) {
            return el.alanAdi === "CepTelefonu";
        })[0];

        $scope.UyeModel.MailIzin = typeof $scope.UyelikKampanyaEmailSecim !== 'undefined' ? ($scope.UyelikKampanyaEmailSecim.deger || false) : false;
        $scope.UyeModel.SmsIzin = typeof $scope.UyelikKampanyaSmsSecim !== 'undefined' ? ($scope.UyelikKampanyaSmsSecim.deger || false) : false;
        $scope.UyeModel.Sozlesme = typeof $scope.UyelikSozlesmeSecim !== 'undefined' ? ($scope.UyelikSozlesmeSecim.deger || false) : false;
        
        if ($scope.UyeModel.MailIzin) {
            $('#cbMailIzin').prop('checked', true);
        }
        if ($scope.UyeModel.SmsIzin) {
            $('#cbSmsIzin').prop('checked', true);
        }
        if (!telefonAlanParametre.zorunlu && $scope.UyeModel.SmsIzin) {
            $scope.SmsOnaySecili = true;
        }
    }

    $scope.SayiOlustur = function (min, max, step, setAutoMax, descending) {
        step = step || 1;
        var input = [];
        max = !setAutoMax ? max : new Date().getFullYear();
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        if (descending) {
            input.reverse();
        }
        return input;
    };

    if (globalModel.xidActive) {
        $(".xIDDiv").show();
        $('#imgTicimaxCaptcha').attr('src', 'handlers/TicimaxCaptcha.ashx');
    }

    $scope.SetCheckbox = function ($event) {
        var element = angular.element($event.target);
        var isCheck = element.prop('checked');
        var chkLabel = element.parent().parent().find("label");

        if (isCheck) {
            $scope.SmsOnaySecili = true;
        }
        else {
            $scope.SmsOnaySecili = false;
        }

        if (chkLabel.hasClass('aktifChekbox')) {
            chkLabel.removeClass('aktifChekbox');
        }
        else {
            chkLabel.addClass('aktifChekbox');
        }
    }

});

function setCustomCheckBox(element) {
    var chkLabel = $(element).parent().parent().find("label");

    if (chkLabel.hasClass('aktifChekbox')) {
        chkLabel.removeClass('aktifChekbox');
    }
    else {
        chkLabel.addClass('aktifChekbox');
    }
}

function setCinsiyet(element) {
    $("#divCinsiyetAlan label").removeClass('aktifChekbox');
    $(element).parent().addClass('aktifChekbox');
}

function GuvenlikKoduYenile() {
    $('#imgTicimaxCaptcha').attr('src', '/api/Captcha/GetCaptcha?v=' + new Date().getTime());
}

jQuery(document).ready(function () {
    window.mem.form.progressPass('#passControlSignPass', '#txtSifre', '.passControlSignPassProgress');
});

function ValidationUserPassword(password) {
    var response = {
        isError: false,
        errorMessage: ''
    };
    if (!siteSettings.otpLoginActive) {
        var sifreAyar = siteSettings.uyeAyar.sifreAyar;

        if (password.length > sifreAyar.maksimumUzunluk || password.length < sifreAyar.minimumUzunluk) {
            response.isError = true;
            response.errorMessage = translateIt("Validation_SifreMinimumMinimumDegerKontrol").replace("{0}", sifreAyar.minimumUzunluk).replace("{1}", sifreAyar.maksimumUzunluk);
            return response;
        }

        var customErrorMessage = '';
        if (sifreAyar.buyukHarfZorunlu && !/[A-Z]/.test(password)) {
            customErrorMessage += " " + translateIt("Global_BuyukHarf").toLowerCase() + ",";
        }
        else if (sifreAyar.harfZorunlu && !/[A-Z-a-z]/.test(password)) {
            customErrorMessage += " " + translateIt("Global_Harf").toLowerCase() + ",";
        }

        if (sifreAyar.rakamZorunlu && !/[0-9]/.test(password)) {
            customErrorMessage += " " + translateIt("Global_Rakam").toLowerCase() + ",";
        }

        if (sifreAyar.ozelKarakterZorunlu && !/[^A-Za-z0-9\x20]/.test(password)) {
            customErrorMessage += " " + translateIt("Global_OzelKarakter").toLowerCase() + ",";
        }

        if (customErrorMessage !== '') {
            customErrorMessage = customErrorMessage.substring(0, customErrorMessage.length - 1);
            response.isError = true;
            response.errorMessage = translateIt("Validation_Sifresnizde0Bulunmalidir").replace("{0}", customErrorMessage);
            return response;
        }
    }
    return response;
}

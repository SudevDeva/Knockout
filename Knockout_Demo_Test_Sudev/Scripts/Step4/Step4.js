var viewModel;
$(document).ready(function () {
    InitialLoading();
    Step1Load();
});
var isBound = function (id) {
    return !!ko.dataFor(document.getElementById(id));
};
function InitialLoading() {
    //$.ajax({
    //    url: "/UserDetails/GetAppraiserInformation",
    //    success: function (data) {
    //console.log(data);

    var data = '{ "AppraiserID": 120, "UserID": 239, "Name": "Sudevpk", "CompanyName": "pkCompany", "CompanyAddress": "cool", "CompanyAddressLine2": " 73301", "TelephoneNumber": "112-233-4455", "EmailAddress": "Sudevv@pathfinderanalysis1.com", "StateCertificationNo": null, "StateLicenseNo": null, "Other": null, "StateNo": null, "State": "AL", "StateName": "Alabama", "ExpirationDateofCertificationorLicense": "/Date(1577817000000)/", "SignatureFileName": "239_Signature.jpg", "SignPassword": "12345", "FederalTaxNo": null, "EmployeeId": null, "CreatedDate": "/Date(1498046562880)/", "CreatedBy": 239, "UpdatedDate": "/Date(1498046562880)/", "UpdatedBy": 239, "LogoFileName": "239_CompanyLogo.jpg", "LogoSource": "", "SignSource": "" }';
    data = JSON.parse(data);
    var element = $('#UserInformation')[0];
    if (isBound('UserInformation')) {
        ko.mapping.fromJS(data, mapping, viewModel);
        viewModel.valueHasMutated();
    }
    else {
        //var fromdate = ConvertJsonDate(data.ClassSearchCriteria.SaleDateFrom);
        viewModel = new ViewModel(ko.mapping.fromJS(data, mapping));
        ko.applyBindings(viewModel, element);
        //$(".DatePickerCtrl").datepicker();
    }
    //    },
    //    error: function (data) {
    //        alert('error');
    //    }
    //})
}
function ViewModel(data) {
    var self = this;
    self.User = data();
    self.submit = function (data, e) {
        alert(JSON.stringify(self.User).replace(new RegExp(',', 'g'), '\n'));
    };
    self.fileUpload = function (data, e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onloadend = function (onloadend_e) {
            var result = reader.result; // Here is your base 64 encoded file. Do with it what you want.
            self.User.LogoSource(result);
            self.saveImage(result, "CompanyLogo");
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };
    self.fileUploadSign = function (data, e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onloadend = function (onloadend_e) {
            var result = reader.result; // Here is your base 64 encoded file. Do with it what you want.
            self.User.SignSource(result);
            self.saveImage(result, "Signature");
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };
    self.downloadSign = function (data, e) {
        downloadSign();
    };
    self.saveImage = function (result, LogoName) {
        $.ajax({
            url: "/UserDetails/GetLogo",
            type: "POST",
            data: {
                dataUrlforCompanyLogo: ko.toJSON(result),
                LogoName: LogoName
            },
            async: false,
            success: function (result) {
            }
        });
    };
    self.forgotPassword = function () {
        email = self.User.EmailAddress();
        if (email) {
            $.ajax({
                url: "/UserDetails/ForgetSignPasswordSendEmail",
                type: 'POST',
                data: { email: email },
                cache: false,
                async: false,
                success: function (data) {
                    alert(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var responseTitle = $($(jqXHR.responseText).filter('title').get(0)).text();
                    alert(responseTitle);
                }
            });
        }
        else {
            alert("Please Enter Email Address !")
        }
    };
    var ExpirationDateofCertificationorLicense = self.User.ExpirationDateofCertificationorLicense() == null ? " " : self.User.ExpirationDateofCertificationorLicense();
    if (ExpirationDateofCertificationorLicense != " ") {
        self.ExpirationDateofCertificationorLicense = ko.observable(ExpirationDateofCertificationorLicense);
        self.User.ExpirationDateofCertificationorLicense = ko.computed({
            read: function () {
                return moment(self.ExpirationDateofCertificationorLicense()).format('L');
            },
            write: function (value) {
                self.ExpirationDateofCertificationorLicense(moment(value).toDate());
            }
        });
    }
}
var mapping = {
    create: function (options) {
        var User = ko.mapping.fromJS(options.data);
        return ko.observable(User);
    }
};
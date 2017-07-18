var windowURL = window.URL || window.webkitURL;
//test Sudev
ko.bindingHandlers.file = {
    init: function (element, valueAccessor) {
        $(element).change(function () {
            var file = this.files[0];
            var fsize = file.size;
            var ftype = file.type;

            if (ko.isObservable(valueAccessor())) {
                valueAccessor()(file);
            }
        });
    },

    update: function (element, valueAccessor, allBindingsAccessor) {
        var file = ko.utils.unwrapObservable(valueAccessor());
        var bindings = allBindingsAccessor();

        if (bindings.fileObjectURL && ko.isObservable(bindings.fileObjectURL)) {
            var oldUrl = bindings.fileObjectURL();
            if (oldUrl) {
                windowURL.revokeObjectURL(oldUrl);
            }
            bindings.fileObjectURL(file && windowURL.createObjectURL(file));
        }

        if (bindings.fileBinaryData && ko.isObservable(bindings.fileBinaryData)) {
            if (!file) {
                bindings.fileBinaryData(null);
            } else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    bindings.fileBinaryData(e.target.result);
                };
                reader.readAsArrayBuffer(file);
            }
        }
    }
};
var isBound = function (id) {
    return !!ko.dataFor(document.getElementById(id));
};
var mapping = {
    create: function (options) {
        var File = ko.mapping.fromJS(options.data);
        return ko.observable(File);
    }
};
function Step1Load() {
    var element = $('#fileUpload')[0];
    if (isBound('fileUpload')) {
        imageListModel.valueHasMutated();
    }
    else {
        ko.applyBindings(ImageListModel, element);
    }
}
//First View Model
var ImageListModel = function () {
    var self = this;
    var slotModel = function () {
        var that = {};
        that.imageFile = ko.observable();
        that.imageObjectURL = ko.observable();
        that.imageBinary = ko.observable();
        return that;
    };
    self.images = ko.observableArray([slotModel()]);
   
    return self;
}();


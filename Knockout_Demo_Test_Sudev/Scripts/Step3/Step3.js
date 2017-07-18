var MenuModel = function () {
    this.name = ko.observable().subscribeTo("nickName");
    this.sections = ["Profile", "Notifications"];
    this.selectedSection = ko.observable().publishOn("section");
};

var ProfileModel = function () {
    //publish updates to the nick name
    this.nickName = ko.observable("Ryan").publishOn("nickName");

    //apply a filter to turn the value that we receive into a boolean
    this.visible = ko.observable().subscribeTo("section", function (newValue) {
        return newValue === "Profile";
    });

    //subscribe and publish on the "email" topic to keep this observable in sync between view models
    this.emailAddress = ko.observable("ryan@knockmeout.net").syncWith("email");
};

var NotificationsModel = function () {
    this.visible = ko.observable(false);
    //as an alternative, use a direct subscription on the topic to update the observable
    ko.postbox.subscribe("section", function (newValue) {
        this.visible(newValue === "Notifications");
    }, this);

    //subscribe and publish on the "email" topic to keep this observable in sync between view models
    this.emailAddress = ko.observable("ryan@knockmeout.net").syncWith("email");

    this.sendNewsLetter = ko.observable(false);
};

//three independent view models, that have no direct references to each other
ko.applyBindings(new MenuModel(), document.getElementById("menu"));
ko.applyBindings(new ProfileModel(), document.getElementById("profile"));
ko.applyBindings(new NotificationsModel(), document.getElementById("notifications"));
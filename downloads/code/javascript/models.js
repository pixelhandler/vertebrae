// List of models  
// --------------
// Models in this directory are intended for site-wide usage  

// This module is used with the r.js optimizer tool during build  
// See http://requirejs.org/docs/faq-optimization.html

// Requires `define`  See <http://requirejs.org/docs/api.html#define>  
// Returns {Object} model constructor references

define([
        "models/application-state", 
        "models/base", 
        "models/event", 
        "models/member-summary", 
        "models/messaging"
        ], 
function (
        ApplicationStateModel,
        BaseModel,
        EventModel,
        MemberSummaryModel,
        MessagingModel
        ) {

    // Add models in this same directory to this object, 
    // for use when requiring this module.
    // grouping site-wide models in this module (object)
    // optimizes the performance and keeps dependencies organized
    // when the (build) optimizer is run.
    return {
        "ApplicationStateModel": ApplicationStateModel,
        "BaseModel": BaseModel,
        "EventModel": EventModel,
        "MemberSummaryModel": MemberSummaryModel,
        "MessagingModel": MessagingModel
    };

});

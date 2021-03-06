"use strict";
var ASSERT = require("./assert.js");
var PromiseArray = require( "./promise_array.js" );
var PromiseInspection = require( "./promise_inspection.js" );
var util = require("./util.js");
var inherits = util.inherits;
// the PromiseArray to use with Promise.settle method

function SettledPromiseArray( values, caller, boundTo ) {
    this.constructor$( values, caller, boundTo );
}
inherits( SettledPromiseArray, PromiseArray );

SettledPromiseArray.prototype._promiseResolved =
function SettledPromiseArray$_promiseResolved( index, inspection ) {
    ASSERT(typeof index === "number");
    this._values[ index ] = inspection;
    var totalResolved = ++this._totalResolved;
    if( totalResolved >= this._length ) {
        this._fulfill( this._values );
    }
};

//override
SettledPromiseArray.prototype._promiseFulfilled =
function SettledPromiseArray$_promiseFulfilled( value, index ) {
    if( this._isResolved() ) return;
    ASSERT( typeof index === "number" );
    var ret = new PromiseInspection();
    ret._bitField = IS_FULFILLED;
    ret._resolvedValue = value;
    this._promiseResolved( index, ret );
};
//override
SettledPromiseArray.prototype._promiseRejected =
function SettledPromiseArray$_promiseRejected( reason, index ) {
    if( this._isResolved() ) return;
    ASSERT( typeof index === "number" );
    var ret = new PromiseInspection();
    ret._bitField = IS_REJECTED;
    ret._resolvedValue = reason;
    this._promiseResolved( index, ret );
};

module.exports = SettledPromiseArray;

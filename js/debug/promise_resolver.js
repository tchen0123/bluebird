/**
 * Copyright (c) 2013 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
"use strict";
var util = require( "./util.js" );
var errors = require( "./errors.js");
var TimeoutError = errors.TimeoutError;
var async = require( "./async.js" );
var haveGetters = util.haveGetters;
var nodebackForResolver = util.nodebackForResolver;

var PromiseResolver;
if( !haveGetters ) {
    PromiseResolver = function PromiseResolver( promise ) {
        this.promise = promise;
        this.asCallback = nodebackForResolver( this );
    };
}
else {
    PromiseResolver = function PromiseResolver( promise ) {
        this.promise = promise;
    };
}
if( haveGetters ) {
    Object.defineProperty( PromiseResolver.prototype, "asCallback", {
        get: function() {
            return nodebackForResolver( this );
        }
    });
}

PromiseResolver.prototype.toString = function PromiseResolver$toString() {
    return "[object PromiseResolver]";
};

PromiseResolver.prototype.fulfill = function PromiseResolver$fulfill( value ) {
    if( this.promise._tryAssumeStateOf( value, false ) ) {
        return;
    }
    async.invoke( this.promise._fulfill, this.promise, value );
};

PromiseResolver.prototype.reject = function PromiseResolver$reject( reason ) {
    this.promise._attachExtraTrace( reason );
    async.invoke( this.promise._reject, this.promise, reason );
};

PromiseResolver.prototype.progress =
function PromiseResolver$progress( value ) {
    async.invoke( this.promise._progress, this.promise, value );
};

PromiseResolver.prototype.cancel = function PromiseResolver$cancel() {
    async.invoke( this.promise.cancel, this.promise, void 0 );
};

PromiseResolver.prototype.timeout = function PromiseResolver$timeout() {
    this.reject( new TimeoutError( "timeout" ) );
};

PromiseResolver.prototype.isResolved = function PromiseResolver$isResolved() {
    return this.promise.isResolved();
};

PromiseResolver.prototype.toJSON = function PromiseResolver$toJSON() {
    return this.promise.toJSON();
};

module.exports = PromiseResolver;

var supertest = require("supertest");
//var should = require("should");
let chai = require('chai');
let chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
// import { expect } from 'chai';

var server = supertest.agent("http://localhost:8080")


describe("Unit test for Getting a user", function () {

    it("should not return Data of a specific user", function (done) {

        // calling home page api
        server
            .get("")
            .send({ })
            .end(function (err, res) {
                if (res) {
                    (res).should.have.status(200);
                    done();
                }
            })
    });

});
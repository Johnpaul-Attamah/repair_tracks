import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import User from '../models/User';


const should = chai.should();

chai.use(chaiHttp);

describe('Administrator', () => {

    const fakeToken = '56hhhi88090990-09jjhbbbtggbll*nbkj';
    const testUserToken = {};
    const adminUserToken = {};
    const testUserId = {id: '5f50ee81ec72c9148cafe77d'};
    const superVisorId = {};
    const engineerId = {};
    const testerVisorId = {};
    const testineerId = {};

    before((done) => {
        User.findOne({
                    email: 'supervisor@email.com'
                }, (err, res) => {
                    superVisorId.id = res._id;
            done();
        })
    });

    before((done) => {
        User.findOne({
                    email: 'engineer@email.com'
                }, (err, res) => {
                    engineerId.id = res._id;
            done();
        })
    });
    before((done) => {
        User.findOne({
                    email: 'testervisor@email.com'
                }, (err, res) => {
                    testerVisorId.id = res._id;
            done();
        })
    });

    before((done) => {
        User.findOne({
                    email: 'testineer@email.com'
                }, (err, res) => {
                    testineerId.id = res._id;
            done();
        })
    });

    before((done) => {
            const user = {
                inputValue: 'scapegoat@email.com',
                password: 'scapeGOAT2020',
            };
            chai.request(server)
                .post('/api/v1/auth/login')
                .send(user)
                .end((err, res) => {
                    testUserToken.token = res.body.token;
                    done();
                });
        });
    before((done) => {
            const user = {
                inputValue: 'administrator@email.com',
                password: 'superADMIN001',
            };
            chai.request(server)
                .post('/api/v1/auth/login')
                .send(user)
                .end((err, res) => {
                    adminUserToken.token = res.body.token;
                    done();
                });
        });

    
    describe('/put - create supervisor user', () => {
        it("Should not create supervisor when token didn't match", (done) => {
            chai.request(server)
                .put(`/api/v1/user/supervisor/${superVisorId.id}`)
                .set('Authorization', fakeToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.eql({});
                    done(err);
                });
        });
        it("Should not create supervisor when user is not admin ", (done) => {
            chai.request(server)
                .put(`/api/v1/user/supervisor/${superVisorId.id}`)
                .set('Authorization', testUserToken.token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noPermission').eql('Only administrators can create a supervisor');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it("Should not create supervisor when user id is not found", (done) => {
            chai.request(server)
                .put(`/api/v1/user/supervisor/${testUserId.id}`)
                .set('Authorization', adminUserToken.token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('userNotFound').eql('user not found');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it("Should create supervisor.", (done) => {
            chai.request(server)
                .put(`/api/v1/user/supervisor/${superVisorId.id}`)
                .set('Authorization', adminUserToken.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('supervisor');
                    res.body.supervisor.should.have.property('role').eql('supervisor');
                    res.body.should.have.property('message').eql('user updated successfully');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it("Should create a test supervisor.", (done) => {
            chai.request(server)
                .put(`/api/v1/user/supervisor/${testerVisorId.id}`)
                .set('Authorization', adminUserToken.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('supervisor');
                    res.body.supervisor.should.have.property('role').eql('supervisor');
                    res.body.should.have.property('message').eql('user updated successfully');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
    });
    
    describe('/get - view all supervisors', () => {
        it("Should not view supervisor when token didn't match", (done) => {
            chai.request(server)
                .get(`/api/v1/user/supervisor/all`)
                .set('Authorization', fakeToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.eql({});
                    done(err);
                });
        });
        it("Should not view supervisors when user is not admin ", (done) => {
            chai.request(server)
                .get(`/api/v1/user/supervisor/all`)
                .set('Authorization', testUserToken.token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noPermission').eql('Only administrators can view supervisors');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it("Should view supervisors.", (done) => {
            chai.request(server)
                .get(`/api/v1/user/supervisor/all`)
                .set('Authorization', adminUserToken.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('outputValue');
                    res.body.outputValue.should.be.a('array');
                    res.body.should.have.property('message').eql('supervisors fetched successfully');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
    });
    
    describe('/get - get supervisor by id', () => {
        it("Should not get supervisor when token didn't match", (done) => {
            chai.request(server)
                .get(`/api/v1/user/supervisor/${superVisorId.id}`)
                .set('Authorization', fakeToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.eql({});
                    done(err);
                });
        });
        it("Should not view supervisor when user is not admin ", (done) => {
            chai.request(server)
                .get(`/api/v1/user/supervisor/${superVisorId.id}`)
                .set('Authorization', testUserToken.token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noPermission').eql('Only administrators can view supervisor');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it("Should not view supervisor when id is not a supervisor", (done) => {
            chai.request(server)
                .get(`/api/v1/user/supervisor/${engineerId.id}`)
                .set('Authorization', adminUserToken.token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('notSupervisor').eql('User is not a supervisor');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it("Should view supervisor by id.", (done) => {
            chai
              .request(server)
              .get(`/api/v1/user/supervisor/${superVisorId.id}`)
              .set("Authorization", adminUserToken.token)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("outputValue");
                res.body.should.have.property("message").eql("supervisor fetched successfully");
                res.body.should.have.property("status").eql("success");
                done();
              });
        });
    });

    describe("/put - demote supervisor user", () => {
      it("Should not remove supervisor when token didn't match", (done) => {
        chai
          .request(server)
          .put(`/api/v1/user/supervisor/demote/${superVisorId.id}`)
          .set("Authorization", fakeToken)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.eql({});
            done(err);
          });
      });
      it("Should not remove supervisor when user is not admin ", (done) => {
        chai
          .request(server)
          .put(`/api/v1/user/supervisor/demote/${superVisorId.id}`)
          .set("Authorization", testUserToken.token)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.errors.should.have
              .property("noPermission")
              .eql("Only administrators can demote a supervisor");
            res.body.should.have.property("status").eql("failed");
            done();
          });
      });
      it("Should not remove supervisor when user id is not found", (done) => {
        chai
          .request(server)
          .put(`/api/v1/user/supervisor/demote/${testUserId.id}`)
          .set("Authorization", adminUserToken.token)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.errors.should.have
              .property("userNotFound")
              .eql("user not found");
            res.body.should.have.property("status").eql("success");
            done();
          });
      });
      it("Should not remove supervisor when user is not a supervisor", (done) => {
        chai
          .request(server)
          .put(`/api/v1/user/supervisor/demote/${engineerId.id}`)
          .set("Authorization", adminUserToken.token)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.errors.should.have
              .property("notSupervisor")
              .eql("User is not a supervisor");
            res.body.should.have.property("status").eql("failed");
            done();
          });
      });
      it("Should remove a supervisor.", (done) => {
        chai
          .request(server)
          .put(`/api/v1/user/supervisor/demote/${testerVisorId.id}`)
          .set("Authorization", adminUserToken.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("newUser");
            res.body.newUser.should.have.property("role").eql("basic");
            res.body.should.have
              .property("message")
              .eql("supervisor demoted successfully");
            res.body.should.have.property("status").eql("success");
            done();
          });
      });
    });
    
    describe('/put - create an Engineer user', () => {
        it("Should not create an Engineer when token didn't match", (done) => {
            chai.request(server)
                .put(`/api/v1/user/engineer/${engineerId.id}`)
                .set('Authorization', fakeToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.eql({});
                    done(err);
                });
        });
        it("Should not create an Engineer when user is not admin ", (done) => {
            chai.request(server)
                .put(`/api/v1/user/engineer/${engineerId.id}`)
                .set('Authorization', testUserToken.token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noPermission').eql('Only administrators can add an engineer');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it("Should not create an Engineer when user id is not found", (done) => {
            chai.request(server)
                .put(`/api/v1/user/engineer/${testUserId.id}`)
                .set('Authorization', adminUserToken.token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('userNotFound').eql('user not found');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it("Should create an Engineer.", (done) => {
            chai.request(server)
                .put(`/api/v1/user/engineer/${engineerId.id}`)
                .set('Authorization', adminUserToken.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('engineer');
                    res.body.engineer.should.have.property('role').eql('engineer');
                    res.body.should.have.property('message').eql('user updated successfully');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it("Should create a test Engineer.", (done) => {
            chai.request(server)
                .put(`/api/v1/user/engineer/${testineerId.id}`)
                .set('Authorization', adminUserToken.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('engineer');
                    res.body.engineer.should.have.property('role').eql('engineer');
                    res.body.should.have.property('message').eql('user updated successfully');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
    });

    describe("/get - view all engineers", () => {
      it("Should not view engineer when token didn't match", (done) => {
        chai
          .request(server)
          .get(`/api/v1/user/engineer/all`)
          .set("Authorization", fakeToken)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.eql({});
            done(err);
          });
      });
      it("Should not view engineers when user is not admin ", (done) => {
        chai
          .request(server)
          .get(`/api/v1/user/engineer/all`)
          .set("Authorization", testUserToken.token)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.errors.should.have
              .property("noPermission")
              .eql("Only administrators can view engineers");
            res.body.should.have.property("status").eql("failed");
            done();
          });
      });
      it("Should view engineers.", (done) => {
        chai
          .request(server)
          .get(`/api/v1/user/engineer/all`)
          .set("Authorization", adminUserToken.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("outputValue");
            res.body.outputValue.should.be.a("array");
            res.body.should.have
              .property("message")
              .eql("engineers fetched successfully");
            res.body.should.have.property("status").eql("success");
            done();
          });
      });
    });
    
    describe("/get - get engineer by id", () => {
      it("Should not get engineer when token didn't match", (done) => {
        chai
          .request(server)
          .get(`/api/v1/user/engineer/${engineerId.id}`)
          .set("Authorization", fakeToken)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.eql({});
            done(err);
          });
      });
      it("Should not view engineer when user is not admin ", (done) => {
        chai
          .request(server)
          .get(`/api/v1/user/engineer/${engineerId.id}`)
          .set("Authorization", testUserToken.token)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.errors.should.have
              .property("noPermission")
              .eql("Only administrators can view engineer");
            res.body.should.have.property("status").eql("failed");
            done();
          });
      });
      it("Should not view engineer when id is not an engineer", (done) => {
        chai
          .request(server)
          .get(`/api/v1/user/engineer/${superVisorId.id}`)
          .set("Authorization", adminUserToken.token)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.errors.should.have
              .property("notEngineer")
              .eql("User is not an engineer");
            res.body.should.have.property("status").eql("success");
            done();
          });
      });
      it("Should view engineer by id.", (done) => {
        chai
          .request(server)
          .get(`/api/v1/user/engineer/${engineerId.id}`)
          .set("Authorization", adminUserToken.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("outputValue");
            res.body.should.have
              .property("message")
              .eql("engineer fetched successfully");
            res.body.should.have.property("status").eql("success");
            done();
          });
      });
    });
    
});
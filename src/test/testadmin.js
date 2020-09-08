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
    });
    
});
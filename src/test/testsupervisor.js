import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import User from '../models/User';
import Request from '../models/Request';


const should = chai.should();

chai.use(chaiHttp);

describe('Supervisor', () => {

    const supervisorToken = {};
    const fakeToken = '56hhhi88090990-09jjhbbbtggbll*nbkj';
    const testRequestId = {id: '5f50ee81ec72c9148cafe77d'};
    const testUserToken = {};
    const requestId= {};
    const cancelId= {};

    before((done) => {
        const supervisor = {
            inputValue: 'supervisor@email.com',
            password: 'superVISE2020',
        };
        chai.request(server)
            .post('/api/v1/auth/login')
            .send(supervisor)
            .end((err, res) => {
                supervisorToken.token = res.body.token;
                done();
            });
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

    describe('GET - view all requests', () => {
        it("Should not get requests when token didn't match", (done) => {
            chai.request(server)
                .get(`/api/v1/supervisor/request`)
                .set('Authorization', fakeToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.eql({});
                    done(err);
                });
        });
        it("Should not get all requests when user is not a supervisor ", (done) => {
            chai.request(server)
                .get(`/api/v1/supervisor/request`)
                .set('Authorization', testUserToken.token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noPermission').eql('Only supervisors can view all requests');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it('it should show all requests', (done) => {
            chai.request(server)
                .get('/api/v1/supervisor/request')
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('allRequests');
                    res.body.allRequests[0].should.have.property('createdBy').to.be.a('string');
                    res.body.allRequests[0].should.have.property('section').to.be.a('string');
                    res.body.allRequests[0].should.have.property('request').to.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('message').eql('requests fetched successfully');
                    requestId.id = res.body.allRequests[0].request._id;
                    done();
                });
        });

    });

    describe('GET - View single request', () => {
        it("Should not get a request when token didn't match", (done) => {
            chai.request(server)
                .get(`/api/v1/supervisor/request/${requestId.id}`)
                .set('Authorization', fakeToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.eql({});
                    done(err);
                });
        });
        it("Should not get a request when user is not a supervisor ", (done) => {
            chai.request(server)
                .get(`/api/v1/supervisor/request/${requestId.id}`)
                .set('Authorization', testUserToken.token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noPermission').eql('Only supervisors can view a request');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it('it should show no request if id is not found', (done) => {
            chai.request(server)
                .get('/api/v1/supervisor/request/5f49a9919e89172054d7dad8')
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noRequest').eql('The request is not found');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it('it should show 500 error if id is less than 2bytes', (done) => {
            chai.request(server)
                .get('/api/v1/supervisor/request/5f49a9919')
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it('it should show request by id', (done) => {
            chai.request(server)
                .get(`/api/v1/supervisor/request/${requestId.id}`)
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('request');
                    res.body.should.have.property('createdBy').to.be.a('string');
                    res.body.should.have.property('section').to.be.a('string');
                    res.body.should.have.property('request').to.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('message').eql('request fetched successfully');
                    done();
                });
        });

    })

    describe('/put - supervisor mark status as started', () => {
        it("Should not update status when token didn't match", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/start/${requestId.id}`)
                .set('Authorization', fakeToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.eql({});
                    done(err);
                });
        });
        it("Should not update status when user is not a supervisor ", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/start/${requestId.id}`)
                .set('Authorization', testUserToken.token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noPermission').eql('Only Supervisors can Update request Status');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it("Should not update when request id is not found", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/start/${testRequestId.id}`)
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noRequest').eql('The request is not found');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it("Should update request status to started.", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/start/${requestId.id}`)
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('upDatedRequest');
                    res.body.upDatedRequest.should.have.property('status').eql('started');
                    res.body.should.have.property('msg').eql('Request Updated successfully');
                    res.body.should.have.property('status').eql('Success');
                    done();
                });
        });
        
    });

    describe('/put - supervisor mark status as in-progress', () => {
        it("Should not update status when token didn't match", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/inprogress/${requestId.id}`)
                .set('Authorization', fakeToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.eql({});
                    done(err);
                });
        });
        it("Should not update status when user is not a supervisor ", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/inprogress/${requestId.id}`)
                .set('Authorization', testUserToken.token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noPermission').eql('Only Supervisors can Update request Status');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it("Should not update when request id is not found", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/inprogress/${testRequestId.id}`)
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noRequest').eql('The request is not found');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it("Should update request status to in-progress.", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/inprogress/${requestId.id}`)
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('upDatedRequest');
                    res.body.upDatedRequest.should.have.property('status').eql('in-progress');
                    res.body.should.have.property('msg').eql('Request Updated successfully');
                    res.body.should.have.property('status').eql('Success');
                    done();
                });
        });
        
    });
    
    describe('/put - supervisor mark status as processing...', () => {
        it("Should not update status when token didn't match", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/processing/${requestId.id}`)
                .set('Authorization', fakeToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.eql({});
                    done(err);
                });
        });
        it("Should not update status when user is not a supervisor ", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/processing/${requestId.id}`)
                .set('Authorization', testUserToken.token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noPermission').eql('Only Supervisors can Update request Status');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it("Should not update when request id is not found", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/processing/${testRequestId.id}`)
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noRequest').eql('The request is not found');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it("Should update request status to processing...", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/processing/${requestId.id}`)
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('upDatedRequest');
                    res.body.upDatedRequest.should.have.property('status').eql('processing...');
                    res.body.should.have.property('msg').eql('Request Updated successfully');
                    res.body.should.have.property('status').eql('Success');
                    done();
                });
        });
        
    });

    describe('/put - supervisor mark status as completed', () => {
        it("Should not update status when token didn't match", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/completed/${requestId.id}`)
                .set('Authorization', fakeToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.eql({});
                    done(err);
                });
        });
        it("Should not update status when user is not a supervisor ", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/completed/${requestId.id}`)
                .set('Authorization', testUserToken.token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noPermission').eql('Only Supervisors can Update request Status');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it("Should not update when request id is not found", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/completed/${testRequestId.id}`)
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noRequest').eql('The request is not found');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it("Should update request status to completed.", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/completed/${requestId.id}`)
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('upDatedRequest');
                    res.body.upDatedRequest.should.have.property('status').eql('completed');
                    res.body.should.have.property('msg').eql('Request Updated successfully');
                    res.body.should.have.property('status').eql('Success');
                    done();
                });
        });
        
    });
    describe('/put - supervisor mark status as rejected', () => {
        it("Should not update status when token didn't match", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/cancel/${requestId.id}`)
                .set('Authorization', fakeToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.eql({});
                    done(err);
                });
        });
        it("Should not update status when user is not a supervisor ", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/cancel/${requestId.id}`)
                .set('Authorization', testUserToken.token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noPermission').eql('Only Supervisors can Update request Status');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it("Should not update when request id is not found", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/cancel/${testRequestId.id}`)
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noRequest').eql('The request is not found');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it("Should update request status to rejected.", (done) => {
            chai.request(server)
                .put(`/api/v1/supervisor/request/cancel/${requestId.id}`)
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('upDatedRequest');
                    res.body.upDatedRequest.should.have.property('status').eql('rejected');
                    res.body.should.have.property('msg').eql('Request Updated successfully');
                    res.body.should.have.property('status').eql('Success');
                    done();
                });
        });
        
    });

    describe('GET - view all cancel requests', () => {
        it("Should not get cancel requests when token didn't match", (done) => {
            chai.request(server)
                .get(`/api/v1/supervisor/request/cancel`)
                .set('Authorization', fakeToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.eql({});
                    done(err);
                });
        });
        it("Should not get all cancel requests when user is not a supervisor ", (done) => {
            chai.request(server)
                .get(`/api/v1/supervisor/request/cancel/all`)
                .set('Authorization', testUserToken.token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noPermission').eql('Only supervisors can view all cancel requests');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it('it should show all cancel requests', (done) => {
            chai.request(server)
                .get('/api/v1/supervisor/request/cancel/all')
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('allCancelRequests');
                    res.body.allCancelRequests[0].should.have.property('createdBy').to.be.a('string');
                    res.body.allCancelRequests[0].should.have.property('section').to.be.a('string');
                    res.body.allCancelRequests[0].should.have.property('rcode').to.be.a('string');
                    res.body.allCancelRequests[0].should.have.property('cancelled').to.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('message').eql('requests fetched successfully');
                    cancelId.id = res.body.allCancelRequests[0].cancelled._id;
                    done();
                });
        });

    });

    describe('GET - View single request', () => {
        it("Should not get a cancel request when token didn't match", (done) => {
            chai.request(server)
                .get(`/api/v1/supervisor/request/cancel/${cancelId.id}`)
                .set('Authorization', fakeToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.eql({});
                    done(err);
                });
        });
        it("Should not get a cancel request when user is not a supervisor ", (done) => {
            chai.request(server)
                .get(`/api/v1/supervisor/request/cancel/${cancelId.id}`)
                .set('Authorization', testUserToken.token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noPermission').eql('Only supervisors can view a cancel request');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it('it should show no cancel request if id is not found', (done) => {
            chai.request(server)
                .get('/api/v1/supervisor/request/cancel/5f49a9919e89172054d7dad8')
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noRequest').eql('The request is not found');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it('it should show 500 error if id is less than 2bytes', (done) => {
            chai.request(server)
                .get('/api/v1/supervisor/request/cancel/ca5f49a9919')
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it('it should show a cancel request by id', (done) => {
            chai.request(server)
                .get(`/api/v1/supervisor/request/cancel/${cancelId.id}`)
                .set('Authorization', supervisorToken.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('createdBy').to.be.a('string');
                    res.body.should.have.property('section').to.be.a('string');
                    res.body.should.have.property('rcode').to.be.a('string');
                    res.body.should.have.property('cancelledRequest').to.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('message').eql('cancel request fetched successfully');
                    done();
                });
        });

    })

})
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
    const testUserToken = {};
    const requestId= {};

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
                .get('/api/v1/request/5f49a9919e89172054d7dad8')
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
                .get('/api/v1/request/5f49a9919')
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

})
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import Cancel from '../models/Cancel';


const should = chai.should();

chai.use(chaiHttp);

describe('User Cancel request', () => {
    before((done) => {
        Cancel.deleteMany({}, (err) => {
            done();
        });
    });

    const tokenObject = {};
    const tokenObject2 = {};
    const fakeToken = '56hhhi88090990-09jjhbbbtggbll*nbkj';
    const request_id = {};
    const request_id2 = {};
    const cancel_id = {};
    const cancel_id2 = {};

    describe('post-make a cancel request', () => {
        before((done) => {
            const user = {
                inputValue: 'johnson@email.com',
                password: 'johnSON2020',
            };
            chai.request(server)
                .post('/api/v1/auth/login')
                .send(user)
                .end((err, res) => {
                    tokenObject.token = res.body.token;
                    done();
                });
        });
        before((done) => {
            const user = {
                inputValue: 'engineer@email.com',
                password: 'engineEER2020',
            };
            chai.request(server)
                .post('/api/v1/auth/login')
                .send(user)
                .end((err, res) => {
                    tokenObject2.token = res.body.token;
                    done();
                });
        });

        before((done) => {
            const cancelRequest = {
                title: 'cancel this one',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'
            };
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(cancelRequest)
                .end((err, res) => {
                    request_id.id = res.body.newRequest['_id'];
                    done();
                });
        });
        before((done) => {
            const cancelRequest = {
                title: 'cancel this two',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'
            };
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(cancelRequest)
                .end((err, res) => {
                    request_id2.id = res.body.newRequest['_id'];
                    done();
                });
        });


        it('should generate token', (done) => {
            tokenObject.should.be.a('object');
            tokenObject.should.have.property('token').not.eql('');
            tokenObject.token.slice(0, 6).should.eql('Bearer');
            done();
        });

        it("Should not create a cancel request when token didn't match", (done) => {
            let cancelRequest = {
                reason: 'Cancel reason'
            }
            chai.request(server)
                .post(`/api/v1/cancel/${request_id.id}`)
                .set('Authorization', fakeToken)
                .send(cancelRequest)
                .end((err, req) => {
                    req.should.have.status(401);
                    req.body.should.be.eql({});
                    done(err);
                });
        });

        it('it should not create a cancel request without a reason', (done) => {
            let cancelRequest = {}
            chai.request(server)
                .post(`/api/v1/cancel/${request_id.id}`)
                .set('Authorization', tokenObject.token)
                .send(cancelRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('reason').eql('Cancel reason is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('should create a cancel request to be deleted', (done) => {
            const cancelRequest = {
                reason: 'misteikdf title'
            };
            chai.request(server)
                .post(`/api/v1/cancel/${request_id2.id}`)
                .set('Authorization', tokenObject.token)
                .send(cancelRequest)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('cancelRequest');
                    res.body.should.have.property('createdBy');
                    res.body.should.have.property('rcode').to.be.a('string');
                    res.body.cancelRequest.should.have.property('title').eql('cancel this two');
                    res.body.createdBy.should.have.property('handle').eql('Manchi');
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('message').eql('cancel request submitted successfully');
                    cancel_id2.id = res.body.cancelRequest['_id'];
                    done();
                });
        });
        it('should create a cancel request', (done) => {
            const cancelRequest = {
                reason: 'reason for cancelation'
            };
            chai.request(server)
                .post(`/api/v1/cancel/${request_id.id}`)
                .set('Authorization', tokenObject.token)
                .send(cancelRequest)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('cancelRequest');
                    res.body.should.have.property('createdBy');
                    res.body.should.have.property('rcode').to.be.a('string');
                    res.body.cancelRequest.should.have.property('title').eql('cancel this one');
                    res.body.createdBy.should.have.property('handle').eql('Manchi');
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('message').eql('cancel request submitted successfully');
                    cancel_id.id = res.body.cancelRequest['_id'];
                    done();
                });
        });
        it('should not create a cancel request if cancel request has been made', (done) => {
            const cancelRequest = {
                reason: 'Please reject'
            };
            chai.request(server)
                .post(`/api/v1/cancel/${request_id.id}`)
                .set('Authorization', tokenObject.token)
                .send(cancelRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('requestExists').eql('Request for cancellation has already been made.');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it('it should not create a cancel request if id is not found', (done) => {
            let cancelRequest = {
                reason: 'I have a good reason here'
            }
            chai.request(server)
                .post('/api/v1/cancel/5f49a9919e89172054d7dad8')
                .set('Authorization', tokenObject.token)
                .send(cancelRequest)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noRequest').eql('The request is not found');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it('it should not create a cancel request when user have no profile', (done) => {
            let cancelRequest = {
                reason: 'I no want again'
            }
            chai.request(server)
                .post(`/api/v1/cancel/${request_id.id}`)
                .set('Authorization', tokenObject2.token)
                .send(cancelRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noProfile').eql('Edit profile to continue');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
    })

    describe('/GET - View user cancel requests', () => {
        it('it should show no cancel requests if empty', (done) => {
            chai.request(server)
                .get('/api/v1/cancel')
                .set('Authorization', tokenObject2.token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noCancelRequests').eql('You have not made any cancel requests');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it('it should show no cancel request if id is not found', (done) => {
            chai.request(server)
                .get('/api/v1/cancel/5f49a9919e89172054d7dad8')
                .set('Authorization', tokenObject.token)
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
                .get('/api/v1/cancel/5f49a9919')
                .set('Authorization', tokenObject.token)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it('it should show all logged-in user cancel requests', (done) => {
            chai.request(server)
                .get('/api/v1/cancel')
                .set('Authorization', tokenObject.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('cancelRequests');
                    res.body.cancelRequests[0].should.have.property('profile').to.be.a('string');
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('message').eql('cancel requests fetched successfully');
                    done();
                });
        });

        it('it should show logged-in user cancel request by id', (done) => {
            chai.request(server)
                .get(`/api/v1/cancel/${cancel_id.id}`)
                .set('Authorization', tokenObject.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('cancelRequest');
                    res.body.cancelRequest.should.have.property('profile').to.be.a('string');
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('message').eql('cancel request fetched successfully');
                    done();
                });
        });

    })

    describe('/delete - remove cancel requests', () => {
        it("Should not delete cancel request when token didn't match", (done) => {
            chai.request(server)
                .delete(`/api/v1/cancel/${cancel_id2.id}`)
                .set('Authorization', fakeToken)
                .end((err, req) => {
                    req.should.have.status(401);
                    req.body.should.be.eql({});
                    done(err);
                });
        });
        it('it should not remove cancel request if id is not found', (done) => {
            chai.request(server)
                .delete('/api/v1/cancel/5f49a9919e89172054d7dad8')
                .set('Authorization', tokenObject.token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noRequest').eql('The cancel request is not found');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it('it should should remove cancel request if status is new', (done) => {
            chai.request(server)
                .delete(`/api/v1/cancel/${cancel_id2.id}`)
                .set('Authorization', tokenObject.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql('Cancel request Deleted Successfully');
                    done();
                });
        });
    });

})
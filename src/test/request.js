import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import Request from '../models/Request';


const should = chai.should();

chai.use(chaiHttp);

describe('User Requests', () => {

    before((done) => {
        Request.deleteMany({}, (err) => {
            done();
        });
    });

    const tokenObject = {};
    const tokenObject2 = {};
    const fakeToken = '56hhhi88090990-09jjhbbbtggbll*nbkj';
    const scapeGoatToken = {};
    const request_id = {};

    describe('/post - Create requests', ()=> {
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
            const user = {
                inputValue: 'scapegoat@email.com',
                password: 'scapeGOAT2020',
            };
            chai.request(server)
                .post('/api/v1/auth/login')
                .send(user)
                .end((err, res) => {
                    scapeGoatToken.token = res.body.token;
                    done();
                });
        });

        it('should generate token', (done) => {
            tokenObject.should.be.a('object');
            tokenObject.should.have.property('token').not.eql('');
            tokenObject.token.slice(0, 6).should.eql('Bearer');
            done();
        });

        it("Should not create a request when token didn't match", (done) => {
            let userRequest = {
                title: 'Request title',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', fakeToken)
                .send(userRequest)
                .end((err, req) => {
                    req.should.have.status(401);
                    req.body.should.be.eql({});
                    done(err);
                });
        });

        it('it should not create a request without a title', (done) => {
            let userRequest = {
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('title').eql('Request title is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a request without a valid title', (done) => {
            let userRequest = {
                title: 'R',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('title').eql('Title should be between 2 and 40 characters');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a request without a section field', (done) => {
            let userRequest = {
                title: 'Request title',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('section').eql('Section is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a request without a valid section field', (done) => {
            let userRequest = {
                title: 'Request title',
                section: 's',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('section').eql('Section is between 2 and 20 characters');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a request without branch field', (done) => {
            let userRequest = {
                title: 'Request title',
                section: 'Technical',
                location: 'Maitama',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('branch').eql('Branch field is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a request with no location field', (done) => {
            let userRequest = {
                title: 'Request title',
                section: 'Technical',
                branch: 'Abuja',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('location').eql('location is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a request without a description field', (done) => {
            let userRequest = {
                title: 'Request title',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('description').eql('Request description field is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });

        it('should create request to be deleted', (done) => {
            const userRequest = {
                title: 'Request title',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'   
            };
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('newRequest');
                    res.body.should.have.property('createdBy');
                    res.body.newRequest.should.have.property('rcode').to.be.a('string');
                    res.body.createdBy.should.have.property('handle').eql('Manchi');
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('message').eql('request created successfully');
                    request_id.id = res.body.newRequest['_id'];
                    done();
                });
        });
        it('should create request for user', (done) => {
            const userRequest = {
                title: 'Request2 title',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'   
            };
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('newRequest');
                    res.body.should.have.property('createdBy');
                    res.body.newRequest.should.have.property('rcode').to.be.a('string');
                    res.body.createdBy.should.have.property('handle').eql('Manchi');
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('message').eql('request created successfully');
                    request_id.id = res.body.newRequest['_id'];
                    done();
                });
        });
        it('should not create request if request exists', (done) => {
            const userRequest = {
                title: 'Request2 title',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'   
            };
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('requestExists').eql('Request already exists.');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it('it should not create a request when user have no profile', (done) => {
            let userRequest = {
                title: 'Request title',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject2.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noProfile').eql('Edit profile to continue');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        
        describe('/GET - View user requests', () => {
            it('it should show no requests if empty', (done) => {
                chai.request(server)
                    .get('/api/v1/request')
                    .set('Authorization', tokenObject2.token)
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');
                        res.body.errors.should.have.property('noRequests').eql('You have not made any requests');
                        res.body.should.have.property('status').eql('success');
                        done();
                    });
            });
            it('it should show no request if id is not found', (done) => {
                chai.request(server)
                    .get('/api/v1/request/5f49a9919e89172054d7dad8')
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
                    .get('/api/v1/request/5f49a9919')
                    .set('Authorization', tokenObject.token)
                    .end((err, res) => {
                        res.should.have.status(500);
                        done();
                    });
            });
            it('it should show all logged-in user requests', (done) => {
                chai.request(server)
                    .get('/api/v1/request')
                    .set('Authorization', tokenObject.token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('requests');
                        res.body.requests[0].should.have.property('profile').to.be.a('string');
                        res.body.should.have.property('status').eql('success');
                        res.body.should.have.property('message').eql('requests fetched successfully');
                        done();
                    });
            });
        
            it('it should show logged-in user request by id', (done) => {
                chai.request(server)
                    .get(`/api/v1/request/${request_id.id}`)
                    .set('Authorization', tokenObject.token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('request');
                        res.body.request.should.have.property('profile').to.be.a('string');
                        res.body.should.have.property('status').eql('success');
                        res.body.should.have.property('message').eql('request fetched successfully');
                        done();
                    });
            });
        
        })
        describe('/patch - modify requests', () => {
            it('it should not modify request if id is not found', (done) => {
                let userRequest = {
                    title: 'Request title-edit',
                    section: 'Technical',
                    branch: 'Abuja',
                    location: 'Maitama',
                    description: 'Details of problems-edited'
                }
                chai.request(server)
                    .patch('/api/v1/request/5f49a9919e89172054d7dad8')
                    .set('Authorization', tokenObject.token)
                    .send(userRequest)
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');
                        res.body.errors.should.have.property('noRequest').eql('The request is not found');
                        res.body.should.have.property('status').eql('success');
                        done();
                    });
            });
            it('it should should modify request if status is new', (done) => {
                let userRequest = {
                    title: 'Request title-edit',
                    section: 'Technical',
                    branch: 'Abuja',
                    location: 'Maitama',
                    description: 'Details of problems-edited'
                }
                chai.request(server)
                    .patch(`/api/v1/request/${request_id.id}`)
                    .set('Authorization', tokenObject.token)
                    .send(userRequest)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('upDatedRequest');
                        res.body.upDatedRequest.should.have.property('profile').to.be.a('string');
                        res.body.should.have.property('status').eql('Success');
                        res.body.should.have.property('msg').eql('Request Updated successfully');
                        done();
                    });
            });
        });
        describe('/delete - remove requests', () => {
            it('it should not remove request if id is not found', (done) => {
                chai.request(server)
                    .delete('/api/v1/request/5f49a9919e89172054d7dad8')
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
            it('it should should remove request if status is new', (done) => {
                chai.request(server)
                    .delete(`/api/v1/request/${request_id.id}`)
                    .set('Authorization', tokenObject.token)                    
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql('Request Deleted Successfully');
                        done();
                    });
            });
        });
    });
    

});